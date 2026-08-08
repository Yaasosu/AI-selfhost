import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import MdIcon from '../UI/Icon';
import CodeBlock from './CodeBlock';

/**
 * Message Item Bubble Component with ReactMarkdown & Math/Code rendering (in English)
 */
export default function MessageItem({
  message,
  userName,
  copiedId,
  onCopyText,
}) {
  const isUser = message.sender === 'user';
  const isAssistant = message.sender === 'assistant';

  return (
    <div
      className="animate-fadeIn"
      style={{
        display: 'flex',
        gap: '0.85rem',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
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
            flexShrink: 0,
            marginTop: 2,
            boxShadow: 'var(--md-elevation-1)',
          }}
        >
          <MdIcon name="smart_toy" style={{ fontSize: '20px' }} />
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className="message-bubble-wrapper"
        style={{
          maxWidth: '85%',
          padding: '0.85rem 2.5rem 0.85rem 1.25rem',
          borderRadius: isUser
            ? 'var(--md-shape-xl) var(--md-shape-xl) var(--md-shape-xs) var(--md-shape-xl)'
            : 'var(--md-shape-xl) var(--md-shape-xl) var(--md-shape-xl) var(--md-shape-xs)',
          backgroundColor: isUser
            ? 'var(--md-sys-color-primary-container)'
            : 'var(--md-sys-color-surface-container-high)',
          color: isUser
            ? 'var(--md-sys-color-on-primary-container)'
            : 'var(--md-sys-color-on-surface)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          boxShadow: 'var(--md-elevation-1)',
          position: 'relative',
        }}
      >
        {/* Copy Whole Message Button */}
        {message.text && !message.streaming && (
          <button
            type="button"
            onClick={() => onCopyText(message.id, message.text)}
            title="Copy entire message text"
            aria-label="Copy entire message text"
            className="copy-btn"
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
              backgroundColor: 'var(--md-sys-color-surface-container-lowest)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: 'var(--md-shape-full)',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--md-sys-color-on-surface-variant)',
              opacity: 0,
              transition: 'opacity 0.2s, background-color 0.15s',
            }}
          >
            <MdIcon
              name={copiedId === message.id ? 'check' : 'content_copy'}
              style={{ fontSize: '15px' }}
            />
          </button>
        )}

        {/* Markdown Content */}
        <div style={{ fontSize: '0.9rem', lineHeight: 1.65, wordBreak: 'break-word' }}>
          {message.streaming && !message.text ? (
            <span
              className="animate-blink"
              style={{
                display: 'inline-block',
                width: 8,
                height: 16,
                backgroundColor: 'var(--md-sys-color-primary)',
                borderRadius: 2,
                verticalAlign: 'middle',
              }}
            />
          ) : (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isBlock = !inline;

                    if (isBlock) {
                      return (
                        <CodeBlock
                          language={match ? match[1] : ''}
                          value={String(children)}
                        />
                      );
                    }

                    return (
                      <code
                        {...props}
                        className={className}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                          padding: '0.2rem 0.4rem',
                          borderRadius: 'var(--md-shape-xs)',
                          fontSize: '0.85em',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {children}
                      </code>
                    );
                  },
                  p: ({ ...props }) => (
                    <p style={{ margin: '0 0 0.5rem 0' }} {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul
                      style={{ margin: '0 0 0.5rem 1.5rem', listStyleType: 'disc' }}
                      {...props}
                    />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      style={{ margin: '0 0 0.5rem 1.5rem', listStyleType: 'decimal' }}
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => (
                    <li style={{ marginBottom: '0.2rem' }} {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a
                      style={{
                        color: 'var(--md-sys-color-primary)',
                        textDecoration: 'underline',
                      }}
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  strong: ({ ...props }) => (
                    <strong style={{ fontWeight: 700 }} {...props} />
                  ),
                  h1: ({ ...props }) => (
                    <h1
                      style={{
                        fontSize: '1.35em',
                        fontWeight: 700,
                        margin: '1rem 0 0.5rem',
                      }}
                      {...props}
                    />
                  ),
                  h2: ({ ...props }) => (
                    <h2
                      style={{
                        fontSize: '1.18em',
                        fontWeight: 700,
                        margin: '0.8rem 0 0.5rem',
                      }}
                      {...props}
                    />
                  ),
                  h3: ({ ...props }) => (
                    <h3
                      style={{
                        fontSize: '1.05em',
                        fontWeight: 600,
                        margin: '0.6rem 0 0.5rem',
                      }}
                      {...props}
                    />
                  ),
                  table: ({ ...props }) => (
                    <div style={{ overflowX: 'auto', margin: '0.5rem 0' }}>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.88em',
                        }}
                        {...props}
                      />
                    </div>
                  ),
                  th: ({ ...props }) => (
                    <th
                      style={{
                        borderBottom: '2px solid var(--md-sys-color-outline-variant)',
                        padding: '0.5rem',
                        textAlign: 'left',
                        fontWeight: 700,
                      }}
                      {...props}
                    />
                  ),
                  td: ({ ...props }) => (
                    <td
                      style={{
                        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                        padding: '0.5rem',
                      }}
                      {...props}
                    />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote
                      style={{
                        borderLeft: '4px solid var(--md-sys-color-primary)',
                        margin: '0.5rem 0',
                        paddingLeft: '1rem',
                        fontStyle: 'italic',
                        opacity: 0.9,
                      }}
                      {...props}
                    />
                  ),
                }}
              >
                {(() => {
                  if (!message.text) return '';
                  const parts = message.text.split(/(```[\s\S]*?```|`[^`\n]+`)/g);

                  return parts
                    .map((part) => {
                      if (part.startsWith('`')) return part;
                      let processed = part;
                      // Convert \[ ... \] block math to $$ ... $$
                      processed = processed.replace(
                        /\\\[([\s\S]*?)\\\]/g,
                        (_, eq) => `$$\n${eq.trim()}\n$$`
                      );
                      // Convert \( ... \) inline math to $ ... $
                      processed = processed.replace(
                        /\\\(([\s\S]*?)\\\)/g,
                        (_, eq) => `$${eq.trim()}$`
                      );
                      return processed;
                    })
                    .join('');
                })()}
              </ReactMarkdown>
              {message.streaming && (
                <span
                  className="animate-blink"
                  style={{
                    display: 'inline-block',
                    width: 7,
                    height: 15,
                    backgroundColor: 'var(--md-sys-color-primary)',
                    borderRadius: 2,
                    marginLeft: 4,
                    verticalAlign: 'middle',
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--md-shape-full)',
            backgroundColor: 'var(--md-sys-color-surface-container-highest)',
            color: 'var(--md-sys-color-on-surface-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            flexShrink: 0,
            marginTop: 2,
            boxShadow: 'var(--md-elevation-1)',
          }}
        >
          {(userName || 'U')[0].toUpperCase()}
        </div>
      )}
    </div>
  );
}
