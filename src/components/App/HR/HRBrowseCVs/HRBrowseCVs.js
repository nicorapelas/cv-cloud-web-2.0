import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context as PublicCVContext } from '../../../../context/PublicCVContext';
import { Context as SaveCVContext } from '../../../../context/SaveCVContext';
import socketService from '../../../../services/socketService';
import Loader from '../../../common/loader/Loader';
import { COUNTRIES, detectUserCountry } from '../../../../utils/countryConfig';
import hrLogo from '../../../../assets/images/logo-hr.png';
import './HRBrowseCVs.css';

const HRBrowseCVs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterCountry, setFilterCountry] = useState(detectUserCountry()); // Auto-detect HR user's country
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [liveUpdateNotification, setLiveUpdateNotification] = useState(null);
  const [savingCVs, setSavingCVs] = useState(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    state: { loading, browseCVs, error },
    fetchBrowseCVs,
    savePublicCV,
    requestCVAccess,
    cancelCVAccessRequest,
    clearError,
  } = useContext(PublicCVContext);
  const [requestingCVs, setRequestingCVs] = useState(new Set());
  const [withdrawingCVs, setWithdrawingCVs] = useState(new Set());

  const { fetchSavedCVs } = useContext(SaveCVContext);

  // Fetch public CVs and sync saved CVs state on mount
  useEffect(() => {
    fetchBrowseCVs();
    fetchSavedCVs(); // Sync saved CVs state to ensure accurate isSaved status
  }, [fetchBrowseCVs, fetchSavedCVs]);

  // Auto-hide error banner after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

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

    // Listen for data updates (including photo updates)
    const handleDataUpdate = data => {
      // If photo was updated, refresh the browse list to get new photo URLs
      if (data && data.dataType === 'photo') {
        console.log('📸 Photo update detected, refreshing browse CVs');
        fetchBrowseCVs();
      }
    };

    // Listen for CV access approved (candidate granted access; HR can now view full CV)
    const handleCVAccessApproved = data => {
      console.log('✅ CV access approved:', data);
      setLiveUpdateNotification({
        action: 'cv-access-approved',
        fullName: data?.fullName || 'Candidate',
      });
      setTimeout(() => setLiveUpdateNotification(null), 4000);
      fetchBrowseCVs();
      fetchSavedCVs();
    };

    // Add event listeners
    socketService.addEventListener(
      'public-cv-list-updated',
      handlePublicCVListUpdated
    );
    socketService.addEventListener('data-updated', handleDataUpdate);
    socketService.addEventListener('cv-access-approved', handleCVAccessApproved);

    // Cleanup
    return () => {
      socketService.removeEventListener(
        'public-cv-list-updated',
        handlePublicCVListUpdated
      );
      socketService.removeEventListener('data-updated', handleDataUpdate);
      socketService.removeEventListener('cv-access-approved', handleCVAccessApproved);
    };
  }, [fetchBrowseCVs, fetchSavedCVs]);

  const handleSaveCV = async (curriculumVitaeID, fullName) => {
    // Add CV to saving set
    setSavingCVs(prev => new Set(prev).add(curriculumVitaeID));

    try {
      await savePublicCV(curriculumVitaeID);
      // Refresh saved CVs list (browseCVs state is already updated by reducer)
      fetchSavedCVs();
    } catch (err) {
      alert(err.message || 'Failed to save CV');
    } finally {
      // Remove CV from saving set
      setSavingCVs(prev => {
        const newSet = new Set(prev);
        newSet.delete(curriculumVitaeID);
        return newSet;
      });
    }
  };

  const handleViewCV = curriculumVitaeID => {
    navigate(`/app/hr-view-cv/${curriculumVitaeID}?from=browse`);
  };

  // For unsaved cards: request access only (no save). HR can view/save only after creator clicks "Share CV as requested" in email.
  const handleRequestCVUnsaved = async (curriculumVitaeID, fullName) => {
    setRequestingCVs(prev => new Set(prev).add(curriculumVitaeID));
    try {
      await requestCVAccess(curriculumVitaeID, fullName);
      await fetchBrowseCVs();
      await fetchSavedCVs(); // also refresh saved list (e.g. after "restore" when HR had deleted the saved CV)
    } catch (err) {
      // Error already set in context
    } finally {
      setRequestingCVs(prev => {
        const next = new Set(prev);
        next.delete(curriculumVitaeID);
        return next;
      });
    }
  };

  const handleWithdrawRequest = async curriculumVitaeID => {
    setWithdrawingCVs(prev => new Set(prev).add(curriculumVitaeID));
    try {
      await cancelCVAccessRequest(curriculumVitaeID);
      await fetchBrowseCVs();
    } catch (err) {
      // Error already set in context
    } finally {
      setWithdrawingCVs(prev => {
        const next = new Set(prev);
        next.delete(curriculumVitaeID);
        return next;
      });
    }
  };

  const handlePreviewCV = curriculumVitaeID => {
    navigate(`/app/hr-view-cv/${curriculumVitaeID}?preview=true&from=browse`);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Safely get browseCVs array
  const cvsList = browseCVs || [];

  // Get unique industries for filter dropdown
  const uniqueIndustries = [
    ...new Set(cvsList.flatMap(cv => cv.industries || [])),
  ].sort();

  // Get unique countries from CVs
  const uniqueCountries = [...new Set(cvsList.map(cv => cv.country || 'ZA'))].sort();

  // Filter CVs
  const filteredCVs = cvsList.filter(cv => {
    const matchesSearch = cv.fullName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'all' || cv.gender === filterGender;
    const matchesIndustry =
      filterIndustry === 'all' ||
      (cv.industries && cv.industries.includes(filterIndustry));
    const matchesCountry =
      filterCountry === 'all' || cv.country === filterCountry || (!cv.country && filterCountry === 'ZA');
    const matchesSaved = !showSavedOnly || cv.isSaved;
    return matchesSearch && matchesGender && matchesIndustry && matchesCountry && matchesSaved;
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
            {liveUpdateNotification.action === 'cv-access-approved'
              ? '✅'
              : liveUpdateNotification.action === 'added'
                ? '🆕'
                : '🔴'}
          </span>
          <span className="update-text">
            {liveUpdateNotification.action === 'cv-access-approved' ? (
              <>
                <strong>{liveUpdateNotification.fullName}</strong> granted access
                — you can now view their full CV.
              </>
            ) : liveUpdateNotification.action === 'added' ? (
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
          {/* Desktop Back Button */}
          <button
            onClick={() => navigate('/app/hr-dashboard')}
            className="hr-browse-back"
          >
            ← Back to Dashboard
          </button>

          {/* Logo and Title Section */}
          <div className="hr-browse-title-section">
            <div className="hr-browse-logo">
              <img
                src={hrLogo}
                alt="CV Cloud HR Logo"
                className="hr-browse-logo-image"
              />
            </div>
            <div className="hr-browse-title-text">
              <h1>🔍 Browse CVs</h1>
              <p>Discover talented candidates</p>
            </div>
          </div>

          {/* Desktop Spacer */}
          <div className="hr-browse-spacer"></div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileMenuToggle}
            className="hr-browse-mobile-menu-button"
            title="Menu"
          >
            <div className="hr-browse-hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <>
              <div 
                className="hr-browse-mobile-menu-backdrop"
                onClick={handleMobileMenuClose}
              ></div>
              <div className="hr-browse-mobile-menu">
                <button
                  onClick={() => {
                    navigate('/app/hr-dashboard');
                    handleMobileMenuClose();
                  }}
                  className="hr-browse-mobile-nav-button"
                >
                  ← Back to Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/app/hr-browse-cvs');
                    handleMobileMenuClose();
                  }}
                  className="hr-browse-mobile-nav-button active"
                >
                  🔍 Browse CVs
                </button>
                <button
                  onClick={() => {
                    navigate('/app/hr-dashboard');
                    handleMobileMenuClose();
                  }}
                  className="hr-browse-mobile-nav-button"
                >
                  📊 Dashboard
                </button>
              </div>
            </>
          )}
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
                value={filterCountry}
                onChange={e => setFilterCountry(e.target.value)}
                className="filter-select filter-select-country"
              >
                <option value="all">🌍 All Countries</option>
                {uniqueCountries.map(countryCode => {
                  const country = COUNTRIES.find(c => c.code === countryCode);
                  return (
                    <option key={countryCode} value={countryCode}>
                      {country ? `${country.flag} ${country.name}` : countryCode}
                    </option>
                  );
                })}
              </select>
              <select
                value={filterIndustry}
                onChange={e => setFilterIndustry(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Industries</option>
                {uniqueIndustries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
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
                {searchTerm ||
                filterGender !== 'all' ||
                filterIndustry !== 'all' ||
                filterCountry !== 'all' ||
                showSavedOnly
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No publicly listed CVs available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="hr-browse-grid">
              {filteredCVs.map(cv => (
                <div
                  key={cv._id}
                  className={`hr-browse-cv-card ${cv.isSaved ? 'saved' : ''}`}
                >
                  <div className="cv-card-header">
                    <div className="cv-avatar">
                      {cv.profilePicture ? (
                        <img
                          src={cv.profilePicture}
                          alt={cv.fullName}
                          className="cv-avatar-image"
                          onError={e => {
                            // Try to refetch with cache-busting
                            const separator = cv.profilePicture.includes('?') ? '&' : '?';
                            const newSrc = `${cv.profilePicture}${separator}t=${Date.now()}`;
                            
                            // Only retry once to avoid infinite loops
                            if (!e.target.dataset.retried) {
                              e.target.dataset.retried = 'true';
                              e.target.src = newSrc;
                              return;
                            }
                            
                            // Fallback to initials if image fails to load after retry
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <span
                        className="cv-avatar-initials"
                        style={{ display: cv.profilePicture ? 'none' : 'flex' }}
                      >
                        {getInitials(cv.fullName)}
                      </span>
                    </div>
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
                      <div className="cv-card-header-actions">
                        <div className="cv-saved-badge">✓ Saved</div>
                        <button
                          onClick={() => handleViewCV(cv.curriculumVitaeID)}
                          className="btn-view cv-header-view-btn"
                        >
                          View CV
                        </button>
                      </div>
                    )}
                    {!cv.isSaved && (
                      <div className="cv-card-header-actions">
                        {cv.requestStatus === 'pending' ? (
                          <>
                            <span className="cv-request-pending">Pending</span>
                            <button
                              type="button"
                              onClick={() => handleWithdrawRequest(cv.curriculumVitaeID)}
                              className="cv-withdraw-btn"
                              disabled={withdrawingCVs.has(cv.curriculumVitaeID)}
                            >
                              {withdrawingCVs.has(cv.curriculumVitaeID) ? '...' : 'Withdraw'}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              handleRequestCVUnsaved(cv.curriculumVitaeID, cv.fullName)
                            }
                            className="btn-request-cv cv-header-request-btn"
                            disabled={requestingCVs.has(cv.curriculumVitaeID)}
                          >
                            {requestingCVs.has(cv.curriculumVitaeID) ? (
                              <>
                                <span className="spinner"></span>
                                Requesting...
                              </>
                            ) : (
                              'Request CV'
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Country Badge */}
                  {cv.country && (
                    <div className="cv-country-badge">
                      {COUNTRIES.find(c => c.code === cv.country)?.flag || '🌍'}{' '}
                      {COUNTRIES.find(c => c.code === cv.country)?.name || cv.country}
                    </div>
                  )}

                  {/* Industries */}
                  {cv.industries && cv.industries.length > 0 && (
                    <div className="cv-industries">
                      {cv.industries.slice(0, 3).map((industry, index) => (
                        <span key={index} className="cv-industry-tag">
                          {industry}
                        </span>
                      ))}
                      {cv.industries.length > 3 && (
                        <span className="cv-industry-more">
                          +{cv.industries.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

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
