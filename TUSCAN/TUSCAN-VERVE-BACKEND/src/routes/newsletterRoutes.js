const express = require('express');
const router = express.Router();
const {
  subscribeNewsletter,
  getSubscribers,
} = require('../controllers/newsletterController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/subscribe', subscribeNewsletter);
router.get('/subscribers', protect, adminOnly, getSubscribers);

module.exports = router;
