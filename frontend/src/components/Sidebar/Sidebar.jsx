import React from 'react';
import MdIcon from '../UI/Icon';
import MdIconButton from '../UI/IconButton';
import ChatItem from './ChatItem';

/**
 * Sidebar Navigation Drawer Component in English
 */
export default function Sidebar({
  isOpen,
  onClose,
  isDark,
  setIsDark,
  models,
  selectedModelId,
  setSelectedModelId,
  chats,
  activeChatId,
  setActiveChatId,
  handleCreateChat,
  handleDeleteChat,
  user,
  handleLogout,
}) {
  return (
    <aside
      aria-label="Navigation drawer"
      style={{
        position: 'relative',
        zIndex: 10,
        width: isOpen ? 280 : 0,
        minWidth: isOpen ? 280 : 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        borderRight: '1px solid var(--md-sys-color-outline-variant)',
        transition: 'width 0.25s var(--md-motion-easing), min-width 0.25s var(--md-motion-easing)',
      }}
    >
      <div style={{ minWidth: 280, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--md-sys-color-outline-variant)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--md-shape-md)',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--md-elevation-1)',
              }}
            >
              <span className="blinking-dot" />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '-0.01em',
                color: 'var(--md-sys-color-on-surface)',
              }}
            >
              AI WEBHOST
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <MdIconButton
              onClick={() => window.open('http://' + window.location.hostname + ':3000', '_blank')}
              title="Grafana (Metrics)"
              style={{ width: 34, height: 34 }}
            >
              <MdIcon name="monitoring" style={{ fontSize: '18px' }} />
            </MdIconButton>
            <MdIconButton
              onClick={() => setIsDark((d) => !d)}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
              style={{ width: 34, height: 34 }}
            >
              <MdIcon name={isDark ? 'light_mode' : 'dark_mode'} style={{ fontSize: '18px' }} />
            </MdIconButton>
            <MdIconButton
              onClick={onClose}
              title="Hide Menu"
              style={{ width: 34, height: 34 }}
            >
              <MdIcon name="menu_open" style={{ fontSize: '18px' }} />
            </MdIconButton>
          </div>
        </div>

        {/* AI Model Selector */}
        <div style={{ padding: '1rem 1.25rem 0.5rem' }}>
          <label
            htmlFor="model-select"
            style={{
              display: 'block',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--md-sys-color-on-surface-variant)',
              marginBottom: '0.4rem',
            }}
          >
            AI Model
          </label>
          <select
            id="model-select"
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--md-shape-md)',
              fontSize: '0.825rem',
              fontWeight: 500,
              backgroundColor: 'var(--md-sys-color-surface-container-lowest)',
              border: '1px solid var(--md-sys-color-outline)',
              color: 'var(--md-sys-color-on-surface)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {Object.entries(models).map(([id, modelName]) => (
              <option
                key={id}
                value={id}
                style={{ backgroundColor: isDark ? '#1F232B' : '#FFFFFF' }}
              >
                {modelName}
              </option>
            ))}
          </select>
        </div>

        {/* New Chat Button */}
        <div style={{ padding: '0.5rem 1.25rem 0.75rem' }}>
          <button
            type="button"
            onClick={handleCreateChat}
            className="md-btn-tonal"
            style={{
              width: '100%',
              padding: '0.7rem',
              borderRadius: 'var(--md-shape-xl)',
              fontSize: '0.875rem',
              justifyContent: 'flex-start',
              paddingLeft: '1rem',
            }}
          >
            <MdIcon name="add" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.75rem' }}>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--md-sys-color-outline)',
              padding: '0.5rem 0.5rem 0.35rem',
            }}
          >
            Chat History
          </div>
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onSelect={() => setActiveChatId(chat.id)}
              onDelete={handleDeleteChat}
            />
          ))}
        </div>

        {/* User Footer */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--md-sys-color-outline-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--md-sys-color-surface-container)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--md-shape-full)',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {(user?.user || 'U')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--md-sys-color-on-surface)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.user}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--md-sys-color-outline)' }}>
                Local Session
              </div>
            </div>
          </div>
          <MdIconButton onClick={handleLogout} title="Sign Out" style={{ width: 34, height: 34 }}>
            <MdIcon name="logout" style={{ fontSize: '18px' }} />
          </MdIconButton>
        </div>
      </div>
    </aside>
  );
}
