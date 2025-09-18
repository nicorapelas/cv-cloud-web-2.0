import React from 'react';
import './PrintOptionsModal.css';

const PrintOptionsModal = ({ isOpen, onClose, onPrintInkFriendly, onPrintTemplate }) => {
  if (!isOpen) return null;

  return (
    <div className="print-options-overlay">
      <div className="print-options-modal">
        <div className="print-options-header">
          <h3>Choose Print Option</h3>
          <button className="print-options-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="print-options-content">
          <div className="print-option">
            <div className="print-option-icon">🖨️</div>
            <div className="print-option-info">
              <h4>Ink Friendly</h4>
              <p>Simple black and white layout with minimal ink usage. Proficiency dots shown as numbers (e.g., 4/5).</p>
            </div>
            <button 
              className="print-option-button ink-friendly"
              onClick={onPrintInkFriendly}
            >
              Print Ink Friendly
            </button>
          </div>

          <div className="print-option">
            <div className="print-option-icon">🎨</div>
            <div className="print-option-info">
              <h4>Print as Template</h4>
              <p>Print the CV exactly as it appears on screen with colors and original styling.</p>
            </div>
            <button 
              className="print-option-button template"
              onClick={onPrintTemplate}
            >
              Print Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintOptionsModal;
