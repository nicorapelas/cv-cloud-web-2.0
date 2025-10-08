import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context as PublicCVContext } from '../../../../context/PublicCVContext';
import { Context as SaveCVContext } from '../../../../context/SaveCVContext';
import socketService from '../../../../services/socketService';
import Loader from '../../../common/loader/Loader';
import './HRBrowseCVs.css';

const HRBrowseCVs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [liveUpdateNotification, setLiveUpdateNotification] = useState(null);

  const {
    state: { loading, browseCVs, error },
    fetchBrowseCVs,
    savePublicCV,
    clearError,
  } = useContext(PublicCVContext);

  const { fetchSavedCVs } = useContext(SaveCVContext);

  // Fetch public CVs on mount
  useEffect(() => {
    fetchBrowseCVs();
  }, [fetchBrowseCVs]);

  // Listen for real-time public CV list updates
  useEffect(() => {
    const handlePublicCVListUpdated = data => {
      console.log('🔔 Public CV list updated:', data);

      // Show notification
      setLiveUpdateNotification({
        action: data.action,
        fullName: data.fullName,
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setLiveUpdateNotification(null);
      }, 3000);

      // Refresh the list
      fetchBrowseCVs();
    };

    // Add event listener
    socketService.addEventListener(
      'public-cv-list-updated',
      handlePublicCVListUpdated
    );

    // Cleanup
    return () => {
      socketService.removeEventListener(
        'public-cv-list-updated',
        handlePublicCVListUpdated
      );
    };
  }, [fetchBrowseCVs]);

  const handleSaveCV = async (curriculumVitaeID, fullName) => {
    try {
      await savePublicCV(curriculumVitaeID);
      // Refresh saved CVs list
      fetchSavedCVs();
      alert(`${fullName}'s CV has been saved to your dashboard!`);
    } catch (err) {
      alert(err.message || 'Failed to save CV');
    }
  };

  const handleViewCV = curriculumVitaeID => {
    navigate(`/app/hr-view-cv/${curriculumVitaeID}`);
  };

  // Safely get browseCVs array
  const cvsList = browseCVs || [];

  // Filter CVs
  const filteredCVs = cvsList.filter(cv => {
    const matchesSearch = cv.fullName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'all' || cv.gender === filterGender;
    const matchesSaved = !showSavedOnly || cv.isSaved;
    return matchesSearch && matchesGender && matchesSaved;
  });

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateAge = dateOfBirth => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getInitials = fullName => {
    return (
      fullName
        ?.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'CV'
    );
  };

  if (loading && cvsList.length === 0) return <Loader />;

  return (
    <div className="hr-browse-cvs">
      {/* Live Update Notification */}
      {liveUpdateNotification && (
        <div className="live-update-notification">
          <span className="update-icon">
            {liveUpdateNotification.action === 'added' ? '🆕' : '🔴'}
          </span>
          <span className="update-text">
            {liveUpdateNotification.action === 'added' ? (
              <>
                <strong>{liveUpdateNotification.fullName}</strong> just listed
                their CV!
              </>
            ) : (
              <>
                <strong>{liveUpdateNotification.fullName}</strong>'s CV was
                unlisted
              </>
            )}
          </span>
        </div>
      )}

      <header className="hr-browse-header">
        <div className="hr-browse-header-content">
          <button
            onClick={() => navigate('/app/hr-dashboard')}
            className="hr-browse-back"
          >
            ← Back to Dashboard
          </button>
          <div className="hr-browse-title-section">
            <h1>🔍 Browse Public CVs</h1>
            <p>Discover talented candidates looking for opportunities</p>
          </div>
        </div>
      </header>

      <main className="hr-browse-main">
        <div className="hr-browse-container">
          {/* Stats Bar */}
          <div className="hr-browse-stats">
            <div className="hr-browse-stat">
              <span className="stat-number">{cvsList.length}</span>
              <span className="stat-label">Available CVs</span>
            </div>
            <div className="hr-browse-stat">
              <span className="stat-number">
                {cvsList.filter(cv => cv.isSaved).length}
              </span>
              <span className="stat-label">Already Saved</span>
            </div>
            <div className="hr-browse-stat">
              <span className="stat-number">{filteredCVs.length}</span>
              <span className="stat-label">Filtered Results</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="hr-browse-controls">
            <div className="hr-browse-search">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="hr-browse-filters">
              <select
                value={filterGender}
                onChange={e => setFilterGender(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={showSavedOnly}
                  onChange={e => setShowSavedOnly(e.target.checked)}
                />
                <span>Show saved only</span>
              </label>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="hr-browse-error">
              <span>⚠️ {error}</span>
              <button onClick={clearError} className="error-close">
                ×
              </button>
            </div>
          )}

          {/* CVs Grid */}
          {filteredCVs.length === 0 ? (
            <div className="hr-browse-empty">
              <div className="empty-icon">📭</div>
              <h3>No CVs Found</h3>
              <p>
                {searchTerm || filterGender !== 'all' || showSavedOnly
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No publicly listed CVs available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="hr-browse-grid">
              {filteredCVs.map(cv => (
                <div key={cv._id} className="hr-browse-cv-card">
                  <div className="cv-card-header">
                    <div className="cv-avatar">{getInitials(cv.fullName)}</div>
                    <div className="cv-info">
                      <h3 className="cv-name">{cv.fullName}</h3>
                      {cv.dateOfBirth && (
                        <p className="cv-age">
                          Age: {calculateAge(cv.dateOfBirth)}
                        </p>
                      )}
                      {cv.gender && (
                        <p className="cv-gender">
                          {cv.gender.charAt(0).toUpperCase() +
                            cv.gender.slice(1)}
                        </p>
                      )}
                    </div>
                    {cv.isSaved && (
                      <div className="cv-saved-badge">✓ Saved</div>
                    )}
                  </div>

                  <div className="cv-card-meta">
                    <span className="cv-meta-item">
                      📅 Listed {formatDate(cv.listedAt)}
                    </span>
                    {cv.viewCount > 0 && (
                      <span className="cv-meta-item">
                        👁️ {cv.viewCount}{' '}
                        {cv.viewCount === 1 ? 'view' : 'views'}
                      </span>
                    )}
                    {cv.nationality && (
                      <span className="cv-meta-item">🌍 {cv.nationality}</span>
                    )}
                  </div>

                  <div className="cv-card-actions">
                    {cv.isSaved ? (
                      <button
                        onClick={() => handleViewCV(cv.curriculumVitaeID)}
                        className="btn-view"
                      >
                        View CV
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleViewCV(cv.curriculumVitaeID)}
                          className="btn-preview"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() =>
                            handleSaveCV(cv.curriculumVitaeID, cv.fullName)
                          }
                          className="btn-save"
                        >
                          💾 Save CV
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRBrowseCVs;
