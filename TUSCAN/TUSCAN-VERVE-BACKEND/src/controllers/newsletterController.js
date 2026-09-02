const Newsletter = require('../models/Newsletter');

// 1. SUBSCRIBE TO NEWSLETTER
// POST /api/newsletter/subscribe
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email address' });
    }

    // Check if email already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.json({
        success: true,
        message: 'You are already subscribed to Tuscan Verve style updates!',
      });
    }

    // Save new subscriber
    await Newsletter.create({ email: email.toLowerCase() });

    res.status(201).json({
      success: true,
      message: 'Welcome to the family. You have successfully subscribed!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET ALL SUBSCRIBERS (Admin)
// GET /api/newsletter/subscribers
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  subscribeNewsletter,
  getSubscribers,
};
