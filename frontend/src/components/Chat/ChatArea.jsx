import React, { useState, useRef } from 'react';
import MdIcon from '../UI/Icon';
import MdIconButton from '../UI/IconButton';
import ErrorBanner from '../UI/ErrorBanner';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

/**
 * Main Chat Area View Component with Drag-and-Drop and File Upload support
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
  attachedFile,
  onFileUpload,
  onRemoveFile,
  onOpenPreview,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <main
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div
          style={{
            position: 'absolute',
            inset: '0.75rem',
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            border: '2px dashed var(--md-sys-color-primary)',
            borderRadius: 'var(--md-shape-xl)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.18s ease-out',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--md-shape-full)',
              backgroundColor: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--md-elevation-3)',
            }}
          >
            <MdIcon name="cloud_upload" style={{ fontSize: '32px' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>
              Drop file to attach
            </h3>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              Images and documents will be uploaded automatically
            </p>
          </div>
        </div>
      )}

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
        onOpenPreview={onOpenPreview}
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
        attachedFile={attachedFile}
        onFileUpload={onFileUpload}
        onRemoveFile={onRemoveFile}
        onOpenPreview={onOpenPreview}
      />
    </main>
  );
}
