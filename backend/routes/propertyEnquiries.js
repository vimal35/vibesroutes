const express = require('express');
const PropertyEnquiry = require('../models/propertyEnquiry');

const router = express.Router();
const MAX_STORY_WORDS = 1000;

function countWords(value) {
  const story = String(value || '').trim();
  return story ? story.split(/\s+/).length : 0;
}

router.post('/', async (req, res) => {
  const payload = {
    name: String(req.body.name || '').trim(),
    email: String(req.body.email || '').trim(),
    property: String(req.body.property || '').trim(),
    location: String(req.body.location || '').trim(),
    type: String(req.body.type || '').trim(),
    story: String(req.body.story || '').trim(),
  };

  const missing = ['name', 'email', 'property', 'location', 'type', 'story']
    .filter((field) => !payload[field]);

  if (missing.length) {
    return res.status(400).json({ success: false, message: 'Please complete all property enquiry fields.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }

  if (countWords(payload.story) > MAX_STORY_WORDS) {
    return res.status(400).json({ success: false, message: `Your story must be ${MAX_STORY_WORDS} words or fewer.` });
  }

  try {
    const enquiry = await PropertyEnquiry.create(payload);
    return res.status(201).json({
      success: true,
      message: 'Your property enquiry has been saved.',
      enquiryId: enquiry.id,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((item) => item.message).join(' ');
      return res.status(400).json({ success: false, message });
    }

    console.error('Failed to save property enquiry:', error.message);
    return res.status(500).json({ success: false, message: 'We could not save your enquiry. Please try again.' });
  }
});

module.exports = router;
