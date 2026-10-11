const mongoose = require('mongoose');

const MAX_STORY_WORDS = 1000;

function countWords(value) {
  const story = String(value || '').trim();
  return story ? story.split(/\s+/).length : 0;
}

const propertyEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  property: { type: String, required: true, trim: true, maxlength: 160 },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  type: {
    type: String,
    required: true,
    enum: ['Hotel', 'Resort', 'Villa', 'Homestay', 'Guest house', 'Other'],
  },
  story: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (story) => countWords(story) <= MAX_STORY_WORDS,
      message: `Your story must be ${MAX_STORY_WORDS} words or fewer`,
    },
  },
}, { timestamps: true });

module.exports = mongoose.models.PropertyEnquiry || mongoose.model('PropertyEnquiry', propertyEnquirySchema);
