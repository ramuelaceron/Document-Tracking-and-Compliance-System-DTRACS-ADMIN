
// src/components/AccountControlComponents/VerificationModal/VerificationModal.jsx
import React from 'react';
import './VerificationModal.css';

const VerificationModal = ({ isOpen, onClose, title, children, onDeny, onVerify }) => {
  if (!isOpen) return null;

  return (
    <div className="register-info-overlay">
      <div className="register-info-content">
        {/* X Close Button */}
        <button className="register-info-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Title */}
        <h2>{title}</h2>

        {/* Content */}
        {children}

        {/* Action Buttons */}
        <div className="register-info-actions">
          <button className="deny-btn" onClick={onDeny}>
            Deny
          </button>
          <button className="verify-btn" onClick={onVerify}>
            Verify
          </button>
        </div>
      </div>  
    </div>
  );
};

export default VerificationModal;