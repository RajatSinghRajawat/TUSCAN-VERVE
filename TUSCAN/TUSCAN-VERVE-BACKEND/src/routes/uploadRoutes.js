const express = require('express');
const router = express.Router();
const upload = require('../../multer');
const {
  uploadSingleImage,
  uploadMultipleImages,
} = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Upload single image (e.g. key "image")
router.post('/', protect, adminOnly, upload.single('image'), uploadSingleImage);

// Upload multiple images (e.g. key "images", max 5)
router.post('/multiple', protect, adminOnly, upload.array('images', 5), uploadMultipleImages);

module.exports = router;
