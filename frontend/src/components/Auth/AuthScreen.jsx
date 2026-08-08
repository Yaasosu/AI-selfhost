import React from 'react';
import MdIcon from '../UI/Icon';
import MdIconButton from '../UI/IconButton';

/**
 * Authentication Screen Component (Login / Register) in English
 */
export default function AuthScreen({
  isDark,
  setIsDark,
  authMode,
  setAuthMode,
  name,
  setName,
  password,
  setPassword,
  authError,
  setAuthError,
  handleAuthSubmit,
}) {
  const isSuccess = authError && authError.toLowerCase().includes('successful');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'var(--md-sys-color-surface)',
        position: 'relative',
      }}
    >
      {/* Theme toggle button */}
      <MdIconButton
        onClick={() => setIsDark((d) => !d)}
        title={isDark ? 'Light Mode' : 'Dark Mode'}
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}
      >
        <MdIcon name={isDark ? 'light_mode' : 'dark_mode'} />
      </MdIconButton>

      {/* Auth card */}
      <div
        className="animate-fadeIn"
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: 'var(--md-sys-color-surface-container-high)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: 'var(--md-shape-2xl)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--md-elevation-3)',
        }}
      >
        {/* Brand Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--md-shape-xl)',
              backgroundColor: 'var(--md-sys-color-primary-container)',
              margin: '0 auto 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--md-elevation-1)',
            }}
          >
            <span className="blinking-dot-lg" />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--md-sys-color-on-surface)',
              letterSpacing: '-0.02em',
            }}
          >
            AI WEBHOST
          </h1>
          <p
            style={{
              margin: '0.4rem 0 0',
              fontSize: '0.875rem',
              color: 'var(--md-sys-color-on-surface-variant)',
              fontWeight: 500,
            }}
          >
            Your Private AI Assistant
          </p>
        </div>

        {/* Segmented Button (Tabs) */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--md-sys-color-surface-container-lowest)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: 'var(--md-shape-full)',
            padding: 4,
            marginBottom: '1.5rem',
          }}
        >
          {[
            { id: 'login', label: 'Login' },
            { id: 'register', label: 'Register' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setAuthMode(id);
                setAuthError('');
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: 'var(--md-shape-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--md-motion-duration) var(--md-motion-easing)',
                backgroundColor:
                  authMode === id ? 'var(--md-sys-color-primary-container)' : 'transparent',
                color:
                  authMode === id
                    ? 'var(--md-sys-color-on-primary-container)'
                    : 'var(--md-sys-color-on-surface-variant)',
                boxShadow: authMode === id ? 'var(--md-elevation-1)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Feedback Message */}
        {authError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--md-shape-md)',
              fontSize: '0.825rem',
              fontWeight: 500,
              marginBottom: '1.25rem',
              backgroundColor: isSuccess
                ? 'var(--md-sys-color-primary-container)'
                : 'var(--md-sys-color-error-container)',
              color: isSuccess
                ? 'var(--md-sys-color-on-primary-container)'
                : 'var(--md-sys-color-on-error-container)',
              border: `1px solid ${
                isSuccess
                  ? 'var(--md-sys-color-outline-variant)'
                  : 'var(--md-sys-color-error)'
              }`,
            }}
          >
            {authError}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              htmlFor="auth-username"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--md-sys-color-on-surface-variant)',
                marginBottom: '0.4rem',
                letterSpacing: '0.04em',
              }}
            >
              Username
            </label>
            <input
              id="auth-username"
              type="text"
              className="md-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter username..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--md-sys-color-on-surface-variant)',
                marginBottom: '0.4rem',
                letterSpacing: '0.04em',
              }}
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className="md-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="md-btn-primary"
            style={{
              marginTop: '0.75rem',
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.95rem',
            }}
          >
            {authMode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
