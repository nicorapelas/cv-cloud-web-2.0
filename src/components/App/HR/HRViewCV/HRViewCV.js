import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context as SaveCVContext } from '../../../../context/SaveCVContext';
import { Context as PublicCVContext } from '../../../../context/PublicCVContext';
import Loader from '../../../common/loader/Loader';
import PrintOptionsModal from '../../SharedCVView/PrintOptionsModal';
import InkFriendlyTemplate from '../../SharedCVView/InkFriendlyTemplate';
import FirstImpressionModal from '../../SharedCVView/FirstImpressionModal';
import CertificatesModal from '../../SharedCVView/CertificatesModal';
import Template01 from '../../ViewCV/templates/template01/Template01';
import Template02 from '../../ViewCV/templates/template02/Template02';
import Template03 from '../../ViewCV/templates/template03/Template03';
import Template04 from '../../ViewCV/templates/template04/Template04';
import Template05 from '../../ViewCV/templates/template05/Template05';
import Template06 from '../../ViewCV/templates/template06/Template06';
import Template07 from '../../ViewCV/templates/template07/Template07';
import Template08 from '../../ViewCV/templates/template08/Template08';
import Template09 from '../../ViewCV/templates/template09/Template09';
import Template10 from '../../ViewCV/templates/template10/Template10';
import './HRViewCV.css';
import '../../../../styles/print.css';

const HRViewCV = () => {
  const { id } = useParams(); // curriculumVitaeID
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const isPreview = params.get('preview') === 'true';
  const fromRoute = params.get('from') || 'dashboard'; // 'dashboard' or 'browse'
  const shouldOpenNotes = params.get('notes') === 'true'; // Auto-open notes panel
  const navigate = useNavigate();

  // Dynamic values based on source
  const backRoute =
    fromRoute === 'browse' ? '/app/hr-browse-cvs' : '/app/hr-dashboard';
  const backText =
    fromRoute === 'browse' ? '← Back to Browse CVs' : '← Back to HR Dashboard';
  const headerTitle = isPreview ? 'Preview CV' : 'Saved CV';
  const headerSubtitle = isPreview
    ? 'Preview candidate profile before saving'
    : 'Review candidate profile and add notes';

  // Local state
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [printMode, setPrintMode] = useState('template');
  const [shouldPrint, setShouldPrint] = useState(false);
  const [showFirstImpression, setShowFirstImpression] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedRank, setSelectedRank] = useState('null');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isUpdatingRank, setIsUpdatingRank] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSavingCV, setIsSavingCV] = useState(false);
  const [cvSaved, setCvSaved] = useState(false);

  const {
    state: {
      loading,
      savedCV_ToView,
      cvTemplateSelected,
      savedCVInfo,
      isPreviewMode,
    },
    fetchSavedCVToView,
    fetchPublicCVPreview,
    addNoteToSavedCV,
    updateSavedCVRank,
    deleteNoteFromSavedCV,
    fetchSavedCVs,
  } = useContext(SaveCVContext);

  const { savePublicCV } = useContext(PublicCVContext);

  console.log('savedCV_ToView at HRViewCV:', savedCV_ToView);

  // Fetch CV data when component mounts
  useEffect(() => {
    if (id) {
      if (isPreview) {
        fetchPublicCVPreview(id);
      } else {
        fetchSavedCVToView(id);
      }
    }
  }, [id, isPreview, fetchSavedCVToView, fetchPublicCVPreview]);

  // Set initial rank when savedCVInfo loads
  useEffect(() => {
    if (savedCVInfo && savedCVInfo.rank) {
      setSelectedRank(savedCVInfo.rank);
    }
  }, [savedCVInfo]);

  // Auto-open notes panel if notes=true in URL
  useEffect(() => {
    if (shouldOpenNotes && !isPreview) {
      setShowNotesPanel(true);
    }
  }, [shouldOpenNotes, isPreview]);

  // Handle print
  useEffect(() => {
    if (shouldPrint) {
      setTimeout(() => {
        window.print();
        setShouldPrint(false);
      }, 100);
    }
  }, [shouldPrint]);

  // Prepare CV data object
  const cvData =
    savedCV_ToView && savedCV_ToView[0]
      ? {
          personalInfo: savedCV_ToView[0]._personalInfo?.[0] || null,
          contactInfo: savedCV_ToView[0]._contactInfo?.[0] || null,
          personalSummary: savedCV_ToView[0]._personalSummary?.[0] || null,
          experiences: savedCV_ToView[0]._experience || [],
          secondEdu: savedCV_ToView[0]._secondEdu || [],
          skills: savedCV_ToView[0]._skill || [],
          languages: savedCV_ToView[0]._language || [],
          references: savedCV_ToView[0]._reference || [],
          tertEdus: savedCV_ToView[0]._tertEdu || [],
          interests: savedCV_ToView[0]._interest || [],
          attributes: savedCV_ToView[0]._attribute || [],
          employHistorys: savedCV_ToView[0]._employHistory || [],
          assignedPhotoUrl: savedCV_ToView[0]._photo?.[0]?.photoUrl || null,
          firstImpression: savedCV_ToView[0]._firstImpression?.[0] || null,
          certificates: savedCV_ToView[0]._certificate || [],
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

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setIsSavingNote(true);
    try {
      await addNoteToSavedCV(id, newNote.trim());
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async noteId => {
    try {
      await deleteNoteFromSavedCV(id, noteId);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleSaveCV = async () => {
    if (!id || cvSaved) return; // Use id from URL params instead of savedCVInfo.curriculumVitaeID

    setIsSavingCV(true);
    try {
      await savePublicCV(id); // Use the curriculumVitaeID from URL params
      setCvSaved(true);

      // Refresh saved CVs list to update the browse page
      fetchSavedCVs();

      // Show success message
      console.log('✅ CV saved successfully from preview');
    } catch (error) {
      console.error('❌ Error saving CV:', error);
      alert('Failed to save CV. Please try again.');
    } finally {
      setIsSavingCV(false);
    }
  };

  const handleRankChange = async e => {
    const newRank = e.target.value;
    setSelectedRank(newRank);
    setIsUpdatingRank(true);

    try {
      await updateSavedCVRank(id, newRank);
    } catch (error) {
      console.error('Error updating rank:', error);
      alert('Failed to update rank. Please try again.');
      // Revert on error
      if (savedCVInfo) {
        setSelectedRank(savedCVInfo.rank);
      }
    } finally {
      setIsUpdatingRank(false);
    }
  };

  const getRankColor = rank => {
    switch (rank) {
      case 'excellent':
        return '#2ecc71';
      case 'good':
        return '#3498db';
      case 'fair':
        return '#f39c12';
      case 'poor':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <Loader />;

  if (!savedCV_ToView || !savedCVInfo) {
    return (
      <div className="hr-view-cv">
        <div className="hr-view-cv-error">
          <div className="error-icon">❌</div>
          <h2>CV Not Found</h2>
          <p>The saved CV could not be found or may have been removed.</p>
          <button
            onClick={() => navigate('/app/hr-dashboard')}
            className="btn-back"
          >
            ← Back to HR Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`hr-view-cv ${printMode === 'ink-friendly' ? 'ink-friendly-mode' : ''}`}
    >
      {/* Header */}
      <div className="hr-view-cv-header">
        <div className="hr-view-cv-header-left">
          <button
            onClick={() => navigate(backRoute)}
            className="hr-view-cv-back"
          >
            {backText}
          </button>
        </div>
        <div className="hr-view-cv-header-center">
          <div className="hr-view-cv-header-icon">
            {isPreview ? '🔍' : '📋'}
          </div>
          <div className="hr-view-cv-header-content">
            <h1>{headerTitle}</h1>
            <p>{headerSubtitle}</p>
          </div>
        </div>
        <div className="hr-view-cv-header-actions">
          {isPreview && (
            <button
              onClick={handleSaveCV}
              disabled={isSavingCV || cvSaved}
              className={`hr-view-cv-save-button ${cvSaved ? 'saved' : ''}`}
              title={
                cvSaved
                  ? 'CV Saved Successfully'
                  : 'Save this CV to your collection'
              }
            >
              {isSavingCV ? (
                <>⏳ Saving...</>
              ) : cvSaved ? (
                <>✅ Saved</>
              ) : (
                <>💾 Save CV</>
              )}
            </button>
          )}
          {cvData?.firstImpression?.videoUrl && (
            <button
              onClick={handleFirstImpression}
              className="hr-view-cv-video-button"
              title="View First Impression Video"
            >
              🎥 First Impression
            </button>
          )}
          <button
            onClick={handlePrint}
            className="hr-view-cv-print-button"
            title="Print CV"
          >
            🖨️ Print CV
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="hr-view-cv-info-bar">
        <div className="hr-view-cv-container">
          <div className="cv-info-left">
            <h2 className="cv-candidate-name">{savedCVInfo.fullName}</h2>
            
            {/* Industries */}
            {savedCVInfo.industries && savedCVInfo.industries.length > 0 && (
              <div className="cv-view-industries">
                {savedCVInfo.industries.map((industry, index) => (
                  <span key={index} className="cv-view-industry-tag">
                    {industry}
                  </span>
                ))}
              </div>
            )}

            {isPreviewMode ? (
              <div className="cv-stats">
                <span className="cv-stat">
                  📋 Preview Mode - CV not saved yet
                </span>
                <span className="cv-stat">
                  👁️ {savedCVInfo.viewCount}{' '}
                  {savedCVInfo.viewCount === 1 ? 'HR view' : 'HR views'}
                </span>
                <span className="cv-stat">
                  📅 Listed {formatDate(savedCVInfo.listedAt).split(',')[0]}
                </span>
              </div>
            ) : (
              <div className="cv-stats">
                <span className="cv-stat">
                  👁️ {savedCVInfo.viewCount}{' '}
                  {savedCVInfo.viewCount === 1 ? 'view' : 'views'}
                </span>
                <span className="cv-stat">
                  💾 Saved {formatDate(savedCVInfo.dateSaved).split(',')[0]}
                </span>
                <span className="cv-stat">
                  🕐 Last viewed{' '}
                  {formatDate(savedCVInfo.lastViewed).split(',')[0]}
                </span>
              </div>
            )}
          </div>
          <div className="cv-info-right">
            {!isPreviewMode && (
              <>
                <button
                  onClick={() => setShowNotesPanel(!showNotesPanel)}
                  className="hr-view-cv-notes-button"
                  title="Toggle Notes Panel"
                >
                  📝 Notes{' '}
                  {savedCVInfo.notes?.length > 0 &&
                    `(${savedCVInfo.notes.length})`}
                </button>
                <label htmlFor="rank-select" className="rank-label">
                  Rank:
                </label>
                <select
                  id="rank-select"
                  value={selectedRank}
                  onChange={handleRankChange}
                  className="rank-select"
                  style={{ borderColor: getRankColor(selectedRank) }}
                  disabled={isUpdatingRank}
                >
                  <option value="null">Unrated</option>
                  <option value="excellent">⭐ Excellent</option>
                  <option value="good">👍 Good</option>
                  <option value="fair">👌 Fair</option>
                  <option value="poor">👎 Poor</option>
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="hr-view-cv-content">
        {/* Notes Panel */}
        {showNotesPanel && (
          <div className="hr-notes-panel">
            <div className="notes-panel-header">
              <h3>📝 Notes</h3>
              <button
                onClick={() => setShowNotesPanel(false)}
                className="notes-panel-close"
              >
                ✕
              </button>
            </div>

            {/* Add Note Form */}
            <div className="add-note-form">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a note about this candidate..."
                className="note-textarea"
                rows="3"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isSavingNote}
                className="btn-add-note"
              >
                {isSavingNote ? 'Saving...' : 'Add Note'}
              </button>
            </div>

            {/* Notes List */}
            <div className="notes-list">
              {savedCVInfo.notes && savedCVInfo.notes.length > 0 ? (
                savedCVInfo.notes
                  .slice()
                  .reverse()
                  .map(note => (
                    <div key={note._id} className="note-item">
                      {deleteConfirmId === note._id ? (
                        <div className="note-delete-confirm">
                          <p className="note-delete-message">
                            Delete this note?
                          </p>
                          <div className="note-delete-actions">
                            <button
                              onClick={() => handleDeleteNote(note._id)}
                              className="btn-confirm-delete"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              className="btn-cancel-delete"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="note-content">{note.content}</div>
                          <div className="note-footer">
                            <span className="note-date">
                              {formatDate(note.createdAt)}
                            </span>
                            <button
                              onClick={() => setDeleteConfirmId(note._id)}
                              className="btn-delete-note"
                              title="Delete note"
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
              ) : (
                <div className="notes-empty">
                  <p>No notes yet. Add your first note above!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CV Preview */}
        <div
          className={`cv-preview-container ${showNotesPanel ? 'with-notes-panel' : ''}`}
        >
          {printMode === 'ink-friendly' ? (
            <InkFriendlyTemplate cvData={cvData} />
          ) : (
            renderTemplate()
          )}

          {/* Floating Certificates Button */}
          {cvData?.certificates?.length > 0 && (
            <button
              onClick={handleCertificates}
              className="floating-certificates-button"
              title={`View ${cvData.certificates.length} Certificate${cvData.certificates.length > 1 ? 's' : ''}`}
            >
              <span className="certificates-icon">📋</span>
              <span className="certificates-count">
                {cvData.certificates.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <PrintOptionsModal
        isOpen={showPrintOptions}
        onClose={handleClosePrintOptions}
        onPrintInkFriendly={handlePrintInkFriendly}
        onPrintTemplate={handlePrintTemplate}
      />

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

export default HRViewCV;
