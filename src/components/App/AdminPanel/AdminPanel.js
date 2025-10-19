import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as AdvertisementContext } from '../../../context/AdvertisementContext';
import api from '../../../api/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();

  const {
    state: { user },
  } = useContext(AuthContext);

  const {
    state: { bannerAdStripShow },
    setBannerAdStripShow,
  } = useContext(AdvertisementContext);

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchUsers();
    fetchPlatformStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users');
      setUsers(response.data.users);
      setStats(response.data.stats);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setPlatformStats(response.data);
    } catch (err) {
      console.error('Error fetching platform stats:', err);
    }
  };

  const handleUpdateTier = async (userId, newTier) => {
    try {
      await api.patch(`/api/admin/users/${userId}/tier`, { tier: newTier });
      setSuccess(`User tier updated to ${newTier}`);
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user tier');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleAds = async () => {
    const newValue = !bannerAdStripShow;

    try {
      // Save to database
      await api.patch('/api/admin/settings', {
        bannerAdStripShow: newValue,
      });

      // Update local state
      setBannerAdStripShow(newValue);
      setSuccess(`Ads ${newValue ? 'enabled' : 'disabled'} globally`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update ad settings');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || u.tier === filterTier;
    const matchesType =
      filterType === 'all' ||
      (filterType === 'regular' && !u.HR && !u.isAdmin) ||
      (filterType === 'hr' && u.HR) ||
      (filterType === 'admin' && u.isAdmin);

    return matchesSearch && matchesTier && matchesType;
  });

  if (!user?.isAdmin) {
    return (
      <div className="admin-panel">
        <div className="admin-unauthorized">
          <h1>🚫 Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-container">
        <div className="admin-panel-header">
          <div className="admin-header-title">
            <h1>👑 Admin Panel</h1>
            <p>Manage platform settings and users</p>
          </div>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="admin-btn-back"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && <div className="admin-success-message">{success}</div>}
        {error && <div className="admin-error-message">{error}</div>}

        {/* Platform Stats */}
        {platformStats && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">👥</div>
              <div className="admin-stat-content">
                <div className="admin-stat-value">
                  {platformStats.users.total}
                </div>
                <div className="admin-stat-label">Total Users</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">🌟</div>
              <div className="admin-stat-content">
                <div className="admin-stat-value">
                  {platformStats.users.premium}
                </div>
                <div className="admin-stat-label">Premium Users</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">💼</div>
              <div className="admin-stat-content">
                <div className="admin-stat-value">{platformStats.users.hr}</div>
                <div className="admin-stat-label">HR Users</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">📄</div>
              <div className="admin-stat-content">
                <div className="admin-stat-value">
                  {platformStats.cvs.public}
                </div>
                <div className="admin-stat-label">Public CVs</div>
              </div>
            </div>
          </div>
        )}

        {/* Ad Controls */}
        <div className="admin-section">
          <h2>📢 Advertisement Controls</h2>
          <div className="admin-ad-controls">
            <div className="admin-ad-status">
              <span className="admin-ad-label">Global Ad Status:</span>
              <span
                className={`admin-ad-badge ${bannerAdStripShow ? 'active' : 'inactive'}`}
              >
                {bannerAdStripShow ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <button onClick={handleToggleAds} className="admin-btn-toggle-ads">
              {bannerAdStripShow ? '🚫 Disable Ads' : '✅ Enable Ads'}
            </button>
            <div className="admin-ad-note">
              Note: Premium users will never see ads, regardless of this
              setting.
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="admin-section">
          <h2>👥 User Management</h2>

          {/* Filters */}
          <div className="admin-filters">
            <input
              type="text"
              placeholder="Search by email or username..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
            <select
              value={filterTier}
              onChange={e => setFilterTier(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Tiers</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Types</option>
              <option value="regular">Regular</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* User Stats */}
          {stats && (
            <div className="admin-user-stats">
              <span>Total: {stats.total}</span>
              <span>Regular: {stats.regular}</span>
              <span>HR: {stats.hr}</span>
              <span>Free: {stats.free}</span>
              <span>Premium: {stats.premium}</span>
            </div>
          )}

          {/* Users Table */}
          {loading ? (
            <div className="admin-loading">Loading users...</div>
          ) : (
            <div className="admin-users-table">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Tier</th>
                    <th>Ads</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="admin-user-email">
                          {u.email}
                          {u.isAdmin && (
                            <span className="admin-badge">ADMIN</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`admin-type-badge ${u.HR ? 'hr' : 'regular'}`}
                        >
                          {u.isAdmin ? 'Admin' : u.HR ? 'HR' : 'Regular'}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-tier-badge ${u.tier}`}>
                          {u.tier || 'free'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-ads-badge ${u.tier === 'premium' ? 'no' : 'yes'}`}
                        >
                          {u.tier === 'premium' ? '✗ No' : '✓ Yes'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-user-actions">
                          {u.tier === 'premium' ? (
                            <button
                              onClick={() => handleUpdateTier(u._id, 'free')}
                              className="admin-btn-downgrade"
                              disabled={u.isAdmin}
                            >
                              Downgrade
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateTier(u._id, 'premium')}
                              className="admin-btn-upgrade"
                              disabled={u.isAdmin}
                            >
                              Upgrade
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="admin-no-results">
                  No users found matching your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
