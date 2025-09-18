import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context as ShareCVContext } from '../../../context/ShareCVContext';
import logoImage from '../../../assets/images/icon-512.png';
import Loader from '../../common/loader/Loader';
import './SharedCVView.css';

const SharedCVView = () => {
  const { id } = useParams();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isValidPin, setIsValidPin] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const {
    state: { shareCV, shareCV_ToView, loading, cvTemplateSelected },
    fetchShareCVByCurriculumVitaeId,
    fetchShareCV_ToView,
    setCVTemplateSelected,
  } = useContext(ShareCVContext);

  useEffect(() => {
    if (id) {
      // The id in the URL is the curriculumVitaeID, so we need to find the ShareCV by that ID
      fetchShareCVByCurriculumVitaeId(id);
    }
  }, [id, fetchShareCVByCurriculumVitaeId]);

  // Fetch CV data when pin is validated
  useEffect(() => {
    if (isValidPin && shareCV && shareCV.curriculumVitaeID) {
      fetchShareCV_ToView(shareCV.curriculumVitaeID);
    }
  }, [isValidPin, shareCV, fetchShareCV_ToView]);

  useEffect(() => {
    if (shareCV) {
      const { CVTemplate } = shareCV;
      setCVTemplateSelected(CVTemplate);
    }
  }, [shareCV]);

  const handlePinChange = e => {
    setPin(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handlePinSubmit = e => {
    e.preventDefault();

    if (!pin.trim()) {
      setError('Please enter a view pin');
      return;
    }

    if (!shareCV) {
      setError('CV information not loaded yet');
      return;
    }

    setError('');
    setIsValidating(true);

    // Simulate validation delay
    setTimeout(() => {
      if (shareCV.viewPin && shareCV.viewPin.toString() === pin.trim()) {
        setIsValidPin(true);
        setError('');
      } else {
        setError('Invalid view pin. Please check and try again.');
        setIsValidPin(false);
      }
      setIsValidating(false);
    }, 500);
  };

  if (loading) return <Loader />;

  if (!shareCV) {
    return (
      <div className="shared-cv-view">
        <div className="shared-cv-error">
          <div className="error-icon">❌</div>
          <h2>CV Not Found</h2>
          <p>The shared CV could not be found or may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-cv-view">
      {!isValidPin ? (
        <div className="shared-cv-pin-section">
          <div className="pin-form-container">
            <div className="pin-form-header">
              <div className="pin-form-logo">
                <img
                  src={logoImage}
                  alt="CV Cloud Logo"
                  className="shared-cv-logo-image"
                />
              </div>
              <h2>Enter View Pin</h2>
              <p>
                Please enter the 6-digit view pin that was provided in the email
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="pin-form">
              <div className="form-group">
                <label htmlFor="view-pin">View Pin:</label>
                <input
                  type="text"
                  id="view-pin"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="Enter 6-digit pin"
                  className="form-input pin-input"
                  maxLength={6}
                  autoComplete="off"
                  autoFocus
                />
              </div>

              {error && (
                <div className="form-error">
                  <div className="error-icon">⚠️</div>
                  <span>{error}</span>
                </div>
              )}

              <small className="form-help-text">
                Enter the 6-digit pin from your email
              </small>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isValidating || !pin.trim()}
              >
                {isValidating ? 'Validating...' : 'View CV'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="shared-cv-content">
          <div className="cv-access-granted">
            <div className="success-icon">✅</div>
            <h2>Access Granted!</h2>
            <p>You can now view the shared CV</p>
            <div className="cv-info">
              <p>
                <strong>Subject:</strong> {shareCV.subject}
              </p>
              <p>
                <strong>Message:</strong> "{shareCV.message}"
              </p>
            </div>
            {shareCV_ToView ? (
              <div>
                <p>CV data loaded successfully!</p>
                <pre>{JSON.stringify(shareCV_ToView, null, 2)}</pre>
              </div>
            ) : (
              <div>Loading CV data...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedCVView;
