// models/adminpanel.js

const mongoose = require('mongoose');

const MAX_GALLERY_IMAGES = 10;
const MAX_VIDEOS = 2;

const CITIES = [
  'Pondicherry',
  'Munnar',
  'Ooty',
  'Coimbatore',
  'Bangalore',
  'Hyderabad',
];

const CITY_STATE = {
  Pondicherry: 'Tamil Nadu',
  Munnar: 'Kerala',
  Ooty: 'Tamil Nadu',
  Coimbatore: 'Tamil Nadu',
  Bangalore: 'Karnataka',
  Hyderabad: 'Telangana',
};

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bed: { type: String, required: true, trim: true },
    guests: { type: Number, required: true, default: 2, min: 1 },
    size: { type: Number, required: true, default: 30, min: 1 },
    price: { type: Number, required: true, min: 0 },
    img: { type: String, default: '' },
    benefits: [{ type: String, trim: true }],
  },
  { _id: false }
);

const landmarkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    d: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    country: { type: String, trim: true },
    date: { type: String, trim: true },
    score: { type: Number, min: 0, max: 10 },
    title: { type: String, trim: true },
    comment: { type: String, trim: true },
  },
  { _id: false }
);

const catsSchema = new mongoose.Schema(
  {
    Cleanliness: Number,
    Comfort: Number,
    Location: Number,
    Facilities: Number,
    Staff: Number,
    'Value for money': Number,
    'Free WiFi': Number,
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    city: {
      type: String,
      required: true,
      enum: CITIES,
      index: true,
      trim: true,
    },
    state: { type: String, trim: true },
    area: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Hotel', 'Resort', 'Apartment', 'Villa', 'Hostel'],
      default: 'Hotel',
    },
    stars: { type: Number, min: 1, max: 5, default: 5 },
    rating: { type: Number, min: 0, max: 10, default: 8.5 },
    reviews: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    taxes: { type: Number, default: 0, min: 0 },
    distance: { type: Number, default: 1, min: 0 },
    // Older values plus every "Promotional badge" option in the Admin panel.
    deal: {
      type: String,
      enum: [
        'limited',
        'genius',
        'new',
        'limited-time-deal',
        'newly-opened',
        'popular-stay',
        'special-offer',
        'weekend-escape',
        'guest-favourite',
        'new-listing',
        'exclusive-deal',
        'best-value',
        'trending-stay',
        null,
      ],
      default: null,
    },
    breakfast: { type: Boolean, default: false },
    freeCancel: { type: Boolean, default: true },
    payLater: { type: Boolean, default: false },
    noPrepay: { type: Boolean, default: false },
    sustainable: { type: Boolean, default: false },
    address: { type: String, required: true, trim: true },
    checkIn: { type: String, default: '14:00 – 23:30' },
    checkOut: { type: String, default: '06:00 – 11:00' },
    desc: { type: String, required: true, trim: true },
    highlights: [{ type: String, trim: true }],
    amenities: [{ type: String, trim: true }],
    landmarks: [landmarkSchema],
    image: { type: String, required: true, trim: true },
    gallery: {
      type: [{ type: String, trim: true }],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length <= MAX_GALLERY_IMAGES,
        message: `A property can have at most ${MAX_GALLERY_IMAGES} gallery photos`,
      },
    },
    videos: {
      type: [{ type: String, trim: true }],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length <= MAX_VIDEOS,
        message: `A property can have at most ${MAX_VIDEOS} videos`,
      },
    },
    rooms: [roomSchema],
    guestReviews: [reviewSchema],
    cats: catsSchema,
    mapX: { type: Number, default: () => 12 + Math.floor(Math.random() * 76) },
    mapY: { type: Number, default: () => 12 + Math.floor(Math.random() * 70) },
    source: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

hotelSchema.pre('validate', async function preValidate(next) {
  try {
    const Hotel = mongoose.models.Hotel || mongoose.model('Hotel');

    if (this.city && !this.state) {
      this.state = CITY_STATE[this.city] || '';
    }

    if (!this.id && this.name) {
      const base = slugify(`${this.name}-${this.city || ''}`) || 'hotel';
      let candidate = base;
      let i = 1;

      while (await Hotel.exists({ id: candidate })) {
        candidate = `${base}-${i++}`;
      }

      this.id = candidate;
    }

    if (!this.cats || Object.keys(this.cats.toObject ? this.cats.toObject() : this.cats).length === 0) {
      const r = this.rating || 8.5;
      const j = (v) => Math.max(5, Math.min(9.8, Math.round(v * 10) / 10));

      this.cats = {
        Cleanliness: j(r + 0.3),
        Comfort: j(r + 0.1),
        Location: j(r - 0.2),
        Facilities: j(r + 0.2),
        Staff: j(r + 0.4),
        'Value for money': j(r - 0.5),
        'Free WiFi': j(r + 0.2),
      };
    }

    if (!Array.isArray(this.guestReviews) || this.guestReviews.length === 0) {
      this.guestReviews = [
        {
          name: 'Aarav',
          country: 'India',
          date: 'Reviewed recently',
          score: Math.min(9.8, (this.rating || 8.5) + 0.2),
          title: 'Excellent stay',
          comment: 'Clean rooms, helpful staff and a convenient location.',
        },
      ];
    }

    if (this.gallery && this.gallery.length > MAX_GALLERY_IMAGES) {
      this.gallery = this.gallery.slice(0, MAX_GALLERY_IMAGES);
    }

    if (this.videos && this.videos.length > MAX_VIDEOS) {
      this.videos = this.videos.slice(0, MAX_VIDEOS);
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
module.exports.MAX_GALLERY_IMAGES = MAX_GALLERY_IMAGES;
module.exports.MAX_VIDEOS = MAX_VIDEOS;
module.exports.CITIES = CITIES;
module.exports.CITY_STATE = CITY_STATE;