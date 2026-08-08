import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';

import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('c++', cpp);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('rs', rust);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('dockerfile', docker);
SyntaxHighlighter.registerLanguage('docker', docker);


/* ─── MATERIAL DESIGN 3 ICONS ───────────────────────────── */
const MdIcon = ({ name, className = '', style = {} }) => (
  <span className={`material-symbols-rounded ${className}`} style={{ fontSize: '20px', userSelect: 'none', ...style }}>
    {name}
  </span>
);

/* ─── MATERIAL DESIGN 3 BUTTONS ─────────────────────────── */
const MdIconButton = ({ onClick, title, children, className = '', disabled = false, style = {} }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`md-icon-btn ${className}`}
    style={{ ...style }}
  >
    {children}
  </button>
);

/* ─── MAIN APP ───────────────────────────────────────────── */
export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [chats, setChats] = useState([]);
  
  const getInitialChatId = () => {
    const hashMatch = window.location.hash.match(/chat=(\d+)/);
    if (hashMatch) return Number(hashMatch[1]);
    const saved = localStorage.getItem('activeChatId');
    return saved ? Number(saved) : null;
  };
  const [activeChatId, setActiveChatId] = useState(getInitialChatId);

  const [messages, setMessages] = useState([]);
  const [models, setModels] = useState({});
  const [selectedModelId, setSelectedModelId] = useState(() => {
    return localStorage.getItem('selectedModelId') || '1';
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [chatError, setChatError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);
  const msgIdCounter = useRef(0);
  const nextId = () => ++msgIdCounter.current;

  const suggestions = [
    { text: 'Write a Python script to sort a list', icon: 'code' },
    { text: 'Brainstorm 5 AI startup ideas', icon: 'lightbulb' },
    { text: 'Explain quantum mechanics in simple terms', icon: 'auto_awesome' },
    { text: 'Create a 1-week workout plan for beginners', icon: 'fitness_center' },
  ];

  // Apply dark class to <html> and save theme preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Persist selected AI model
  useEffect(() => {
    if (selectedModelId) {
      localStorage.setItem('selectedModelId', String(selectedModelId));
    }
  }, [selectedModelId]);

  // Persist active chat ID & update URL hash
  useEffect(() => {
    if (activeChatId !== null && activeChatId !== undefined) {
      localStorage.setItem('activeChatId', String(activeChatId));
      if (!window.location.hash.includes(`chat=${activeChatId}`)) {
        window.history.replaceState(null, '', `#chat=${activeChatId}`);
      }
    } else {
      localStorage.removeItem('activeChatId');
      if (window.location.hash.includes('chat=')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [activeChatId]);

  // Listen to hash changes (e.g. back/forward browser buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hashMatch = window.location.hash.match(/chat=(\d+)/);
      if (hashMatch) {
        const id = Number(hashMatch[1]);
        setActiveChatId(id);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => { checkAuth(); }, []);
  useEffect(() => { if (user) { fetchChats(); fetchModels(); } }, [user]);
  useEffect(() => {
    if (activeChatId) fetchMessages(activeChatId);
    else setMessages([]);
  }, [activeChatId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  /* ── API HANDLERS ── */
  const checkAuth = async () => {
    try {
      const res = await fetch('/users/me', { credentials: 'include' });
      setUser(res.ok ? await res.json() : null);
    } catch { setUser(null); }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!name || !password) { setAuthError('Please fill in all fields'); return; }
    const url = authMode === 'login' ? '/users/login' : '/users/register';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        if (authMode === 'register') {
          setAuthMode('login');
          setAuthError('Registration successful! Please sign in.');
        } else {
          await checkAuth();
        }
      } else {
        setAuthError(data.detail || 'Authentication error');
      }
    } catch {
      setAuthError('Server connection error');
    }
  };

  const handleLogout = async () => {
    try { await fetch('/users/logout', { method: 'POST', credentials: 'include' }); } catch {}
    setUser(null); setChats([]); setActiveChatId(null);
    localStorage.removeItem('activeChatId');
    if (window.location.hash.includes('chat=')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch('/chats/', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const reversed = [...data].reverse();
        setChats(reversed);
        if (reversed.length > 0) {
          setActiveChatId(currentId => {
            if (currentId && reversed.some(c => c.id === currentId)) {
              return currentId;
            }
            return reversed[reversed.length - 1].id;
          });
        }
      }
    } catch { setChatError('Failed to load chats'); }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch('/messages/models', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setModels(data);
        const keys = Object.keys(data);
        if (keys.length > 0) {
          setSelectedModelId(prev => {
            const saved = localStorage.getItem('selectedModelId');
            const target = saved || prev;
            return keys.includes(target) ? target : keys[0];
          });
        }
      }
    } catch { console.error('Failed to load models'); }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await fetch(`/messages/${chatId}/messages`, { credentials: 'include' });
      if (res.ok) setMessages(await res.json());
    } catch { setChatError('Failed to load message history'); }
  };

  const handleCreateChat = async () => {
    try {
      const res = await fetch('/chats/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
        credentials: 'include',
      });
      if (res.ok) {
        const newChat = await res.json();
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    } catch { setChatError('Failed to create chat'); }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat?')) return;
    try {
      const res = await fetch(`/chats/${chatId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setChats(prev => prev.filter(c => c.id !== chatId));
        if (activeChatId === chatId) {
          const remaining = chats.filter(c => c.id !== chatId);
          setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    } catch { setChatError('Failed to delete chat'); }
  };

  const handleStopGeneration = () => { abortControllerRef.current?.abort(); };

  const handleSendMessage = async (e, textToSend = null) => {
    if (e) e.preventDefault();
    const text = textToSend || inputText.trim();
    if (!text || isLoading) return;

    let chatId = activeChatId;
    if (!chatId) {
      try {
        const res = await fetch('/chats/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: text.slice(0, 24) + (text.length > 24 ? '...' : '') }),
          credentials: 'include',
        });
        if (res.ok) {
          const newChat = await res.json();
          setChats(prev => [newChat, ...prev]);
          chatId = newChat.id;
          setActiveChatId(newChat.id);
        } else return;
      } catch { setChatError('Failed to create chat'); return; }
    }

    const userMsgId = nextId();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    const botMsgId = nextId();
    setMessages(prev => [...prev, { id: botMsgId, sender: 'assistant', text: '', streaming: true }]);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/messages/sendmessage/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, ai: parseInt(selectedModelId) }),
        credentials: 'include',
        signal: abortControllerRef.current.signal,
      });
      if (!response.ok) throw new Error('Server error generating response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let botResponseText = '';
      let isFirstChunk = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) throw new Error(data.error);
              const newContent = data.content || '';
              const isPlaceholder = (str) =>
                str.startsWith('Пожалуйста, подождите') ||
                str.startsWith('Please wait') ||
                str.includes('думает');

              if (isFirstChunk && isPlaceholder(newContent)) {
                botResponseText = newContent;
              } else {
                if (isFirstChunk || isPlaceholder(botResponseText)) {
                  botResponseText = newContent;
                  isFirstChunk = false;
                } else {
                  botResponseText += newContent;
                }
              }
              setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: botResponseText } : m));
            } catch {}
          }
        }
      }
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, streaming: false } : m));
      fetchChats();
    } catch (err) {
      if (err.name === 'AbortError') {
        const isPlaceholder = (str) =>
          !str ||
          str.startsWith('Please wait') ||
          str.startsWith('Пожалуйста, подождите') ||
          str.includes('thinking') ||
          str.includes('думает');

        if (isPlaceholder(botResponseText)) {
          setMessages(prev => prev.filter(m => m.id !== botMsgId));
        } else {
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: botResponseText, streaming: false } : m));
        }
        setTimeout(() => {
          fetchChats();
          if (chatId) fetchMessages(chatId);
        }, 400);
      } else {
        setMessages(prev => prev.map(m => m.id === botMsgId
          ? { ...m, text: err.message || 'Network error. Please try again.', streaming: false } : m));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleSuggestionClick = (text) => {
    setInputText(text);
    setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, 50);
  };

  /* ─── AUTH SCREEN (Material Design 3 Card) ─── */
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'var(--md-sys-color-surface)',
        position: 'relative',
      }}>
        {/* Theme toggle */}
        <MdIconButton
          onClick={() => setIsDark(d => !d)}
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
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--md-shape-xl)',
              backgroundColor: 'var(--md-sys-color-primary-container)',
              margin: '0 auto 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--md-elevation-1)',
            }}>
              <span className="blinking-dot-lg" />
            </div>
            <h1 style={{
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--md-sys-color-on-surface)',
              letterSpacing: '-0.02em',
            }}>AI WEBHOST</h1>
            <p style={{
              margin: '0.4rem 0 0',
              fontSize: '0.875rem',
              color: 'var(--md-sys-color-on-surface-variant)',
              fontWeight: 500,
            }}>Your Private AI Assistant</p>
          </div>

          {/* Segmented Button (Tabs) */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--md-sys-color-surface-container-lowest)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: 'var(--md-shape-full)',
            padding: 4,
            marginBottom: '1.5rem',
          }}>
            {['login', 'register'].map(mode => (
              <button
                key={mode}
                onClick={() => { setAuthMode(mode); setAuthError(''); }}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  border: 'none',
                  borderRadius: 'var(--md-shape-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--md-motion-duration) var(--md-motion-easing)',
                  backgroundColor: authMode === mode ? 'var(--md-sys-color-primary-container)' : 'transparent',
                  color: authMode === mode ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                  boxShadow: authMode === mode ? 'var(--md-elevation-1)' : 'none',
                }}
              >
                {mode === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {/* Error / Success Feedback */}
          {authError && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--md-shape-md)',
              fontSize: '0.825rem',
              fontWeight: 500,
              marginBottom: '1.25rem',
              backgroundColor: authError.toLowerCase().includes('successful') ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-error-container)',
              color: authError.toLowerCase().includes('successful') ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-error-container)',
              border: `1px solid ${authError.toLowerCase().includes('successful') ? 'var(--md-sys-color-outline-variant)' : 'var(--md-sys-color-error)'}`,
            }}>
              {authError}
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--md-sys-color-on-surface-variant)',
                marginBottom: '0.4rem',
                letterSpacing: '0.04em',
              }}>
                Username
              </label>
              <input
                type="text"
                className="md-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter username..."
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--md-sys-color-on-surface-variant)',
                marginBottom: '0.4rem',
                letterSpacing: '0.04em',
              }}>
                Password
              </label>
              <input
                type="password"
                className="md-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
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

  /* ─── MAIN INTERFACE (Material Design 3 Layout) ─── */
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--md-sys-color-surface)',
      color: 'var(--md-sys-color-on-surface)',
    }}>

      {/* ── SIDEBAR (Material Design Navigation Drawer) ── */}
      <aside style={{
        position: 'relative',
        zIndex: 10,
        width: isSidebarOpen ? 280 : 0,
        minWidth: isSidebarOpen ? 280 : 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        borderRight: '1px solid var(--md-sys-color-outline-variant)',
        transition: 'width 0.25s var(--md-motion-easing), min-width 0.25s var(--md-motion-easing)',
      }}>
        <div style={{ minWidth: 280, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Drawer Header */}
          <div style={{
            padding: '1.25rem 1.25rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--md-sys-color-outline-variant)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--md-shape-md)',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--md-elevation-1)',
              }}>
                <span className="blinking-dot" />
              </div>
              <span style={{
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '-0.01em',
                color: 'var(--md-sys-color-on-surface)',
              }}>AI WEBHOST</span>
            </div>

            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <MdIconButton
                onClick={() => window.open('http://' + window.location.hostname + ':3000', '_blank')}
                title="Grafana (Metrics)"
                style={{ width: 34, height: 34 }}
              >
                <MdIcon name="monitoring" style={{ fontSize: '18px' }} />
              </MdIconButton>
              <MdIconButton
                onClick={() => setIsDark(d => !d)}
                title={isDark ? 'Light Mode' : 'Dark Mode'}
                style={{ width: 34, height: 34 }}
              >
                <MdIcon name={isDark ? 'light_mode' : 'dark_mode'} style={{ fontSize: '18px' }} />
              </MdIconButton>
              <MdIconButton
                onClick={() => setIsSidebarOpen(false)}
                title="Hide Menu"
                style={{ width: 34, height: 34 }}
              >
                <MdIcon name="menu_open" style={{ fontSize: '18px' }} />
              </MdIconButton>
            </div>
          </div>

          {/* AI Model Selector */}
          <div style={{ padding: '1rem 1.25rem 0.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--md-sys-color-on-surface-variant)',
              marginBottom: '0.4rem',
            }}>
              AI Model
            </label>
            <select
              value={selectedModelId}
              onChange={e => setSelectedModelId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--md-shape-md)',
                fontSize: '0.825rem',
                fontWeight: 500,
                backgroundColor: 'var(--md-sys-color-surface-container-lowest)',
                border: '1px solid var(--md-sys-color-outline)',
                color: 'var(--md-sys-color-on-surface)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {Object.entries(models).map(([id, modelName]) => (
                <option key={id} value={id} style={{ backgroundColor: isDark ? '#1F232B' : '#FFFFFF' }}>{modelName}</option>
              ))}
            </select>
          </div>

          {/* Extended FAB: New Chat Button */}
          <div style={{ padding: '0.5rem 1.25rem 0.75rem' }}>
            <button
              onClick={handleCreateChat}
              className="md-btn-tonal"
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: 'var(--md-shape-xl)',
                fontSize: '0.875rem',
                justifyContent: 'flex-start',
                paddingLeft: '1rem',
              }}
            >
              <MdIcon name="add" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.75rem' }}>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--md-sys-color-outline)',
              padding: '0.5rem 0.5rem 0.35rem',
            }}>
              Chat History
            </div>
            {chats.map(chat => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className="animate-slideIn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--md-shape-full)',
                    marginBottom: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all var(--md-motion-duration) var(--md-motion-easing)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 400,
                    backgroundColor: isActive ? 'var(--md-sys-color-primary-container)' : 'transparent',
                    color: isActive ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                    <MdIcon name="chat_bubble" style={{ fontSize: '16px', opacity: isActive ? 1 : 0.7 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {chat.title}
                    </span>
                  </div>
                  <button
                    onClick={e => handleDeleteChat(chat.id, e)}
                    title="Delete"
                    className="delete-btn"
                    style={{
                      opacity: 0,
                      padding: '0.2rem',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--md-sys-color-error)',
                      cursor: 'pointer',
                      borderRadius: 'var(--md-shape-sm)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <MdIcon name="delete" style={{ fontSize: '16px' }} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* User Footer */}
          <div style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--md-sys-color-outline-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--md-sys-color-surface-container)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--md-shape-full)',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {(user?.user || 'U')[0].toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--md-sys-color-on-surface)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user?.user}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--md-sys-color-outline)' }}>Local Session</div>
              </div>
            </div>
            <MdIconButton onClick={handleLogout} title="Sign Out" style={{ width: 34, height: 34 }}>
              <MdIcon name="logout" style={{ fontSize: '18px' }} />
            </MdIconButton>
          </div>
        </div>
      </aside>

      {/* ── MAIN CHAT AREA ── */}
      <main style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--md-sys-color-surface)',
      }}>

        {/* Floating Top Control Bar (when sidebar is closed) */}
        {!isSidebarOpen && (
          <div style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            zIndex: 20,
            display: 'flex',
            gap: '0.5rem',
          }}>
            <MdIconButton onClick={() => setIsSidebarOpen(true)} title="Show Menu">
              <MdIcon name="menu" />
            </MdIconButton>
            <MdIconButton onClick={() => setIsDark(d => !d)} title={isDark ? 'Light Mode' : 'Dark Mode'}>
              <MdIcon name={isDark ? 'light_mode' : 'dark_mode'} />
            </MdIconButton>
          </div>
        )}

        {/* Error Banner */}
        {chatError && (
          <div style={{
            margin: '1rem 1.5rem 0',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--md-shape-md)',
            fontSize: '0.85rem',
            backgroundColor: 'var(--md-sys-color-error-container)',
            color: 'var(--md-sys-color-on-error-container)',
            border: '1px solid var(--md-sys-color-error)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
          }}>
            <span>{chatError}</span>
            <button onClick={() => setChatError('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>
              <MdIcon name="close" style={{ fontSize: '18px' }} />
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Welcome State (Zero messages) */}
            {messages.length === 0 ? (
              <div className="animate-fadeIn" style={{ textAlign: 'center', paddingTop: '3.5rem' }}>
                <div style={{
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
                }}>
                  <MdIcon name="auto_awesome" style={{ fontSize: '36px' }} />
                </div>
                <h1 style={{
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--md-sys-color-on-surface)',
                  margin: '0 0 0.5rem',
                }}>
                  How can I help you today?
                </h1>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  marginBottom: '2.5rem',
                  lineHeight: 1.6,
                }}>
                  Ask a question or pick a prompt suggestion below:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(s.text)}
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
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--md-elevation-2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-low)';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'var(--md-elevation-1)';
                      }}
                    >
                      <div style={{
                        padding: '0.5rem',
                        borderRadius: 'var(--md-shape-md)',
                        backgroundColor: 'var(--md-sys-color-primary-container)',
                        color: 'var(--md-sys-color-on-primary-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <MdIcon name={s.icon} style={{ fontSize: '22px' }} />
                      </div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.5, fontWeight: 500 }}>
                        {s.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message List */
              messages.map(m => (
                <div key={m.id} className="animate-fadeIn" style={{
                  display: 'flex',
                  gap: '0.85rem',
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                }}>

                  {/* Assistant Avatar */}
                  {m.sender === 'assistant' && (
                    <div style={{
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
                    }}>
                      <MdIcon name="smart_toy" style={{ fontSize: '20px' }} />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div
                    className="message-bubble-wrapper"
                    style={{
                      maxWidth: '82%',
                      padding: '0.85rem 2.5rem 0.85rem 1.25rem',
                      borderRadius: m.sender === 'user'
                        ? 'var(--md-shape-xl) var(--md-shape-xl) var(--md-shape-xs) var(--md-shape-xl)'
                        : 'var(--md-shape-xl) var(--md-shape-xl) var(--md-shape-xl) var(--md-shape-xs)',
                      backgroundColor: m.sender === 'user'
                        ? 'var(--md-sys-color-primary-container)'
                        : 'var(--md-sys-color-surface-container-high)',
                      color: m.sender === 'user'
                        ? 'var(--md-sys-color-on-primary-container)'
                        : 'var(--md-sys-color-on-surface)',
                      border: '1px solid var(--md-sys-color-outline-variant)',
                      boxShadow: 'var(--md-elevation-1)',
                      position: 'relative',
                    }}
                  >
                    {/* Copy Action Button */}
                    {m.text && !m.streaming && (
                      <button
                        onClick={() => handleCopyText(m.id, m.text)}
                        title="Copy message"
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
                        <MdIcon name={copiedId === m.id ? 'check' : 'content_copy'} style={{ fontSize: '15px' }} />
                      </button>
                    )}

                    {/* Markdown Content */}
                    <div style={{ fontSize: '0.9rem', lineHeight: 1.65, wordBreak: 'break-word' }}>
                      {m.streaming && !m.text ? (
                        <span className="animate-blink" style={{
                          display: 'inline-block',
                          width: 8,
                          height: 16,
                          backgroundColor: 'var(--md-sys-color-primary)',
                          borderRadius: 2,
                          verticalAlign: 'middle',
                        }} />
                      ) : (
                        <>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '')
                                const customOneDark = {
                                  ...oneDark,
                                  'pre[class*="language-"]': {
                                    ...oneDark['pre[class*="language-"]'],
                                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                    border: '1px solid var(--md-sys-color-outline-variant)',
                                    borderRadius: 'var(--md-shape-md)',
                                    padding: '1rem 1.25rem',
                                    margin: '0.75rem 0',
                                  },
                                  'code[class*="language-"]': {
                                    ...oneDark['code[class*="language-"]'],
                                    background: 'transparent',
                                    fontFamily: 'var(--font-mono)',
                                    textShadow: 'none',
                                  }
                                };
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    {...props}
                                    children={String(children).replace(/\n$/, '')}
                                    style={customOneDark}
                                    language={match[1]}
                                    PreTag="div"
                                  />
                                ) : (
                                  <code {...props} className={className} style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    padding: '0.25rem 0.45rem',
                                    borderRadius: 'var(--md-shape-xs)',
                                    fontSize: '0.85em',
                                    fontFamily: 'var(--font-mono)',
                                  }}>
                                    {children}
                                  </code>
                                )
                              },
                              p: ({node, ...props}) => <p style={{ margin: '0 0 0.5rem 0' }} {...props} />,
                              ul: ({node, ...props}) => <ul style={{ margin: '0 0 0.5rem 1.5rem', listStyleType: 'disc' }} {...props} />,
                              ol: ({node, ...props}) => <ol style={{ margin: '0 0 0.5rem 1.5rem', listStyleType: 'decimal' }} {...props} />,
                              li: ({node, ...props}) => <li style={{ marginBottom: '0.2rem' }} {...props} />,
                              a: ({node, ...props}) => <a style={{ color: 'var(--md-sys-color-primary)', textDecoration: 'underline' }} {...props} target="_blank" rel="noopener noreferrer" />,
                              strong: ({node, ...props}) => <strong style={{ fontWeight: 700 }} {...props} />,
                              h1: ({node, ...props}) => <h1 style={{ fontSize: '1.35em', fontWeight: 700, margin: '1rem 0 0.5rem' }} {...props} />,
                              h2: ({node, ...props}) => <h2 style={{ fontSize: '1.18em', fontWeight: 700, margin: '0.8rem 0 0.5rem' }} {...props} />,
                              h3: ({node, ...props}) => <h3 style={{ fontSize: '1.05em', fontWeight: 600, margin: '0.6rem 0 0.5rem' }} {...props} />,
                              table: ({node, ...props}) => <div style={{ overflowX: 'auto', margin: '0.5rem 0' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88em' }} {...props} /></div>,
                              th: ({node, ...props}) => <th style={{ borderBottom: '2px solid var(--md-sys-color-outline-variant)', padding: '0.5rem', textAlign: 'left', fontWeight: 700 }} {...props} />,
                              td: ({node, ...props}) => <td style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)', padding: '0.5rem' }} {...props} />,
                              blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid var(--md-sys-color-primary)', margin: '0.5rem 0', paddingLeft: '1rem', fontStyle: 'italic', opacity: 0.9 }} {...props} />,
                            }}
                          >
                            {(() => {
                              if (!m.text) return '';
                              const parts = m.text.split(/(```[\s\S]*?```|`[^`\n]+`)/g);

                              return parts.map(part => {
                                if (part.startsWith('`')) return part;
                                let processed = part;
                                // Convert \[ ... \] block math to $$ ... $$
                                processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, eq) => `$$\n${eq.trim()}\n$$`);
                                // Convert \( ... \) inline math to $ ... $
                                processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, eq) => `$${eq.trim()}$`);
                                return processed;
                              }).join('');
                            })()}
                          </ReactMarkdown>
                          {m.streaming && (
                            <span className="animate-blink" style={{
                              display: 'inline-block',
                              width: 7,
                              height: 15,
                              backgroundColor: 'var(--md-sys-color-primary)',
                              borderRadius: 2,
                              marginLeft: 4,
                              verticalAlign: 'middle',
                            }} />
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {m.sender === 'user' && (
                    <div style={{
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
                    }}>
                      {(user?.user || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── MATERIAL INPUT BAR ── */}
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
                  title="Send"
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
            <p style={{
              textAlign: 'center',
              marginTop: '0.4rem',
              fontSize: '0.7rem',
              color: 'var(--md-sys-color-outline)',
            }}>
              AI Webhost may make mistakes. Verify important info.
            </p>
          </div>
        </div>
      </main>

      {/* Hover reveal delete button */}
      <style>{`
        div:hover > .delete-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
