import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context as AuthContext } from '../../../context/AuthContext';
import Loader from '../../common/loader/Loader';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { forgotPassword, clearErrorMessage, clearApiMessage } =
    useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      await forgotPassword({ email });

      setMessage(
        'Password reset instructions have been sent to your email address. Please check your inbox and follow the link to reset your password.'
      );
    } catch (err) {
      setError(
        'Failed to send password reset email. Invalid email address. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavToLogin = () => {
    clearErrorMessage();
    clearApiMessage();
    navigate('/login');
  };

  const handleEmailChange = e => {
    setEmail(e.target.value);
    if (error) setError('');
    if (message) setMessage('');
  };

  const renderSuccessMessage = () => {
    if (!message) return null;

    return (
      <div className="forgot-password-success">
        <div className="forgot-password-success-icon">✓</div>
        <p>{message}</p>
        <div className="forgot-password-actions">
          <div
            onClick={handleNavToLogin}
            className="forgot-password-button forgot-password-button-primary"
          >
            Back to Login
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (message) return null;

    return (
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div className="forgot-password-form-group">
          <label htmlFor="email" className="forgot-password-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            className="forgot-password-input"
            placeholder="Enter your email address"
            disabled={loading}
            autoFocus
          />
        </div>

        {error && <div className="forgot-password-error">{error}</div>}

        <button
          type="submit"
          className="forgot-password-submit-button"
          disabled={loading || !email.trim()}
        >
          {loading ? (
            <>
              <Loader size="small" />
              Sending...
            </>
          ) : (
            'Send Reset Instructions'
          )}
        </button>

        <div className="forgot-password-footer">
          <Link to="/login" className="forgot-password-link">
            Back to Login
          </Link>
        </div>
      </form>
    );
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <div className="forgot-password-logo">
              <img
                src="/icon-512.png"
                alt="CV Cloud Logo"
                className="forgot-password-logo-image"
              />
            </div>
            <h1 className="forgot-password-title">Reset Your Password</h1>
            <p className="forgot-password-subtitle">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
          </div>

          {renderForm()}
          {renderSuccessMessage()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
