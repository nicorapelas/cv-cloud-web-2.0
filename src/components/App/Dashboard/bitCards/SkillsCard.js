import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Context as SkillContext } from '../../../../context/SkillContext';
import { useRealTime } from '../../../../context/RealTimeContext';

const SkillsCard = ({ setNavTabSelected }) => {
  const {
    state: { skillStatus, loading, skillStatusInitFetchDone },
    fetchSkillStatus,
    setSkillStatusInitFetchDone,
  } = useContext(SkillContext);

  const { lastUpdate } = useRealTime();
  const lastRefreshTimestamp = useRef(null);

  // Fetch skill status on component mount
  useEffect(() => {
    if (!skillStatusInitFetchDone) {
      fetchSkillStatus();
      setSkillStatusInitFetchDone(true);
    }
  }, [skillStatusInitFetchDone, fetchSkillStatus, setSkillStatusInitFetchDone]);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate.dataType === 'skill') {
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
        fetchSkillStatus();
      }, 500);
    }
  }, [lastUpdate, fetchSkillStatus]);

  const section = {
    id: 'skills',
    title: 'Skills',
    description: 'Highlight your key skills and competencies',
    icon: '⚡',
    route: '/app/cv-builder/skills',
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
        {skillStatus !== null && !loading && (
          <span className="status-indicator">
            {Number(skillStatus) === 0 ? (
              <span style={{ color: '#e74c3c' }}>● 0</span>
            ) : Number(skillStatus) === 1 ? (
              <span style={{ color: '#f39c12' }}>● 1</span>
            ) : Number(skillStatus) === 2 ? (
              <span style={{ color: '#f1c40f' }}>● 2</span>
            ) : (
              <span style={{ color: '#2ecc71' }}>● {skillStatus}</span>
            )}
          </span>
        )}
      </div>
      <div className="dashboard-section-arrow">→</div>
    </Link>
  );
};

export default SkillsCard;
