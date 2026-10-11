// routes/adminpanel.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Hotel = require('../models/adminpanel');

const router = express.Router();

const MAX_GALLERY_IMAGES = Hotel.MAX_GALLERY_IMAGES || 10;
const MAX_VIDEOS = Hotel.MAX_VIDEOS || 2;
const CITIES = Hotel.CITIES || [
  'Pondicherry',
  'Munnar',
  'Ooty',
  'Coimbatore',
  'Bangalore',
  'Hyderabad',
];
const CITY_STATE = Hotel.CITY_STATE || {
  Pondicherry: 'Tamil Nadu',
  Munnar: 'Kerala',
  Ooty: 'Tamil Nadu',
  Coimbatore: 'Tamil Nadu',
  Bangalore: 'Karnataka',
  Hyderabad: 'Telangana',
};

const uploadDirectory = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();

    cb(null, `${Date.now()}-${safeName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: function fileFilter(req, file, cb) {
    if (file.fieldname === 'image' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Cover file must be an image'));
    }

    if (file.fieldname === 'gallery' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Gallery files must be images'));
    }

    if (file.fieldname === 'videos' && !file.mimetype.startsWith('video/')) {
      return cb(new Error('Video files must be videos'));
    }

    cb(null, true);
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: MAX_GALLERY_IMAGES },
  { name: 'videos', maxCount: MAX_VIDEOS },
]);

function getFileUrl(req, file) {
  if (!file) return '';
  return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
}

function parseJson(value, fallback = null) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.city && CITIES.includes(req.query.city)) {
      filter.city = req.query.city;
    }

    const hotels = await Hotel.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: hotels.length,
      hotels,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hotels',
      error: err.message,
    });
  }
});

router.post('/add', (req, res) => {
  upload(req, res, async (uploadError) => {
    try {
      if (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message || 'File upload failed',
        });
      }

      const meta = parseJson(req.body.data, {});
      const coverFile = req.files?.image?.[0];
      const galleryFiles = req.files?.gallery || [];
      const videoFiles = req.files?.videos || [];

      const city = String(meta.city || '').trim();

      const payload = {
        ...meta,
        city,
        state: CITY_STATE[city] || meta.state || '',
        image: getFileUrl(req, coverFile),
        gallery: galleryFiles.map((file) => getFileUrl(req, file)),
        videos: videoFiles.map((file) => getFileUrl(req, file)),
        source: 'admin',
        reviews: Number(meta.reviews) || 0,
      };

      const required = ['name', 'city', 'area', 'address', 'desc', 'price'];
      const missing = required.filter((field) => {
        return payload[field] === undefined || payload[field] === null || payload[field] === '';
      });

      if (!payload.image) missing.push('image');

      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missing.join(', ')}`,
        });
      }

      if (!CITIES.includes(city)) {
        return res.status(400).json({
          success: false,
          message: `Location must be one of: ${CITIES.join(', ')}`,
        });
      }

      if (payload.gallery.length > MAX_GALLERY_IMAGES) {
        return res.status(400).json({
          success: false,
          message: `You can add at most ${MAX_GALLERY_IMAGES} gallery photos`,
        });
      }

      if (payload.videos.length > MAX_VIDEOS) {
        return res.status(400).json({
          success: false,
          message: `You can add at most ${MAX_VIDEOS} videos`,
        });
      }

      const hotel = new Hotel(payload);
      await hotel.save();

      return res.status(201).json({
        success: true,
        message: 'Hotel added successfully',
        hotel,
      });
    } catch (err) {
      console.error('Failed to add hotel:', err);

      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map((error) => error.message);

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      if (err.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'A hotel with this ID already exists',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to add hotel',
        error: err.message,
      });
    }
  });
});

router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ id: req.params.id });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.json({
      success: true,
      hotel,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hotel',
      error: err.message,
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.city) {
      updateData.state = CITY_STATE[updateData.city] || updateData.state;
    }

    const hotel = await Hotel.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      hotel,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update hotel',
      error: err.message,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndDelete({ id: req.params.id });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.json({
      success: true,
      message: 'Hotel deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete hotel',
      error: err.message,
    });
  }
});

module.exports = router;