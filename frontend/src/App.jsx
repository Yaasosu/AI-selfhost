import React, { useState, useEffect, useRef } from 'react';
import AuthScreen from './components/Auth/AuthScreen';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/Chat/ChatArea';

export default function App() {
  /* ─── THEME & AUTH STATE ─── */
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  /* ─── CHAT & MODEL STATE ─── */
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
  const [chatError, setChatError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  /* ─── REFS ─── */
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);
  const msgIdCounter = useRef(0);
  const nextId = () => ++msgIdCounter.current;

  /* ─── COPY TEXT HANDLER ─── */
  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  /* ─── EFFECTS ─── */
  // Theme sync
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Model ID sync
  useEffect(() => {
    if (selectedModelId) {
      localStorage.setItem('selectedModelId', String(selectedModelId));
    }
  }, [selectedModelId]);

  // Active chat ID & URL hash sync
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

  // Hash change handler
  useEffect(() => {
    const handleHashChange = () => {
      const hashMatch = window.location.hash.match(/chat=(\d+)/);
      if (hashMatch) {
        setActiveChatId(Number(hashMatch[1]));
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initial Auth check
  useEffect(() => {
    checkAuth();
  }, []);

  // Load chats & models on login
  useEffect(() => {
    if (user) {
      fetchChats();
      fetchModels();
    }
  }, [user]);

  // Load message history on active chat change
  useEffect(() => {
    if (activeChatId) fetchMessages(activeChatId);
    else setMessages([]);
  }, [activeChatId]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ─── API HANDLERS ─── */
  const checkAuth = async () => {
    try {
      const res = await fetch('/users/me', { credentials: 'include' });
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!name || !password) {
      setAuthError('Please fill in all fields');
      return;
    }
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
    try {
      await fetch('/users/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    setUser(null);
    setChats([]);
    setActiveChatId(null);
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
          setActiveChatId((currentId) => {
            if (currentId && reversed.some((c) => c.id === currentId)) {
              return currentId;
            }
            return reversed[reversed.length - 1].id;
          });
        }
      }
    } catch {
      setChatError('Failed to load chats');
    }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch('/messages/models', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setModels(data);
        const keys = Object.keys(data);
        if (keys.length > 0) {
          setSelectedModelId((prev) => {
            const saved = localStorage.getItem('selectedModelId');
            const target = saved || prev;
            return keys.includes(target) ? target : keys[0];
          });
        }
      }
    } catch {
      console.error('Failed to load models');
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await fetch(`/messages/${chatId}/messages`, { credentials: 'include' });
      if (res.ok) setMessages(await res.json());
    } catch {
      setChatError('Failed to load message history');
    }
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
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    } catch {
      setChatError('Failed to create chat');
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat?')) return;
    try {
      const res = await fetch(`/chats/${chatId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (activeChatId === chatId) {
          const remaining = chats.filter((c) => c.id !== chatId);
          setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    } catch {
      setChatError('Failed to delete chat');
    }
  };

  const handleStopGeneration = () => {
    abortControllerRef.current?.abort();
  };

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
          setChats((prev) => [newChat, ...prev]);
          chatId = newChat.id;
          setActiveChatId(newChat.id);
        } else return;
      } catch {
        setChatError('Failed to create chat');
        return;
      }
    }

    const userMsgId = nextId();
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    const botMsgId = nextId();
    setMessages((prev) => [...prev, { id: botMsgId, sender: 'assistant', text: '', streaming: true }]);

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
                str.startsWith('Please wait') ||
                str.startsWith('Пожалуйста, подождите') ||
                str.includes('thinking') ||
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
              setMessages((prev) =>
                prev.map((m) => (m.id === botMsgId ? { ...m, text: botResponseText } : m))
              );
            } catch {}
          }
        }
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === botMsgId ? { ...m, streaming: false } : m))
      );
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
          setMessages((prev) => prev.filter((m) => m.id !== botMsgId));
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId ? { ...m, text: botResponseText, streaming: false } : m
            )
          );
        }
        setTimeout(() => {
          fetchChats();
          if (chatId) fetchMessages(chatId);
        }, 400);
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? { ...m, text: err.message || 'Network error. Please try again.', streaming: false }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

  /* ─── AUTH SCREEN ─── */
  if (!user) {
    return (
      <AuthScreen
        isDark={isDark}
        setIsDark={setIsDark}
        authMode={authMode}
        setAuthMode={setAuthMode}
        name={name}
        setName={setName}
        password={password}
        setPassword={setPassword}
        authError={authError}
        setAuthError={setAuthError}
        handleAuthSubmit={handleAuthSubmit}
      />
    );
  }

  /* ─── MAIN INTERFACE ─── */
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)',
      }}
    >
      {/* Navigation Drawer (Sidebar) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDark={isDark}
        setIsDark={setIsDark}
        models={models}
        selectedModelId={selectedModelId}
        setSelectedModelId={setSelectedModelId}
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        handleCreateChat={handleCreateChat}
        handleDeleteChat={handleDeleteChat}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main Content (Chat Area) */}
      <ChatArea
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDark={isDark}
        setIsDark={setIsDark}
        chatError={chatError}
        setChatError={setChatError}
        messages={messages}
        userName={user?.user}
        copiedId={copiedId}
        onCopyText={handleCopyText}
        onSuggestionClick={handleSuggestionClick}
        messagesEndRef={messagesEndRef}
        inputText={inputText}
        isLoading={isLoading}
        textareaRef={textareaRef}
        handleTextareaChange={handleTextareaChange}
        handleInputKeyDown={handleInputKeyDown}
        handleSendMessage={handleSendMessage}
        handleStopGeneration={handleStopGeneration}
      />

      {/* Dynamic CSS rule for drawer chat item delete button hover */}
      <style>{`
        div:hover > .delete-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
