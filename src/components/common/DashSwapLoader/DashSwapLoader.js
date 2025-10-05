import React, { useState, useEffect } from 'react';
import './DashSwapLoader.css';

const DashSwapLoader = ({
  show = true,
  switchingTo = 'dashboard', // 'dashboard' or 'hr-dashboard'
  delay = 3000,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setFadeOut(false);
    } else if (shouldRender) {
      setFadeOut(true);
      // Hide component after fade out completes
      setTimeout(() => {
        setShouldRender(false);
        setFadeOut(false);
      }, 800); // Match CSS animation duration
    }
  }, [show, shouldRender]);

  if (!shouldRender) return null;

  const isSwitchingToHR = switchingTo === 'hr-dashboard';
  const title = isSwitchingToHR
    ? 'Switching to HR Dashboard'
    : 'Switching to Dashboard';
  const subtitle = isSwitchingToHR
    ? 'Loading your HR management tools...'
    : 'Loading your CV builder...';
  const logo = isSwitchingToHR
    ? '/logo-h79.png' // You can change this to an HR-specific logo if you have one
    : '/logo-h79.png';

  return (
    <div className={`dash-swap-loader-page ${fadeOut ? 'fade-out' : ''}`}>
      <div className="dash-swap-loader-container">
        <div
          className={`dash-swap-loader-content ${fadeOut ? 'fade-out' : ''}`}
        >
          {/* Logo Section with Animation */}
          <div className="dash-swap-loader-logo">
            <img
              src={logo}
              alt="CV Cloud Logo"
              className="dash-swap-loader-logo-image"
            />
          </div>

          {/* Dashboard Type Indicator */}
          <div className="dash-swap-loader-type-indicator">
            <div
              className={`dashboard-type-badge ${isSwitchingToHR ? 'hr-badge' : 'regular-badge'}`}
            >
              {isSwitchingToHR ? 'HR' : 'CV'}
            </div>
          </div>

          {/* Message Section */}
          <div className="dash-swap-loader-message-section">
            <h2 className="dash-swap-loader-title">{title}</h2>
            <p className="dash-swap-loader-subtitle">{subtitle}</p>
          </div>

          {/* Animated Progress Bar */}
          <div className="dash-swap-loader-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>

          {/* Swapping Dots Loader */}
          <div className="dash-swap-loader-dots">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashSwapLoader;
