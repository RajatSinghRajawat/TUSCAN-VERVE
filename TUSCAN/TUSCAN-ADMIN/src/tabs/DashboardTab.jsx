import React from 'react';
import {
  IconRevenue,
  IconOrders,
  IconProducts,
  IconSubscribers,
  IconEye,
  IconPlus,
} from '../components/Icons';
import { ShirtSwatch } from '../components/ShirtSwatch';

export const DashboardTab = ({
  products = [],
  orders = [],
  subscribers = [],
  onSelectOrder,
  onNavigateTab,
  onNewProduct,
}) => {
  // Calculations
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid' || o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed'
  );

  const lowStockProducts = products.filter((p) => (p.stock || 0) < 30);

  // Group by collection family
  const familyCount = products.reduce((acc, p) => {
    acc[p.family] = (acc[p.family] || 0) + 1;
    return acc;
  }, {});

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="admin-page">
      {/* Page Title */}
      <div className="page-header">
        <div className="page-title">
          <h2>Dashboard Overview</h2>
          <p>Real-time metrics, order fulfillments, and luxury shirt inventory</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-luxury" onClick={onNewProduct}>
            <IconPlus size={16} />
            <span>Add New Shirt</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card gold">
          <div className="stat-top">
            <span className="stat-label">Total Revenue</span>
            <div className="stat-icon">
              <IconRevenue size={18} />
            </div>
          </div>
          <div className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="stat-meta">Across {orders.length} total orders</div>
        </div>

        <div className="stat-card blue">
          <div className="stat-top">
            <span className="stat-label">Orders</span>
            <div className="stat-icon">
              <IconOrders size={18} />
            </div>
          </div>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-meta" style={{ color: pendingOrders.length > 0 ? '#b45309' : 'inherit' }}>
            <strong>{pendingOrders.length}</strong> pending fulfillment
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-top">
            <span className="stat-label">Active Catalog</span>
            <div className="stat-icon">
              <IconProducts size={18} />
            </div>
          </div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-meta">
            {lowStockProducts.length > 0 ? (
              <span style={{ color: '#b91c1c' }}>{lowStockProducts.length} low stock warnings</span>
            ) : (
              'All products well-stocked'
            )}
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-top">
            <span className="stat-label">VIP Subscribers</span>
            <div className="stat-icon">
              <IconSubscribers size={18} />
            </div>
          </div>
          <div className="stat-value">{subscribers.length}</div>
          <div className="stat-meta">Newsletter audience</div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Orders Table Card */}
        <div className="luxury-card" style={{ margin: 0 }}>
          <div className="card-header">
            <h3>Recent Orders</h3>
            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              onClick={() => onNavigateTab('orders')}
            >
              View All ({orders.length})
            </button>
          </div>

          <div className="table-wrapper">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--ink-muted)' }}>
                      No orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const custName =
                      order.shippingAddress?.fullName || order.user?.name || 'Guest';
                    return (
                      <tr key={order._id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--ink-secondary)' }}>
                            #{order._id?.slice(-6)}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{custName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                            {order.shippingAddress?.city || 'India'}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.84rem' }}>
                            {order.items?.length || 0} shirt{order.items?.length === 1 ? '' : 's'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--green-950)' }}>
                            ₹{order.totalAmount}
                          </strong>
                        </td>
                        <td>
                          <span className={`badge badge-${order.orderStatus || 'pending'}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                            onClick={() => onSelectOrder(order)}
                            title="Inspect order details"
                          >
                            <IconEye size={14} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Collection Distribution & Low Stock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Collection Distribution */}
          <div className="luxury-card" style={{ margin: 0 }}>
            <div className="card-header">
              <h3>Collections</h3>
              <button
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                onClick={() => onNavigateTab('products')}
              >
                Catalog
              </button>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(familyCount).map(([family, count]) => {
                const pct = Math.round((count / (products.length || 1)) * 100);
                return (
                  <div key={family}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 500 }}>{family}</span>
                      <span style={{ color: 'var(--ink-muted)' }}>
                        {count} shirts ({pct}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--cream)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--green-900) 0%, var(--gold) 100%)',
                          borderRadius: '99px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="luxury-card" style={{ margin: 0 }}>
            <div className="card-header">
              <h3>Inventory Health</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--gold-dark)', fontWeight: 600 }}>
                {lowStockProducts.length} low stock
              </span>
            </div>
            <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lowStockProducts.length === 0 ? (
                <p style={{ fontSize: '0.84rem', color: 'var(--ink-muted)', padding: '10px 0' }}>
                  All shirt inventories are above minimum safety threshold (30 units).
                </p>
              ) : (
                lowStockProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: '#fff9f9',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #fee2e2',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShirtSwatch
                        base={prod.base}
                        deep={prod.deep}
                        pattern={prod.pattern}
                        size={32}
                      />
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{prod.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{prod.sku}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626' }}>
                      {prod.stock} left
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
