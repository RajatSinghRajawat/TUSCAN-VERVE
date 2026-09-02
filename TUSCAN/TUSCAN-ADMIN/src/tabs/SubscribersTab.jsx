import React, { useState, useMemo } from 'react';
import { IconSearch, IconCopy, IconCheck } from '../components/Icons';

export const SubscribersTab = ({ subscribers = [], onNotify }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredSubscribers = useMemo(() => {
    if (!searchTerm.trim()) return subscribers;
    const q = searchTerm.toLowerCase();
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, searchTerm]);

  const copyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    if (onNotify) onNotify(`Copied ${email} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllEmails = () => {
    const all = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(all);
    if (onNotify) onNotify(`Copied ${subscribers.length} email addresses to clipboard!`);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-title">
          <h2>Newsletter & VIP Subscribers</h2>
          <p>Clients who subscribed for Tuscan Verve private collections and style newsletters</p>
        </div>

        <button className="btn-secondary" onClick={copyAllEmails} disabled={subscribers.length === 0}>
          <IconCopy size={16} />
          <span>Copy All ({subscribers.length}) Emails</span>
        </button>
      </div>

      <div className="luxury-card">
        <div className="filter-bar">
          <div style={{ position: 'relative' }}>
            <span className="search-icon" style={{ left: '10px' }}>
              <IconSearch size={14} />
            </span>
            <input
              type="text"
              className="filter-input"
              style={{ paddingLeft: '32px', width: '260px' }}
              placeholder="Search subscriber emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <span style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
          </span>
        </div>

        <div className="table-wrapper">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Subscriber Email</th>
                <th>Subscription Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-muted)' }}>
                    No newsletter subscribers found.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub, idx) => (
                  <tr key={sub._id || sub.email}>
                    <td style={{ color: 'var(--ink-muted)', fontSize: '0.8rem' }}>{idx + 1}</td>
                    <td>
                      <strong style={{ color: 'var(--green-950)', fontSize: '0.92rem' }}>
                        {sub.email}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem' }}>
                        {new Date(sub.createdAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>
                        Subscribed
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        onClick={() => copyEmail(sub.email, sub._id || idx)}
                      >
                        {copiedId === (sub._id || idx) ? (
                          <>
                            <IconCheck size={14} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <IconCopy size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
