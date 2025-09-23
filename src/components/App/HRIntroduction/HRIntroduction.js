import React from 'react';
import { Link } from 'react-router-dom';
import './HRIntroduction.css';

const HRIntroduction = () => {
  return (
    <div className="hr-introduction">
      <div className="hr-intro-container">
        {/* Header */}
        <header className="hr-intro-header">
          <div className="hr-intro-logo">
            <img
              src="/logo-h79.png"
              alt="CV Cloud Logo"
              className="hr-intro-logo-image"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="hr-intro-main">
          <div className="hr-intro-content">
            {/* Hero Section */}
            <div className="hr-intro-hero">
              <div className="hr-intro-icon">👥</div>
              <h1>Welcome to CV Cloud HR</h1>
              <p className="hr-intro-subtitle">
                The professional way to manage, organize, and track candidate CVs
              </p>
            </div>

            {/* Features Section */}
            <div className="hr-intro-features">
              <h2>What you can do with CV Cloud HR:</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">💾</div>
                  <h3>Save & Organize</h3>
                  <p>Save CVs you receive and organize them in your personal HR dashboard</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔍</div>
                  <h3>Search & Sort</h3>
                  <p>Quickly find candidates with powerful search and sorting tools</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Track Progress</h3>
                  <p>Keep track of candidate status and your hiring pipeline</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔒</div>
                  <h3>Secure & Private</h3>
                  <p>Your saved CVs are secure and only accessible to you</p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="hr-intro-benefits">
              <h2>Why choose CV Cloud HR?</h2>
              <ul className="benefits-list">
                <li>✅ <strong>Free to use</strong> - No hidden costs or subscriptions</li>
                <li>✅ <strong>Easy to use</strong> - Intuitive interface designed for HR professionals</li>
                <li>✅ <strong>Always accessible</strong> - Access your saved CVs from anywhere</li>
                <li>✅ <strong>Professional</strong> - Maintain a professional image with candidates</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="hr-intro-actions">
              <h2>Get Started Today</h2>
              <div className="action-buttons">
                <Link to="/auth/signup" className="btn btn-primary btn-large">
                  Create HR Account
                </Link>
                <Link to="/auth/signin" className="btn btn-secondary btn-large">
                  Sign In to Existing Account
                </Link>
              </div>
              <p className="hr-intro-note">
                Already have a CV Cloud account? Sign in and we'll upgrade it to include HR features!
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="hr-intro-footer">
          <p>&copy; 2024 CV Cloud. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HRIntroduction;
