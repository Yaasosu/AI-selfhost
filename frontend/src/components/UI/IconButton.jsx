import React from 'react';

/**
 * Material Design 3 Icon Button Component
 */
const MdIconButton = ({ onClick, title, children, className = '', disabled = false, style = {} }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    disabled={disabled}
    className={`md-icon-btn ${className}`}
    style={{ ...style }}
  >
    {children}
  </button>
);

export default MdIconButton;
