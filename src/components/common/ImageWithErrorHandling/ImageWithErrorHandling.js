import React, { useState, useEffect } from 'react';

/**
 * Image component with automatic error handling and refetch
 * Automatically refetches the photo URL if the image fails to load
 */
const ImageWithErrorHandling = ({
  src,
  alt,
  className,
  style,
  onError,
  onLoad,
  fallbackSrc = null,
  maxRetries = 2,
  retryDelay = 1000,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Reset when src changes
  useEffect(() => {
    setImageSrc(src);
    setRetryCount(0);
    setHasError(false);
  }, [src]);

  const handleError = (e) => {
    console.warn('🖼️ Image failed to load:', imageSrc);
    
    // Call custom onError handler if provided
    if (onError) {
      onError(e);
    }

    // If we haven't exceeded max retries, try refetching with cache-busting
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying image load (attempt ${retryCount + 1}/${maxRetries})`);
      
      setTimeout(() => {
        // Add cache-busting query parameter
        const separator = imageSrc.includes('?') ? '&' : '?';
        const newSrc = `${imageSrc}${separator}t=${Date.now()}`;
        setImageSrc(newSrc);
        setRetryCount(prev => prev + 1);
      }, retryDelay);
    } else {
      // Max retries exceeded, show fallback or hide image
      console.error('❌ Image failed to load after max retries');
      setHasError(true);
      
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      } else {
        // Hide the image if no fallback
        e.target.style.display = 'none';
      }
    }
  };

  const handleLoad = (e) => {
    // Reset error state on successful load
    if (hasError) {
      setHasError(false);
      setRetryCount(0);
    }
    
    if (onLoad) {
      onLoad(e);
    }
  };

  // Don't render if we've exhausted retries and have no fallback
  if (hasError && !fallbackSrc && retryCount >= maxRetries) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default ImageWithErrorHandling;
