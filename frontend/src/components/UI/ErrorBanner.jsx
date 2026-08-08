import React from 'react';
import MdIcon from './Icon';

/**
 * Dismissible Error Banner Component in English
 */
const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      style={{
        margin: '1rem 1.5rem 0',
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--md-shape-md)',
        fontSize: '0.85rem',
        backgroundColor: 'var(--md-sys-color-error-container)',
        color: 'var(--md-sys-color-on-error-container)',
        border: '1px solid var(--md-sys-color-error)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MdIcon name="error" style={{ fontSize: '18px', color: 'var(--md-sys-color-error)' }} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss error notification"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '0.2rem',
            borderRadius: 'var(--md-shape-xs)',
          }}
        >
          <MdIcon name="close" style={{ fontSize: '18px' }} />
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
