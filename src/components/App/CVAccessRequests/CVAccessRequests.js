import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import NotificationCenter from '../../common/NotificationCenter/NotificationCenter';
import './CVAccessRequests.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CVAccessRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respondingId, setRespondingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/cv-access-requests');
      setRequests(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (requestId, action) => {
    setRespondingId(requestId);
    try {
      await api.patch(`/api/cv-access-requests/${requestId}/respond`, {
        action,
      });
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${action}`);
    } finally {
      setRespondingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const otherRequests = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="cv-access-requests-page">
      <header className="cv-access-requests-header">
        <div className="cv-access-requests-header-inner">
          <Link to="/app/dashboard" className="cv-access-requests-back">
            ← Dashboard
          </Link>
          <h1 className="cv-access-requests-title">CV Access Requests</h1>
          <div className="cv-access-requests-header-actions">
            <NotificationCenter />
          </div>
        </div>
      </header>

      <main className="cv-access-requests-main">
        {error && (
          <div className="cv-access-requests-error">
            {error}
            <button type="button" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="cv-access-requests-loading">Loading...</div>
        ) : (
          <>
            <p className="cv-access-requests-intro">
              HR professionals who have saved your CV can request to view the
              full version. Approve or decline below.
            </p>

            {pendingRequests.length > 0 && (
              <section className="cv-access-requests-section">
                <h2>Pending ({pendingRequests.length})</h2>
                <ul className="cv-access-requests-list">
                  {pendingRequests.map((r) => (
                    <li key={r._id} className="cv-access-request-card">
                      <div className="cv-access-request-info">
                        <strong>
                          {r.requestedBy?.fullName || r.requestedBy?.email || 'HR user'}
                        </strong>
                        {r.requestedBy?.email && (
                          <span className="cv-access-request-email">
                            {r.requestedBy.email}
                          </span>
                        )}
                        <span className="cv-access-request-meta">
                          Requested for: {r.fullName} · {formatDate(r.createdAt)}
                        </span>
                      </div>
                      <div className="cv-access-request-actions">
                        <button
                          type="button"
                          className="cv-access-request-btn approve"
                          onClick={() => handleRespond(r._id, 'approve')}
                          disabled={respondingId === r._id}
                        >
                          {respondingId === r._id ? '...' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          className="cv-access-request-btn decline"
                          onClick={() => handleRespond(r._id, 'decline')}
                          disabled={respondingId === r._id}
                        >
                          Decline
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {otherRequests.length > 0 && (
              <section className="cv-access-requests-section">
                <h2>Recent</h2>
                <ul className="cv-access-requests-list cv-access-requests-list-recent">
                  {otherRequests.slice(0, 20).map((r) => (
                    <li key={r._id} className="cv-access-request-card recent">
                      <div className="cv-access-request-info">
                        <strong>
                          {r.requestedBy?.fullName || r.requestedBy?.email || 'HR user'}
                        </strong>
                        <span className={`cv-access-request-status ${r.status}`}>
                          {r.status}
                        </span>
                        <span className="cv-access-request-meta">
                          {r.fullName} · {formatDate(r.respondedAt || r.createdAt)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {requests.length === 0 && !loading && (
              <div className="cv-access-requests-empty">
                <p>No CV access requests yet.</p>
                <p>When an HR professional saves your CV and requests access, they will appear here.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CVAccessRequests;
