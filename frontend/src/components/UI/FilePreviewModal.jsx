import React, { useState, useEffect } from 'react';
import MdIcon from './Icon';

/**
 * File Preview Modal Component
 * Renders image lightbox, text/code viewer, audio/video player, or document preview overlay
 * directly in the app background without opening a new browser tab.
 */
export default function FilePreviewModal({ file, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [textContent, setTextContent] = useState(null);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [textError, setTextError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Normalize file input (object or string URL)
  const url = typeof file === 'string' ? file : file?.url || file?.previewUrl;
  const fileName = typeof file === 'string'
    ? file.split('/').pop()
    : file?.filename || file?.name || (url ? url.split('/').pop() : 'Attachment');

  const cleanUrl = (url || '').split('?')[0].split('#')[0];
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  const mimeType = (typeof file === 'object' ? file?.file?.type || file?.type : '') || '';
  const isImage =
    mimeType.startsWith('image/') ||
    /^data:image\//i.test(url || '') ||
    /^blob:/i.test(url || '') ||
    /\.(jpg|jpeg|png|webp|gif|svg|bmp|ico|heic|avif)$/i.test(cleanUrl);

  const isVideo = mimeType.startsWith('video/') || /\.(mp4|webm|ogv|mov)$/i.test(cleanUrl);
  const isAudio = mimeType.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac)$/i.test(cleanUrl);
  const isPdf = mimeType === 'application/pdf' || /\.pdf$/i.test(cleanUrl);
  const isText =
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    /\.(txt|json|js|jsx|ts|tsx|py|html|css|md|csv|log|xml|sh|yml|yaml|sql|env)$/i.test(cleanUrl);

  // Fetch text file content if text preview is applicable and url is remote/local endpoint
  useEffect(() => {
    if (isText && url && !textContent) {
      setIsLoadingText(true);
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.text();
        })
        .then((text) => {
          setTextContent(text);
          setIsLoadingText(false);
        })
        .catch((err) => {
          console.error('Failed to load text preview:', err);
          setTextError('Failed to load text content');
          setIsLoadingText(false);
        });
    }
  }, [isText, url, textContent]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      {/* Modal Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: isImage ? '920px' : '820px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--md-sys-color-surface-container-high)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: 'var(--md-shape-2xl)',
          boxShadow: 'var(--md-elevation-4)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid var(--md-sys-color-outline-variant)',
            backgroundColor: 'var(--md-sys-color-surface-container-highest)',
          }}
        >
          {/* File Name & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--md-shape-sm)',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MdIcon
                name={
                  isImage
                    ? 'image'
                    : isVideo
                    ? 'videocam'
                    : isAudio
                    ? 'audiotrack'
                    : isPdf
                    ? 'picture_as_pdf'
                    : isText
                    ? 'description'
                    : 'insert_drive_file'
                }
                style={{ fontSize: '20px' }}
              />
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: 'var(--md-sys-color-on-surface)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '380px',
              }}
            >
              {fileName}
            </span>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Zoom Controls for Images */}
            {isImage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  marginRight: '0.5rem',
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  borderRadius: 'var(--md-shape-full)',
                  padding: '2px 6px',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                }}
              >
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom out"
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4,
                  }}
                >
                  <MdIcon name="zoom_out" style={{ fontSize: '18px' }} />
                </button>
                <span
                  onClick={handleResetZoom}
                  title="Reset zoom"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minWidth: 36,
                    textAlign: 'center',
                    color: 'var(--md-sys-color-on-surface)',
                  }}
                >
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom in"
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4,
                  }}
                >
                  <MdIcon name="zoom_in" style={{ fontSize: '18px' }} />
                </button>
              </div>
            )}

            {/* Copy Link Button */}
            {url && (
              <button
                type="button"
                onClick={handleCopyLink}
                title={copiedLink ? 'Link copied!' : 'Copy link'}
                aria-label="Copy link"
                className="md-icon-btn"
                style={{ width: 34, height: 34 }}
              >
                <MdIcon name={copiedLink ? 'check' : 'link'} style={{ fontSize: '18px' }} />
              </button>
            )}

            {/* Download Button */}
            {url && (
              <button
                type="button"
                onClick={handleDownload}
                title="Download file"
                aria-label="Download file"
                className="md-icon-btn"
                style={{ width: 34, height: 34 }}
              >
                <MdIcon name="download" style={{ fontSize: '18px' }} />
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close modal"
              className="md-icon-btn"
              style={{
                width: 34,
                height: 34,
                backgroundColor: 'var(--md-sys-color-error-container)',
                color: 'var(--md-sys-color-on-error-container)',
                border: 'none',
              }}
            >
              <MdIcon name="close" style={{ fontSize: '18px' }} />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--md-sys-color-surface)',
            minHeight: '260px',
          }}
        >
          {/* 1. Image Lightbox View */}
          {isImage && (
            <div
              style={{
                overflow: 'auto',
                maxWidth: '100%',
                maxHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={url}
                alt={fileName}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                  maxWidth: '100%',
                  maxHeight: '68vh',
                  objectFit: 'contain',
                  borderRadius: 'var(--md-shape-md)',
                  boxShadow: 'var(--md-elevation-2)',
                }}
              />
            </div>
          )}

          {/* 2. Video Player View */}
          {isVideo && (
            <video
              controls
              autoPlay
              src={url}
              style={{
                maxWidth: '100%',
                maxHeight: '68vh',
                borderRadius: 'var(--md-shape-md)',
                outline: 'none',
              }}
            />
          )}

          {/* 3. Audio Player View */}
          {isAudio && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '2rem',
                width: '100%',
                maxWidth: '460px',
                backgroundColor: 'var(--md-sys-color-surface-container)',
                borderRadius: 'var(--md-shape-xl)',
                border: '1px solid var(--md-sys-color-outline-variant)',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 'var(--md-shape-full)',
                  backgroundColor: 'var(--md-sys-color-primary-container)',
                  color: 'var(--md-sys-color-on-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--md-elevation-2)',
                }}
              >
                <MdIcon name="graphic_eq" style={{ fontSize: '36px' }} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '1rem', textAlign: 'center' }}>
                {fileName}
              </span>
              <audio controls src={url} style={{ width: '100%' }} />
            </div>
          )}

          {/* 4. Text / Code File View */}
          {isText && (
            <div style={{ width: '100%', height: '100%', maxHeight: '68vh', display: 'flex', flexDirection: 'column' }}>
              {isLoadingText ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 'auto' }}>
                  <MdIcon name="sync" className="animate-spin" style={{ color: 'var(--md-sys-color-primary)' }} />
                  <span>Loading file preview...</span>
                </div>
              ) : textError ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--md-sys-color-error)' }}>
                  <p>{textError}</p>
                  <button type="button" onClick={handleDownload} className="md-btn-tonal">
                    Download File to View
                  </button>
                </div>
              ) : (
                <pre
                  style={{
                    margin: 0,
                    padding: '1rem',
                    backgroundColor: 'var(--md-sys-color-surface-container-lowest)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    borderRadius: 'var(--md-shape-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: 'var(--md-sys-color-on-surface)',
                    maxHeight: '64vh',
                  }}
                >
                  <code>{textContent}</code>
                </pre>
              )}
            </div>
          )}

          {/* 5. PDF Document View */}
          {isPdf && (
            <iframe
              src={url}
              title={fileName}
              style={{
                width: '100%',
                height: '68vh',
                border: 'none',
                borderRadius: 'var(--md-shape-md)',
              }}
            />
          )}

          {/* 6. Generic File Fallback View */}
          {!isImage && !isVideo && !isAudio && !isText && !isPdf && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 'var(--md-shape-full)',
                  backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                  color: 'var(--md-sys-color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MdIcon name="insert_drive_file" style={{ fontSize: '32px' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1.05rem', fontWeight: 600 }}>
                  {fileName}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.75 }}>
                  Extension: .{ext.toUpperCase() || 'FILE'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="md-btn-primary"
                style={{ marginTop: '0.5rem' }}
              >
                <MdIcon name="download" style={{ fontSize: '18px' }} />
                Download File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
