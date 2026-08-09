import React, { useRef } from 'react';
import MdIcon from '../UI/Icon';

/**
 * Chat Input Control Bar Component with File Upload support
 */
export default function ChatInput({
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
  const fileInputRef = useRef(null);

  const canSubmit = Boolean(inputText.trim() || attachedFile) && !attachedFile?.isUploading;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div style={{ padding: '0 1.5rem 1rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <form
          onSubmit={handleSendMessage}
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: 'var(--md-shape-2xl)',
            padding: '0.5rem 0.6rem 0.5rem 0.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            boxShadow: 'var(--md-elevation-2)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          {/* File Attachment Rich Preview Card */}
          {attachedFile && (
            <div style={{ padding: '0.2rem 0' }}>
              {(() => {
                const urlStr = attachedFile.previewUrl || attachedFile.url || attachedFile.filename || '';
                const cleanUrl = urlStr.split('?')[0].split('#')[0];
                const mimeType = attachedFile.file?.type || '';
                const isImage =
                  mimeType.startsWith('image/') ||
                  /^data:image\//i.test(urlStr) ||
                  /^blob:/i.test(urlStr) ||
                  /\.(jpg|jpeg|png|webp|gif|svg|bmp|ico|heic|avif)$/i.test(cleanUrl);

                if (isImage) {
                  return (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.4rem 0.75rem 0.4rem 0.4rem',
                        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                        border: '1px solid var(--md-sys-color-outline-variant)',
                        borderRadius: 'var(--md-shape-md)',
                        boxShadow: 'var(--md-elevation-1)',
                      }}
                    >
                      {/* Rendered Image Thumbnail Card */}
                      <div
                        onClick={() => onOpenPreview && onOpenPreview(attachedFile)}
                        title="Click to preview image"
                        style={{
                          position: 'relative',
                          width: 68,
                          height: 52,
                          borderRadius: 'var(--md-shape-xs)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          flexShrink: 0,
                          border: '1px solid var(--md-sys-color-outline-variant)',
                          backgroundColor: '#000000',
                        }}
                      >
                        <img
                          src={attachedFile.previewUrl || attachedFile.url}
                          alt={attachedFile.filename}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {attachedFile.isUploading ? (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.55)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <MdIcon name="sync" className="animate-spin" style={{ color: '#ffffff', fontSize: '18px' }} />
                          </div>
                        ) : (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                            }}
                            className="image-overlay"
                          >
                            <MdIcon name="visibility" style={{ fontSize: '18px' }} />
                          </div>
                        )}
                      </div>

                      {/* Image Details */}
                      <div
                        onClick={() => onOpenPreview && onOpenPreview(attachedFile)}
                        style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', gap: '2px' }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: 'var(--md-sys-color-on-surface)',
                            maxWidth: 180,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {attachedFile.filename}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--md-sys-color-primary)', fontWeight: 500 }}>
                          {attachedFile.isUploading ? 'Uploading image...' : 'Click to enlarge'}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={onRemoveFile}
                        title="Remove image"
                        aria-label="Remove image"
                        style={{
                          border: 'none',
                          backgroundColor: 'var(--md-sys-color-surface-container-high)',
                          color: 'var(--md-sys-color-on-surface-variant)',
                          borderRadius: 'var(--md-shape-full)',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          marginLeft: '0.25rem',
                        }}
                      >
                        <MdIcon name="close" style={{ fontSize: '14px' }} />
                      </button>
                    </div>
                  );
                }

                // Non-image file card
                return (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.4rem 0.75rem 0.4rem 0.5rem',
                      backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                      border: '1px solid var(--md-sys-color-outline-variant)',
                      borderRadius: 'var(--md-shape-md)',
                      fontSize: '0.85rem',
                      color: 'var(--md-sys-color-on-surface)',
                      boxShadow: 'var(--md-elevation-1)',
                    }}
                  >
                    {attachedFile.isUploading ? (
                      <MdIcon name="sync" className="animate-spin" style={{ fontSize: '18px', color: 'var(--md-sys-color-primary)' }} />
                    ) : (
                      <MdIcon name="description" style={{ fontSize: '20px', color: 'var(--md-sys-color-primary)' }} />
                    )}

                    <div
                      onClick={() => onOpenPreview && (attachedFile.url || attachedFile.previewUrl) && onOpenPreview(attachedFile)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: (attachedFile.url || attachedFile.previewUrl) ? 'pointer' : 'default',
                      }}
                    >
                      <span
                        style={{
                          maxWidth: 220,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
                        {attachedFile.filename}
                      </span>
                      {(attachedFile.url || attachedFile.previewUrl) && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--md-sys-color-primary)', fontWeight: 500 }}>
                          Click to preview
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={onRemoveFile}
                      title="Remove file"
                      aria-label="Remove file"
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        borderRadius: 'var(--md-shape-full)',
                        marginLeft: '0.2rem',
                      }}
                    >
                      <MdIcon name="close" style={{ fontSize: '16px' }} />
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Text input and action buttons row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Paperclip File Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
              aria-label="Attach file"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--md-shape-full)',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--md-sys-color-on-surface-variant)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background-color 0.15s',
              }}
            >
              <MdIcon name="attach_file" style={{ fontSize: '20px' }} />
            </button>

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleTextareaChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask anything or attach a file..."
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
                disabled={!canSubmit}
                title="Send message"
                aria-label="Send message"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--md-shape-full)',
                  border: 'none',
                  backgroundColor: canSubmit
                    ? 'var(--md-sys-color-primary)'
                    : 'var(--md-sys-color-surface-container-highest)',
                  color: canSubmit
                    ? 'var(--md-sys-color-on-primary)'
                    : 'var(--md-sys-color-outline)',
                  cursor: canSubmit ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: canSubmit ? 'var(--md-elevation-1)' : 'none',
                  transition: 'all 0.18s var(--md-motion-easing)',
                }}
              >
                <MdIcon name="arrow_upward" style={{ fontSize: '18px', fontWeight: 'bold' }} />
              </button>
            )}
          </div>
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
