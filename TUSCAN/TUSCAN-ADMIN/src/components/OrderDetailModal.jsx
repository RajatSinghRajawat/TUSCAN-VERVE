import React, { useState } from 'react';
import { IconClose, IconCheck } from './Icons';
import { ShirtSwatch } from './ShirtSwatch';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];

export const OrderDetailModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
  if (!isOpen || !order) return null;

  const [orderStatus, setOrderStatus] = useState(order.orderStatus || 'pending');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'pending');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateStatus(order._id, { orderStatus, paymentStatus });
    setSaving(false);
    onClose();
  };

  const customerName = order.shippingAddress?.fullName || order.user?.name || 'Customer';
  const customerEmail = order.user?.email || order.guestEmail || 'No email provided';
  const phone = order.shippingAddress?.phone || 'N/A';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div>
            <h3>Order #{order._id?.slice(-8) || order._id}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <IconClose size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Controls Bar */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px 20px',
              background: 'var(--cream)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              flexWrap: 'wrap',
              border: '1px solid var(--line)',
            }}
          >
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-secondary)', display: 'block', marginBottom: '6px' }}>
                Fulfillment Status
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                {ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-secondary)', display: 'block', marginBottom: '6px' }}>
                Payment Status
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                {PAYMENT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', background: 'var(--paper)' }}>
              <h4 style={{ fontFamily: 'var(--roman)', fontSize: '0.95rem', marginBottom: '8px', color: 'var(--green-950)' }}>
                Customer Information
              </h4>
              <p style={{ fontWeight: 600, color: 'var(--ink)' }}>{customerName}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{customerEmail}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginTop: '4px' }}>Tel: {phone}</p>
            </div>

            <div style={{ padding: '16px', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', background: 'var(--paper)' }}>
              <h4 style={{ fontFamily: 'var(--roman)', fontSize: '0.95rem', marginBottom: '8px', color: 'var(--green-950)' }}>
                Shipping Destination
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{order.shippingAddress?.street}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{order.shippingAddress?.country || 'India'}</p>
            </div>
          </div>

          {/* Ordered Shirts List */}
          <h4 style={{ fontFamily: 'var(--roman)', fontSize: '1.05rem', marginBottom: '12px', color: 'var(--green-950)' }}>
            Purchased Shirts ({order.items?.length || 0})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--cream)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <ShirtSwatch
                    base={item.base || '#f9f8f4'}
                    deep={item.deep || '#d8d5ca'}
                    pattern={item.pattern || 'solid'}
                    size={42}
                  />
                  <div>
                    <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--green-950)' }}>
                      {item.name}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                      Size: <strong style={{ color: 'var(--ink)' }}>{item.size}</strong> • Qty: {item.qty} • SKU: {item.sku || 'N/A'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, color: 'var(--green-950)', fontSize: '0.95rem' }}>
                    ₹{item.price * item.qty}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--ink-muted)' }}>
                    ₹{item.price} each
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Payment Summary */}
          <div style={{ background: '#fbf9f4', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--ink-muted)' }}>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--ink-muted)' }}>Shipping Fee</span>
              <span>{order.shippingFee === 0 ? 'Free Shipping' : `₹${order.shippingFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--line)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--green-950)' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--gold-dark)' }}>₹{order.totalAmount}</span>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
              Payment Method: <strong style={{ color: 'var(--ink)' }}>{order.paymentMethod}</strong>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-luxury" onClick={handleSave} disabled={saving}>
            <IconCheck size={16} />
            <span>{saving ? 'Updating...' : 'Update Order Status'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
