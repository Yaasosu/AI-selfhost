import React from 'react';
import WelcomeState from './WelcomeState';
import MessageItem from './MessageItem';

/**
 * Scrollable Message List Container Component
 */
export default function MessageList({
  messages,
  userName,
  copiedId,
  onCopyText,
  onSuggestionClick,
  messagesEndRef,
}) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 0' }}>
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {messages.length === 0 ? (
          <WelcomeState onSuggestionClick={onSuggestionClick} />
        ) : (
          messages.map((m) => (
            <MessageItem
              key={m.id}
              message={m}
              userName={userName}
              copiedId={copiedId}
              onCopyText={onCopyText}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
