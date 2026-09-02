require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    sku: 'tv-01',
    name: 'Classic White Oxford',
    family: 'Oxfords',
    fabric: 'Giza Cotton · Regular Fit',
    price: 2499,
    mrp: 3299,
    tag: 'Bestseller',
    base: '#f9f8f4',
    deep: '#d8d5ca',
    pattern: 'dot',
    patternColor: 'rgba(60,70,66,0.06)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
  },
  {
    sku: 'tv-02',
    name: 'Riviera Sky Oxford',
    family: 'Oxfords',
    fabric: 'Oxford Weave · Slim Fit',
    price: 2499,
    mrp: 3299,
    tag: null,
    base: '#cfe0ee',
    deep: '#a8c2d8',
    pattern: 'dot',
    patternColor: 'rgba(38,74,105,0.10)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 45,
  },
  {
    sku: 'tv-03',
    name: 'Bengal Stripe Rosa',
    family: 'Stripes',
    fabric: 'Poplin Weave · Slim Fit',
    price: 2699,
    mrp: 3499,
    tag: 'New',
    base: '#f6e3e6',
    deep: '#dfb6bd',
    pattern: 'stripe',
    patternColor: 'rgba(196,90,110,0.35)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 40,
  },
  {
    sku: 'tv-04',
    name: 'Midnight Navy Twill',
    family: 'Solids',
    fabric: 'Cotton Twill · Slim Fit',
    price: 2599,
    mrp: 3399,
    tag: null,
    base: '#2a3a55',
    deep: '#1d2a40',
    pattern: 'diag',
    patternColor: 'rgba(255,255,255,0.05)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 60,
  },
  {
    sku: 'tv-05',
    name: 'Olive Safari Twill',
    family: 'Solids',
    fabric: 'Brushed Twill · Regular Fit',
    price: 2799,
    mrp: 3599,
    tag: null,
    base: '#6a7150',
    deep: '#525840',
    pattern: 'diag',
    patternColor: 'rgba(255,255,255,0.06)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 35,
  },
  {
    sku: 'tv-06',
    name: 'Ash Grey Chambray',
    family: 'Textures',
    fabric: 'Chambray · Regular Fit',
    price: 2599,
    mrp: 3399,
    tag: null,
    base: '#c9cccb',
    deep: '#a8adac',
    pattern: 'dot',
    patternColor: 'rgba(50,60,58,0.12)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 55,
  },
  {
    sku: 'tv-07',
    name: 'Tuscan Wine Herringbone',
    family: 'Textures',
    fabric: 'Herringbone · Slim Fit',
    price: 2899,
    mrp: 3699,
    tag: 'Limited',
    base: '#5d2a35',
    deep: '#451e27',
    pattern: 'diag',
    patternColor: 'rgba(255,255,255,0.07)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 25,
  },
  {
    sku: 'tv-08',
    name: 'Forest Gingham Check',
    family: 'Checks',
    fabric: 'Yarn-Dyed Check · Slim Fit',
    price: 2999,
    mrp: 3799,
    tag: 'New',
    base: '#e8ece5',
    deep: '#c2cbbd',
    pattern: 'check',
    patternColor: 'rgba(24,68,56,0.28)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 30,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tuscan_verve');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Insert Tuscan Verve signature shirts
    await Product.insertMany(products);
    console.log(`✓ Successfully seeded ${products.length} Tuscan Verve shirts!`);

    // Ensure default admin user exists
    const adminExists = await User.findOne({ email: 'admin@tuscanverve.store' });
    if (!adminExists) {
      await User.create({
        name: 'Tuscan Verve Admin',
        email: 'admin@tuscanverve.store',
        password: 'AdminPassword2026',
        role: 'admin',
      });
      console.log('✓ Default admin created: admin@tuscanverve.store / AdminPassword2026');
    }

    process.exit(0);
  } catch (error) {
    console.error(`✗ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
