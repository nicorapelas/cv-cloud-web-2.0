import api from '../api/api';

/**
 * Track user activity
 * @param {string} action - The action performed (e.g., 'personal_info_saved')
 * @param {string} feature - The feature used (e.g., 'personal_info')
 * @param {object} metadata - Additional context data
 */
export const trackActivity = async (action, feature = null, metadata = {}) => {
  try {
    await api.post('/api/user-activity/track', {
      action,
      feature,
      metadata,
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.error('Activity tracking error:', error);
  }
};

// Pre-defined tracking functions for common actions
export const trackCVPublished = () =>
  trackActivity('cv_published', 'cv_visibility');
export const trackCVUnpublished = () =>
  trackActivity('cv_unpublished', 'cv_visibility');
export const trackCVShared = () => trackActivity('cv_shared', 'cv_sharing');
export const trackCVExported = () => trackActivity('cv_exported', 'cv_export');
export const trackPersonalInfoSaved = () =>
  trackActivity('personal_info_saved', 'personal_info');
export const trackContactInfoSaved = () =>
  trackActivity('contact_info_saved', 'contact_info');
export const trackSummarySaved = () =>
  trackActivity('summary_saved', 'personal_summary');
export const trackSkillAdded = () => trackActivity('skill_added', 'skills');
export const trackExperienceAdded = () =>
  trackActivity('experience_added', 'experience');
export const trackEmploymentHistoryAdded = () =>
  trackActivity('employment_history_added', 'employment_history');
export const trackCertificateAdded = () =>
  trackActivity('certificate_added', 'certificates');
export const trackReferenceAdded = () =>
  trackActivity('reference_added', 'references');
export const trackLanguageAdded = () =>
  trackActivity('language_added', 'languages');
export const trackInterestAdded = () =>
  trackActivity('interest_added', 'interests');
export const trackAttributeAdded = () =>
  trackActivity('attribute_added', 'attributes');
export const trackFirstImpressionUploaded = () =>
  trackActivity('first_impression_uploaded', 'first_impression');
export const trackCVBrowsed = () => trackActivity('browse_cvs', 'hr_dashboard');
export const trackCVViewed = cvId =>
  trackActivity('cv_viewed', 'cv_viewing', { cvId });
export const trackCVSavedByHR = cvId =>
  trackActivity('cv_saved_by_hr', 'hr_saved_cvs', { cvId });
