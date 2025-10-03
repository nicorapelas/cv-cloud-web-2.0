import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Context as AuthContext } from '../../../context/AuthContext';
import Loader from '../../common/loader/Loader';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid

  const { resetPassword, clearErrorMessage, clearApiMessage } =
    useContext(AuthContext);

  const validateToken = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/auth/user/reset/${token}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setError(
          'This reset link is invalid or has expired. Please request a new password reset.'
        );
      }
    } catch (err) {
      setTokenValid(false);
      setError('Unable to validate reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Clear any existing messages when component mounts
    clearErrorMessage();
    clearApiMessage();

    // Validate token on component mount
    if (token) {
      validateToken();
    } else {
      setTokenValid(false);
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token, clearErrorMessage, clearApiMessage, validateToken]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
    if (message) setMessage('');
  };

  const validateForm = () => {
    if (!formData.password.trim()) {
      setError('Please enter a new password');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.confirmPassword.trim()) {
      setError('Please confirm your password');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const result = await resetPassword({
        password: formData.password,
        password2: formData.confirmPassword,
        token: token,
      });

      // Use the success message from the server response or fallback to our message
      const successMessage =
        result?.success ||
        'Your password has been successfully reset! You can now sign in with your new password.';
      setMessage(successMessage);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        clearErrorMessage();
        clearApiMessage();
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        'Failed to reset password. Please try again or request a new reset link.'
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

  const handleNavToForgotPassword = () => {
    clearErrorMessage();
    clearApiMessage();
    navigate('/forgot-password');
  };

  const renderTokenValidation = () => {
    if (tokenValid === null) {
      return (
        <div className="reset-password-page">
          <div className="reset-password-container">
            <div className="reset-password-card">
              <Loader show={true} message="Validating reset link..." />
            </div>
          </div>
        </div>
      );
    }

    if (tokenValid === false) {
      return (
        <div className="reset-password-page">
          <div className="reset-password-container">
            <div className="reset-password-card">
              <div className="reset-password-header">
                <div className="reset-password-logo">
                  <img
                    src="/icon-512.png"
                    alt="CV Cloud Logo"
                    className="reset-password-logo-image"
                  />
                </div>
                <h1 className="reset-password-title">Invalid Reset Link</h1>
                <p className="reset-password-subtitle">
                  This password reset link is invalid or has expired.
                </p>
              </div>

              <div className="reset-password-error">{error}</div>

              <div className="reset-password-actions">
                <button
                  onClick={handleNavToForgotPassword}
                  className="reset-password-button reset-password-button-primary"
                >
                  Request New Reset Link
                </button>
                <button
                  onClick={handleNavToLogin}
                  className="reset-password-button reset-password-button-secondary"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSuccessMessage = () => {
    if (!message) return null;

    return (
      <div className="reset-password-success">
        <div className="reset-password-success-icon">✓</div>
        <p>{message}</p>
        <p className="reset-password-redirect-message">
          Redirecting to login page in 3 seconds...
        </p>
        <div className="reset-password-actions">
          <button
            onClick={handleNavToLogin}
            className="reset-password-button reset-password-button-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (message || tokenValid !== true) return null;

    return (
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="reset-password-form-group">
          <label htmlFor="password" className="reset-password-label">
            New Password
          </label>
          <div className="reset-password-password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="reset-password-input"
              placeholder="Enter your new password"
              disabled={loading}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="reset-password-password-toggle"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div className="reset-password-form-group">
          <label htmlFor="confirmPassword" className="reset-password-label">
            Confirm New Password
          </label>
          <div className="reset-password-password-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="reset-password-input"
              placeholder="Confirm your new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="reset-password-password-toggle"
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {error && <div className="reset-password-error">{error}</div>}

        <button
          type="submit"
          className="reset-password-submit-button"
          disabled={
            loading ||
            !formData.password.trim() ||
            !formData.confirmPassword.trim()
          }
        >
          {loading ? (
            <>
              <Loader size="small" />
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>

        <div className="reset-password-footer">
          <Link to="/login" className="reset-password-link">
            Back to Login
          </Link>
        </div>
      </form>
    );
  };

  // Show token validation first
  if (tokenValid !== true) {
    return renderTokenValidation();
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <div className="reset-password-logo">
              <img
                src="/icon-512.png"
                alt="CV Cloud Logo"
                className="reset-password-logo-image"
              />
            </div>
            <h1 className="reset-password-title">Set New Password</h1>
            <p className="reset-password-subtitle">
              Enter your new password below to complete the reset process.
            </p>
          </div>

          {renderForm()}
          {renderSuccessMessage()}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
