import React, { useState, useMemo } from 'react';
import {
  IconSearch,
  IconEye,
} from '../components/Icons';
import { ShirtSwatch } from '../components/ShirtSwatch';

const STATUS_FILTERS = ['All', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export const OrdersTab = ({
  orders = [],
  onSelectOrder,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (selectedStatus !== 'All') {
      list = list.filter((o) => (o.orderStatus || 'pending').toLowerCase() === selectedStatus.toLowerCase());
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((o) => {
        const idMatch = o._id?.toLowerCase().includes(q);
        const nameMatch = (o.shippingAddress?.fullName || o.user?.name || '').toLowerCase().includes(q);
        const emailMatch = (o.user?.email || o.guestEmail || '').toLowerCase().includes(q);
        const cityMatch = (o.shippingAddress?.city || '').toLowerCase().includes(q);
        return idMatch || nameMatch || emailMatch || cityMatch;
      });
    }

    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, selectedStatus, searchTerm]);

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>Orders & Fulfillment</h2>
          <p>Track client purchases, manage dispatch cycles, and review payments</p>
        </div>
      </div>

      <div className="luxury-card">
        {/* Filter bar */}
        <div className="filter-bar">
          <div className="filter-pills">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                className={`filter-pill ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
                style={{ paddingLeft: '32px', width: '230px' }}
                placeholder="Search by order #, name, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-wrapper">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Client</th>
                <th>Items Ordered</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Fulfillment Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-muted)' }}>
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const clientName = order.shippingAddress?.fullName || order.user?.name || 'Customer';
                  const city = order.shippingAddress?.city || 'India';
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={order._id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--ink-secondary)' }}>
                          #{order._id?.slice(-8) || order._id}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.84rem' }}>{orderDate}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--green-950)' }}>{clientName}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
                          {city} • {order.shippingAddress?.phone || order.guestEmail || ''}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ display: 'flex', marginLeft: '-4px' }}>
                            {order.items?.slice(0, 3).map((it, idx) => (
                              <div key={idx} style={{ marginLeft: idx > 0 ? '-10px' : 0, zIndex: 3 - idx }}>
                                <ShirtSwatch
                                  base={it.base || '#f9f8f4'}
                                  deep={it.deep || '#d8d5ca'}
                                  pattern={it.pattern || 'solid'}
                                  size={28}
                                />
                              </div>
                            ))}
                          </div>
                          <span style={{ fontSize: '0.82rem', color: 'var(--ink)' }}>
                            {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <strong style={{ color: 'var(--green-950)', fontSize: '0.94rem' }}>
                          ₹{order.totalAmount}
                        </strong>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                            {order.paymentMethod || 'COD'}
                          </span>
                          <span
                            className="badge"
                            style={{
                              alignSelf: 'flex-start',
                              fontSize: '0.68rem',
                              background:
                                order.paymentStatus === 'paid'
                                  ? '#dcfce7'
                                  : order.paymentStatus === 'failed'
                                  ? '#fee2e2'
                                  : '#fef3c7',
                              color:
                                order.paymentStatus === 'paid'
                                  ? '#15803d'
                                  : order.paymentStatus === 'failed'
                                  ? '#b91c1c'
                                  : '#b45309',
                            }}
                          >
                            {order.paymentStatus || 'pending'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <select
                          className="filter-select"
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            borderRadius: '99px',
                            borderColor: 'transparent',
                            background:
                              order.orderStatus === 'delivered'
                                ? 'var(--status-delivered-bg)'
                                : order.orderStatus === 'shipped'
                                ? 'var(--status-shipped-bg)'
                                : order.orderStatus === 'processing'
                                ? 'var(--status-processing-bg)'
                                : order.orderStatus === 'confirmed'
                                ? 'var(--status-confirmed-bg)'
                                : order.orderStatus === 'cancelled'
                                ? 'var(--status-cancelled-bg)'
                                : 'var(--status-pending-bg)',
                            color:
                              order.orderStatus === 'delivered'
                                ? 'var(--status-delivered-text)'
                                : order.orderStatus === 'shipped'
                                ? 'var(--status-shipped-text)'
                                : order.orderStatus === 'processing'
                                ? 'var(--status-processing-text)'
                                : order.orderStatus === 'confirmed'
                                ? 'var(--status-confirmed-text)'
                                : order.orderStatus === 'cancelled'
                                ? 'var(--status-cancelled-text)'
                                : 'var(--status-pending-text)',
                          }}
                          value={order.orderStatus || 'pending'}
                          onChange={(e) =>
                            onUpdateStatus(order._id, { orderStatus: e.target.value })
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => onSelectOrder(order)}
                          title="View order summary"
                        >
                          <IconEye size={14} />
                          <span>Inspect</span>
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
    </div>
  );
};
