import React, { useState, useRef, useEffect } from 'react';
import './FirstImpressionModal.css';

const FirstImpressionModal = ({ isOpen, onClose, videoUrl, fullName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  // Auto-play when modal opens
  useEffect(() => {
    if (isOpen && videoRef.current && videoUrl) {
      setIsLoading(true);
      setHasError(false);

      // Start playing immediately when modal opens
      if (videoRef.current) {
        videoRef.current.play().catch(error => {
          console.error('Auto-play failed:', error);
          setHasError(true);
          setIsLoading(false);
        });
      }
    }
  }, [isOpen, videoUrl]);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsLoading(true);
    setHasError(false);
    onClose();
  };

  if (!isOpen || !videoUrl) return null;

  return (
    <div className="first-impression-overlay" onClick={handleClose}>
      <div
        className="first-impression-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="first-impression-header">
          <div className="first-impression-logo">
            <img
              src="/logo-h79.png"
              alt="CV Cloud Logo"
              className="first-impression-logo-image"
            />
          </div>
          <h3 className="first-impression-title">
            First Impression Video of {fullName || 'This Candidate'}
          </h3>
          <button className="first-impression-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="first-impression-content">
          {isLoading && (
            <div className="first-impression-loading">
              <div className="loading-spinner"></div>
              <p>Loading video...</p>
            </div>
          )}

          {hasError && (
            <div className="first-impression-error">
              <div className="error-icon">⚠️</div>
              <h4>Video Error</h4>
              <p>Unable to load the video. Please try again later.</p>
              <button
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {!hasError && (
            <div className="first-impression-video-container">
              <video
                ref={videoRef}
                className="first-impression-video"
                src={videoUrl}
                controls
                autoPlay
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onError={handleError}
                onLoadedData={handleLoadedData}
                style={{ display: isLoading ? 'none' : 'block' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className="first-impression-footer">
          <p className="first-impression-note">
            This is the candidate's first impression video showcasing their
            personality and communication skills.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirstImpressionModal;
