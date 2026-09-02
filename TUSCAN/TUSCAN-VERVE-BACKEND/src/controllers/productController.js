const Product = require('../models/Product');

// 1. GET ALL PRODUCTS (with optional category & search filter)
// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { family, search, sort } = req.query;
    let filter = {};

    // Filter by family / category (Solids, Oxfords, Stripes, Checks, Textures)
    if (family && family !== 'All') {
      filter.family = family;
    }

    // Search by shirt name or fabric
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let query = Product.find(filter);

    // Sorting: price low to high or high to low
    if (sort === 'price-asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 }); // newest first
    }

    const products = await query;
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET SINGLE PRODUCT BY ID OR SKU
// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by Mongo _id if valid, otherwise search by SKU (e.g. 'tv-01')
    const product = id.match(/^[0-9a-fA-F]{24}$/)
      ? await Product.findById(id)
      : await Product.findOne({ sku: id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET UNIQUE COLLECTIONS / FAMILIES
// GET /api/products/families
const getProductFamilies = async (req, res) => {
  try {
    const families = await Product.distinct('family');
    res.json({ success: true, families });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. CREATE PRODUCT (Admin)
// POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. UPDATE PRODUCT (Admin)
// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 6. DELETE PRODUCT (Admin)
// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductFamilies,
  createProduct,
  updateProduct,
  deleteProduct,
};
