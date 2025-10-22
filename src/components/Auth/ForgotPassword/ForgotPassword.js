import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context as AuthContext } from '../../../context/AuthContext';
import Loader from '../../common/loader/Loader';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessageState] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { forgotPassword, clearErrorMessage, clearApiMessage } =
    useContext(AuthContext);

  // Wrap setMessage to log when it's called
  const setMessage = msg => {
    console.log(
      '🐛 setMessage called with:',
      msg,
      'Call stack:',
      new Error().stack
    );
    setMessageState(msg);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('🐛 Forgot password form submitted with email:', email);

    if (!email.trim()) {
      console.log('🐛 Email is empty');
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('🐛 Email format invalid');
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      console.log('🐛 Calling forgotPassword API...');

      await forgotPassword({ email });
      console.log('🐛 forgotPassword succeeded');

      const successMsg =
        'Password reset instructions have been sent to your email address. Please check your inbox and follow the link to reset your password.';
      console.log('🐛 Setting success message:', successMsg);
      setMessage(successMsg);
    } catch (err) {
      console.log('🐛 forgotPassword error:', err);
      const errorMsg =
        'Failed to send password reset email. Invalid email address. Please try again.';
      console.log('🐛 Setting error message:', errorMsg);
      setError(errorMsg);
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
    console.log(
      '🐛 handleEmailChange called, current message:',
      message,
      'new email:',
      e.target.value
    );
    setEmail(e.target.value);
    if (error) {
      console.log('🐛 Clearing error');
      setError('');
    }
    if (message) {
      console.log('🐛 Clearing message in handleEmailChange!');
      setMessage('');
    }
  };

  const renderSuccessMessage = () => {
    console.log(
      '🐛 renderSuccessMessage called, message:',
      message,
      'message length:',
      message?.length
    );
    if (!message) {
      console.log('🐛 No message, returning null');
      return null;
    }

    console.log('🐛 Rendering success message');
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
    console.log('🐛 renderForm called, message:', message, 'error:', error);
    if (message) {
      console.log('🐛 Message exists, not rendering form');
      return null;
    }

    console.log('🐛 Rendering form');
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
          Send Reset Instructions
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
    <>
      {loading ? (
        <Loader show={true} message="Sending reset instructions..." />
      ) : (
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
                  Enter your email address and we'll send you instructions to
                  reset your password.
                </p>
              </div>

              {renderForm()}
              {renderSuccessMessage()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
