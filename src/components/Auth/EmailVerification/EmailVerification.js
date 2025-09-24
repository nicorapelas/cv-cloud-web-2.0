import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import Loader from '../../common/loader/Loader';
import './EmailVerification.css';

const EmailVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      verifyEmail(id);
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, [id]);

  const verifyEmail = async (userId) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/user/verify-email/', {
        id: userId
      });

      if (response.data.error) {
        setError(response.data.error);
        setMessage('Verification failed. Please try again or request a new verification email.');
      } else {
        setSuccess(true);
        setMessage('Your email has been successfully verified! You can now sign in to your account.');
      }
    } catch (err) {
      console.error('Email verification error:', err);
      setError('Verification failed. The link may be invalid or expired.');
      setMessage('Please try again or request a new verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = () => {
    navigate('/login?action=resend-verification');
  };

  if (loading) {
    return (
      <div className="email-verification-page">
        <div className="email-verification-container">
          <Loader show={true} message="Verifying your email..." />
        </div>
      </div>
    );
  }

  return (
    <div className="email-verification-page">
      <div className="email-verification-container">
        <div className="email-verification-card">
          <div className="email-verification-header">
            <div className="email-verification-logo">
              <img
                src="/icon-512.png"
                alt="CV Cloud Icon"
                className="email-verification-logo-image"
              />
            </div>
            <h1>Email Verification</h1>
          </div>

          <div className="email-verification-content">
            {success ? (
              <div className="email-verification-success">
                <div className="verification-icon success">✅</div>
                <h2>Email Verified Successfully!</h2>
                <p>{message}</p>
                <div className="verification-actions">
                  <Link to="/login" className="btn btn-primary">
                    Sign In to Your Account
                  </Link>
                </div>
              </div>
            ) : (
              <div className="email-verification-error">
                <div className="verification-icon error">❌</div>
                <h2>Verification Failed</h2>
                <p>{error}</p>
                <p className="verification-message">{message}</p>
                <div className="verification-actions">
                  <button 
                    onClick={handleResendVerification}
                    className="btn btn-secondary"
                  >
                    Request New Verification Email
                  </button>
                  <Link to="/login" className="btn btn-primary">
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="email-verification-footer">
            <p>
              Need help? <Link to="/">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
