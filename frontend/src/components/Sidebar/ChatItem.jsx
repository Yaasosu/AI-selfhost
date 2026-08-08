import React from 'react';
import MdIcon from '../UI/Icon';

/**
 * Chat List Item Row Component in English
 */
export default function ChatItem({ chat, isActive, onSelect, onDelete }) {
  return (
    <div
      onClick={onSelect}
      className="animate-slideIn"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--md-shape-full)',
        marginBottom: '0.25rem',
        cursor: 'pointer',
        transition: 'all var(--md-motion-duration) var(--md-motion-easing)',
        fontSize: '0.85rem',
        fontWeight: isActive ? 600 : 400,
        backgroundColor: isActive ? 'var(--md-sys-color-primary-container)' : 'transparent',
        color: isActive
          ? 'var(--md-sys-color-on-primary-container)'
          : 'var(--md-sys-color-on-surface-variant)',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
        <MdIcon name="chat_bubble" style={{ fontSize: '16px', opacity: isActive ? 1 : 0.7 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {chat.title || 'New Chat'}
        </span>
      </div>
      <button
        type="button"
        onClick={(e) => onDelete(chat.id, e)}
        title="Delete chat"
        aria-label="Delete chat"
        className="delete-btn"
        style={{
          opacity: 0,
          padding: '0.2rem',
          border: 'none',
          background: 'transparent',
          color: 'var(--md-sys-color-error)',
          cursor: 'pointer',
          borderRadius: 'var(--md-shape-sm)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <MdIcon name="delete" style={{ fontSize: '16px' }} />
      </button>
    </div>
  );
}
