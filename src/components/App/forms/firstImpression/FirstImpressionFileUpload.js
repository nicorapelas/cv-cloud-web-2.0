import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Context as FirstImpressionContext } from '../../../../context/FirstImpressionContext';
import Loader from '../../../common/loader/Loader';
import './FirstImpression.css';
import api from '../../../../api/api';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { uploadMessages } from './uploadingMessagesArray';

const ffmpeg = new FFmpeg();

const FirstImpressionFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [videoDuration, setVideoDuration] = useState(null);
  const [isCheckingDuration, setIsCheckingDuration] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [converting, setConverting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStartTime, setUploadStartTime] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentStage, setCurrentStage] = useState('');

  const {
    state: { loading, videoUploading },
    createFirstImpression,
    setVideoUploading,
  } = useContext(FirstImpressionContext);

  const MAX_DURATION_SECONDS = 31; // 31 seconds for First Impression

  // Get current message based on elapsed time - memoized to prevent re-renders
  const getCurrentMessage = useCallback(elapsed => {
    const seconds = Math.floor(elapsed / 1000);

    if (seconds < 5) {
      return { text: uploadMessages[0].message, stage: 'preparing' };
    } else if (seconds < 15) {
      return { text: uploadMessages[1].message, stage: 'converting' };
    } else if (seconds < 30) {
      return { text: uploadMessages[2].message, stage: 'uploading' };
    } else if (seconds < 45) {
      return { text: uploadMessages[3].message, stage: 'processing' };
    } else {
      return { text: uploadMessages[4].message, stage: 'finalizing' };
    }
  }, []); // Empty dependency array since uploadMessages is imported and won't change

  // Dynamic message updates
  useEffect(() => {
    if (isUploading && uploadStartTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - uploadStartTime;
        const message = getCurrentMessage(elapsed);
        setCurrentMessage(message.text);
        setCurrentStage(message.stage);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isUploading, uploadStartTime, getCurrentMessage]);

  const getVideoDuration = file => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        const duration = video.duration; // Duration in seconds
        URL.revokeObjectURL(video.src); // Clean up
        resolve(duration);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Could not load video metadata'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const formatDuration = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const convertToMOV = async videoBlob => {
    setConverting(true);
    try {
      // Load FFmpeg if not already loaded
      if (!ffmpeg.loaded) {
        await ffmpeg.load({
          coreURL: await toBlobURL('/ffmpeg/ffmpeg-core.js', 'text/javascript'),
          wasmURL: await toBlobURL(
            '/ffmpeg/ffmpeg-core.wasm',
            'application/wasm'
          ),
        });
      }

      // Create a file from the blob for FFmpeg
      const inputFile = new File([videoBlob], 'input.webm', {
        type: videoBlob.type,
      });

      // Write input file to FFmpeg virtual filesystem
      await ffmpeg.writeFile('input.webm', await fetchFile(inputFile));
      // Convert to MOV using H.264 video + AAC audio (matching RecordUpload specs)
      await ffmpeg.exec([
        '-i',
        'input.webm',
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-crf',
        '28',
        '-c:a',
        'aac',
        '-b:a',
        '64k',
        '-movflags',
        '+faststart',
        'output.mov',
      ]);

      // Read the converted file
      const data = await ffmpeg.readFile('output.mov');
      // Create blob from converted data
      const movBlob = new Blob([data.buffer], { type: 'video/quicktime' });

      // Create a new file with MOV extension
      const movFile = new File(
        [movBlob],
        `first-impression-${Date.now()}.mov`,
        {
          type: 'video/quicktime',
        }
      );

      setConverting(false);

      return {
        blob: movBlob,
        file: movFile,
        url: URL.createObjectURL(movBlob),
      };
    } catch (error) {
      console.error('FFmpeg conversion failed:', error);
      setConverting(false);

      // Fallback to simple blob conversion if FFmpeg fails
      const movBlob = new Blob([videoBlob], { type: 'video/quicktime' });
      const movFile = new File(
        [movBlob],
        `first-impression-${Date.now()}.mov`,
        {
          type: 'video/quicktime',
        }
      );

      return {
        blob: movBlob,
        file: movFile,
        url: URL.createObjectURL(movBlob),
      };
    }
  };

  const uploadToCloudinaryWithSignature = async (signatureData, videoFile) => {
    if (!videoFile || !signatureData) {
      console.error('Missing videoFile or signatureData');
      return;
    }

    try {
      setVideoUploading(true);
      setErrorMessage('');

      const { apiKey, signature, timestamp } = signatureData;

      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/cv-cloud/video/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary upload failed:', errorText);
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      // Create first impression with the uploaded video
      await createFirstImpression({
        videoUrl: result.secure_url,
        publicId: result.public_id,
      });

      setVideoUploading(false);
      clearVideo();

      // Show success message
      setErrorMessage(''); // Clear any previous errors
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error.message);
      setVideoUploading(false);
    }
  };

  const handleFileChange = async event => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear previous error
      setErrorMessage('');

      // Validate file type
      if (!file.type.startsWith('video/')) {
        setErrorMessage('Please select a valid video file.');
        return;
      }

      // Validate file size (max 30MB)
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage('File size must be less than 30MB.');
        return;
      }

      // Check video duration
      setIsCheckingDuration(true);
      try {
        const duration = await getVideoDuration(file);
        setVideoDuration(duration);

        if (duration > MAX_DURATION_SECONDS) {
          setErrorMessage(
            `Video is too long. Maximum duration is ${formatDuration(MAX_DURATION_SECONDS)}. Your video is ${formatDuration(duration)}.`
          );
          setIsCheckingDuration(false);
          return;
        }

        setSelectedFile(file);
        setFileName(file.name);
        setVideoUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error('Error checking video duration:', error);
        setErrorMessage(
          'Could not verify video duration. Please try another file.'
        );
      } finally {
        setIsCheckingDuration(false);
      }
    }
  };

  const clearVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setSelectedFile(null);
    setVideoUrl('');
    setFileName('');
    setVideoDuration(null);
    setErrorMessage('');
    setIsUploading(false);
    setUploadStartTime(null);
    setCurrentMessage('');
    setCurrentStage('');
  };

  // Drag and drop handlers
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        handleFileChange({ target: { files: [file] } });
      } else {
        setErrorMessage('Please select a valid video file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a video file first.');
      return;
    }

    try {
      // Start upload process
      setIsUploading(true);
      setUploadStartTime(Date.now());
      setErrorMessage('');
      // Convert to MOV format for mobile compatibility
      const convertedVideo = await convertToMOV(selectedFile);

      // Get upload signature using the API client (includes auth headers)
      const response = await api.post(
        '/api/cloudinary/signature-request-no-preset'
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Use the signature directly for upload with converted video
      await uploadToCloudinaryWithSignature(response.data, convertedVideo.file);

      // Upload completed successfully
    } catch (error) {
      console.error('Error during upload:', error);
      setErrorMessage('Failed to upload video. Please try again.');
    } finally {
      // Clean up upload state
      setIsUploading(false);
      setUploadStartTime(null);
      setCurrentMessage('');
      setCurrentStage('');
    }
  };

  if (loading) {
    return <Loader message="Loading..." />;
  }

  if (isUploading) {
    return (
      <Loader
        message={
          typeof currentMessage === 'string'
            ? currentMessage
            : currentMessage?.text || 'Processing your video...'
        }
      />
    );
  }

  return (
    <>
      <div className="upload-info">
        <p>
          💡 <strong>Supported formats:</strong> MP4, WebM, MOV, AVI
        </p>
        <p>
          📏 <strong>Maximum size:</strong> 30MB
        </p>
        <p>
          📏 <strong>Maximum length:</strong> 31 seconds
        </p>
        <p className="portrait-recommendation">
          📱 <strong>Recommendation:</strong> We highly recommend uploading your
          video in portrait orientation rather than landscape for better mobile
          compatibility.
        </p>
      </div>
      {errorMessage && (
        <div className="error-message">
          <p>❌ {errorMessage}</p>
        </div>
      )}

      <div className="first-impression-create">
        <div
          className={`video-container ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isCheckingDuration ? (
            <div className="upload-placeholder">
              <div className="upload-icon">⏳</div>
              <h3>Checking Video Duration...</h3>
              <p>
                Please wait while we verify your video meets the requirements
              </p>
            </div>
          ) : videoUrl ? (
            <div className="first-impression-file-upload-vieo-container">
              <div>
                <div className="video-info">
                  <h3>Selected Video</h3>
                  <p>
                    <strong>File:</strong> {fileName}
                  </p>
                  {videoDuration && (
                    <p>
                      <strong>Duration:</strong> {formatDuration(videoDuration)}
                    </p>
                  )}
                </div>
                <video
                  src={videoUrl}
                  controls
                  className="video-player"
                  onError={e => console.error('Video error:', e)}
                />
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">📁</div>
              <h3>Select a Video File</h3>
              <p>
                Choose a video file from your device or drag and drop it here
              </p>
              <div
                className="drop-zone-hint"
                onClick={() => {
                  document.getElementById('video-file-input').click();
                }}
              >
                <span>📥 Drop your video file here</span>
              </div>
            </div>
          )}
        </div>

        <div className="file-upload-controls">
          <div className="file-input-wrapper">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              id="video-file-input"
              style={{ display: 'none' }}
            />
          </div>

          {videoUrl && (
            <div className="action-buttons">
              <button onClick={clearVideo} className="retry-btn">
                🗑️ Clear Video
              </button>
              <button
                onClick={handleUpload}
                className="upload-btn"
                disabled={isUploading || converting}
              >
                {converting ? '🔄 Converting...' : '☁️ Upload Video'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FirstImpressionFileUpload;
