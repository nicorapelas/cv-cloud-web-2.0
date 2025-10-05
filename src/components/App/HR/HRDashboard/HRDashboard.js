import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context as AuthContext } from '../../../../context/AuthContext';
import { Context as SaveCVContext } from '../../../../context/SaveCVContext';
import api from '../../../../api/api';
import hrLogo from '../../../../assets/images/logo-hr.png';
import DashSwapLoader from '../../../common/DashSwapLoader/DashSwapLoader';
import './HRDashboard.css';

const HRDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRank, setFilterRank] = useState('all');
  const [sortBy, setSortBy] = useState('dateSaved');

  // Loader state
  const [showLoader, setShowLoader] = useState(false);
  const [switchingTo, setSwitchingTo] = useState('dashboard');

  const navigate = useNavigate();

  const {
    state: { user },
    signout,
  } = useContext(AuthContext);

  const {
    state: { loading, savedCVs },
    fetchSavedCVs,
  } = useContext(SaveCVContext);

  // Fetch saved CVs on component mount
  useEffect(() => {
    fetchSavedCVs();
  }, []);

  console.log('savedCVs', savedCVs);

  const handleSignout = () => {
    signout();
  };

  const handleSwitchToDashboard = () => {
    // Show loader first
    setSwitchingTo('dashboard');
    setShowLoader(true);

    // Navigate after 3 seconds
    setTimeout(() => {
      navigate('/app/dashboard');
      setShowLoader(false);
    }, 3000);
  };

  // Filter and search CVs
  const filteredCVs = (savedCVs || [])
    .filter(cv => {
      const matchesSearch = cv.label
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRank = filterRank === 'all' || cv.rank === filterRank;
      return matchesSearch && matchesRank;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateSaved':
          return new Date(b.dateSaved) - new Date(a.dateSaved);
        case 'lastViewed':
          return new Date(b.lastViewed) - new Date(a.lastViewed);
        case 'viewCount':
          return b.viewCount - a.viewCount;
        case 'label':
          return a.label?.localeCompare(b.label);
        default:
          return 0;
      }
    });

  const getRankColor = rank => {
    switch (rank) {
      case 'excellent':
        return '#2ecc71';
      case 'good':
        return '#3498db';
      case 'fair':
        return '#f39c12';
      case 'poor':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = label => {
    return (
      label
        ?.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'CV'
    );
  };

  return (
    <>
      <DashSwapLoader
        show={showLoader}
        switchingTo={switchingTo}
        delay={3000}
      />
      <div className="hr-dashboard">
        <header className="hr-dashboard-header">
          <div className="hr-dashboard-header-content">
            <div className="hr-dashboard-logo">
              <img
                src={hrLogo}
                alt="CV Cloud HR Logo"
                className="hr-dashboard-logo-image"
              />
              <div className="hr-dashboard-logo-text">
                <span className="hr-dashboard-badge">HR Dashboard</span>
              </div>
            </div>
            <div className="hr-dashboard-user-info">
              <span>Welcome, {user?.fullName || 'HR Professional'}</span>
              <div className="hr-dashboard-header-actions">
                <button
                  onClick={handleSwitchToDashboard}
                  className="hr-dashboard-switch-button"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleSignout}
                  className="hr-dashboard-signout"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="hr-dashboard-main">
          <div className="hr-dashboard-container">
            {/* Stats Section */}
            <section className="hr-dashboard-stats">
              <div className="hr-dashboard-stat">
                <span className="hr-dashboard-stat-number">
                  {savedCVs.length}
                </span>
                <span className="hr-dashboard-stat-label">Total Saved CVs</span>
              </div>
              <div className="hr-dashboard-stat">
                <span className="hr-dashboard-stat-number">
                  {
                    savedCVs.filter(cv => {
                      const oneWeekAgo = new Date();
                      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                      return new Date(cv.dateSaved) > oneWeekAgo;
                    }).length
                  }
                </span>
                <span className="hr-dashboard-stat-label">This Week</span>
              </div>
              <div className="hr-dashboard-stat">
                <span className="hr-dashboard-stat-number">
                  {savedCVs.reduce(
                    (total, cv) => total + (cv.viewCount || 0),
                    0
                  )}
                </span>
                <span className="hr-dashboard-stat-label">Total Views</span>
              </div>
              <div className="hr-dashboard-stat">
                <span className="hr-dashboard-stat-number">
                  {savedCVs.filter(cv => cv.rank && cv.rank !== 'null').length}
                </span>
                <span className="hr-dashboard-stat-label">Rated CVs</span>
              </div>
            </section>

            {/* Search and Filter Section */}
            <section className="hr-dashboard-controls">
              <div className="hr-dashboard-search">
                <input
                  type="text"
                  placeholder="Search CVs by name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="hr-dashboard-search-input"
                />
              </div>
              <div className="hr-dashboard-filters">
                <select
                  value={filterRank}
                  onChange={e => setFilterRank(e.target.value)}
                  className="hr-dashboard-filter-select"
                >
                  <option value="all">All Ranks</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="null">Unrated</option>
                </select>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="hr-dashboard-filter-select"
                >
                  <option value="dateSaved">Sort by Date Saved</option>
                  <option value="lastViewed">Sort by Last Viewed</option>
                  <option value="viewCount">Sort by View Count</option>
                  <option value="label">Sort by Name</option>
                </select>
              </div>
            </section>

            {/* CVs Grid */}
            <section className="hr-dashboard-cvs">
              {loading ? (
                <div className="hr-dashboard-loading">
                  <div className="hr-dashboard-spinner"></div>
                  <p className="hr-dashboard-loading-text">
                    Loading saved CVs...
                  </p>
                </div>
              ) : filteredCVs.length === 0 ? (
                <div className="hr-dashboard-empty">
                  <div className="hr-dashboard-empty-icon">📄</div>
                  <h3 className="hr-dashboard-empty-title">No CVs Found</h3>
                  <p className="hr-dashboard-empty-text">
                    {searchTerm || filterRank !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Start by saving CVs from shared links to build your talent pipeline.'}
                  </p>
                  {!searchTerm && filterRank === 'all' && (
                    <Link
                      to="/hr-introduction"
                      className="hr-dashboard-cta-button"
                    >
                      Learn How to Save CVs
                    </Link>
                  )}
                </div>
              ) : (
                <div className="hr-dashboard-cvs-grid">
                  {filteredCVs.map(cv => (
                    <div key={cv._id} className="hr-dashboard-cv-card">
                      <div className="hr-dashboard-cv-header">
                        <div className="hr-dashboard-cv-avatar">
                          {getInitials(cv.label)}
                        </div>
                        <div className="hr-dashboard-cv-info">
                          <h3 className="hr-dashboard-cv-name">
                            {cv.label || 'Unnamed CV'}
                          </h3>
                          <p className="hr-dashboard-cv-id">
                            ID: {cv.curriculumVitaeID}
                          </p>
                        </div>
                        {cv.rank && cv.rank !== 'null' && (
                          <div
                            className="hr-dashboard-cv-rank"
                            style={{ backgroundColor: getRankColor(cv.rank) }}
                          >
                            {cv.rank}
                          </div>
                        )}
                      </div>

                      <div className="hr-dashboard-cv-stats">
                        <div className="hr-dashboard-cv-stat">
                          <span className="hr-dashboard-cv-stat-number">
                            {cv.viewCount || 0}
                          </span>
                          <span className="hr-dashboard-cv-stat-label">
                            Views
                          </span>
                        </div>
                        <div className="hr-dashboard-cv-stat">
                          <span className="hr-dashboard-cv-stat-number">
                            {cv.notes?.length || 0}
                          </span>
                          <span className="hr-dashboard-cv-stat-label">
                            Notes
                          </span>
                        </div>
                      </div>

                      <div className="hr-dashboard-cv-dates">
                        <p className="hr-dashboard-cv-date">
                          <strong>Saved:</strong> {formatDate(cv.dateSaved)}
                        </p>
                        <p className="hr-dashboard-cv-date">
                          <strong>Last Viewed:</strong>{' '}
                          {formatDate(cv.lastViewed)}
                        </p>
                      </div>

                      <div className="hr-dashboard-cv-actions">
                        <button
                          className="hr-dashboard-cv-action-button primary"
                          onClick={() => {
                            // TODO: Implement view CV functionality
                            console.log('View CV:', cv.curriculumVitaeID);
                          }}
                        >
                          View CV
                        </button>
                        <button
                          className="hr-dashboard-cv-action-button secondary"
                          onClick={() => {
                            // TODO: Implement edit notes functionality
                            console.log(
                              'Edit notes for:',
                              cv.curriculumVitaeID
                            );
                          }}
                        >
                          Add Notes
                        </button>
                      </div>

                      {cv.notes && cv.notes.length > 0 && (
                        <div className="hr-dashboard-cv-notes">
                          <h4 className="hr-dashboard-cv-notes-title">
                            Recent Notes:
                          </h4>
                          {cv.notes.slice(0, 2).map((note, index) => (
                            <div key={index} className="hr-dashboard-cv-note">
                              <p className="hr-dashboard-cv-note-content">
                                {note.content}
                              </p>
                              <small className="hr-dashboard-cv-note-date">
                                {formatDate(note.createdAt)}
                              </small>
                            </div>
                          ))}
                          {cv.notes.length > 2 && (
                            <p className="hr-dashboard-cv-notes-more">
                              +{cv.notes.length - 2} more notes
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default HRDashboard;
