import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Context as PersonalSummaryContext } from '../../../../context/PersonalSummaryContext';
import { useRealTime } from '../../../../context/RealTimeContext';

const PersonalSummaryCard = ({ setNavTabSelected }) => {
  const {
    state: { personalSummaryStatus, loading, personalSummaryStatusFetchDone },
    fetchPersonalSummaryStatus,
    setPersonalSummaryStatusFetchDone,
  } = useContext(PersonalSummaryContext);

  const { lastUpdate } = useRealTime();
  const lastRefreshTimestamp = useRef(null);

  // Fetch personal summary status on component mount
  useEffect(() => {
    if (!personalSummaryStatusFetchDone) {
      fetchPersonalSummaryStatus();
      setPersonalSummaryStatusFetchDone(true);
    }
  }, [
    personalSummaryStatusFetchDone,
    fetchPersonalSummaryStatus,
    setPersonalSummaryStatusFetchDone,
  ]);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate.dataType === 'personal-summary') {
      const now = Date.now();
      if (
        lastRefreshTimestamp.current &&
        now - lastRefreshTimestamp.current < 2000
      ) {
        return;
      }

      lastRefreshTimestamp.current = now;
      setTimeout(() => {
        fetchPersonalSummaryStatus();
      }, 500);
    }
  }, [lastUpdate, fetchPersonalSummaryStatus]);

  const section = {
    id: 'personalSummary',
    title: 'Personal Summary',
    description: 'Write a compelling professional summary',
    icon: '📝',
    route: '/app/cv-builder/personalSummary',
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
        {personalSummaryStatus !== null && !loading && (
          <span className="status-indicator">
            {personalSummaryStatus < 10 ? (
              <span style={{ color: '#e74c3c' }}>○ Incomplete</span>
            ) : (
              <span style={{ color: '#2ecc71' }}>✓ Complete</span>
            )}
          </span>
        )}
      </div>
      <div className="dashboard-section-arrow">→</div>
    </Link>
  );
};

export default PersonalSummaryCard;
