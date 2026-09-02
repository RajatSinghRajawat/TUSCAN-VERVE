import React from 'react';
import { IconSearch, IconPlus, IconRefresh } from './Icons';

export const Header = ({
  searchQuery,
  setSearchQuery,
  onNewProductClick,
  onRefresh,
  loading = false,
  activeTab,
}) => {
  return (
    <header className="admin-header">
      {/* Search Bar */}
      <div className="header-search">
        <span className="search-icon">
          <IconSearch size={16} />
        </span>
        <input
          type="text"
          placeholder={`Search ${activeTab === 'products' ? 'shirts, SKU, fabrics...' : activeTab === 'orders' ? 'orders, customer name...' : 'in Tuscan Verve admin...'}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        <button
          className="btn-secondary"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh current data"
        >
          <IconRefresh size={15} className={loading ? 'spin' : ''} />
          <span>{loading ? 'Refreshing...' : 'Sync'}</span>
        </button>

        <button className="btn-luxury" onClick={onNewProductClick}>
          <IconPlus size={16} />
          <span>Add Product</span>
        </button>

        <div className="admin-avatar-pill">
          <div className="avatar-circle">TV</div>
          <div className="avatar-info">
            <strong>Admin Suite</strong>
            <span>Master Access</span>
          </div>
        </div>
      </div>
    </header>
  );
};
