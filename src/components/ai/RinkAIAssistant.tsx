'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles, X, Send, ArrowRight, ExternalLink,
  FlaskConical, Building2, Layers, TrendingUp,
  ChevronDown, RotateCcw, Loader2
} from 'lucide-react';
import type { AISearchResponse, AISearchResult } from '@/lib/aiSearch';

// ── Quick Action Chips ────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Agriculture Startups',   icon: '🚜', query: 'agriculture technologies for startups' },
  { label: 'Food Processing',        icon: '🍽️', query: 'food processing technologies' },
  { label: 'Water Technologies',     icon: '💧', query: 'water purification and treatment technologies' },
  { label: 'Energy & Climate',       icon: '⚡', query: 'renewable energy and climate tech' },
  { label: 'Biotechnology',          icon: '🧪', query: 'biotechnology and life sciences' },
  { label: 'Manufacturing',          icon: '🏭', query: 'manufacturing and industrial technologies' },
  { label: 'Healthcare & MedTech',   icon: '🏥', query: 'healthcare and medical technologies' },
  { label: 'Patented Technologies',  icon: '📜', query: 'patented technologies' },
];

// ── Message types ─────────────────────────────────────────────
type MessageRole = 'user' | 'assistant' | 'results' | 'welcome';

interface ChatMessage {
  id: string;
  role: MessageRole;
  text?: string;
  results?: AISearchResult[];
  responseMessage?: string;
  query?: string;
}

// ── Typing indicator ──────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-md rounded-tl-sm border"
      style={{
        background: 'var(--bg-assistant-bubble)',
        borderColor: 'var(--border-assistant-bubble)',
        width: 'fit-content',
        maxWidth: '80px',
      }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-secondary)',
          animation: `rinkBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          display: 'block',
        }} />
      ))}
    </div>
  );
}

// ── Tech Result Card ──────────────────────────────────────────
function TechCard({ result }: { result: AISearchResult }) {
  const instr = result.instrument;
  const tags = Array.isArray(instr.tag) ? instr.tag : (instr.tag ? instr.tag.split(',') : []);

  return (
    <div style={{
      background: 'var(--bg-assistant-bubble)',
      borderRadius: 14,
      border: '1px solid var(--border-assistant-bubble)',
      padding: '14px 16px',
      marginBottom: 10,
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)')}
    >
      {/* Name */}
      <div style={{ fontWeight: 700, color: 'var(--accent-secondary)', fontSize: 14, lineHeight: 1.3, marginBottom: 8 }}>
        {instr.instruments}
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)', background: 'var(--card-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px' }}>
          <Building2 size={10} /> {instr.institution_name}
        </span>
        {tags.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)', background: 'var(--card-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px' }}>
            <Layers size={10} /> {tags[0]}
          </span>
        )}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Link href={`/instruments/${instr.id}`} target="_blank"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 12, fontWeight: 600, color: 'var(--heading)',
            background: 'var(--card-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 12px',
            textDecoration: 'none', transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--border)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--card-secondary)';
          }}
        >
          View Technology <ExternalLink size={11} />
        </Link>
      </div>
    </div>
  );
}

// ── Parse bold markdown in assistant messages ─────────────────
function ParsedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function RinkAIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'welcome',
      text: `Hello! I'm the **RINK AI Discovery Assistant**. I help startup founders discover technologies from Kerala's leading research institutions.\n\nAsk me anything — or pick a quick action below!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(scrollToBottom, 100);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Detect scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 60);
  };

  // ── Send query ────────────────────────────────────────────
  const sendQuery = useCallback(async (queryText: string) => {
    const q = queryText.trim();
    if (!q || loading) return;

    const userId = `msg-${Date.now()}`;
    setMessages(prev => [...prev, { id: userId, role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const data: AISearchResponse = await res.json();

      // Conversational intents → plain assistant bubble (no results layout)
      const CONVERSATIONAL_INTENTS = new Set([
        'greeting', 'smalltalk', 'who_are_you', 'help', 'thanks', 'empty',
      ]);

      if (CONVERSATIONAL_INTENTS.has(data.intent)) {
        setMessages(prev => [
          ...prev,
          {
            id: `res-${Date.now()}`,
            role: 'assistant',
            text: data.responseMessage,
          },
        ]);
      } else {
        // Search intent → results layout
        setMessages(prev => [
          ...prev,
          {
            id: `res-${Date.now()}`,
            role: 'results',
            results: data.results,
            responseMessage: data.responseMessage,
            query: q,
          },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'Sorry, I could not connect to the RINK database. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuery(input);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'welcome',
      text: `Hello! I'm the **RINK AI Discovery Assistant**. I help startup founders discover technologies from Kerala's leading research institutions.\n\nAsk me anything — or pick a quick action below!`,
    }]);
    setInput('');
  };

  return (
    <>
      {/* ── Keyframe Styles ── */}
      <style>{`
        @keyframes rinkBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes rinkSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rinkPulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,63,138,0.3), 0 8px 32px rgba(0,63,138,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(0,63,138,0.08), 0 8px 32px rgba(0,63,138,0.35); }
        }
        .rink-ai-panel { animation: rinkSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .rink-ai-fab { animation: rinkPulseGlow 2.5s ease-in-out infinite; }
        .rink-chip:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,63,138,0.15); }
      `}</style>

      {/* ── Floating Action Button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rink-ai-fab"
          style={{
            position: 'fixed', bottom: 90, right: 28, zIndex: 9999,
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #003F8A 0%, #0066CC 100%)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          title="RINK Discovery Assistant"
          id="rink-ai-fab"
        >
          <Sparkles size={26} color="white" />
        </button>
      )}

      {/* ── Chat Panel ── */}
      {open && (
        <div
          className="rink-ai-panel"
          style={{
            position: 'fixed', bottom: 90, right: 28, zIndex: 9999,
            width: 420, maxWidth: 'calc(100vw - 56px)', height: 620, maxHeight: 'calc(100vh - 120px)',
            display: 'flex', flexDirection: 'column',
            borderRadius: 24,
            background: 'var(--card)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          {/* ── Header ── */}
          <div style={{
            background: 'linear-gradient(135deg, #002F6C 0%, #003F8A 60%, #0055AA 100%)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
            flexShrink: 0,
          }}>
            {/* Avatar */}
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Sparkles size={20} color="white" />
            </div>

            {/* Title */}
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
                RINK Discovery Assistant
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                Find technologies for your next startup
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={resetChat} title="New chat"
                style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)')}
              >
                <RotateCcw size={14} color="rgba(255,255,255,0.8)" />
              </button>
              <button onClick={() => setOpen(false)} title="Close"
                style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)')}
              >
                <X size={14} color="rgba(255,255,255,0.8)" />
              </button>
            </div>
          </div>

          {/* ── Messages Area ── */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {messages.map(msg => (
              <div key={msg.id}>

                {/* Welcome Message */}
                {msg.role === 'welcome' && (
                  <div>
                    <div style={{
                      background: 'var(--bg-assistant-bubble)', borderRadius: '18px 18px 18px 4px',
                      padding: '14px 16px', fontSize: 13.5, lineHeight: 1.6,
                      color: 'var(--text-assistant-bubble)', border: '1px solid var(--border-assistant-bubble)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)', maxWidth: '90%',
                    }}>
                      <ParsedText text={msg.text!} />
                    </div>

                    {/* Quick Actions */}
                    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {QUICK_ACTIONS.map(action => (
                        <button
                          key={action.label}
                          onClick={() => sendQuery(action.query)}
                          className="rink-chip"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '6px 12px', borderRadius: 20,
                            background: 'var(--bg-assistant-bubble)', border: '1px solid var(--border-assistant-bubble)',
                            fontSize: 12, fontWeight: 500, color: 'var(--accent-secondary)',
                            cursor: 'pointer', transition: 'all 0.15s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                        >
                          <span>{action.icon}</span>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Message */}
                {msg.role === 'user' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #003F8A, #0055AA)',
                      color: 'white', borderRadius: '18px 18px 4px 18px',
                      padding: '10px 16px', fontSize: 13.5, lineHeight: 1.5,
                      maxWidth: '80%', fontWeight: 500,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                )}

                {/* Assistant Text Message */}
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--card-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <Sparkles size={13} color="var(--accent-secondary)" />
                    </div>
                    <div style={{
                      background: 'var(--bg-assistant-bubble)', borderRadius: '18px 18px 18px 4px',
                      padding: '10px 16px', fontSize: 13.5, lineHeight: 1.6,
                      color: 'var(--text-assistant-bubble)', border: '1px solid var(--border-assistant-bubble)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)', maxWidth: '85%',
                    }}>
                      <ParsedText text={msg.text!} />
                    </div>
                  </div>
                )}

                {/* Results Message */}
                {msg.role === 'results' && (
                  <div>
                    {/* Response label */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--card-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <Sparkles size={13} color="var(--accent-secondary)" />
                      </div>
                      <div style={{
                        background: 'var(--bg-assistant-bubble)', borderRadius: '18px 18px 18px 4px',
                        padding: '10px 16px', fontSize: 13.5, lineHeight: 1.6,
                        color: 'var(--text-assistant-bubble)', border: '1px solid var(--border-assistant-bubble)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                      }}>
                        <ParsedText text={msg.responseMessage!} />
                      </div>
                    </div>

                    {/* Tech cards */}
                    {msg.results && msg.results.length > 0 && (
                      <div style={{ paddingLeft: 36 }}>
                        {msg.results.map(r => (
                          <TechCard key={r.instrument.id} result={r} />
                        ))}

                        {/* View all link */}
                        <Link
                          href={`/instruments?q=${encodeURIComponent(msg.query || '')}`}
                          target="_blank"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 12, color: 'var(--heading)', fontWeight: 600,
                            textDecoration: 'none', marginTop: 4, padding: '6px 12px',
                            background: 'var(--card-secondary)', border: '1px solid var(--border)', borderRadius: 8,
                          }}
                        >
                          Browse all in Technology Transfer Portal <ArrowRight size={12} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--card-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Sparkles size={13} color="var(--accent-secondary)" />
                </div>
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll Down Button */}
          {showScrollDown && (
            <button onClick={scrollToBottom} style={{
              position: 'absolute', bottom: 80, right: 20, width: 32, height: 32,
              borderRadius: '50%', background: 'var(--bg-assistant-bubble)', border: '1px solid var(--border-assistant-bubble)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
            }}>
              <ChevronDown size={16} color="var(--text-secondary)" />
            </button>
          )}

          {/* ── Input Area ── */}
          <div style={{
            padding: '12px 16px 16px',
            borderTop: '1px solid var(--border)',
            background: 'var(--card)',
            flexShrink: 0,
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about technologies, sectors, startups..."
                rows={1}
                style={{
                  flex: 1, padding: '10px 14px',
                  borderRadius: 16, border: '1.5px solid var(--border-assistant-bubble)',
                  background: 'var(--bg-assistant-bubble)', fontSize: 13.5, lineHeight: 1.5,
                  resize: 'none', outline: 'none', fontFamily: 'inherit',
                  color: 'var(--text-assistant-bubble)', transition: 'border-color 0.15s',
                  maxHeight: 100, overflowY: 'auto',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-secondary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-assistant-bubble)')}
                disabled={loading}
                id="rink-ai-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  width: 42, height: 42, borderRadius: 14, border: 'none',
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #003F8A, #0066CC)'
                    : 'var(--border-assistant-bubble)',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                {loading
                  ? <Loader2 size={18} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
                  : <Send size={18} color={input.trim() ? 'white' : 'var(--text-secondary)'} />
                }
              </button>
            </form>

            {/* Footer note */}
            <div style={{ textAlign: 'center', fontSize: 10.5, color: 'var(--text-secondary)', marginTop: 8 }}>
              Searches only real technologies from the RINK database
            </div>
          </div>
        </div>
      )}
    </>
  );
}
