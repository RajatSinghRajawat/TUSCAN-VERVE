const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please enter shirt name'],
      trim: true,
    },
    family: {
      type: String,
      required: [true, 'Please specify collection/family'],
      enum: ['Solids', 'Oxfords', 'Stripes', 'Checks', 'Textures'],
      index: true,
    },
    fabric: {
      type: String,
      required: [true, 'Please specify fabric and fit details'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please enter selling price in INR'],
      min: 0,
    },
    mrp: {
      type: Number,
      required: [true, 'Please enter original MRP in INR'],
      min: 0,
    },
    tag: {
      type: String,
      enum: ['Bestseller', 'New', 'Limited', null],
      default: null,
    },
    // Styling attributes matching Tuscan Verve luxury shirt art
    base: {
      type: String,
      default: '#f9f8f4',
    },
    deep: {
      type: String,
      default: '#d8d5ca',
    },
    pattern: {
      type: String,
      enum: ['solid', 'stripe', 'check', 'dot', 'diag'],
      default: 'solid',
    },
    patternColor: {
      type: String,
      default: 'rgba(0,0,0,0.08)',
    },
    images: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
    description: {
      type: String,
      default: 'Crafted with German precision and Italian soul. 2-ply compact cotton tailored for all-day comfort.',
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (this.mrp && this.mrp > this.price) {
    return Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
