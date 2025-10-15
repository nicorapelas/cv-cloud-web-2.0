import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context as FirstImpressionContext } from '../../../../context/FirstImpressionContext';
import { Context as NavContext } from '../../../../context/NavContext';

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
            <h2 className="dashboard-hero-title">{section.title}</h2>
            <p className="dashboard-hero-description">{section.description}</p>
            {firstImpressionStatus !== null &&
            !loading &&
            Number(firstImpressionStatus) > 0 ? (
              <div className="dashboard-hero-badge">
                <span
                  style={{
                    color: '#2ecc71',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  ✓ Complete
                </span>
              </div>
            ) : (
              <div className="dashboard-hero-badge">
                <span>Watch a demo, on how it's done</span>

                {videoDemoUrl && (
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDemoClick();
                    }}
                    className="demo-watch-button"
                    style={{
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      margin: '5px',
                    }}
                  >
                    🎬 Watch Demo
                  </button>
                )}
                {loading && (
                  <span className="loading-indicator">Loading...</span>
                )}
                {firstImpressionStatus !== null &&
                  !loading &&
                  Number(firstImpressionStatus) === 0 && (
                    <span className="status-indicator">
                      <span style={{ color: '#e74c3c' }}>○ Incomplete</span>
                    </span>
                  )}
              </div>
            )}
          </div>
          <div className="dashboard-hero-arrow">→</div>
        </div>
      </Link>
    </div>
  );
};

export default FirstImpressionCard;
