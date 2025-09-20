import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context as ShareCVContext } from '../../../context/ShareCVContext';
import logoImage from '../../../assets/images/icon-512.png';
import Loader from '../../common/loader/Loader';
import PrintOptionsModal from './PrintOptionsModal';
import InkFriendlyTemplate from './InkFriendlyTemplate';
import FirstImpressionModal from './FirstImpressionModal';
import CertificatesModal from './CertificatesModal';
import Template01 from '../ViewCV/templates/template01/Template01';
import Template02 from '../ViewCV/templates/template02/Template02';
import Template03 from '../ViewCV/templates/template03/Template03';
import Template04 from '../ViewCV/templates/template04/Template04';
import Template05 from '../ViewCV/templates/template05/Template05';
import Template06 from '../ViewCV/templates/template06/Template06';
import Template07 from '../ViewCV/templates/template07/Template07';
import Template08 from '../ViewCV/templates/template08/Template08';
import Template09 from '../ViewCV/templates/template09/Template09';
import Template10 from '../ViewCV/templates/template10/Template10';
import './SharedCVView.css';
import '../../../styles/print.css';

const SharedCVView = () => {
  const { id } = useParams();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isValidPin, setIsValidPin] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [printMode, setPrintMode] = useState('template'); // 'template' or 'ink-friendly'
  const [shouldPrint, setShouldPrint] = useState(false);
  const [showFirstImpression, setShowFirstImpression] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

  const {
    state: { shareCV, shareCV_ToView, loading, cvTemplateSelected },
    fetchShareCVByCurriculumVitaeId,
    fetchShareCV_ToView,
    setCVTemplateSelected,
  } = useContext(ShareCVContext);

  console.log(shareCV);

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
  }, [shareCV, setCVTemplateSelected]);

  // Handle print when shouldPrint changes
  useEffect(() => {
    if (shouldPrint) {
      setTimeout(() => {
        window.print();
        setShouldPrint(false);
      }, 100);
    }
  }, [shouldPrint, printMode]);

  // Prepare CV data object from shareCV_ToView
  const cvData =
    shareCV_ToView && shareCV_ToView.curriculumVitae?.[0]
      ? {
          personalInfo:
            shareCV_ToView.curriculumVitae[0]._personalInfo?.[0] || null,
          contactInfo:
            shareCV_ToView.curriculumVitae[0]._contactInfo?.[0] || null,
          personalSummary:
            shareCV_ToView.curriculumVitae[0]._personalSummary?.[0] || null,
          experiences: shareCV_ToView.curriculumVitae[0]._experience || [],
          secondEdu: shareCV_ToView.curriculumVitae[0]._secondEdu || [],
          skills: shareCV_ToView.curriculumVitae[0]._skill || [],
          languages: shareCV_ToView.curriculumVitae[0]._language || [],
          references: shareCV_ToView.curriculumVitae[0]._reference || [],
          tertEdus: shareCV_ToView.curriculumVitae[0]._tertEdu || [],
          interests: shareCV_ToView.curriculumVitae[0]._interest || [],
          attributes: shareCV_ToView.curriculumVitae[0]._attribute || [],
          employHistorys:
            shareCV_ToView.curriculumVitae[0]._employHistory || [],
          assignedPhotoUrl:
            shareCV_ToView.curriculumVitae[0]._photo?.[0]?.photoUrl || null,
          firstImpression:
            shareCV_ToView.curriculumVitae[0]._firstImpression?.[0] || null,
          certificates: shareCV_ToView.curriculumVitae[0]._certificate || [],
        }
      : null;

  // Render template based on selection
  const renderTemplate = () => {
    if (!cvData) return null;

    switch (cvTemplateSelected) {
      case 'template01':
        return <Template01 cvData={cvData} />;
      case 'template02':
        return <Template02 cvData={cvData} />;
      case 'template03':
        return <Template03 cvData={cvData} />;
      case 'template04':
        return <Template04 cvData={cvData} />;
      case 'template05':
        return <Template05 cvData={cvData} />;
      case 'template06':
        return <Template06 cvData={cvData} />;
      case 'template07':
        return <Template07 cvData={cvData} />;
      case 'template08':
        return <Template08 cvData={cvData} />;
      case 'template09':
        return <Template09 cvData={cvData} />;
      case 'template10':
        return <Template10 cvData={cvData} />;
      default:
        return <Template01 cvData={cvData} />;
    }
  };

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

  const handlePrint = () => {
    setShowPrintOptions(true);
  };

  const handlePrintInkFriendly = () => {
    setPrintMode('ink-friendly');
    setShowPrintOptions(false);
    setShouldPrint(true);
  };

  const handlePrintTemplate = () => {
    setPrintMode('template');
    setShowPrintOptions(false);
    setShouldPrint(true);
  };

  const handleClosePrintOptions = () => {
    setShowPrintOptions(false);
  };

  const handleFirstImpression = () => {
    setShowFirstImpression(true);
  };

  const handleCloseFirstImpression = () => {
    setShowFirstImpression(false);
  };

  const handleCertificates = () => {
    setShowCertificates(true);
  };

  const handleCloseCertificates = () => {
    setShowCertificates(false);
  };

  const handleSave = () => {
    console.log('Save button clicked');
  };

  return (
    <div
      className={`shared-cv-view ${printMode === 'ink-friendly' ? 'ink-friendly-mode' : ''}`}
    >
      {/* Header */}
      <header className="shared-cv-header">
        <div className="shared-cv-container">
          <div className="shared-cv-logo">
            <img
              src="/logo-h79.png"
              alt="CV Cloud Logo"
              className="shared-cv-logo-image"
            />
          </div>
          <nav className="shared-cv-nav">
            {isValidPin && cvData?.firstImpression?.videoUrl && (
              <>
                <div>Video included -></div>
                <button
                  onClick={handleFirstImpression}
                  className="shared-cv-nav-link first-impression-button"
                  title="View First Impression Video"
                >
                  🎥 First Impression
                </button>
              </>
            )}
            {isValidPin && (
              <button
                onClick={handlePrint}
                className="shared-cv-nav-link"
                title="Print CV"
              >
                🖨️ Print
              </button>
            )}
            {isValidPin && (
              <div className="save-button-container">
                <button
                  onClick={handleSave}
                  className="shared-cv-nav-button"
                  title="Save CV"
                >
                  💾 Save
                </button>
                <div className="hr-bubble">
                  <span className="hr-text">HR</span>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {!isValidPin ? (
        <div className="shared-cv-pin-section-wrapper">
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
                  Please enter the 6-digit view pin that was provided in the
                  email
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
        </div>
      ) : (
        <div className="shared-cv-content">
          {shareCV_ToView ? (
            <div className="cv-preview-container">
              {printMode === 'ink-friendly' ? (
                <InkFriendlyTemplate cvData={cvData} />
              ) : (
                renderTemplate()
              )}

              {/* Floating Certificates Button */}
              {isValidPin && cvData?.certificates?.length > 0 && (
                <button
                  onClick={handleCertificates}
                  className="floating-certificates-button"
                  title={`View ${cvData.certificates.length} Certificate${cvData.certificates.length > 1 ? 's' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    fontSize: '0.8rem',
                    fontWeight: '600',
                  }}
                >
                  <span className="certificates-icon">📋</span>
                  <span className="certificates-count">
                    {cvData.certificates.length}
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="shared-cv-loading">
              <Loader show={true} message="Loading CV data..." />
            </div>
          )}
        </div>
      )}

      {/* Print Options Modal */}
      <PrintOptionsModal
        isOpen={showPrintOptions}
        onClose={handleClosePrintOptions}
        onPrintInkFriendly={handlePrintInkFriendly}
        onPrintTemplate={handlePrintTemplate}
      />

      {/* First Impression Modal */}
      <FirstImpressionModal
        isOpen={showFirstImpression}
        onClose={handleCloseFirstImpression}
        videoUrl={cvData?.firstImpression?.videoUrl}
        fullName={
          cvData?.personalInfo?.fullName ||
          (cvData?.personalInfo?.firstName && cvData?.personalInfo?.lastName
            ? `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`
            : null) ||
          cvData?.personalInfo?.name
        }
      />

      {/* Certificates Modal */}
      <CertificatesModal
        isOpen={showCertificates}
        onClose={handleCloseCertificates}
        certificates={cvData?.certificates}
        fullName={
          cvData?.personalInfo?.fullName ||
          (cvData?.personalInfo?.firstName && cvData?.personalInfo?.lastName
            ? `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`
            : null) ||
          cvData?.personalInfo?.name
        }
      />
    </div>
  );
};

export default SharedCVView;
