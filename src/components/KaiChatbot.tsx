'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGOIFY - Kai AI Chatbot Component
// Intelligent help assistant with sales skills
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from 'react';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  suggestions?: Array<{ label: string; prompt: string }>;
  cta?: { label: string; href: string } | null;
}

type ChatbotClientEventName = 'cta_clicked' | 'resolution_confirmed';

interface KaiChatbotProps {
  variant?: 'floating' | 'embedded' | 'fullscreen';
  initialOpen?: boolean;
  onClose?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function KaiChatbot({ 
  variant = 'floating', 
  initialOpen = false,
  onClose 
}: KaiChatbotProps) {
  const { user } = useStoreUser();
  const activeHabits = useQuery(api.habits.listActive, user ? {} : 'skip');
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationIdRef = useRef(`kai-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Hey! I'm Kai, your RESURGO assistant.\n\nI can help you with:\n• Setting up habits and goals\n• Understanding features\n• Troubleshooting issues\n• Habit advice (using Atomic Habits principles)\n\nWhat can I help you with today?`,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  const trackClientEvent = useCallback(
    async (
      eventName: ChatbotClientEventName,
      payload?: {
        intent?: string;
        cta?: { label: string; href: string };
        details?: Record<string, unknown>;
      }
    ) => {
      try {
        await fetch('/api/chatbot/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName,
            conversationId: conversationIdRef.current,
            intent: payload?.intent,
            cta: payload?.cta,
            details: payload?.details,
          }),
        });
      } catch {
        // best-effort telemetry only
      }
    },
    []
  );

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setShowSuggestions(false);
    setInput('');
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId: conversationIdRef.current,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
          userContext: {
            plan: user?.plan || 'free',
            habitsCount: activeHabits?.length ?? 0,
            currentStreak: 0,
            daysActive: 0,
            completionRatio7d: 0,
            recentMisses7d: 0,
            streakTrend: 'flat',
          },
        }),
      });

      const data = await response.json();
      
      if (data.success && data.message) {
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          intent: typeof data.intent === 'string' ? data.intent : undefined,
          suggestions: Array.isArray(data.suggestions) ? data.suggestions : undefined,
          cta: data.cta ?? null,
        }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again!',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, user, activeHabits]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  // Quick suggestion buttons
  const suggestions = [
    { label: 'Set up a habit', text: 'How do I create my first habit?' },
    { label: 'Atomic Habits tips', text: 'Give me a tip from Atomic Habits' },
    { label: 'Pricing', text: 'What are the pricing plans?' },
    { label: 'Help', text: 'I need help with something' },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // FLOATING VARIANT (Chat bubble)
  // ─────────────────────────────────────────────────────────────────────────────
  
  if (variant === 'floating') {
    return (
      <>
        {/* Chat bubble button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
            aria-label="Open chat with Kai"
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {/* Pulse indicator */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </button>
        )}

        {/* Chat window */}
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-4rem)] glass-card rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-secondary)]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">K</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Kai</h3>
                  <p className="text-xs text-[var(--text-secondary)]">RESURGO AI Assistant</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-[var(--accent)] text-white rounded-br-md'
                        : 'bg-white/10 text-[var(--text-primary)] rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === 'assistant' && msg.cta && (
                      <div className="mt-3">
                        <a
                          href={msg.cta.href}
                          onClick={() => {
                            void trackClientEvent('cta_clicked', {
                              intent: msg.intent,
                              cta: msg.cta ?? undefined,
                              details: { variant: 'floating' },
                            });
                          }}
                          className="inline-flex items-center rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
                        >
                          {msg.cta.label}
                        </a>
                      </div>
                    )}
                    {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={`${msg.id}-suggestion-${i}`}
                            onClick={() => sendMessage(s.prompt)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)] transition-colors"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.role === 'assistant' && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            void trackClientEvent('resolution_confirmed', {
                              intent: msg.intent,
                              details: { variant: 'floating', messageId: msg.id },
                            });
                          }}
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                        >
                          ✅ This solved it
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {showSuggestions && messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s.text)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Kai anything..."
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EMBEDDED VARIANT (For help center)
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-secondary)]/10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">Ask Kai</h3>
          <p className="text-sm text-[var(--text-secondary)]">Get instant answers from our AI assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <h4 className="font-medium text-[var(--text-primary)] mb-2">How can I help?</h4>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Ask me anything about RESURGO, habits, or goals!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  className="text-sm px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-[var(--accent)] text-white rounded-br-md'
                      : 'bg-white/10 text-[var(--text-primary)] rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && msg.cta && (
                    <div className="mt-3">
                      <a
                        href={msg.cta.href}
                        onClick={() => {
                          void trackClientEvent('cta_clicked', {
                            intent: msg.intent,
                            cta: msg.cta ?? undefined,
                            details: { variant: 'embedded' },
                          });
                        }}
                        className="inline-flex items-center rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
                      >
                        {msg.cta.label}
                      </a>
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={`${msg.id}-embed-suggestion-${i}`}
                          onClick={() => sendMessage(s.prompt)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)] transition-colors"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.role === 'assistant' && (
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          void trackClientEvent('resolution_confirmed', {
                            intent: msg.intent,
                            details: { variant: 'embedded', messageId: msg.id },
                          });
                        }}
                        className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                      >
                        ✅ This solved it
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────────

export default KaiChatbot;
