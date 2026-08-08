import React from 'react';
import MdIcon from '../UI/Icon';

/**
 * Chat Input Control Bar Component in English
 */
export default function ChatInput({
  inputText,
  isLoading,
  textareaRef,
  handleTextareaChange,
  handleInputKeyDown,
  handleSendMessage,
  handleStopGeneration,
}) {
  return (
    <div style={{ padding: '0 1.5rem 1rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <form
          onSubmit={handleSendMessage}
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: 'var(--md-shape-2xl)',
            padding: '0.4rem 0.5rem 0.4rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: 'var(--md-elevation-2)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleTextareaChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Ask anything..."
            aria-label="Message input"
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--md-sys-color-on-surface)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              resize: 'none',
              padding: '0.2rem 0',
              maxHeight: 160,
              fontFamily: 'inherit',
            }}
          />

          {isLoading ? (
            <button
              type="button"
              onClick={handleStopGeneration}
              title="Stop generation"
              aria-label="Stop generation"
              className="animate-stop-pulse"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--md-shape-full)',
                border: 'none',
                backgroundColor: 'var(--md-sys-color-error-container)',
                color: 'var(--md-sys-color-on-error-container)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              <MdIcon name="square" style={{ fontSize: '16px' }} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputText.trim()}
              title="Send message"
              aria-label="Send message"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--md-shape-full)',
                border: 'none',
                backgroundColor: inputText.trim()
                  ? 'var(--md-sys-color-primary)'
                  : 'var(--md-sys-color-surface-container-highest)',
                color: inputText.trim()
                  ? 'var(--md-sys-color-on-primary)'
                  : 'var(--md-sys-color-outline)',
                cursor: inputText.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: inputText.trim() ? 'var(--md-elevation-1)' : 'none',
                transition: 'all 0.18s var(--md-motion-easing)',
              }}
            >
              <MdIcon name="arrow_upward" style={{ fontSize: '18px', fontWeight: 'bold' }} />
            </button>
          )}
        </form>
        <p
          style={{
            textAlign: 'center',
            marginTop: '0.4rem',
            fontSize: '0.7rem',
            color: 'var(--md-sys-color-outline)',
          }}
        >
          AI Webhost may make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}
