import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as AdvertisementContext } from '../../../context/AdvertisementContext';
import api from '../../../api/api';
import { COUNTRIES } from '../../../utils/countryConfig';
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
  const [activityStats, setActivityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchUsers();
    fetchPlatformStats();
    fetchActivityStats();
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

  const fetchActivityStats = async () => {
    try {
      const response = await api.get('/api/user-activity/stats?days=30');
      setActivityStats(response.data);
    } catch (err) {
      console.error('Error fetching activity stats:', err);
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

  // Calculate country distribution
  const countryStats = users.reduce((acc, u) => {
    const country = u.country || 'ZA';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  // Sort countries by user count (descending)
  const topCountries = Object.entries(countryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 countries

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

        {/* Activity Stats */}
        {activityStats && (
          <div className="admin-section">
            <h2>📊 User Activity (Last 30 Days)</h2>
            <div className="admin-activity-grid">
              <div className="admin-activity-card">
                <div className="admin-activity-icon">📅</div>
                <div className="admin-activity-content">
                  <div className="admin-activity-value">
                    {activityStats.activeUsers?.daily || 0}
                  </div>
                  <div className="admin-activity-label">Active Today</div>
                </div>
              </div>
              <div className="admin-activity-card">
                <div className="admin-activity-icon">📆</div>
                <div className="admin-activity-content">
                  <div className="admin-activity-value">
                    {activityStats.activeUsers?.weekly || 0}
                  </div>
                  <div className="admin-activity-label">Active This Week</div>
                </div>
              </div>
              <div className="admin-activity-card">
                <div className="admin-activity-icon">📈</div>
                <div className="admin-activity-content">
                  <div className="admin-activity-value">
                    {activityStats.activeUsers?.monthly || 0}
                  </div>
                  <div className="admin-activity-label">Active This Month</div>
                </div>
              </div>
            </div>

            {/* Top Actions */}
            {activityStats.actionStats &&
              activityStats.actionStats.length > 0 && (
                <div className="admin-top-actions">
                  <h3>🎯 Top User Actions</h3>
                  <div className="admin-actions-list">
                    {activityStats.actionStats
                      .slice(0, 5)
                      .map((stat, index) => (
                        <div key={stat._id} className="admin-action-item">
                          <span className="admin-action-rank">
                            #{index + 1}
                          </span>
                          <span className="admin-action-name">
                            {stat._id
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="admin-action-count">
                            {stat.count} times
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Country Distribution */}
        {topCountries.length > 0 && (
          <div className="admin-section">
            <h2>🌍 User Distribution by Country</h2>
            <div className="admin-country-stats">
              {topCountries.map(([countryCode, count]) => {
                const country = COUNTRIES.find(c => c.code === countryCode);
                const percentage = ((count / users.length) * 100).toFixed(1);
                return (
                  <div key={countryCode} className="admin-country-stat-item">
                    <div className="admin-country-stat-header">
                      <span className="admin-country-stat-flag">
                        {country?.flag || '🌍'}
                      </span>
                      <span className="admin-country-stat-name">
                        {country?.name || countryCode}
                      </span>
                    </div>
                    <div className="admin-country-stat-bar">
                      <div
                        className="admin-country-stat-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="admin-country-stat-info">
                      <span className="admin-country-stat-count">
                        {count} users
                      </span>
                      <span className="admin-country-stat-percent">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
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
                    <th>Country</th>
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
                        <span className="admin-country-badge">
                          {COUNTRIES.find(c => c.code === (u.country || 'ZA'))
                            ?.flag || '🌍'}{' '}
                          {COUNTRIES.find(c => c.code === (u.country || 'ZA'))
                            ?.name ||
                            u.country ||
                            'South Africa'}
                        </span>
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
