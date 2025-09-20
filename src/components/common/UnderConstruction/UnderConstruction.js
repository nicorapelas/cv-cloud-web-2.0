import React from 'react';
import { Construction, Wrench, Hammer } from 'lucide-react';
import './UnderConstruction.css';

const UnderConstruction = ({ 
  title = "Under Construction", 
  message = "We're working hard to bring you something amazing!",
  showIcon = true,
  className = ""
}) => {
  return (
    <div className={`under-construction ${className}`}>
      <div className="construction-container">
        {showIcon && (
          <div className="construction-icon">
            <Construction className="main-icon" />
            <Wrench className="wrench-icon" />
            <Hammer className="hammer-icon" />
          </div>
        )}
        
        <div className="construction-content">
          <h2 className="construction-title">{title}</h2>
          <p className="construction-message">{message}</p>
          
          <div className="construction-animation">
            <div className="construction-bar">
              <div className="construction-progress"></div>
            </div>
            <p className="construction-subtitle">Coming Soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
