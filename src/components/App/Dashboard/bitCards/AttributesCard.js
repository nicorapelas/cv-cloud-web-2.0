import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Context as AttributeContext } from '../../../../context/AttributeContext';
import { useRealTime } from '../../../../context/RealTimeContext';

const AttributesCard = ({ setNavTabSelected }) => {
  const {
    state: { attributeStatus, loading, attributeStatusInitFetchDone },
    fetchAttributeStatus,
    setAttributeStatusInitFetchDone,
  } = useContext(AttributeContext);

  const { lastUpdate } = useRealTime();
  const lastRefreshTimestamp = useRef(null);

  // Fetch attribute status on component mount
  useEffect(() => {
    if (!attributeStatusInitFetchDone) {
      fetchAttributeStatus();
      setAttributeStatusInitFetchDone(true);
    }
  }, [
    attributeStatusInitFetchDone,
    fetchAttributeStatus,
    setAttributeStatusInitFetchDone,
  ]);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate.dataType === 'attribute') {
      const now = Date.now();
      if (
        lastRefreshTimestamp.current &&
        now - lastRefreshTimestamp.current < 2000
      ) {
        return;
      }

      lastRefreshTimestamp.current = now;
      setTimeout(() => {
        fetchAttributeStatus();
      }, 500);
    }
  }, [lastUpdate, fetchAttributeStatus]);

  const section = {
    id: 'attributes',
    title: 'Attributes',
    description: 'Add your personal attributes and qualities',
    icon: '✨',
    route: '/app/cv-builder/attributes',
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
        {attributeStatus !== null && !loading && (
          <span className="status-indicator">
            {Number(attributeStatus) === 0 ? (
              <span style={{ color: '#e74c3c' }}>● 0</span>
            ) : Number(attributeStatus) === 1 ? (
              <span style={{ color: '#f39c12' }}>● 1</span>
            ) : Number(attributeStatus) === 2 ? (
              <span style={{ color: '#f1c40f' }}>● 2</span>
            ) : (
              <span style={{ color: '#2ecc71' }}>● {attributeStatus}</span>
            )}
          </span>
        )}
      </div>
      <div className="dashboard-section-arrow">→</div>
    </Link>
  );
};

export default AttributesCard;
