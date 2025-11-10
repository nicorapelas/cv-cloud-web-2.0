import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Context as CertificateContext } from '../../../../context/CertificateContext';
import { useRealTime } from '../../../../context/RealTimeContext';

const CertificateCard = ({ setNavTabSelected }) => {
  const {
    state: { certificateStatus, loading, certificateStatusInitFetchDone },
    fetchCertificateStatus,
    setCertificateInitStatusFetchDone,
  } = useContext(CertificateContext);

  const { lastUpdate } = useRealTime();
  const lastRefreshTimestamp = useRef(null);

  // Fetch certificate status on component mount
  useEffect(() => {
    if (!certificateStatusInitFetchDone) {
      fetchCertificateStatus();
      setCertificateInitStatusFetchDone(true);
    }
  }, [certificateStatusInitFetchDone]);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate.dataType === 'certificate') {
      const now = Date.now();
      if (
        lastRefreshTimestamp.current &&
        now - lastRefreshTimestamp.current < 2000
      ) {
        return;
      }

      lastRefreshTimestamp.current = now;
      setTimeout(() => {
        fetchCertificateStatus();
      }, 500);
    }
  }, [lastUpdate, fetchCertificateStatus]);

  const section = {
    id: 'certificates',
    title: 'Certificates',
    description: 'Add your professional certificates and qualifications',
    icon: '🏆',
    route: '/app/cv-builder/certificates',
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
        {certificateStatus !== null && !loading && (
          <span className="status-indicator">
            {certificateStatus === '0' ? (
              <span style={{ color: '#e74c3c' }}>● 0</span>
            ) : (
              <span style={{ color: '#2ecc71' }}>● {certificateStatus}</span>
            )}
          </span>
        )}
      </div>
      <div className="dashboard-section-arrow">→</div>
    </Link>
  );
};

export default CertificateCard;
