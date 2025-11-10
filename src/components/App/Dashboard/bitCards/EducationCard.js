import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Context as SecondEduContext } from '../../../../context/SecondEduContext';
import { useRealTime } from '../../../../context/RealTimeContext';

const EducationCard = ({ setNavTabSelected }) => {
  const {
    state: { secondEduStatus, loading, secondEduStatusInitFetchDone },
    fetchSecondEduStatus,
    setSecondEduStatusInitFetchDone,
  } = useContext(SecondEduContext);

  const { lastUpdate } = useRealTime();
  const lastRefreshTimestamp = useRef(null);

  console.log('secondEduStatus', secondEduStatus);

  // Fetch secondary education status on component mount
  useEffect(() => {
    if (!secondEduStatusInitFetchDone) {
      fetchSecondEduStatus();
      setSecondEduStatusInitFetchDone(true);
    }
  }, [
    secondEduStatusInitFetchDone,
    fetchSecondEduStatus,
    setSecondEduStatusInitFetchDone,
  ]);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate.dataType === 'second-edu') {
      const now = Date.now();
      if (
        lastRefreshTimestamp.current &&
        now - lastRefreshTimestamp.current < 2000
      ) {
        return;
      }

      lastRefreshTimestamp.current = now;
      setTimeout(() => {
        fetchSecondEduStatus();
      }, 500);
    }
  }, [lastUpdate, fetchSecondEduStatus]);

  const section = {
    id: 'education',
    title: 'Secondary Education',
    description: 'Include your academic background',
    icon: '🎓',
    route: '/app/cv-builder/education',
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
        {secondEduStatus !== null && !loading && (
          <span className="status-indicator">
            {Number(secondEduStatus) > 0 ? (
              <span style={{ color: '#2ecc71' }}>✓ Complete</span>
            ) : (
              <span style={{ color: '#e74c3c' }}>○ Incomplete</span>
            )}
          </span>
        )}
      </div>
      <div className="dashboard-section-arrow">→</div>
    </Link>
  );
};

export default EducationCard;
