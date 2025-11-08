import React, { useState } from 'react';
import TermsAndConditionsModal from '../../../common/TermsAndConditionsModal/TermsAndConditionsModal';
import './DashboardFooter.css';

const DashboardFooter = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalSection, setModalSection] = useState('both'); // 'terms', 'privacy', or 'both'
  const currentYear = new Date().getFullYear();

  const handleTermsClick = e => {
    e.preventDefault();
    setModalSection('terms');
    setShowTermsModal(true);
  };

  const handlePrivacyClick = e => {
    e.preventDefault();
    setModalSection('privacy');
    setShowTermsModal(true);
  };

  return (
    <>
      <footer className="dashboard-footer">
        <div className="dashboard-footer-container">
          <div className="dashboard-footer-content">
            {/* Company Info */}
            <div className="dashboard-footer-section">
              <div className="dashboard-footer-logo">
                <img
                  src="/logo-h79.png"
                  alt="CV Cloud Logo"
                  className="dashboard-footer-logo-image"
                />
              </div>
              <p className="dashboard-footer-tagline">
                Create professional CVs in minutes
              </p>
              <p className="dashboard-footer-copyright">
                © {currentYear} CV Cloud. All rights reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div className="dashboard-footer-section">
              <h4 className="dashboard-footer-heading">Quick Links</h4>
              <ul className="dashboard-footer-links">
                <li>
                  <a href="/app/dashboard" className="dashboard-footer-link">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/app/view-cv" className="dashboard-footer-link">
                    View CV
                  </a>
                </li>
                <li>
                  <a href="/app/share-cv" className="dashboard-footer-link">
                    Share CV
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="dashboard-footer-section">
              <h4 className="dashboard-footer-heading">Legal</h4>
              <ul className="dashboard-footer-links">
                <li>
                  <a
                    href="#terms"
                    onClick={handleTermsClick}
                    className="dashboard-footer-link"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    onClick={handlePrivacyClick}
                    className="dashboard-footer-link"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="dashboard-footer-section">
              <h4 className="dashboard-footer-heading">Support</h4>
              <ul className="dashboard-footer-links">
                <li>
                  <a
                    href="mailto:hello@cvcloud.app"
                    className="dashboard-footer-link"
                  >
                    hello@cvcloud.app
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="dashboard-footer-bottom">
            <p className="dashboard-footer-bottom-text">
              Made with ❤️ in South Africa
            </p>
            <div className="dashboard-footer-social">
              <span className="dashboard-footer-version">v1.0.2</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setShowTermsModal(false);
        }}
        currentlyAccepted={true}
        viewOnly={true}
        section={modalSection}
      />
    </>
  );
};

export default DashboardFooter;
