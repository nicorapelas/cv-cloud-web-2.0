import React from 'react';

const GenericAd = () => {
  return (
    <div className="generic-ad">
      <div className="generic-ad-icon">📢</div>
      <div className="generic-ad-text">
        <h3 className="generic-ad-title">
          Advertise with CV Cloud - Reach Job Seekers Daily
        </h3>
        <p className="generic-ad-subtitle">
          Connect with thousands of career-focused professionals building their
          future
        </p>
      </div>
      <a
        href="mailto:sponsor@cvcloud.com?subject=Advertising Inquiry"
        className="generic-ad-cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sponsor Us →
      </a>
    </div>
  );
};

export default GenericAd;

