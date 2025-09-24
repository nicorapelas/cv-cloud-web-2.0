import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context as AuthContext } from '../../../context/AuthContext';
import Loader from '../../common/loader/Loader';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    password2: '',
    introAffiliateCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();
  const {
    state: { loading, errorMessage, apiMessage },
    register,
    clearErrorMessage,
    clearApiMessage,
  } = useContext(AuthContext);

  useEffect(() => {
    // Clear any existing messages when component mounts
    clearErrorMessage();
    clearApiMessage();
  }, [clearErrorMessage, clearApiMessage]); // Include dependencies

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
    if (loading) return;

    // Basic validation
    if (formData.password !== formData.password2) {
      // Handle password mismatch
      return;
    }

    await register(formData);
  };

  const renderErrorMessage = () => {
    if (!errorMessage) return null;

    // Handle different error message formats
    if (typeof errorMessage === 'string') {
      return (
        <div className="signup-error">
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (typeof errorMessage === 'object') {
      // Handle object with specific error fields
      const { fullName, email, password, password2, general } = errorMessage;
      return (
        <div className="signup-error">
          {fullName && <p>{fullName}</p>}
          {email && <p>{email}</p>}
          {password && <p>{password}</p>}
          {password2 && <p>{password2}</p>}
          {general && <p>{general}</p>}
          {/* If none of the above, try to render the first available error */}
          {!fullName && !email && !password && !password2 && !general && (
            <p>{Object.values(errorMessage)[0]}</p>
          )}
        </div>
      );
    }

    return null;
  };

  const renderApiMessage = () => {
    if (!apiMessage) return null;
    const { success } = apiMessage;
    if (!success) return null;
    return (
      <div className="signup-success">
        <p>{success}</p>
      </div>
    );
  };

  const handleNavToLogin = () => {
    clearErrorMessage();
    clearApiMessage();
    navigate('/login');
  };

  return (
    <>
      {loading ? (
        <Loader show={true} message="Creating your account..." />
      ) : (
        <div className="signup-page">
          <div className="signup-container">
            <div className="signup-card">
              <div className="signup-header">
                <div className="signup-logo">
                  <img
                    src="/icon-512.png"
                    alt="CV Cloud Icon"
                    className="signup-logo-image"
                    onClick={() => navigate('/')}
                  />
                </div>
                <h1>Create Account</h1>
                <p>Join CV Cloud and start building your professional CV</p>
              </div>

              <form onSubmit={handleSubmit} className="signup-form">
                {renderErrorMessage()}
                {renderApiMessage()}

                <div className="signup-form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="signup-input"
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="signup-input"
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="password">Password</label>
                  <div className="signup-password-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      className="signup-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="signup-password-toggle"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="signup-form-group">
                  <label htmlFor="password2">Confirm Password</label>
                  <div className="signup-password-container">
                    <input
                      type={showPassword2 ? 'text' : 'password'}
                      id="password2"
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      className="signup-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                      className="signup-password-toggle"
                    >
                      {showPassword2 ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="signup-form-group">
                  <label htmlFor="introAffiliateCode">
                    Affiliate Code (Optional)
                  </label>
                  <input
                    type="text"
                    id="introAffiliateCode"
                    name="introAffiliateCode"
                    value={formData.introAffiliateCode}
                    onChange={handleChange}
                    placeholder="Enter affiliate code if you have one"
                    className="signup-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    !formData.fullName ||
                    !formData.email ||
                    !formData.password ||
                    !formData.password2
                  }
                  className="signup-submit-button"
                >
                  Create Account
                </button>
              </form>

              <div className="signup-footer">
                <p>
                  Already have an account?{' '}
                  <div onClick={handleNavToLogin} className="signup-link">
                    Sign in here
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;
