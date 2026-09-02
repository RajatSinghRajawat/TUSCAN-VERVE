import React, { useState, useMemo } from 'react';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
} from '../components/Icons';
import { ShirtSwatch } from '../components/ShirtSwatch';

const FAMILIES = ['All', 'Solids', 'Oxfords', 'Stripes', 'Checks', 'Textures'];

export const ProductsTab = ({
  products = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleStatus,
}) => {
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedFamily !== 'All') {
      list = list.filter((p) => p.family === selectedFamily);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.fabric?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock-asc') {
      list.sort((a, b) => a.stock - b.stock);
    } else {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [products, selectedFamily, searchTerm, sortBy]);

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>Products Catalog & Inventory</h2>
          <p>Manage Tuscan Verve signature shirts, fabrics, pricing, and stock levels</p>
        </div>
        <button className="btn-luxury" onClick={onAddProduct}>
          <IconPlus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Catalog Card */}
      <div className="luxury-card">
        {/* Filter and Search Bar */}
        <div className="filter-bar">
          <div className="filter-pills">
            {FAMILIES.map((fam) => (
              <button
                key={fam}
                className={`filter-pill ${selectedFamily === fam ? 'active' : ''}`}
                onClick={() => setSelectedFamily(fam)}
              >
                {fam}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <div style={{ position: 'relative' }}>
              <span className="search-icon" style={{ left: '10px' }}>
                <IconSearch size={14} />
              </span>
              <input
                type="text"
                className="filter-input"
                style={{ paddingLeft: '32px', width: '210px' }}
                placeholder="Filter by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="table-wrapper">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Swatch</th>
                <th>SKU</th>
                <th>Shirt Name & Fabric</th>
                <th>Family</th>
                <th>Price / MRP</th>
                <th>Tag</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-muted)' }}>
                    No shirts found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const discount =
                    product.mrp && product.mrp > product.price
                      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                      : 0;

                  const isLowStock = (product.stock || 0) < 30;

                  return (
                    <tr key={product._id || product.sku}>
                      <td>
                        <ShirtSwatch
                          base={product.base}
                          deep={product.deep}
                          pattern={product.pattern}
                          patternColor={product.patternColor}
                          imageUrl={product.images?.[0]}
                          size={40}
                        />
                      </td>

                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--ink-secondary)' }}>
                          {product.sku}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--green-950)' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                          {product.fabric}
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-family">{product.family}</span>
                      </td>

                      <td>
                        <strong style={{ color: 'var(--green-950)' }}>₹{product.price}</strong>
                        {product.mrp && product.mrp > product.price && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>
                            <span style={{ textDecoration: 'line-through' }}>₹{product.mrp}</span>{' '}
                            <span style={{ color: '#16a34a', fontWeight: 600 }}>({discount}% off)</span>
                          </div>
                        )}
                      </td>

                      <td>
                        {product.tag ? (
                          <span className="badge badge-gold">{product.tag}</span>
                        ) : (
                          <span style={{ color: 'var(--ink-light)', fontSize: '0.78rem' }}>—</span>
                        )}
                      </td>

                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: isLowStock ? '#dc2626' : 'var(--green-950)',
                          }}
                        >
                          {product.stock} units
                        </span>
                        {isLowStock && (
                          <span style={{ display: 'block', fontSize: '0.70rem', color: '#dc2626', fontWeight: 600 }}>
                            Low Stock
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            onToggleStatus(product._id, { isActive: !product.isActive })
                          }
                          className="badge"
                          style={{
                            cursor: 'pointer',
                            background: product.isActive !== false ? '#dcfce7' : '#fee2e2',
                            color: product.isActive !== false ? '#15803d' : '#b91c1c',
                          }}
                          title="Click to toggle store visibility"
                        >
                          {product.isActive !== false ? 'Active' : 'Hidden'}
                        </button>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn-secondary"
                            style={{ padding: '6px 8px' }}
                            onClick={() => onEditProduct(product)}
                            title="Edit product"
                          >
                            <IconEdit size={14} />
                          </button>
                          <button
                            className="btn-secondary"
                            style={{ padding: '6px 8px', color: '#dc2626' }}
                            onClick={() => onDeleteProduct(product._id || product.sku)}
                            title="Delete product"
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
