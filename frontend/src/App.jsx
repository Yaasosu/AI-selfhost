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


/* ─── ICONS ─────────────────────────────────────────────── */
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconMenu = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="6 11 12 5 18 11"/>
  </svg>
);
const IconStop = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="3"/>
  </svg>
);
const IconCopy = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconChart = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconSun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

/* ─── GLASS BUTTON ───────────────────────────────────────── */
const GlassBtn = ({ onClick, title, children, className = '', type = 'button', disabled = false, style = {} }) => (
  <button
    type={type}
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={className}
    style={{
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
      backdropFilter: 'blur(40px) saturate(200%)',
      WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      color: 'var(--text-primary)',
      cursor: disabled ? 'default' : 'pointer',
      transition: 'all 0.18s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--glass-bg-hover)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass-bg)'; }}
  >
    {children}
  </button>
);

/* ─── MAIN APP ───────────────────────────────────────────── */
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [models, setModels] = useState({});
  const [selectedModelId, setSelectedModelId] = useState('1');

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
    { text: 'Напиши код для сортировки списка на Python', icon: '🐍' },
    { text: 'Придумай 5 идей для IT-стартапа с ИИ', icon: '💡' },
    { text: 'Объясни квантовую теорию простыми словами', icon: '🌌' },
    { text: 'Составь недельный план тренировок для начинающего', icon: '💪' },
  ];

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => { checkAuth(); }, []);
  useEffect(() => { if (user) { fetchChats(); fetchModels(); } }, [user]);
  useEffect(() => {
    if (activeChatId) fetchMessages(activeChatId);
    else setMessages([]);
  }, [activeChatId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  /* ── API ── */
  const checkAuth = async () => {
    try {
      const res = await fetch('/users/me', { credentials: 'include' });
      setUser(res.ok ? await res.json() : null);
    } catch { setUser(null); }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!name || !password) { setAuthError('Заполните все поля'); return; }
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
        if (authMode === 'register') { setAuthMode('login'); setAuthError('Регистрация успешна! Войдите в аккаунт.'); }
        else await checkAuth();
      } else { setAuthError(data.detail || 'Ошибка авторизации'); }
    } catch { setAuthError('Ошибка подключения к серверу'); }
  };

  const handleLogout = async () => {
    try { await fetch('/users/logout', { method: 'POST', credentials: 'include' }); } catch {}
    setUser(null); setChats([]); setActiveChatId(null);
  };

  const fetchChats = async () => {
    try {
      const res = await fetch('/chats/', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setChats([...data].reverse());
        if (data.length > 0 && !activeChatId) setActiveChatId(data[data.length - 1].id);
      }
    } catch { setChatError('Не удалось загрузить список чатов'); }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch('/messages/models', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setModels(data);
        const keys = Object.keys(data);
        if (keys.length > 0) setSelectedModelId(keys[0]);
      }
    } catch { console.error('Ошибка загрузки моделей'); }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await fetch(`/messages/${chatId}/messages`, { credentials: 'include' });
      if (res.ok) setMessages(await res.json());
    } catch { setChatError('Не удалось загрузить историю сообщений'); }
  };

  const handleCreateChat = async () => {
    try {
      const res = await fetch('/chats/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Новый чат' }),
        credentials: 'include',
      });
      if (res.ok) {
        const newChat = await res.json();
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    } catch { setChatError('Ошибка создания чата'); }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!window.confirm('Удалить этот чат?')) return;
    try {
      const res = await fetch(`/chats/${chatId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setChats(prev => prev.filter(c => c.id !== chatId));
        if (activeChatId === chatId) {
          const remaining = chats.filter(c => c.id !== chatId);
          setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    } catch { setChatError('Ошибка удаления чата'); }
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
          body: JSON.stringify({ title: text.slice(0, 20) + (text.length > 20 ? '...' : '') }),
          credentials: 'include',
        });
        if (res.ok) {
          const newChat = await res.json();
          setChats(prev => [newChat, ...prev]);
          chatId = newChat.id;
          setActiveChatId(newChat.id);
        } else return;
      } catch { setChatError('Не удалось создать чат'); return; }
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
      if (!response.ok) throw new Error('Ошибка сервера при генерации ответа');

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
              if (isFirstChunk && newContent.startsWith('Пожалуйста, подождите')) {
                botResponseText = newContent;
              } else {
                if (isFirstChunk || botResponseText.startsWith('Пожалуйста, подождите')) {
                  botResponseText = newContent; isFirstChunk = false;
                } else { botResponseText += newContent; }
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
        setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, streaming: false } : m));
      } else {
        setMessages(prev => prev.map(m => m.id === botMsgId
          ? { ...m, text: err.message || 'Ошибка сети. Попробуйте ещё раз.', streaming: false } : m));
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
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

  /* ─── STYLES ────────────────────────────────────────── */
  const glassStyle = {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    border: '1px solid var(--glass-border)',
    boxShadow: 'var(--glass-shadow)',
  };
  const glassLgStyle = { ...glassStyle, boxShadow: 'var(--glass-shadow-lg)' };

  /* ─── AUTH SCREEN ───────────────────────────────────── */
  if (!user) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        {/* Background */}
        <div className="bg-scene">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(d => !d)}
          title={isDark ? 'Светлая тема' : 'Тёмная тема'}
          style={{ ...glassStyle, position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10, width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
        >
          {isDark ? <IconSun /> : <IconMoon />}
        </button>

        {/* Auth card */}
        <div style={{ ...glassLgStyle, position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, borderRadius: 24, padding: '2rem', transition: 'all 0.3s ease' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--accent)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,122,255,0.4)', fontSize: 26 }}>
              🤖
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>AISLOP</h1>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Ваш приватный ИИ-помощник</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--glass-bg)', border: '1px solid var(--glass-border-subtle)', borderRadius: 9999, padding: 3, marginBottom: '1.25rem' }}>
            {['login', 'register'].map(mode => (
              <button
                key={mode}
                onClick={() => { setAuthMode(mode); setAuthError(''); }}
                style={{
                  flex: 1, padding: '0.5rem', border: 'none', borderRadius: 9999, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
                  background: authMode === mode ? 'var(--glass-bg-active)' : 'transparent',
                  boxShadow: authMode === mode ? 'var(--glass-shadow)' : 'none',
                  color: authMode === mode ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: authMode === mode ? '1px solid var(--glass-border)' : '1px solid transparent',
                }}
              >
                {mode === 'login' ? 'Вход' : 'Регистрация'}
              </button>
            ))}
          </div>

          {/* Error / Success */}
          {authError && (
            <div style={{
              padding: '0.625rem 0.875rem', borderRadius: 12, fontSize: '0.78rem', marginBottom: '1rem',
              background: authError.includes('успешна') ? 'rgba(52,199,89,0.15)' : 'var(--danger-glass)',
              border: `1px solid ${authError.includes('успешна') ? 'rgba(52,199,89,0.35)' : 'rgba(255,59,48,0.35)'}`,
              color: authError.includes('успешна') ? '#1a7f37' : 'var(--danger)',
            }}>
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Имя пользователя', type: 'text', value: name, onChange: e => setName(e.target.value), placeholder: 'Введите имя...' },
              { label: 'Пароль', type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: '••••••••' },
            ].map(field => (
              <div key={field.label}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  required
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: 9999, fontSize: '0.88rem',
                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border-subtle)',
                    color: 'var(--text-primary)', outline: 'none', transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.border = '1px solid var(--accent-border)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glass)'; }}
                  onBlur={e => { e.target.style.border = '1px solid var(--glass-border-subtle)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            ))}
            <button
              type="submit"
              style={{
                marginTop: '0.5rem', padding: '0.75rem', borderRadius: 9999, border: 'none', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                background: 'var(--accent)', color: '#fff', boxShadow: '0 6px 20px rgba(0,122,255,0.38)', transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'none'; }}
            >
              {authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ─── MAIN INTERFACE ────────────────────────────────── */
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Animated Background */}
      <div className="bg-scene">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* ── SIDEBAR ── */}
      <aside style={{
        ...glassStyle,
        position: 'relative', zIndex: 10,
        width: isSidebarOpen ? 260 : 0,
        minWidth: isSidebarOpen ? 260 : 0,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--glass-border)',
        borderRadius: 0,
        transition: 'width 0.3s ease, min-width 0.3s ease',
        background: 'var(--glass-bg)',
      }}>
        <div style={{ minWidth: 260, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Sidebar Header */}
          <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid var(--glass-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)', animation: 'blink 3s ease-in-out infinite' }} />
              <span style={{ fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.08em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>AISLOP</span>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {/* Grafana placeholder */}
              <GlassBtn onClick={() => window.open('http://' + window.location.hostname + ':3000', '_blank')} title="Grafana (Метрики)" style={{ width: 30, height: 30, borderRadius: '50%' }}>
                <IconChart />
              </GlassBtn>
              {/* Theme toggle */}
              <GlassBtn onClick={() => setIsDark(d => !d)} title={isDark ? 'Светлая тема' : 'Тёмная тема'} style={{ width: 30, height: 30, borderRadius: '50%' }}>
                {isDark ? <IconSun /> : <IconMoon />}
              </GlassBtn>
              {/* Close sidebar */}
              <GlassBtn onClick={() => setIsSidebarOpen(false)} title="Скрыть" style={{ width: 30, height: 30, borderRadius: '50%' }}>
                <IconMenu />
              </GlassBtn>
            </div>
          </div>

          {/* Model selector */}
          <div style={{ padding: '0.75rem 1rem 0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>
              Модель ИИ
            </label>
            <select
              value={selectedModelId}
              onChange={e => setSelectedModelId(e.target.value)}
              style={{
                width: '100%', padding: '0.45rem 0.75rem', borderRadius: 9999, fontSize: '0.78rem',
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border-subtle)',
                color: 'var(--text-primary)', outline: 'none', cursor: 'pointer',
              }}
            >
              {Object.entries(models).map(([id, modelName]) => (
                <option key={id} value={id} style={{ background: isDark ? '#1a2035' : '#f0f4f8' }}>{modelName}</option>
              ))}
            </select>
          </div>

          {/* New chat button */}
          <div style={{ padding: '0.25rem 0.75rem 0.5rem' }}>
            <button
              onClick={handleCreateChat}
              style={{
                width: '100%', padding: '0.55rem', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 600,
                border: '1px solid var(--accent-border)', background: 'var(--accent-glass)',
                color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-glass)'; e.currentTarget.style.color = 'var(--accent)'; }}
            >
              <IconPlus /> Новый чат
            </button>
          </div>

          {/* Chat list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.25rem 0.5rem' }}>
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className="animate-slideIn"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem', borderRadius: 9999, marginBottom: '0.2rem',
                  cursor: 'pointer', transition: 'all 0.16s ease', fontSize: '0.8rem',
                  background: chat.id === activeChatId ? 'var(--glass-bg-active)' : 'transparent',
                  border: `1px solid ${chat.id === activeChatId ? 'var(--glass-border)' : 'transparent'}`,
                  color: chat.id === activeChatId ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: chat.id === activeChatId ? 600 : 400,
                  boxShadow: chat.id === activeChatId ? 'var(--glass-shadow)' : 'none',
                }}
                onMouseEnter={e => { if (chat.id !== activeChatId) e.currentTarget.style.background = 'var(--glass-bg-hover)'; }}
                onMouseLeave={e => { if (chat.id !== activeChatId) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '0.5rem' }}>
                  {chat.title}
                </span>
                <button
                  onClick={e => handleDeleteChat(chat.id, e)}
                  title="Удалить"
                  style={{
                    opacity: 0, padding: '0.2rem', border: 'none', background: 'transparent',
                    color: 'var(--danger)', cursor: 'pointer', borderRadius: 6, transition: 'opacity 0.15s',
                    display: 'flex', alignItems: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.parentElement.querySelector('button').style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0'; }}
                  className="delete-btn"
                >
                  <IconTrash />
                </button>
              </div>
            ))}
          </div>

          {/* User footer */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--glass-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-glass)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                {(user?.user || 'U')[0].toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.user}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Локальная сессия</div>
              </div>
            </div>
            <GlassBtn onClick={handleLogout} title="Выйти" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }}>
              <IconLogout />
            </GlassBtn>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <main style={{ position: 'relative', zIndex: 5, flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Top bar when sidebar is closed */}
        {!isSidebarOpen && (
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 20, display: 'flex', gap: '0.4rem' }}>
            <GlassBtn onClick={() => setIsSidebarOpen(true)} title="Показать меню"
              style={{ width: 36, height: 36, borderRadius: '50%', ...glassStyle }}>
              <IconMenu />
            </GlassBtn>
            <GlassBtn onClick={() => setIsDark(d => !d)} title={isDark ? 'Светлая тема' : 'Тёмная тема'}
              style={{ width: 36, height: 36, borderRadius: '50%', ...glassStyle }}>
              {isDark ? <IconSun /> : <IconMoon />}
            </GlassBtn>
          </div>
        )}

        {/* Error banner */}
        {chatError && (
          <div style={{
            margin: '0.75rem 1.5rem 0', padding: '0.6rem 0.9rem', borderRadius: 12, fontSize: '0.78rem',
            background: 'var(--danger-glass)', border: '1px solid rgba(255,59,48,0.3)', color: 'var(--danger)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{chatError}</span>
            <button onClick={() => setChatError('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>×</button>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 0' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {messages.length === 0 ? (
              <div className="animate-fadeIn" style={{ textAlign: 'center', paddingTop: '3rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  AISLOP AI
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Быстрый приватный ИИ-помощник. Задайте любой вопрос или выберите шаблон:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(s.text)}
                      className="animate-fadeIn"
                      style={{
                        ...glassStyle, padding: '1rem', borderRadius: 16, textAlign: 'left',
                        cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                        animationDelay: `${idx * 0.07}s`, border: '1px solid var(--glass-border)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-bg-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow-lg)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className="animate-fadeIn" style={{ display: 'flex', gap: '0.75rem', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>

                  {/* AI avatar */}
                  {m.sender === 'assistant' && (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-glass)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>
                      AI
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className="message-bubble-wrapper"
                    style={{
                      ...glassStyle,
                      maxWidth: '78%', padding: '0.75rem 2.2rem 0.75rem 1rem', borderRadius: m.sender === 'user' ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
                      background: m.sender === 'user' ? 'var(--accent-glass)' : 'var(--glass-bg)',
                      border: m.sender === 'user' ? '1px solid var(--accent-border)' : '1px solid var(--glass-border)',
                      position: 'relative',
                    }}
                  >
                    {/* Copy Button */}
                    {m.text && !m.streaming && (
                      <button
                        onClick={() => handleCopyText(m.id, m.text)}
                        title="Копировать сообщение"
                        className="copy-btn"
                        style={{
                          position: 'absolute',
                          right: '0.4rem',
                          top: '0.4rem',
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid var(--glass-border-subtle)',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)',
                          opacity: 0,
                          transition: 'opacity 0.2s, background-color 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        {copiedId === m.id ? <IconCheck /> : <IconCopy />}
                      </button>
                    )}
                    <div style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                      {m.streaming && !m.text ? (
                        <span className="animate-blink" style={{ display: 'inline-block', width: 6, height: 14, background: 'var(--accent)', borderRadius: 2, verticalAlign: 'middle' }} />
                      ) : (
                        <>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '')
                                // Use custom styles to merge oneDark nicely and override background/font
                                const customOneDark = {
                                  ...oneDark,
                                  'pre[class*="language-"]': {
                                    ...oneDark['pre[class*="language-"]'],
                                    background: 'rgba(20, 25, 40, 0.65)',
                                    border: '1px solid var(--glass-border-subtle)',
                                    borderRadius: '14px',
                                    padding: '1rem 1.25rem',
                                    margin: '0.75rem 0',
                                  },
                                  'code[class*="language-"]': {
                                    ...oneDark['code[class*="language-"]'],
                                    background: 'transparent',
                                    fontFamily: '"JetBrains Mono", monospace',
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
                                  <code {...props} className={className} style={{ background: 'rgba(0,0,0,0.15)', padding: '0.2rem 0.4rem', borderRadius: '6px', fontSize: '0.85em', fontFamily: '"JetBrains Mono", monospace' }}>
                                    {children}
                                  </code>
                                )
                              },
                              p: ({node, ...props}) => <p style={{ margin: '0 0 0.5rem 0' }} {...props} />,
                              ul: ({node, ...props}) => <ul style={{ margin: '0 0 0.5rem 1.5rem', listStyleType: 'disc' }} {...props} />,
                              ol: ({node, ...props}) => <ol style={{ margin: '0 0 0.5rem 1.5rem', listStyleType: 'decimal' }} {...props} />,
                              li: ({node, ...props}) => <li style={{ marginBottom: '0.2rem' }} {...props} />,
                              a: ({node, ...props}) => <a style={{ color: 'var(--accent)', textDecoration: 'underline' }} {...props} target="_blank" rel="noopener noreferrer" />,
                              strong: ({node, ...props}) => <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }} {...props} />,
                              h1: ({node, ...props}) => <h1 style={{ fontSize: '1.4em', fontWeight: 700, margin: '1rem 0 0.5rem' }} {...props} />,
                              h2: ({node, ...props}) => <h2 style={{ fontSize: '1.2em', fontWeight: 700, margin: '0.8rem 0 0.5rem' }} {...props} />,
                              h3: ({node, ...props}) => <h3 style={{ fontSize: '1.1em', fontWeight: 600, margin: '0.6rem 0 0.5rem' }} {...props} />,
                              table: ({node, ...props}) => <div style={{ overflowX: 'auto', margin: '0.5rem 0' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }} {...props} /></div>,
                              th: ({node, ...props}) => <th style={{ borderBottom: '1px solid var(--glass-border)', padding: '0.5rem', textAlign: 'left', fontWeight: 600 }} {...props} />,
                              td: ({node, ...props}) => <td style={{ borderBottom: '1px solid var(--glass-border-subtle)', padding: '0.5rem' }} {...props} />,
                              blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '3px solid var(--accent)', margin: '0.5rem 0', paddingLeft: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic' }} {...props} />,
                            }}
                          >
                            {(() => {
                              if (!m.text) return '';
                              // Protect code blocks (```code``` or `code`) from math parsing
                              const parts = m.text.split(/(\`\`\`[\s\S]*?\`\`\`|\`[^\`\n]+\`)/g);
                              const mathKeywords = /\\frac|\\sqrt|\\sin|\\cos|\\tan|\\theta|\\alpha|\\beta|\\gamma|\\infty|\^|_|\\circ|\\approx|\\cdot|\\times|\\div|\\le|\\ge|\\neq|\\pm|\\to|\\pi/i;

                              return parts.map(part => {
                                // If it is a code block, leave it untouched
                                if (part.startsWith('`')) return part;

                                // Translate LaTeX delimiters only outside code blocks
                                let processed = part;
                                processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, eq) => `$$\n${eq}\n$$`);
                                processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, eq) => `$${eq}$`);
                                processed = processed.replace(/\[([\s\S]*?)\]/g, (match, eq) => {
                                  if (mathKeywords.test(eq)) return `$$\n${eq}\n$$`;
                                  return match;
                                });
                                processed = processed.replace(/\(([\s\S]*?)\)/g, (match, eq) => {
                                  if (mathKeywords.test(eq)) return `$${eq}$`;
                                  return match;
                                });
                                return processed;
                              }).join('');
                            })()}
                          </ReactMarkdown>
                          {m.streaming && (
                            <span className="animate-blink" style={{ display: 'inline-block', width: 6, height: 14, background: 'var(--accent)', borderRadius: 2, marginLeft: 4, verticalAlign: 'middle' }} />
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* User avatar */}
                  {m.sender === 'user' && (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--glass-bg-active)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', flexShrink: 0, marginTop: 2 }}>
                      {(user?.user || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── INPUT BAR ── */}
        <div style={{ padding: '0 1.5rem 1.25rem' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <form
              onSubmit={handleSendMessage}
              style={{
                ...glassLgStyle, borderRadius: 9999, padding: '0.75rem 0.75rem 0.75rem 1.25rem',
                display: 'flex', alignItems: 'flex-end', gap: '0.6rem',
                transition: 'all 0.2s ease',
              }}
            >
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                onKeyDown={handleInputKeyDown}
                placeholder="Задайте любой вопрос..."
                rows={1}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6,
                  resize: 'none', padding: '0.35rem 0', maxHeight: 160,
                  fontFamily: 'inherit',
                }}
              />

              {isLoading ? (
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  title="Остановить генерацию"
                  className="animate-stop-pulse"
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,59,48,0.5)',
                    background: 'var(--danger-glass)', color: 'var(--danger)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.18s ease',
                  }}
                >
                  <IconStop />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  title="Отправить"
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: 'none',
                    background: inputText.trim() ? 'var(--accent)' : 'var(--glass-bg)',
                    color: inputText.trim() ? '#fff' : 'var(--text-tertiary)',
                    cursor: inputText.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: inputText.trim() ? '0 4px 14px rgba(0,122,255,0.4)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <IconSend />
                </button>
              )}
            </form>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.67rem', color: 'var(--text-tertiary)' }}>
              AISLOP может ошибаться. Проверяйте важную информацию.
            </p>
          </div>
        </div>
      </main>

      {/* Hover reveal delete btn via CSS trick */}
      <style>{`
        div:hover .delete-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
