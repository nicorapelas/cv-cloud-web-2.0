import React, { useContext, useEffect, useState } from 'react';
import { Context as PublicCVContext } from '../../../../context/PublicCVContext';
import socketService from '../../../../services/socketService';
import './CVVisibilityCard.css';

const CVVisibilityCard = () => {
  const {
    state: { isListed, publicCV, loading, error },
    fetchPublicCVStatus,
    togglePublicCV,
    clearError,
  } = useContext(PublicCVContext);

  const [isToggling, setIsToggling] = useState(false);
  const [liveViewNotification, setLiveViewNotification] = useState(null);

  // Fetch status on component mount
  useEffect(() => {
    fetchPublicCVStatus();
  }, [fetchPublicCVStatus]);

  // Listen for real-time view notifications
  useEffect(() => {
    const handlePublicCVViewed = data => {
      console.log('🔔 Public CV viewed notification:', data);

      // Show notification
      setLiveViewNotification({
        hrUserName: data.hrUserName,
        viewedAt: data.viewedAt,
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setLiveViewNotification(null);
      }, 5000);

      // Refresh status to get updated view count
      fetchPublicCVStatus();
    };

    // Add event listener
    socketService.addEventListener('public-cv-viewed', handlePublicCVViewed);

    // Cleanup
    return () => {
      socketService.removeEventListener(
        'public-cv-viewed',
        handlePublicCVViewed
      );
    };
  }, [fetchPublicCVStatus]);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await togglePublicCV();
    } catch (err) {
      console.error('Error toggling visibility:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="cv-visibility-card">
      {/* Live View Notification */}
      {liveViewNotification && (
        <div className="live-view-notification">
          <span className="notification-icon">👁️</span>
          <span className="notification-text">
            <strong>{liveViewNotification.hrUserName}</strong> just viewed your
            CV!
          </span>
        </div>
      )}

      <div className="cv-visibility-header">
        <div className="cv-visibility-icon">🌐</div>
        <div className="cv-visibility-title">
          <h4>CV Visibility Settings</h4>
          <p className="cv-visibility-subtitle">
            {isListed
              ? 'Your CV is discoverable by HR professionals'
              : 'Make your CV discoverable to HR professionals'}
          </p>
        </div>
      </div>

      <div className="cv-visibility-content">
        <div className="cv-visibility-toggle-section">
          <div className="toggle-info">
            <span className="toggle-label">
              {isListed ? '✓ Listed Publicly' : 'Not Listed'}
            </span>
            <p className="toggle-description">
              {isListed
                ? 'HR users can find and save your CV'
                : 'Enable to let HR professionals discover your CV'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={loading || isToggling}
            className={`visibility-toggle-button ${isListed ? 'active' : ''}`}
          >
            {isToggling ? (
              <span className="toggle-spinner">⟳</span>
            ) : isListed ? (
              'TURN OFF'
            ) : (
              'TURN ON'
            )}
          </button>
        </div>

        {/* Stats Section */}
        {isListed && publicCV && publicCV.viewCount > 0 && (
          <div className="cv-visibility-stats">
            <div className="visibility-stat">
              <span className="stat-icon">👁️</span>
              <span className="stat-value">{publicCV.viewCount}</span>
              <span className="stat-label">
                {publicCV.viewCount === 1 ? 'HR view' : 'HR views'}
              </span>
            </div>
            {publicCV.hrViews && publicCV.hrViews.length > 0 && (
              <div className="visibility-stat">
                <span className="stat-icon">👥</span>
                <span className="stat-value">{publicCV.hrViews.length}</span>
                <span className="stat-label">
                  {publicCV.hrViews.length === 1
                    ? 'HR professional'
                    : 'HR professionals'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Recent HR Views */}
        {isListed &&
          publicCV &&
          publicCV.hrViews &&
          publicCV.hrViews.length > 0 && (
            <div className="cv-visibility-recent-views">
              <h5 className="recent-views-title">Recent Views:</h5>
              <div className="recent-views-list">
                {publicCV.hrViews.slice(0, 3).map((view, index) => (
                  <div key={index} className="recent-view-item">
                    <span className="view-name">
                      {view.hrUserName || 'HR Professional'}
                    </span>
                    <span className="view-date">
                      {new Date(view.viewedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Error Display */}
        {error && (
          <div className="cv-visibility-error">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button onClick={clearError} className="error-close">
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVVisibilityCard;
