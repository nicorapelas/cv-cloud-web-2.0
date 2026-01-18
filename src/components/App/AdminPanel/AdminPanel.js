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
  
  // Email form state
  const [emailForm, setEmailForm] = useState({
    template: 'adminCommunicationTemplate',
    subject: '',
    message: '',
    recipients: {
      regular: false,
      hr: false,
      marketing: [],
      all: false,
    },
    marketingEmails: '', // Comma or newline separated
    marketingEnabled: false, // Separate state to control marketing checkbox
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailCampaigns, setEmailCampaigns] = useState([]);
  const [showEmailStats, setShowEmailStats] = useState(false);
  const [templateHint, setTemplateHint] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchPlatformStats();
    fetchActivityStats();
    fetchEmailCampaigns();
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

  const fetchEmailCampaigns = async () => {
    try {
      const response = await api.get('/api/admin/email-tracking/stats');
      setEmailCampaigns(response.data.campaigns || []);
    } catch (err) {
      console.error('Error fetching email campaigns:', err);
    }
  };

  const handleEmailFormChange = (field, value) => {
    if (field.startsWith('recipients.')) {
      const recipientField = field.split('.')[1];
      setEmailForm(prev => ({
        ...prev,
        recipients: {
          ...prev.recipients,
          [recipientField]: value,
        },
      }));
    } else {
      setEmailForm(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleTemplateChange = (value) => {
    setEmailForm(prev => ({
      ...prev,
      template: value,
    }));

    if (value === 'firstImpressionPromoTemplate') {
      setTemplateHint(
        "Uses the built-in 'First Impression' promo layout (includes demo video + HR intro links automatically)."
      );

      setEmailForm(prev => {
        const next = { ...prev, template: value };

        if (!next.subject) {
          next.subject =
            'Would a 30-second video change how you shortlist candidates?';
        }
        if (!next.message) {
          next.message = `<p>CVs tell you <strong>what</strong> a candidate has done — but not always <strong>who</strong> they are.</p><p><strong>First Impression</strong>, a feature in <strong>CV Cloud</strong>, allows job applicants to attach a <strong>30-second introduction video</strong> to their CV, giving you instant insight into their communication skills, confidence, and personality — before the interview stage.</p><h3>Why recruiters use First Impression:</h3><ul><li>Faster, more effective shortlisting</li><li>Early insight into communication and professionalism</li><li>Better-quality candidates reaching interview stage</li></ul><p>Many recruiters are now <strong>requiring a First Impression video</strong> as part of the application process to save time and improve hiring decisions.</p>`;
        }

        // If nothing is selected yet, default to HR (promo is HR-targeted)
        const anySelected =
          next.recipients.all ||
          next.recipients.regular ||
          next.recipients.hr ||
          (next.marketingEnabled && next.recipients.marketing.length > 0);

        if (!anySelected && !next.recipients.all) {
          next.recipients = {
            ...next.recipients,
            hr: true,
          };
        }

        return next;
      });
    } else {
      setTemplateHint('');
    }
  };

  const handleMarketingEmailsChange = (value) => {
    setEmailForm(prev => ({
      ...prev,
      marketingEmails: value,
    }));
    
    // Parse emails from textarea (comma or newline separated)
    const emails = value
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    setEmailForm(prev => ({
      ...prev,
      recipients: {
        ...prev.recipients,
        marketing: emails,
      },
    }));
  };

  const handleSendEmail = async () => {
    if (!emailForm.subject || !emailForm.message) {
      setError('Subject and message are required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const hasRecipients = 
      emailForm.recipients.regular || 
      emailForm.recipients.hr || 
      (emailForm.marketingEnabled && emailForm.recipients.marketing.length > 0) || 
      emailForm.recipients.all;

    if (!hasRecipients) {
      setError('Please select at least one recipient type');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setSendingEmail(true);
      setError('');
      
      const response = await api.post('/api/admin/send-email', {
        template: emailForm.template,
        subject: emailForm.subject,
        message: emailForm.message,
        recipients: emailForm.recipients,
      });

      setSuccess(`Email sent successfully! Sent to ${response.data.campaign.totalSent} recipients.`);
      setTimeout(() => setSuccess(''), 5000);
      
      // Reset form
      setEmailForm({
        template: 'adminCommunicationTemplate',
        subject: '',
        message: '',
        recipients: {
          regular: false,
          hr: false,
          marketing: [],
          all: false,
        },
        marketingEmails: '',
        marketingEnabled: false,
      });
      
      // Refresh campaigns
      fetchEmailCampaigns();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send email');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSendingEmail(false);
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

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'N/A';
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

        {/* Email Communication */}
        <div className="admin-section">
          <h2>📧 Email Communication</h2>
          <div className="admin-email-form">
            <div className="admin-email-field">
              <label htmlFor="email-template">Template</label>
              <select
                id="email-template"
                value={emailForm.template}
                onChange={e => handleTemplateChange(e.target.value)}
                className="admin-email-select"
              >
                <option value="adminCommunicationTemplate">
                  Standard (Admin Communication)
                </option>
                <option value="firstImpressionPromoTemplate">
                  Promo: First Impression (HR / Recruiters)
                </option>
              </select>
              {templateHint ? (
                <div className="admin-email-hint">{templateHint}</div>
              ) : null}
            </div>

            <div className="admin-email-field">
              <label htmlFor="email-subject">Subject *</label>
              <input
                id="email-subject"
                type="text"
                placeholder="Enter email subject"
                value={emailForm.subject}
                onChange={e => handleEmailFormChange('subject', e.target.value)}
                className="admin-email-input"
              />
            </div>

            <div className="admin-email-field">
              <label htmlFor="email-message">Message *</label>
              <textarea
                id="email-message"
                placeholder="Enter your message here..."
                value={emailForm.message}
                onChange={e => handleEmailFormChange('message', e.target.value)}
                className="admin-email-textarea"
                rows={8}
              />
            </div>

            <div className="admin-email-recipients">
              <label>Recipients *</label>
              <div className="admin-email-checkboxes">
                <label className="admin-email-checkbox">
                  <input
                    type="checkbox"
                    checked={emailForm.recipients.all}
                    onChange={e => {
                      const allChecked = e.target.checked;
                      handleEmailFormChange('recipients.all', allChecked);
                      if (allChecked) {
                        handleEmailFormChange('recipients.regular', false);
                        handleEmailFormChange('recipients.hr', false);
                        setEmailForm(prev => ({
                          ...prev,
                          marketingEnabled: false,
                          marketingEmails: '',
                          recipients: {
                            ...prev.recipients,
                            marketing: [],
                          },
                        }));
                      }
                    }}
                  />
                  <span>All Users</span>
                </label>
                <label className="admin-email-checkbox">
                  <input
                    type="checkbox"
                    checked={emailForm.recipients.regular}
                    onChange={e => {
                      handleEmailFormChange('recipients.regular', e.target.checked);
                      if (e.target.checked) {
                        handleEmailFormChange('recipients.all', false);
                      }
                    }}
                    disabled={emailForm.recipients.all}
                  />
                  <span>Regular Users</span>
                </label>
                <label className="admin-email-checkbox">
                  <input
                    type="checkbox"
                    checked={emailForm.recipients.hr}
                    onChange={e => {
                      handleEmailFormChange('recipients.hr', e.target.checked);
                      if (e.target.checked) {
                        handleEmailFormChange('recipients.all', false);
                      }
                    }}
                    disabled={emailForm.recipients.all}
                  />
                  <span>HR Users</span>
                </label>
                <label className="admin-email-checkbox">
                  <input
                    type="checkbox"
                    checked={emailForm.marketingEnabled}
                    onChange={e => {
                      const isChecked = e.target.checked;
                      setEmailForm(prev => ({
                        ...prev,
                        marketingEnabled: isChecked,
                      }));
                      if (!isChecked) {
                        // Clear marketing emails when unchecked
                        handleMarketingEmailsChange('');
                      }
                    }}
                    disabled={emailForm.recipients.all}
                  />
                  <span>Marketing (Manual Emails)</span>
                </label>
              </div>

              {emailForm.marketingEnabled ? (
                <div className="admin-email-marketing-input">
                  <label htmlFor="marketing-emails">
                    Marketing Email Addresses (comma or newline separated)
                  </label>
                  <textarea
                    id="marketing-emails"
                    placeholder="email1@example.com, email2@example.com&#10;email3@example.com"
                    value={emailForm.marketingEmails}
                    onChange={e => handleMarketingEmailsChange(e.target.value)}
                    className="admin-email-textarea"
                    rows={4}
                    disabled={emailForm.recipients.all}
                  />
                  {emailForm.recipients.marketing.length > 0 && (
                    <div className="admin-email-marketing-count">
                      {emailForm.recipients.marketing.length} email(s) entered
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <button
              onClick={handleSendEmail}
              disabled={sendingEmail || !emailForm.subject || !emailForm.message}
              className="admin-btn-send-email"
            >
              {sendingEmail ? '⏳ Sending...' : '📤 Send Email'}
            </button>
          </div>

          {/* Email Campaign Stats */}
          {emailCampaigns.length > 0 && (
            <div className="admin-email-stats">
              <div className="admin-email-stats-header">
                <h3>📊 Recent Email Campaigns</h3>
                <button
                  onClick={() => setShowEmailStats(!showEmailStats)}
                  className="admin-btn-toggle-stats"
                >
                  {showEmailStats ? 'Hide Stats' : 'Show Stats'}
                </button>
              </div>
              {showEmailStats && (
                <div className="admin-email-campaigns-list">
                  {emailCampaigns.slice(0, 10).map(campaign => (
                    <div key={campaign.id} className="admin-email-campaign-item">
                      <div className="admin-email-campaign-subject">{campaign.subject}</div>
                      <div className="admin-email-campaign-meta">
                        <span>Sent: {new Date(campaign.sentAt).toLocaleDateString()}</span>
                        <span>Recipients: {campaign.totalSent}</span>
                        <span>Opened: {campaign.totalOpened} ({campaign.openRate}%)</span>
                        <span>Clicked: {campaign.totalClicked} ({campaign.clickRate}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
                    <th>Date Signed Up</th>
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
                        <span className="admin-date-signed-up">
                          {formatDate(u.created)}
                        </span>
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
