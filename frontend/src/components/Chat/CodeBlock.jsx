import React, { useState } from 'react';
import { SyntaxHighlighter, oneDark } from '../../utils/syntaxLanguages';
import MdIcon from '../UI/Icon';

/**
 * Dedicated Code Block Component with per-block code copy functionality (in English)
 */
export default function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const customOneDark = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: 0,
      padding: '0.85rem 1rem',
      margin: 0,
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: 'transparent',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.85rem',
      lineHeight: '1.5',
      textShadow: 'none',
    },
  };

  const displayLang = (language || 'code').toLowerCase();

  return (
    <div
      style={{
        margin: '0.85rem 0',
        borderRadius: 'var(--md-shape-md)',
        overflow: 'hidden',
        border: '1px solid var(--md-sys-color-outline-variant)',
        backgroundColor: '#1E1E2E',
        boxShadow: 'var(--md-elevation-1)',
      }}
    >
      {/* Code Block Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 0.85rem',
          backgroundColor: '#181825',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#A6ADC8', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <MdIcon name="terminal" style={{ fontSize: '15px' }} />
          <span style={{ fontWeight: 600, textTransform: 'lowercase' }}>{displayLang}</span>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          title="Copy code block"
          aria-label="Copy code block"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--md-shape-xs)',
            backgroundColor: copied ? '#313244' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: copied ? '#A6E3A1' : '#CDD6F4',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 500,
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={(e) => {
            if (!copied) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          }}
          onMouseLeave={(e) => {
            if (!copied) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          <MdIcon name={copied ? 'check' : 'content_copy'} style={{ fontSize: '14px' }} />
          <span>{copied ? 'Copied!' : 'Copy code'}</span>
        </button>
      </div>

      {/* Highlighted Code */}
      <div style={{ overflowX: 'auto' }}>
        <SyntaxHighlighter
          language={language || 'text'}
          style={customOneDark}
          PreTag="div"
        >
          {String(value).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
