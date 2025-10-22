import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as SaveCVContext } from '../../../context/SaveCVContext';
import Loader from '../../common/loader/Loader';
import api from '../../../api/api';
import './Login.css';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();

  // Check if user came from resend verification action
  const showResendVerification =
    searchParams.get('action') === 'resend-verification';

  const {
    state: { loading, errorMessage, apiMessage, token, user, HRIntent },
    signin,
    clearErrorMessage,
    clearApiMessage,
  } = useContext(AuthContext);
  const {
    state: { cvToSave },
  } = useContext(SaveCVContext);

  // Debug: Log whenever errorMessage or loading changes
  useEffect(() => {
    console.log(
      '🐛 Component state - loading:',
      loading,
      'errorMessage:',
      errorMessage
    );
  }, [errorMessage, loading]);

  // Watch for successful authentication and redirect
  // Only redirect if we're actually on the login page
  useEffect(() => {
    if ((token || user) && window.location.pathname === '/login') {
      // Check if there's a 'from' parameter in the URL or use dashboard as default
      const urlParams = new URLSearchParams(window.location.search);
      const from = urlParams.get('from') || '/app/dashboard';
      navigate(from);
    }
  }, [token, user, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) clearErrorMessage();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.email || !formData.password || loading) {
      return;
    }

    await signin({
      email: formData.email,
      password: formData.password,
      HRIntent,
      cvToSave,
    });
  };

  const handleResendVerification = async () => {
    console.log('handleResendVerification called with email:', formData.email);

    if (!formData.email || resendLoading) {
      console.log('Early return: no email or already loading');
      return;
    }

    try {
      setResendLoading(true);
      setResendMessage('');
      console.log('Making API request to resend verification...');

      const response = await api.post('/auth/user/resend-verification-email', {
        email: formData.email,
      });

      console.log('Response data:', response.data);

      if (response.data.success || response.data.message) {
        setResendMessage(
          response.data.message ||
            'Verification email sent! Please check your inbox.'
        );
      } else if (response.data.error) {
        setResendMessage(
          response.data.error ||
            'Failed to send verification email. Please try again.'
        );
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      const errorMessage =
        error.response?.data?.error ||
        'Failed to send verification email. Please try again.';
      setResendMessage(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const renderErrorMessage = () => {
    if (!errorMessage) return null;

    console.log('🐛 Login Error Message:', errorMessage, typeof errorMessage);

    // Handle different error message formats
    if (typeof errorMessage === 'string') {
      const element = (
        <div className="login-error">
          <p>{errorMessage}</p>
        </div>
      );
      console.log('🐛 Returning string error element:', element);
      return element;
    }

    if (typeof errorMessage === 'object') {
      // Handle object with specific error fields
      const { email, password, notVerified, general } = errorMessage;
      console.log('🐛 Error object fields:', {
        email,
        password,
        notVerified,
        general,
      });
      console.log('🐛 notVerified is truthy?', !!notVerified);

      const element = (
        <div
          className="login-error"
          style={{ border: '2px solid red', padding: '10px', margin: '10px 0' }}
        >
          {email && <p>{email}</p>}
          {password && <p>{password}</p>}
          {notVerified && (
            <div>
              <p>{notVerified}</p>
              <button
                type="button"
                onClick={() => navigate('/login?action=resend-verification')}
                className="resend-verification-link"
              >
                Resend Verification Email
              </button>
            </div>
          )}
          {general && <p>{general}</p>}
          {/* If none of the above, try to render the first available error */}
          {!email && !password && !notVerified && !general && (
            <p>{Object.values(errorMessage)[0]}</p>
          )}
        </div>
      );
      console.log('🐛 Returning object error element:', element);
      return element;
    }

    console.log('🐛 Returning null');
    return null;
  };

  const renderApiMessage = () => {
    if (!apiMessage) return null;

    return (
      <div className="login-success">
        <p>{apiMessage}</p>
      </div>
    );
  };

  const renderResendMessage = () => {
    if (!resendMessage) return null;

    return (
      <div
        className={`login-message ${resendMessage.includes('sent') ? 'success' : 'error'}`}
      >
        <p>{resendMessage}</p>
      </div>
    );
  };

  const renderResendVerificationSection = () => {
    if (!showResendVerification) return null;

    return (
      <div className="resend-verification-section">
        <h3>Resend Verification Email</h3>
        <p>Enter your email address to receive a new verification email.</p>
        <div className="resend-form">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="login-input"
          />
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={!formData.email || resendLoading}
            className="resend-button"
          >
            {resendLoading ? 'Sending...' : 'Send Verification Email'}
          </button>
        </div>
        {renderResendMessage()}
        <div className="resend-actions">
          <Link to="/login" className="back-to-login">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  };

  const handleNavToSignup = () => {
    clearErrorMessage();
    clearApiMessage();
    navigate('/signup');
  };

  return (
    <>
      {loading ? (
        <Loader show={true} message="Signing you in..." />
      ) : showResendVerification ? (
        <div className="login-page">
          <div className="login-container">
            <div className="login-card">
              {renderResendVerificationSection()}
            </div>
          </div>
        </div>
      ) : (
        <div className="login-page">
          <div className="login-container">
            <div className="login-card">
              <div className="login-header">
                <div className="login-logo">
                  <img
                    src="/icon-512.png"
                    alt="CV Cloud Icon"
                    className="login-logo-image"
                    onClick={() => navigate('/')}
                  />
                </div>
                <h1>Welcome Back</h1>
                <p>Sign in to your CV Cloud account</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                {renderErrorMessage()}
                {renderApiMessage()}

                <div className="login-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="login-input"
                  />
                </div>

                <div className="login-form-group">
                  <label htmlFor="password">Password</label>
                  <div className="login-password-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="login-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="login-password-toggle"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formData.email || !formData.password}
                  className="login-submit-button"
                >
                  Sign In
                </button>
              </form>

              <div className="login-footer">
                <p>
                  Don't have an account?{' '}
                  <span onClick={handleNavToSignup} className="login-link">
                    Sign up here
                  </span>
                </p>
                <Link to="/forgot-password" className="login-link">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
