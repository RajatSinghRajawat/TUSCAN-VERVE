import React from 'react';
import {
  IconDashboard,
  IconProducts,
  IconOrders,
  IconSubscribers,
  IconRefresh,
} from './Icons';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  pendingOrdersCount = 0,
  productsCount = 0,
  backendStatus = { connected: false },
  onRefresh,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <IconDashboard size={19} />,
      badge: null,
    },
    {
      id: 'products',
      label: 'Products Catalog',
      icon: <IconProducts size={19} />,
      badge: productsCount > 0 ? productsCount : null,
    },
    {
      id: 'orders',
      label: 'Orders & Sales',
      icon: <IconOrders size={19} />,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : null,
    },
    {
      id: 'subscribers',
      label: 'Subscribers',
      icon: <IconSubscribers size={19} />,
      badge: null,
    },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-crest">TV</div>
        <div className="brand-info">
          <h1>TUSCAN VERVE</h1>
          <span>Admin Control</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-item-left">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Backend Status */}
      <div className="sidebar-footer">
        <div className="backend-indicator">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              className={`status-dot ${backendStatus.connected ? 'online' : 'offline'}`}
            />
            <span style={{ color: '#d8e2dc', fontSize: '0.78rem' }}>
              {backendStatus.connected ? 'Backend Online' : 'Local / Offline'}
            </span>
          </div>
          <button
            onClick={onRefresh}
            title="Check connection & refresh data"
            style={{ color: 'var(--gold-soft)', padding: '2px' }}
          >
            <IconRefresh size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
