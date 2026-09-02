import React, { useState, useEffect, useRef } from 'react';
import { IconClose, IconCheck, IconUpload, IconTrash } from './Icons';
import { ShirtSwatch } from './ShirtSwatch';
import { uploadImage } from '../services/api';

const FAMILIES = ['Solids', 'Oxfords', 'Stripes', 'Checks', 'Textures'];
const PATTERNS = [
  { id: 'solid', label: 'Solid Weave' },
  { id: 'stripe', label: 'Stripe' },
  { id: 'check', label: 'Check / Gingham' },
  { id: 'dot', label: 'Pinpoint / Dot' },
  { id: 'diag', label: 'Twill / Diagonal' },
];
const TAGS = ['None', 'Bestseller', 'New', 'Limited'];
const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const ProductModal = ({ isOpen, onClose, onSave, product = null }) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    family: 'Oxfords',
    fabric: 'Giza Cotton · Slim Fit',
    price: 2499,
    mrp: 3299,
    tag: 'None',
    base: '#f9f8f4',
    deep: '#d8d5ca',
    pattern: 'dot',
    patternColor: 'rgba(60,70,66,0.08)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
    description: 'Crafted with German precision and Italian soul. 2-ply compact cotton tailored for all-day comfort.',
    isFeatured: true,
    isActive: true,
    imageUrl: '',
  });

  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        name: product.name || '',
        family: product.family || 'Oxfords',
        fabric: product.fabric || '',
        price: product.price || 0,
        mrp: product.mrp || 0,
        tag: product.tag || 'None',
        base: product.base || '#f9f8f4',
        deep: product.deep || '#d8d5ca',
        pattern: product.pattern || 'solid',
        patternColor: product.patternColor || 'rgba(0,0,0,0.08)',
        sizes: product.sizes?.length ? product.sizes : AVAILABLE_SIZES,
        stock: product.stock !== undefined ? product.stock : 50,
        description: product.description || '',
        isFeatured: product.isFeatured !== undefined ? product.isFeatured : true,
        isActive: product.isActive !== undefined ? product.isActive : true,
        imageUrl: product.images?.[0] || '',
      });
    } else {
      setFormData({
        sku: `tv-${Math.floor(10 + Math.random() * 90)}`,
        name: '',
        family: 'Oxfords',
        fabric: 'Giza Cotton · Slim Fit',
        price: 2499,
        mrp: 3299,
        tag: 'None',
        base: '#f9f8f4',
        deep: '#d8d5ca',
        pattern: 'dot',
        patternColor: 'rgba(60,70,66,0.08)',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 50,
        description: 'Crafted with German precision and Italian soul. 2-ply compact cotton tailored for all-day comfort.',
        isFeatured: true,
        isActive: true,
        imageUrl: '',
      });
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a shirt name');
      return;
    }
    if (!formData.sku.trim()) {
      setError('Please provide a SKU');
      return;
    }
    if (Number(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      stock: Number(formData.stock),
      tag: formData.tag === 'None' ? null : formData.tag,
      images: formData.imageUrl ? [formData.imageUrl] : [],
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{product ? 'Edit Tuscan Shirt' : 'Add New Shirt to Catalog'}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
              Configure product details, fabric weaves, and inventory levels
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <IconClose size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Live Swatch Preview Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                background: 'var(--cream)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                border: '1px solid var(--line)',
              }}
            >
              <ShirtSwatch
                base={formData.base}
                deep={formData.deep}
                pattern={formData.pattern}
                patternColor={formData.patternColor}
                imageUrl={formData.imageUrl}
                size={54}
              />
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--green-950)' }}>
                  {formData.name || 'Untitled Tuscan Shirt'}
                </strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
                  SKU: {formData.sku || 'N/A'} • {formData.family} • ₹{formData.price} (MRP: ₹{formData.mrp})
                </span>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>SKU (Identifier)</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. tv-09"
                  required
                />
              </div>

              <div className="form-group">
                <label>Collection Family</label>
                <select name="family" value={formData.family} onChange={handleChange}>
                  {FAMILIES.map((fam) => (
                    <option key={fam} value={fam}>{fam}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full">
                <label>Shirt Title / Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Tuscan Reserve Twill"
                  required
                />
              </div>

              <div className="form-group full">
                <label>Fabric & Fit Description</label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleChange}
                  placeholder="e.g. 100% Giza Cotton · Slim Fit"
                  required
                />
              </div>

              <div className="form-group">
                <label>Selling Price (₹ INR)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Original MRP (₹ INR)</label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Badge / Tag</label>
                <select name="tag" value={formData.tag} onChange={handleChange}>
                  {TAGS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              {/* Fabric Art Styling */}
              <div className="form-group">
                <label>Base Fabric Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="color"
                    name="base"
                    value={formData.base}
                    onChange={handleChange}
                    style={{ width: '42px', height: '42px', padding: '2px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    name="base"
                    value={formData.base}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Collar / Deep Shade</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="color"
                    name="deep"
                    value={formData.deep}
                    onChange={handleChange}
                    style={{ width: '42px', height: '42px', padding: '2px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    name="deep"
                    value={formData.deep}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Weave / Pattern</label>
                <select name="pattern" value={formData.pattern} onChange={handleChange}>
                  {PATTERNS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Pattern Line Color</label>
                <input
                  type="text"
                  name="patternColor"
                  value={formData.patternColor}
                  onChange={handleChange}
                  placeholder="e.g. rgba(0,0,0,0.08)"
                />
              </div>

              {/* Sizes Selection */}
              <div className="form-group full">
                <label>Available Sizes</label>
                <div className="checkbox-group">
                  {AVAILABLE_SIZES.map((sz) => {
                    const isSelected = formData.sizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        className={`size-pill-check ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSize(sz)}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group full">
                <label>Shirt Photograph / Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px',
                    border: '1px dashed var(--line-strong)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--cream)',
                    flexWrap: 'wrap',
                  }}
                >
                  {formData.imageUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                      <img
                        src={formData.imageUrl}
                        alt="Product preview"
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid var(--gold)',
                        }}
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--green-950)' }}>
                          Image Attached
                        </strong>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            color: 'var(--ink-muted)',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formData.imageUrl}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        >
                          <IconUpload size={14} />
                          <span>Replace</span>
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                          style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#dc2626' }}
                          title="Remove image"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--green-950)' }}>
                          Upload Image File
                        </strong>
                        <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
                          Supports JPG, PNG, WEBP up to 5MB (or leave empty for dynamic Italian weave swatch)
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn-luxury"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      >
                        <IconUpload size={16} />
                        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '6px' }}>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Or paste external image URL (e.g. https://...)"
                    style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                  />
                </div>
              </div>

              <div className="form-group full">
                <label>Product Description</label>
                <textarea
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Details regarding cut, collar structure, and fabric hand feel..."
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isFeatured" style={{ cursor: 'pointer', textTransform: 'none' }}>
                  Feature on Storefront Homepage
                </label>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isActive" style={{ cursor: 'pointer', textTransform: 'none' }}>
                  Active for Sale (Visible)
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-luxury">
              <IconCheck size={16} />
              <span>{product ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
