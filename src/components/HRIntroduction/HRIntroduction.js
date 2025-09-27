import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Context as AuthContext } from '../../context/AuthContext';
import './HRIntroduction.css';
import hrLogo from '../../assets/images/logo-hr.png';

const HRIntroduction = () => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const navigate = useNavigate();

  const { setHRIntent } = useContext(AuthContext);

  const hrFeatures = [
    'Organize and manage candidate CVs efficiently',
    'Save and categorize CVs from shared links',
    'Build your talent pipeline with ease',
    'Access professional CV management tools',
  ];

  // Typing effect logic
  useEffect(() => {
    const currentFeature = hrFeatures[currentFeatureIndex];
    const fullText = currentFeature;

    let timeout;

    if (isTyping) {
      // Typing effect
      if (displayedText.length < fullText.length) {
        timeout = setTimeout(
          () => {
            setDisplayedText(fullText.slice(0, displayedText.length + 1));
          },
          50 + Math.random() * 50
        );
      } else {
        // Finished typing, wait before starting to delete
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    } else {
      // Deleting effect
      if (displayedText.length > 0) {
        timeout = setTimeout(
          () => {
            setDisplayedText(displayedText.slice(0, -1));
          },
          30 + Math.random() * 30
        );
      } else {
        // Finished deleting, move to next feature
        setCurrentFeatureIndex(
          prevIndex => (prevIndex + 1) % hrFeatures.length
        );
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentFeatureIndex]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const handleNavToLogin = () => {
    setHRIntent(true);
    navigate('/login');
  };

  const handleNavToSignup = () => {
    setHRIntent(true);
    navigate('/signup');
  };

  return (
    <div className="hr-introduction-page">
      <header className="hr-introduction-header">
        <div className="hr-introduction-container">
          <div className="hr-introduction-logo">
            <img
              src={hrLogo}
              alt="CV Cloud Logo"
              className="hr-introduction-logo-image"
            />
          </div>
          <nav className="hr-introduction-nav">
            <div
              onClick={handleNavToLogin}
              className="hr-introduction-nav-link"
            >
              Login
            </div>
            <div
              onClick={handleNavToSignup}
              className="hr-introduction-nav-button"
            >
              Sign Up
            </div>
          </nav>
        </div>
      </header>

      <main className="hr-introduction-main">
        <section className="hr-introduction-hero">
          <div className="hr-introduction-container">
            <div className="hr-introduction-hero-content">
              {/* HR Logo Section */}
              <div className="hr-logo-section">
                <h1 className="hr-introduction-hero-title">
                  Welcome to CV Cloud HR
                </h1>
                <p className="hr-introduction-hero-subtitle">
                  Professional CV management for HR professionals and recruiters
                </p>
              </div>

              {/* Typing Feature Effect */}
              <div className="hr-introduction-quote-container">
                <div className="hr-introduction-quote-text">
                  {displayedText}
                  <span
                    className={`hr-introduction-cursor ${showCursor ? 'visible' : ''}`}
                  >
                    |
                  </span>
                </div>
              </div>

              <div className="hr-introduction-hero-buttons">
                <div
                  onClick={handleNavToSignup}
                  className="hr-introduction-cta-button"
                >
                  Create HR Account
                </div>
                <div
                  onClick={handleNavToLogin}
                  className="hr-introduction-secondary-button"
                >
                  Sign In to Existing Account
                </div>
              </div>
            </div>
            <div className="hr-introduction-hero-image">
              <div className="hr-introduction-mockup">
                <div className="hr-introduction-mockup-screen">
                  <div className="hr-mockup-content">
                    <div className="hr-mockup-header">
                      <h3>HR Dashboard</h3>
                      <span className="hr-mockup-badge">HR</span>
                    </div>
                    <div className="hr-mockup-stats">
                      <div className="hr-mockup-stat">
                        <span className="hr-mockup-stat-number">24</span>
                        <span className="hr-mockup-stat-label">Saved CVs</span>
                      </div>
                      <div className="hr-mockup-stat">
                        <span className="hr-mockup-stat-number">8</span>
                        <span className="hr-mockup-stat-label">This Week</span>
                      </div>
                    </div>
                    <div className="hr-mockup-cvs">
                      <div className="hr-mockup-cv-item">
                        <div className="hr-mockup-cv-avatar">👤</div>
                        <div className="hr-mockup-cv-info">
                          <span className="hr-mockup-cv-name">John Smith</span>
                          <span className="hr-mockup-cv-role">
                            Software Engineer
                          </span>
                        </div>
                      </div>
                      <div className="hr-mockup-cv-item">
                        <div className="hr-mockup-cv-avatar">👩</div>
                        <div className="hr-mockup-cv-info">
                          <span className="hr-mockup-cv-name">
                            Sarah Johnson
                          </span>
                          <span className="hr-mockup-cv-role">
                            Marketing Manager
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hr-introduction-features">
          <div className="hr-introduction-container">
            <h2 className="hr-introduction-features-title">HR Features</h2>
            <div className="hr-introduction-features-grid">
              <div className="hr-introduction-feature">
                <div className="hr-introduction-feature-icon">💼</div>
                <h3>CV Management</h3>
                <p>
                  Save, organize, and categorize candidate CVs from shared links
                  with ease.
                </p>
              </div>
              <div className="hr-introduction-feature">
                <div className="hr-introduction-feature-icon">📊</div>
                <h3>Analytics Dashboard</h3>
                <p>
                  Track your recruitment metrics and manage your talent pipeline
                  effectively.
                </p>
              </div>
              <div className="hr-introduction-feature">
                <div className="hr-introduction-feature-icon">🔒</div>
                <h3>Secure Access</h3>
                <p>
                  Professional-grade security for sensitive candidate
                  information and data.
                </p>
              </div>
              <div className="hr-introduction-feature">
                <div className="hr-introduction-feature-icon">⚡</div>
                <h3>Quick Actions</h3>
                <p>
                  Streamlined workflow for reviewing, rating, and managing
                  candidate applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="hr-introduction-cta">
          <div className="hr-introduction-container">
            <div className="hr-introduction-cta-content">
              <h2>Ready to Streamline Your Recruitment?</h2>
              <p>
                Join HR professionals who trust CV Cloud to manage their
                candidate pipeline efficiently.
              </p>
              <div className="hr-introduction-cta-buttons">
                <div
                  onClick={handleNavToSignup}
                  className="hr-introduction-cta-button"
                >
                  Get Started Free
                </div>
                <div
                  onClick={handleNavToLogin}
                  className="hr-introduction-secondary-button"
                >
                  Sign In
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="hr-introduction-footer">
        <div className="hr-introduction-container">
          <div className="hr-introduction-footer-content">
            <div className="hr-introduction-footer-logo">
              <img
                src="/logo-h79.png"
                alt="CV Cloud Logo"
                className="hr-introduction-footer-logo-image"
              />
            </div>
            <div className="hr-introduction-footer-links">
              <Link to="/" className="hr-introduction-footer-link">
                Home
              </Link>
              <Link to="/contact" className="hr-introduction-footer-link">
                Contact
              </Link>
              <Link to="/privacy" className="hr-introduction-footer-link">
                Privacy
              </Link>
            </div>
          </div>
          <div className="hr-introduction-footer-bottom">
            <p>&copy; 2024 CV Cloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HRIntroduction;
