import React, { useState, useContext, useEffect } from 'react';
import { Context as FirstImpressionContext } from '../../../../context/FirstImpressionContext';
import Loader from '../../../common/loader/Loader';
import './FirstImpression.css';

const FirstImpressionViewOrRemove = () => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    state: { loading, firstImpression, firstImpressionStatus },
    deleteFirstImpression,
    fetchFirstImpression,
  } = useContext(FirstImpressionContext);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Extract publicId from Cloudinary video URL
  const extractPublicIdFromUrl = url => {
    if (!url) return null;

    // Cloudinary URL format: https://res.cloudinary.com/cloud_name/video/upload/version/folder/filename.ext
    // We need to extract: folder/filename (without extension)
    const match = url.match(/\/upload\/[^\/]+\/(.+?)\./);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };

  const handleRemoveVideo = async () => {
    if (!firstImpression) {
      alert('No video to remove');
      return;
    }

    // Extract publicId from videoUrl
    const publicId = extractPublicIdFromUrl(firstImpression.videoUrl);

    if (!publicId) {
      console.error(
        'Could not extract publicId from videoUrl:',
        firstImpression.videoUrl
      );
      setErrorMessage('Failed to extract video information. Please try again.');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteFirstImpression({
        id: firstImpression._id,
        publicId: publicId,
      });
      setShowDeleteConfirmation(false);
      setSuccessMessage('Video removed successfully!');
      setErrorMessage('');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error removing video:', error);
      setErrorMessage('Failed to remove video. Please try again.');
      setSuccessMessage('');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  if (loading) {
    return <Loader message="Loading..." />;
  }

  if (!firstImpression || !firstImpression.videoUrl) {
    return (
      <div className="first-impression-form">
        <div className="form-header">
          <h2>First Impression Video</h2>
          <p>No video uploaded yet</p>
        </div>
        <div className="video-container">
          <div className="upload-placeholder">
            <div className="upload-icon">📹</div>
            <h3>No Video Available</h3>
            <p>You haven't uploaded a first impression video yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="first-impression-form">
      <div className="form-header">
        <h2>First Impression Video</h2>
        <p>View and manage your uploaded video</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="form-success-message">{successMessage}</div>
      )}

      {/* Error Message */}
      {errorMessage && <div className="form-error-message">{errorMessage}</div>}

      {/* Delete Loading Modal */}
      {isDeleting && <Loader message="Removing your video..." />}

      {/* Video Player */}
      <div className="video-preview-container">
        <video
          className="video-player"
          src={firstImpression.videoUrl}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Controls */}
      <div className="video-controls">
        <button
          className="retake-button"
          onClick={confirmDelete}
          disabled={loading}
        >
          {loading ? 'Removing...' : 'Remove Video/Record New'}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
            }}
          >
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
              Remove First Impression Video?
            </h3>
            <p
              style={{ margin: '0 0 25px 0', color: '#666', lineHeight: '1.5' }}
            >
              Are you sure you want to remove your first impression video? This
              action cannot be undone.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={cancelDelete}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveVideo}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#dc3545',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Removing...' : 'Remove Video'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Warning */}
      <div className="video-warning">
        <p>
          <strong>Important:</strong> Your first impression video is a key part
          of your CV.
        </p>
        <p>
          Only remove it if you plan to upload a new one, as this helps
          employers get to know you better.
        </p>
      </div>
    </div>
  );
};

export default FirstImpressionViewOrRemove;
