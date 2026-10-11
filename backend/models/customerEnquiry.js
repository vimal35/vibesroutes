const mongoose = require('mongoose');

const customerEnquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  mobile: { type: String, required: true, trim: true, maxlength: 18 },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  checkIn: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  checkOut: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  message: { type: String, trim: true, maxlength: 2000, default: '' },
  source: { type: String, required: true, enum: ['deal', 'join', 'direct'], default: 'direct' },
  offer: { type: String, trim: true, maxlength: 100, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.CustomerEnquiry || mongoose.model('CustomerEnquiry', customerEnquirySchema);
