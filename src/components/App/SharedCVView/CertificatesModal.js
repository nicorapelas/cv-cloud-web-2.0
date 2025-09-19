import React, { useState } from 'react';
import './CertificatesModal.css';

const CertificatesModal = ({ isOpen, onClose, certificates, fullName }) => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const handleCertificateClick = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleCloseViewer = () => {
    setSelectedCertificate(null);
  };

  const handleDownload = (certificate) => {
    const url = certificate.pdfUrl || certificate.photoUrl;
    const link = document.createElement('a');
    link.href = url;
    link.download = certificate.title || 'certificate';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !certificates || certificates.length === 0) return null;

  return (
    <div className="certificates-overlay" onClick={onClose}>
      <div className="certificates-modal" onClick={(e) => e.stopPropagation()}>
        <div className="certificates-header">
          <div className="certificates-logo">
            <img src="/logo-h79.png" alt="CV Cloud Logo" className="certificates-logo-image" />
          </div>
          <h3 className="certificates-title">Certificates of {fullName || 'This Candidate'}</h3>
          <button className="certificates-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="certificates-content">
          <div className="certificates-list">
            {certificates.map((certificate, index) => (
              <div key={index} className="certificate-item">
                <div className="certificate-info">
                  <h4 className="certificate-title">{certificate.title}</h4>
                  <div className="certificate-type">
                    {certificate.pdfUrl ? '📄 PDF Document' : '🖼️ Image'}
                  </div>
                </div>
                <div className="certificate-actions">
                  <button
                    className="certificate-view-button"
                    onClick={() => handleCertificateClick(certificate)}
                  >
                    👁️ View
                  </button>
                  <button
                    className="certificate-download-button"
                    onClick={() => handleDownload(certificate)}
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="certificates-footer">
          <p className="certificates-note">
            These are the candidate's uploaded certificates and documents.
          </p>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCertificate && (
        <div className="certificate-viewer-overlay" onClick={handleCloseViewer}>
          <div className="certificate-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="certificate-viewer-header">
              <h3>{selectedCertificate.title}</h3>
              <button className="certificate-viewer-close" onClick={handleCloseViewer}>
                ×
              </button>
            </div>
            <div className="certificate-viewer-content">
              {selectedCertificate.pdfUrl ? (
                <iframe
                  src={selectedCertificate.pdfUrl}
                  className="certificate-pdf-viewer"
                  title={selectedCertificate.title}
                />
              ) : (
                <img
                  src={selectedCertificate.photoUrl}
                  alt={selectedCertificate.title}
                  className="certificate-image-viewer"
                />
              )}
            </div>
            <div className="certificate-viewer-footer">
              <button
                className="certificate-viewer-download"
                onClick={() => handleDownload(selectedCertificate)}
              >
                📥 Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesModal;
