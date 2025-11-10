import React, { useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context as FirstImpressionContext } from '../../../../context/FirstImpressionContext';
import { Context as NavContext } from '../../../../context/NavContext';
import { useRealTime } from '../../../../context/RealTimeContext';

const FirstImpressionCard = ({ setNavTabSelected }) => {
  const navigate = useNavigate();
  const {
    state: {
      videoDemoShow,
      videoDemoUrl,
      firstImpressionStatus,
      loading,
      firstImpressionStatusInitFetchDone,
    },
    fetchDemoVideoUrl,
    fetchFirsImpressionStatus,
    setFirstImpressionStatusInitFetchDone,
  } = useContext(FirstImpressionContext);
  const { setNavTabSelected: setNavTab } = useContext(NavContext);
  
  const { lastUpdate } = useRealTime();
  const lastRefreshTimestamp = useRef(null);

  useEffect(() => {
    fetchDemoVideoUrl();
  }, [fetchDemoVideoUrl]);

  // Fetch first impression status on component mount
  useEffect(() => {
    if (!firstImpressionStatusInitFetchDone) {
      fetchFirsImpressionStatus();
      setFirstImpressionStatusInitFetchDone(true);
    }
  }, [
    firstImpressionStatusInitFetchDone,
    fetchFirsImpressionStatus,
    setFirstImpressionStatusInitFetchDone,
  ]);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate.dataType === 'first-impression') {
      const now = Date.now();
      if (
        lastRefreshTimestamp.current &&
        now - lastRefreshTimestamp.current < 2000
      ) {
        return;
      }

      lastRefreshTimestamp.current = now;
      setTimeout(() => {
        fetchFirsImpressionStatus();
      }, 500);
    }
  }, [lastUpdate, fetchFirsImpressionStatus]);

  const handleDemoClick = () => {
    // Set the navigation tab to first impression
    setNavTab('firstImpression');

    // Navigate to CV Builder with first impression tab
    navigate('/app/cv-builder/firstImpression');

    // Set a flag in sessionStorage to trigger auto-demo after navigation
    sessionStorage.setItem('autoPlayDemo', 'true');
  };

  const section = {
    id: 'firstImpression',
    title: 'First Impression',
    description:
      'Create a compelling video introduction that makes you stand out',
    icon: '🎥',
    route: '/app/cv-builder/firstImpression',
    isHero: true,
  };

  return (
    <div className="dashboard-hero-section">
      <Link
        to={section.route}
        className="dashboard-hero-card"
        onClick={() => setNavTabSelected(section.id)}
      >
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-icon">{section.icon}</div>
          <div className="dashboard-hero-text">
            <div className="dashboard-hero-title-row">
              <h2 className="dashboard-hero-title">{section.title}</h2>
              {firstImpressionStatus !== null &&
                !loading &&
                Number(firstImpressionStatus) === 0 && (
                  <span className="status-badge-incomplete">○ Incomplete</span>
                )}
              {firstImpressionStatus !== null &&
                !loading &&
                Number(firstImpressionStatus) > 0 && (
                  <span className="status-badge-complete">✓ Complete</span>
                )}
            </div>
            <p className="dashboard-hero-description">{section.description}</p>
            {firstImpressionStatus !== null &&
              !loading &&
              Number(firstImpressionStatus) === 0 && (
                <div className="dashboard-hero-actions">
                  {videoDemoUrl && (
                    <button
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDemoClick();
                      }}
                      className="demo-watch-button"
                    >
                      🎬 Watch Demo
                    </button>
                  )}
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate('/app/cv-builder/firstImpression');
                      setNavTab('firstImpression');
                    }}
                    className="create-impression-button"
                  >
                    🎥 Create First Impression
                  </button>
                </div>
              )}
            {loading && <span className="loading-indicator">Loading...</span>}
          </div>
          <div className="dashboard-hero-arrow">→</div>
        </div>
      </Link>
    </div>
  );
};

export default FirstImpressionCard;
