const express = require('express');
const CustomerEnquiry = require('../models/customerEnquiry');

const router = express.Router();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const recentRequests = new Map();
const OFFER_CONTEXT = {
  deal: 'Early Summer Escapes',
  join: 'Book + Save Extra 15%',
};

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isValidIndianMobile(value) {
  const compact = value.trim().replace(/[\s()-]/g, '');
  return /^(?:(?:\+|00)?91)?[6-9]\d{9}$/.test(compact);
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (recentRequests.get(ip) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    recentRequests.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentRequests.set(ip, recent);
  if (recentRequests.size > 1000) {
    for (const [key, timestamps] of recentRequests.entries()) {
      const active = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
      if (active.length) recentRequests.set(key, active);
      else recentRequests.delete(key);
    }
  }
  return false;
}

router.post('/', async (req, res) => {
  const requestIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(requestIp)) {
    return res.status(429).json({ success: false, message: 'Too many enquiries were sent from this connection. Please try again later.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const payload = {
    fullName: String(body.fullName || '').trim(),
    mobile: String(body.mobile || '').trim(),
    location: String(body.location || '').trim(),
    checkIn: String(body.checkIn || '').trim(),
    checkOut: String(body.checkOut || '').trim(),
    message: String(body.message || '').trim(),
    source: String(body.source || 'direct').trim(),
    offer: String(body.offer || '').trim(),
  };

  if (!payload.fullName || !payload.mobile || !payload.location || !payload.checkIn || !payload.checkOut) {
    return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
  }
  if (payload.fullName.length > 120 || payload.mobile.length > 18 || payload.location.length > 160 || payload.message.length > 2000) {
    return res.status(400).json({ success: false, message: 'One or more fields are longer than allowed.' });
  }
  if (!isValidIndianMobile(payload.mobile)) {
    return res.status(400).json({ success: false, message: 'Enter a valid Indian mobile number, with or without +91.' });
  }
  if (!isValidDate(payload.checkIn) || !isValidDate(payload.checkOut)) {
    return res.status(400).json({ success: false, message: 'Enter valid check-in and check-out dates.' });
  }
  const todayParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const today = `${todayParts.find((part) => part.type === 'year').value}-${todayParts.find((part) => part.type === 'month').value}-${todayParts.find((part) => part.type === 'day').value}`;
  if (payload.checkIn < today || payload.checkOut <= payload.checkIn) {
    return res.status(400).json({ success: false, message: 'Check-in must not be in the past and check-out must be after check-in.' });
  }
  if (!['deal', 'join', 'direct'].includes(payload.source)) {
    return res.status(400).json({ success: false, message: 'Invalid enquiry source.' });
  }
  if (payload.source === 'direct') {
    payload.offer = '';
  } else if (OFFER_CONTEXT[payload.source] !== payload.offer) {
    return res.status(400).json({ success: false, message: 'The selected offer context is not valid.' });
  }

  try {
    const enquiry = await CustomerEnquiry.create(payload);
    return res.status(201).json({ success: true, message: 'Customer enquiry received.', enquiryId: enquiry.id });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Please check the enquiry details and try again.' });
    }
    console.error('Failed to save customer enquiry:', error.message);
    return res.status(500).json({ success: false, message: 'We could not save your enquiry. Please try again.' });
  }
});

module.exports = router;
