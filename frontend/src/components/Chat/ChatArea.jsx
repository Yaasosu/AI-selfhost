import React from 'react';
import MdIcon from '../UI/Icon';
import MdIconButton from '../UI/IconButton';
import ErrorBanner from '../UI/ErrorBanner';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

/**
 * Main Chat Area View Component in English
 */
export default function ChatArea({
  isSidebarOpen,
  setIsSidebarOpen,
  isDark,
  setIsDark,
  chatError,
  setChatError,
  messages,
  userName,
  copiedId,
  onCopyText,
  onSuggestionClick,
  messagesEndRef,
  inputText,
  isLoading,
  textareaRef,
  handleTextareaChange,
  handleInputKeyDown,
  handleSendMessage,
  handleStopGeneration,
}) {
  return (
    <main
      style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--md-sys-color-surface)',
      }}
    >
      {/* Floating Control Bar when sidebar is hidden */}
      {!isSidebarOpen && (
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            zIndex: 20,
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <MdIconButton onClick={() => setIsSidebarOpen(true)} title="Show Menu">
            <MdIcon name="menu" />
          </MdIconButton>
          <MdIconButton
            onClick={() => setIsDark((d) => !d)}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            <MdIcon name={isDark ? 'light_mode' : 'dark_mode'} />
          </MdIconButton>
        </div>
      )}

      {/* Error Banner */}
      <ErrorBanner message={chatError} onClose={() => setChatError('')} />

      {/* Message History List */}
      <MessageList
        messages={messages}
        userName={userName}
        copiedId={copiedId}
        onCopyText={onCopyText}
        onSuggestionClick={onSuggestionClick}
        messagesEndRef={messagesEndRef}
      />

      {/* Chat Input Bar */}
      <ChatInput
        inputText={inputText}
        isLoading={isLoading}
        textareaRef={textareaRef}
        handleTextareaChange={handleTextareaChange}
        handleInputKeyDown={handleInputKeyDown}
        handleSendMessage={handleSendMessage}
        handleStopGeneration={handleStopGeneration}
      />
    </main>
  );
}
