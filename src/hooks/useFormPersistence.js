import { useEffect, useRef } from 'react';

/**
 * Custom hook for form data persistence
 * 
 * This hook automatically saves form data to localStorage and restores it
 * when the component mounts, preventing data loss during re-renders.
 * 
 * @param {Object} formData - The current form data object
 * @param {string} formKey - Unique key for localStorage (e.g., 'reference-form', 'personal-info-form')
 * @param {Function} setFormData - Function to set form data
 * @param {boolean} enabled - Whether persistence is enabled (default: true)
 */
export const useFormPersistence = (formData, formKey, setFormData, enabled = true) => {
  const isInitialized = useRef(false);
  const lastSavedData = useRef(null);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (!enabled || !formData || Object.keys(formData).length === 0) {
      return;
    }

    // Don't save if data hasn't actually changed
    const currentDataString = JSON.stringify(formData);
    if (lastSavedData.current === currentDataString) {
      return;
    }

    try {
      localStorage.setItem(`form-data-${formKey}`, currentDataString);
      lastSavedData.current = currentDataString;
      console.log(`💾 Form data saved for ${formKey}`);
    } catch (error) {
      console.warn(`⚠️ Failed to save form data for ${formKey}:`, error);
    }
  }, [formData, formKey, enabled]);

  // Restore form data from localStorage on mount
  useEffect(() => {
    if (!enabled || isInitialized.current) {
      return;
    }

    try {
      const savedData = localStorage.getItem(`form-data-${formKey}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData && Object.keys(parsedData).length > 0) {
          setFormData(parsedData);
          console.log(`🔄 Form data restored for ${formKey}`);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Failed to restore form data for ${formKey}:`, error);
    }

    isInitialized.current = true;
  }, [formKey, setFormData, enabled]);

  // Clear saved data when form is successfully submitted
  const clearSavedData = () => {
    try {
      localStorage.removeItem(`form-data-${formKey}`);
      lastSavedData.current = null;
      console.log(`🗑️ Form data cleared for ${formKey}`);
    } catch (error) {
      console.warn(`⚠️ Failed to clear form data for ${formKey}:`, error);
    }
  };

  return { clearSavedData };
};
