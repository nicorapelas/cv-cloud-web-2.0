import { useState, useEffect } from 'react';

const useDashSwapLoader = (delay = 3000) => {
  const [showLoader, setShowLoader] = useState(false);
  const [switchingTo, setSwitchingTo] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  const startLoader = (target = 'dashboard') => {
    if (isLoading) return; // Prevent multiple simultaneous loads
    
    setSwitchingTo(target);
    setShowLoader(true);
    setIsLoading(true);
  };

  const stopLoader = () => {
    setShowLoader(false);
    setIsLoading(false);
  };

  // Auto-hide loader after delay
  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        stopLoader();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [showLoader, delay]);

  return {
    showLoader,
    switchingTo,
    isLoading,
    startLoader,
    stopLoader
  };
};

export default useDashSwapLoader;
