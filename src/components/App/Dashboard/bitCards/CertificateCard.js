import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Context as CertificateContext } from '../../../../context/CertificateContext';

const CertificateCard = ({ setNavTabSelected }) => {
  const {
    state: { certificateStatus, loading, certificateStatusInitFetchDone },
    fetchCertificateStatus,
    setCertificateInitStatusFetchDone,
  } = useContext(CertificateContext);

  // Fetch certificate status on component mount
  useEffect(() => {
    if (!certificateStatusInitFetchDone) {
      fetchCertificateStatus();
      setCertificateInitStatusFetchDone(true);
    }
  }, [certificateStatusInitFetchDone]);

  const section = {
    id: 'certificates',
    title: 'Certificates',
    description: 'Add your professional certificates and qualifications',
    icon: '🏆',
    route: '/app/cv-builder',
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
