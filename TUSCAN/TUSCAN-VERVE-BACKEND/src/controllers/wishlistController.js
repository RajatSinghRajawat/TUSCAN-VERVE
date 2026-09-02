const User = require('../models/User');

// 1. GET USER WISHLIST
// GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. TOGGLE PRODUCT IN WISHLIST (Add or Remove)
// POST /api/wishlist/toggle/:productId
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.findIndex((id) => id.toString() === productId);

    let isAdded = false;
    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      isAdded = true;
    }

    await user.save();

    res.json({
      success: true,
      added: isAdded,
      message: isAdded ? 'Added to wishlist ♥' : 'Removed from wishlist',
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
};
