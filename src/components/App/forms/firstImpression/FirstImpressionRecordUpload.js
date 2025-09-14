import React, { useState, useRef, useEffect, useContext } from 'react';
import { Context as FirstImpressionContext } from '../../../../context/FirstImpressionContext';
import { Context as AuthContext } from '../../../../context/AuthContext';
import { Context as NavContext } from '../../../../context/NavContext';
import { useNavigate } from 'react-router-dom';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { uploadMessages } from './uploadingMessagesArray';
import './FirstImpression.css';

const FirstImpressionRecordUpload = () => {
  const { videoDemoUrl, firstImpressionStatus, fetchFirstImpressionStatus } =
    useContext(FirstImpressionContext);
  const { user } = useContext(AuthContext);
  const { setNavTabSelected } = useContext(NavContext);
  const navigate = useNavigate();

  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [mediaStream, setMediaStream] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);

  // Timing and messaging state
  const [uploadStartTime, setUploadStartTime] = useState(null);
  const [conversionStartTime, setConversionStartTime] = useState(null);
  const [uploadTimes, setUploadTimes] = useState({});
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentStage, setCurrentStage] = useState('');

  // Refs
  const videoRef = useRef(null);
  const playbackVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const ffmpegRef = useRef(new FFmpeg());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  // Ensure playback video gets the correct source
  useEffect(() => {
    if (recordedVideo && playbackVideoRef.current) {
      playbackVideoRef.current.src = recordedVideo.url;
      playbackVideoRef.current.load(); // Force reload the video
    }
  }, [recordedVideo]);

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
  }, [isUploading, uploadStartTime]);

  // Get current message based on elapsed time
  const getCurrentMessage = elapsed => {
    const seconds = Math.floor(elapsed / 1000);

    if (seconds < 5) {
      return { text: uploadMessages[0], stage: 'preparing' };
    } else if (seconds < 15) {
      return { text: uploadMessages[1], stage: 'converting' };
    } else if (seconds < 30) {
      return { text: uploadMessages[2], stage: 'uploading' };
    } else if (seconds < 45) {
      return { text: uploadMessages[3], stage: 'processing' };
    } else {
      return { text: uploadMessages[4], stage: 'finalizing' };
    }
  };

  // Start camera with optimized settings
  const startCamera = async () => {
    try {
      setError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 180, max: 240 },
          height: { ideal: 320, max: 360 },
          frameRate: { ideal: 10, max: 15 },
          facingMode: 'user',
          aspectRatio: { ideal: 9 / 16 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setMediaStream(stream);

      // Wait a bit for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Add event listeners to track video element state
          videoRef.current.addEventListener('loadedmetadata', () => {
            // Video is ready to play
          });

          videoRef.current.addEventListener('canplay', () => {
            // Force the video to play
            if (videoRef.current) {
              videoRef.current.play().catch(err => {
                console.error('Video play failed:', err);
              });
            }
          });

          videoRef.current.addEventListener('error', e => {
            console.error('Video error:', e);
          });
        }
      }, 100);

      setIsCameraStarted(true);
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  // Start recording
  const startRecording = () => {
    if (!mediaStream) return;

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 250000, // Very low bitrate for minimal file size
    });

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      // Clear the camera stream from the video element to prepare for playback
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setRecordedVideo({ blob, url });
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Reset recording
  const resetRecording = () => {
    setRecordedVideo(null);
    setError('');
    setUploadProgress('');
    setCurrentMessage('');
    setCurrentStage('');

    // Restore camera stream to video element
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  };

  // Convert video to MOV using FFmpeg
  const convertToMOV = async videoBlob => {
    const ffmpeg = ffmpegRef.current;

    try {
      setConversionStartTime(Date.now());
      setUploadProgress('Converting video format...');

      // Load FFmpeg
      if (!ffmpeg.loaded) {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            'text/javascript'
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            'application/wasm'
          ),
        });
      }

      // Write input file
      await ffmpeg.writeFile('input.webm', await fetchFile(videoBlob));

      // Convert to MOV with optimized settings
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

      // Read output file
      const data = await ffmpeg.readFile('output.mov');
      const convertedBlob = new Blob([data.buffer], {
        type: 'video/quicktime',
      });

      // Clean up
      await ffmpeg.deleteFile('input.webm');
      await ffmpeg.deleteFile('output.mov');

      return convertedBlob;
    } catch (error) {
      console.error('Conversion error:', error);
      throw new Error('Failed to convert video format');
    }
  };

  // Upload to Cloudinary with signature
  const uploadToCloudinaryWithSignature = async videoBlob => {
    try {
      setUploadProgress('Getting upload signature...');

      // Get upload signature from server
      const signatureResponse = await fetch(
        '/api/cvBits/firstImpression/signature',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            folder: `users/${user.id}/firstImpression`,
            resource_type: 'video',
          }),
        }
      );

      if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const { signature, timestamp, cloudName } =
        await signatureResponse.json();

      // Create form data
      const formData = new FormData();
      formData.append('file', videoBlob);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY);
      formData.append('folder', `users/${user.id}/firstImpression`);
      formData.append('resource_type', 'video');

      setUploadProgress('Uploading to cloud...');

      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      return uploadResult.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload video');
    }
  };

  // Handle complete upload process
  const handleUpload = async () => {
    if (!recordedVideo || !user) return;

    try {
      setIsUploading(true);
      setError('');
      setUploadStartTime(Date.now());
      setUploadProgress('Starting upload process...');

      // Convert video format
      const convertedBlob = await convertToMOV(recordedVideo.blob);

      // Upload to cloud
      const videoUrl = await uploadToCloudinaryWithSignature(convertedBlob);

      // Save to database
      setUploadProgress('Saving to database...');
      const response = await fetch('/api/cvBits/firstImpression', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          videoUrl,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save video');
      }

      // Update status
      await fetchFirstImpressionStatus();
      setUploadProgress('Upload completed successfully!');

      // Navigate back to dashboard after success
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Play demo video
  const playDemo = () => {
    if (videoDemoUrl && videoDemoUrl.url) {
      const demoWindow = window.open('', '_blank', 'width=800,height=600');
      if (demoWindow) {
        demoWindow.document.write(`
          <html>
            <head><title>First Impression Demo</title></head>
            <body style="margin:0; padding:20px; background:#000; display:flex; align-items:center; justify-content:center;">
              <video controls autoplay style="max-width:100%; max-height:100%;">
                <source src="${videoDemoUrl.url}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </body>
          </html>
        `);
        demoWindow.document.close();
      } else {
        // Fallback if popup blocked
        window.open(videoDemoUrl.url, '_blank');
      }
    }
  };

  return (
    <div className="first-impression-form">
      <div className="first-impression-form-container">
        <div className="first-impression-form-header">
          <div className="first-impression-form-header-icon">🎥</div>
          <div className="first-impression-form-header-content">
            <h2>First Impression</h2>
            <p>
              Record a short video introduction to showcase your personality
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="demo-section">
          <p className="demo-message">Want to see an example first?</p>
          <button className="demo-button" onClick={playDemo}>
            🎬 Watch Demo Video
          </button>
        </div>

        {/* Error Display */}
        {error && <div className="error-message">{error}</div>}

        {/* Upload Progress */}
        {isUploading && (
          <div className="upload-progress">
            <div>{currentMessage}</div>
            <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>
              {uploadProgress}
            </div>
          </div>
        )}

        {/* Recording Interface */}
        <div className="recording-interface">
          {!recordedVideo ? (
            <>
              {/* Camera Preview */}
              <div className="camera-container">
                {isCameraStarted ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div className="camera-placeholder">
                    <p>Click to start your camera</p>
                    <button onClick={startCamera} className="start-camera-btn">
                      📹 Start Camera
                    </button>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              {isCameraStarted && (
                <div className="recording-controls">
                  {!isRecording ? (
                    <button onClick={startRecording} className="record-btn">
                      🔴 Start Recording
                    </button>
                  ) : (
                    <button onClick={stopRecording} className="stop-btn">
                      ⏹️ Stop Recording
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Playback */}
              <div className="playback-container">
                <video
                  ref={playbackVideoRef}
                  src={recordedVideo.url}
                  controls
                  className="recorded-video"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button onClick={resetRecording} className="retry-btn">
                  🔄 Retry
                </button>
                <button
                  onClick={handleUpload}
                  className="upload-btn"
                  disabled={isUploading}
                >
                  {isUploading ? '⏳ Uploading...' : '☁️ Upload to Cloud'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstImpressionRecordUpload;
