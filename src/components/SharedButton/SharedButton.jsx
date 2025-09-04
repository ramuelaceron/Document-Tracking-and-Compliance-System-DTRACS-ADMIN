// src/components/SharedButton/SharedButton.jsx
import React from 'react';
import './SharedButton.css';

const SharedButton = ({ 
  children, 
  variant = 'default', 
  size = 'medium', 
  onClick, 
  disabled, 
  type = 'button', 
  fullWidth = false,
  as = 'button'
}) => {
  const Component = as;

  return (
    <Component
      type={as === 'button' ? type : undefined}
      className={`shared-button shared-button--${variant} shared-button--${size}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ 
        width: fullWidth ? '100%' : 'auto',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {children}
    </Component>
  );
};

export default SharedButton;        