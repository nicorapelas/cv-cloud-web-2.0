import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Context as PersonalInfoContext } from '../../../../context/PersonalInfoContext';
import { useRealTime } from '../../../../context/RealTimeContext';

const PersonalInfoCard = ({ setNavTabSelected }) => {
  const {
    state: { personalInfoStatus, loading, personalInfoStatusFetchDone },
    fetchPersonalInfoStatus,
    setPersonalInfoStatusFetchDone,
  } = useContext(PersonalInfoContext);

  const { lastUpdate } = useRealTime();
  const lastRefreshTimestamp = useRef(null);

  // Fetch personal info status on component mount
  useEffect(() => {
    if (!personalInfoStatusFetchDone) {
      fetchPersonalInfoStatus();
      setPersonalInfoStatusFetchDone(true);
    }
  }, [
    personalInfoStatusFetchDone,
    fetchPersonalInfoStatus,
    setPersonalInfoStatusFetchDone,
  ]);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate.dataType === 'personal-info') {
      // Prevent multiple rapid refreshes (within 2 seconds)
      const now = Date.now();
      if (
        lastRefreshTimestamp.current &&
        now - lastRefreshTimestamp.current < 2000
      ) {
        return;
      }

      lastRefreshTimestamp.current = now;

      // Fetch updated status
      setTimeout(() => {
        fetchPersonalInfoStatus();
      }, 500);
    }
  }, [lastUpdate, fetchPersonalInfoStatus]);

  const section = {
    id: 'personalInfo',
    title: 'Personal Information',
    description: 'Add your basic details and contact information',
    icon: '👤',
    route: '/app/cv-builder/personalInfo',
  };

  return (
    <Link
      to={section.route}
      className="dashboard-section-card"
      onClick={() => setNavTabSelected(section.id)}
    >
      <div className="dashboard-section-icon">{section.icon}</div>
      <div className="dashboard-section-content">
        <h4>{section.title}</h4>
        <p>{section.description}</p>
        {loading && <span className="loading-indicator">Loading...</span>}
        {personalInfoStatus !== null && !loading && (
          <span className="status-indicator">
            {personalInfoStatus === null || personalInfoStatus < 1 ? (
              <span style={{ color: '#e74c3c' }}>● {personalInfoStatus}%</span>
            ) : personalInfoStatus > 1 && personalInfoStatus < 35 ? (
              <span style={{ color: '#f39c12' }}>● {personalInfoStatus}%</span>
            ) : personalInfoStatus > 49 && personalInfoStatus < 68 ? (
              <span style={{ color: '#f1c40f' }}>● {personalInfoStatus}%</span>
            ) : (
              <span style={{ color: '#2ecc71' }}>● {personalInfoStatus}%</span>
            )}
          </span>
        )}
      </div>
      <div className="dashboard-section-arrow">→</div>
    </Link>
  );
};

export default PersonalInfoCard;
