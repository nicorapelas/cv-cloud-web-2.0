import React, { useState } from 'react';
import './IndustrySelectionModal.css';

const INDUSTRIES = [
  'Technology & IT',
  'Healthcare & Medical',
  'Finance & Banking',
  'Education & Training',
  'Retail & Sales',
  'Hospitality & Tourism',
  'Construction & Engineering',
  'Mining & Resources',
  'Marketing & Advertising',
  'Legal & Compliance',
  'Manufacturing',
  'Transportation & Logistics',
  'Real Estate',
  'Media & Entertainment',
  'Government & Public Sector',
  'Agriculture & Farming',
  'Energy & Utilities',
  'Telecommunications',
  'Consulting & Professional Services',
  'Non-Profit & NGO',
  'Other',
];

const IndustrySelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialIndustries = [],
}) => {
  const [selectedIndustries, setSelectedIndustries] =
    useState(initialIndustries);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleToggleIndustry = industry => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
    setError(''); // Clear error when user makes selection
  };

  const handleConfirm = () => {
    if (selectedIndustries.length === 0) {
      setError('Please select at least one industry');
      return;
    }
    onConfirm(selectedIndustries);
  };

  const handleCancel = () => {
    setSelectedIndustries(initialIndustries);
    setError('');
    onClose();
  };

  return (
    <div className="industry-modal-overlay" onClick={handleCancel}>
      <div className="industry-modal" onClick={e => e.stopPropagation()}>
        <div className="industry-modal-header">
          <h2>Select Your Industries</h2>
          <p>Choose the industries you're interested in working within</p>
        </div>

        {error && <div className="industry-modal-error">{error}</div>}

        <div className="industry-modal-body">
          <div className="industry-grid">
            {INDUSTRIES.map(industry => (
              <label key={industry} className="industry-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedIndustries.includes(industry)}
                  onChange={() => handleToggleIndustry(industry)}
                  className="industry-checkbox-input"
                />
                <span className="industry-checkbox-custom"></span>
                <span className="industry-name">{industry}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="industry-modal-footer">
          <div className="industry-selected-count">
            {selectedIndustries.length}{' '}
            {selectedIndustries.length === 1 ? 'industry' : 'industries'}{' '}
            selected
          </div>
          <div className="industry-modal-actions">
            <button
              type="button"
              className="industry-modal-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="industry-modal-confirm"
              onClick={handleConfirm}
            >
              Make CV Public
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrySelectionModal;
