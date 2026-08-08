import React from 'react';
import MdIcon from '../UI/Icon';

/**
 * Welcome State Component shown when no messages exist in the active chat (in English)
 */
export default function WelcomeState({ onSuggestionClick }) {
  const suggestions = [
    { text: 'Write a Python script to sort a list', icon: 'code' },
    { text: 'Brainstorm 5 AI startup ideas', icon: 'lightbulb' },
    { text: 'Explain quantum mechanics in simple terms', icon: 'auto_awesome' },
    { text: 'Create a 1-week workout plan for beginners', icon: 'fitness_center' },
  ];

  return (
    <div className="animate-fadeIn" style={{ textAlign: 'center', paddingTop: '3.5rem' }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 'var(--md-shape-2xl)',
          backgroundColor: 'var(--md-sys-color-primary-container)',
          color: 'var(--md-sys-color-on-primary-container)',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--md-elevation-2)',
        }}
      >
        <MdIcon name="auto_awesome" style={{ fontSize: '36px' }} />
      </div>
      <h1
        style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--md-sys-color-on-surface)',
          margin: '0 0 0.5rem',
        }}
      >
        How can I help you today?
      </h1>
      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--md-sys-color-on-surface-variant)',
          marginBottom: '2.5rem',
          lineHeight: 1.6,
        }}
      >
        Ask a question or pick a prompt suggestion below:
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSuggestionClick(s.text)}
            className="animate-fadeIn"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--md-shape-xl)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              animationDelay: `${idx * 0.06}s`,
              backgroundColor: 'var(--md-sys-color-surface-container-low)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              color: 'var(--md-sys-color-on-surface)',
              transition: 'all var(--md-motion-duration) var(--md-motion-easing)',
              boxShadow: 'var(--md-elevation-1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--md-elevation-2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-low)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--md-elevation-1)';
            }}
          >
            <div
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--md-shape-md)',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MdIcon name={s.icon} style={{ fontSize: '22px' }} />
            </div>
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--md-sys-color-on-surface-variant)',
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              {s.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
