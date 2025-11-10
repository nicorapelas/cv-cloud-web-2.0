import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Context as EmploymentHistoryContext } from '../../../../context/EmployHistoryContext';
import { useRealTime } from '../../../../context/RealTimeContext';

const EmploymentHistoryCard = ({ setNavTabSelected }) => {
  const {
    state: { employHistoryStatus, loading, employHistoryStatusInitFetchDone },
    fetchEmployHistoryStatus,
    setEmployHistoryStatusInitFetchDone,
  } = useContext(EmploymentHistoryContext);

  const { lastUpdate } = useRealTime();
  const lastRefreshTimestamp = useRef(null);

  // Fetch employment history status on component mount
  useEffect(() => {
    if (!employHistoryStatusInitFetchDone) {
      fetchEmployHistoryStatus();
      setEmployHistoryStatusInitFetchDone(true);
    }
  }, [employHistoryStatusInitFetchDone]);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate.dataType === 'employment-history') {
      const now = Date.now();
      if (
        lastRefreshTimestamp.current &&
        now - lastRefreshTimestamp.current < 2000
      ) {
        return;
      }

      lastRefreshTimestamp.current = now;
      setTimeout(() => {
        fetchEmployHistoryStatus();
      }, 500);
    }
  }, [lastUpdate, fetchEmployHistoryStatus]);

  const section = {
    id: 'employmentHistory',
    title: 'Employment History',
    description: 'Add your detailed employment history',
    icon: '🏢',
    route: '/app/cv-builder/employmentHistory',
  };

  const handleClick = () => {
    setNavTabSelected(section.id);
  };

  return (
    <Link
      to={section.route}
      className="dashboard-section-card"
      onClick={handleClick}
    >
      <div className="dashboard-section-icon">{section.icon}</div>
      <div className="dashboard-section-content">
        <h4>{section.title}</h4>
        <p>{section.description}</p>
        {loading && <span className="loading-indicator">Loading...</span>}
        {employHistoryStatus !== null && !loading && (
          <span className="status-indicator">
            {employHistoryStatus === '0' ? (
              <span style={{ color: '#e74c3c' }}>● 0</span>
            ) : employHistoryStatus === '1' ? (
              <span style={{ color: '#f39c12' }}>● 1</span>
            ) : employHistoryStatus === '2' ? (
              <span style={{ color: '#f1c40f' }}>● 2</span>
            ) : (
              <span style={{ color: '#2ecc71' }}>● {employHistoryStatus}</span>
            )}
          </span>
        )}
      </div>
      <div className="dashboard-section-arrow">→</div>
    </Link>
  );
};

export default EmploymentHistoryCard;
