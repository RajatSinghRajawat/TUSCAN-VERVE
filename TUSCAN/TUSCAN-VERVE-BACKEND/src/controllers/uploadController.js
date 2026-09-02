// 1. UPLOAD SINGLE IMAGE
// POST /api/upload
const uploadSingleImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      fileUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. UPLOAD MULTIPLE IMAGES
// POST /api/upload/multiple
const uploadMultipleImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select image files' });
    }

    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      fileUrls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
};
