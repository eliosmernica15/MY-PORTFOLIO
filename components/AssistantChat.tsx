'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Send, X, Minus, Sparkles, Copy, Mic, MicOff, Info, Mail, Phone,
  Github, ArrowUpRight, ShieldCheck, Download, RotateCcw,
} from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useKeyShortcut } from '@/hooks/useKeyShortcut';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { matchKnowledge, type KnowledgeCard, type MatchResult } from '@/lib/matchKnowledge';
import { KNOWLEDGE_STATIC } from '@/data/knowledge.static';
import { PROJECTS } from '@/data/projects';
import { SKILL_CATEGORIES } from '@/data/skills';
import { SITE } from '@/data/site';
import { useTheme } from '../context/ThemeContext';

// Static import — `predev`/`prebuild` runs the knowledge generator before
// `next dev`/`next build`, so the file is always present in normal use.
// If the file is missing for any reason, we fall back to static entries only.
import { KNOWLEDGE_GENERATED } from '@/data/knowledge.generated';
const KB: typeof KNOWLEDGE_STATIC = [...KNOWLEDGE_STATIC, ...KNOWLEDGE_GENERATED];

// ---------- Types ----------

type Card = KnowledgeCard;

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  card?: Card;
  ts: number;
};

const QUICK_PROMPTS = [
  'What do you do?',
  'Show me AI work',
  "Are you available?",
  "What's A++(APL)?",
  'How do we start?',
];

// Rate-limit: 5 queries / 60s.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

// ---------- Helpers ----------

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function renderCard(card: Card, onAction: (kind: 'open' | 'scroll', target: string) => void) {
  if (card.type === 'project') {
    const p = PROJECTS.find(p => p.id === card.projectId);
    if (!p) return null;
    return (
      <div
        className="mt-2 rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
      >
        {/* Project hero URLs can point at prod.spline.design, which the Next/Image optimizer cannot reach — keep as a plain <img>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.title}
          className="w-full aspect-[16/9] object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {p.title}
            </h4>
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              {p.year}
            </span>
          </div>
          <p className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {p.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--accent-light)' }}
            >
              {p.category}
            </span>
            <button
              onClick={() => onAction('open', `/project/${p.id}`)}
              className="text-xs font-bold flex items-center gap-1 hover:opacity-80"
              style={{ color: 'var(--accent-light)' }}
            >
              Open case study <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (card.type === 'skill_list') {
    const cat = SKILL_CATEGORIES.find(c => c.name === card.category);
    if (!cat) return null;
    return (
      <div
        className="mt-2 rounded-xl border p-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
      >
        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2"
          style={{ color: 'var(--accent-light)' }}>
          {cat.name}
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {cat.skills.map(s => (
            <div
              key={s.name}
              className="flex items-center justify-between text-[11px]"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>{s.name}</span>
              <span style={{ color: 'var(--accent)' }}>{'●'.repeat(s.level)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (card.type === 'contact') {
    return (
      <div
        className="mt-2 rounded-xl border p-3 space-y-2"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
      >
        <div className="flex items-center gap-2 text-[12px]"
          style={{ color: 'var(--text-primary)' }}>
          <Mail size={14} style={{ color: 'var(--accent)' }} />
          <a href={`mailto:${SITE.email}`} className="hover:underline">{SITE.email}</a>
        </div>
        <div className="flex items-center gap-2 text-[12px]"
          style={{ color: 'var(--text-primary)' }}>
          <Phone size={14} style={{ color: 'var(--accent)' }} />
          <span>{SITE.phone}</span>
        </div>
        <button
          onClick={() => onAction('scroll', '#contact')}
          className="mt-1 w-full text-[11px] font-bold uppercase tracking-widest py-2 rounded-lg transition-colors"
          style={{
            background: 'var(--accent)',
            color: 'var(--accent-contrast)',
          }}
        >
          Open contact form
        </button>
      </div>
    );
  }
  return null;
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const onCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1200);
    } catch {}
  };
  return (
    <button
      onClick={onCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
      style={{ color: 'var(--text-muted)' }}
      aria-label="Copy message"
    >
      {done ? <Copy size={11} className="text-emerald-400" /> : <Copy size={11} />}
    </button>
  );
}

// ---------- Component ----------

export default function AssistantChat() {
  const reduced = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useLocalStorage<Message[]>('assistant-messages', []);
  const [input, setInput] = useState('');
  const [inputHistory, setInputHistory] = useLocalStorage<string[]>('assistant-input-history', []);
  const [hIndex, setHIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rateRemaining, setRateRemaining] = useState(RATE_MAX);
  const [showInfo, setShowInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [supportsVoice, setSupportsVoice] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Voice input ref
  const recognitionRef = useRef<unknown>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen && !minimized);
  const panelRef = useRef<HTMLDivElement>(null);
  // Stable callback ref — see the same pattern in Terminal.tsx.
  // Inline-arrow refs get a new identity every render, which makes
  // React re-run the ref callback on every render even when the DOM
  // element didn't change. `focusTrapRef` and `panelRef` are
  // `useRef` objects whose identity is stable across renders, so
  // the empty dep array is correct.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const combinedRef = useCallback(
    (el: HTMLDivElement | null) => {
      (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      (focusTrapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    []
  );

  // Belt-and-suspenders: force the panel's height directly on the DOM
  // with `!important` when `minimized` flips. The CSS rule already does
  // this, but some devices intermittently ignore attribute-driven
  // `!important` right after a state flip (when the previous frame's
  // height transition is still resolving). Setting the property with
  // `important` priority from JS guarantees the panel collapses on
  // every device.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (!isMobile && minimized) {
      el.style.setProperty('height', '44px', 'important');
      el.style.setProperty('min-height', '44px', 'important');
      el.style.setProperty('max-height', '44px', 'important');
    } else if (!isMobile && !minimized) {
      el.style.removeProperty('height');
      el.style.removeProperty('min-height');
      el.style.removeProperty('max-height');
    }
  }, [minimized, isMobile, isOpen]);

  // Theme is always available (the layout wraps with ThemeProvider).
  // The previous version was a no-op `useOptionalTheme()` wrapper
  // that paid a try/catch cost on every render. Direct call instead.
  const { theme: currentTheme } = useTheme();
  void currentTheme; // we read it indirectly via the CSS variables

  // -- Mobile / voice detection --
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      // On mobile, `minimized` is meaningless (the panel is fullscreen),
      // so force it off — otherwise a resize that crosses the 640px
      // boundary would leave the panel as a 100dvh strip with only the
      // header visible.
      if (mobile) setMinimized(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const W = window as unknown as {
      webkitSpeechRecognition?: unknown;
      SpeechRecognition?: unknown;
    };
    setSupportsVoice(Boolean(W.webkitSpeechRecognition || W.SpeechRecognition));
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // -- Rate-limit tick (only runs while the panel is open). The
  //    previous version ran a 1Hz `setNow` forever, which forced a
  //    React re-render of the entire AssistantChat tree every second
  //    — even when the panel was closed and the user wasn't looking.
  //    A `JSON.parse` + `JSON.stringify` of the rate stamps also ran
  //    on each tick. The footer that shows "X/5 this min" is the
  //    only consumer of the rate value, and the user can only see
  //    the footer when the panel is open. --
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stamps = JSON.parse(
      window.localStorage.getItem('assistant-rate-stamps') || '[]',
    ) as number[];
    const recent = stamps.filter(s => now - s < RATE_WINDOW_MS);
    setRateRemaining(Math.max(0, RATE_MAX - recent.length));
    window.localStorage.setItem('assistant-rate-stamps', JSON.stringify(recent));
  }, [now, isOpen]);

  // -- Body autoscroll --
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, isGenerating]);

  // -- Focus input on open --
  useEffect(() => {
    if (isOpen && !minimized) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [isOpen, minimized]);

  // -- Cmd/Ctrl+K to toggle the panel --
  useKeyShortcut({ key: 'k', meta: true, handler: () => setIsOpen(v => !v) }, true);

  // -- Cmd/Ctrl+M to toggle minimize (desktop). On mobile, the panel is
  //    fullscreen, so Ctrl+M closes the panel outright. --
  useKeyShortcut({
    key: 'm',
    meta: true,
    handler: () => {
      setIsOpen(prevOpen => {
        if (!prevOpen) return true;
        if (isMobile) return false;
        setMinimized(prevMin => !prevMin);
        return true;
      });
    },
  }, isOpen);

  // -- Esc handling. On desktop, Esc minimizes (keeps session). On mobile
  //    (fullscreen), Esc closes outright. --
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isMobile) {
          setIsOpen(false);
        } else {
          setMinimized(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isMobile]);

  // Note: we intentionally do NOT auto-minimize on click-outside. The
  // user explicitly minimizes via the header dot, the trigger button, or
  // Esc. Auto-minimizing on every outside click interferes with normal
  // page interaction (clicking a project link, a card, etc.) and the
  // session is already preserved by the explicit minimize affordances.

  // -- Seed greeting on first open --
  const seededRef = useRef(false);
  useEffect(() => {
    if (isOpen && messages.length === 0 && !seededRef.current) {
      seededRef.current = true;
      setMessages([
        {
          id: uid(),
          role: 'bot',
          content:
            "Hi — I'm Elios AI. Ask me about my work, my stack, or how to start a project. I work offline from a knowledge base built from the site, so replies reflect exactly what's here.",
          ts: Date.now(),
        },
      ]);
    }
  }, [isOpen, messages.length, setMessages]);

  // ---------- Action execution ----------

  const executeAction = useCallback((action: { type: string; target?: string; theme?: 'dark' | 'light' } | undefined) => {
    if (!action) return;
    try {
      if (action.type === 'scroll_to' && action.target) {
        document.querySelector(action.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if ((action.type === 'open_link' || action.type === 'open_route') && action.target) {
        window.open(action.target, '_blank', 'noopener,noreferrer');
      }
    } catch {}
  }, []);

  const onCardAction = useCallback((kind: 'open' | 'scroll', target: string) => {
    if (kind === 'open') window.open(target, '_blank', 'noopener,noreferrer');
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ---------- Sending ----------

  const recordRateStamp = useCallback(() => {
    try {
      const stamps = JSON.parse(
        window.localStorage.getItem('assistant-rate-stamps') || '[]',
      ) as number[];
      const recent = [...stamps.filter(s => Date.now() - s < RATE_WINDOW_MS), Date.now()];
      window.localStorage.setItem('assistant-rate-stamps', JSON.stringify(recent));
      setRateRemaining(Math.max(0, RATE_MAX - recent.length));
    } catch {}
  }, []);

  const send = useCallback((textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!text || isGenerating) return;
    if (rateRemaining <= 0) {
      // Inject a rate-limit message.
      setMessages(prev => [
        ...prev.slice(-19),
        {
          id: uid(),
          role: 'bot',
          content:
            "Whoa, slow down — I throttle to 5 questions per minute. Take a breath, then try again.",
          ts: Date.now(),
        },
      ]);
      return;
    }
    recordRateStamp();

    const userMsg: Message = { id: uid(), role: 'user', content: text, ts: Date.now() };
    setMessages(prev => [...prev.slice(-19), userMsg]);
    setInput('');
    setHIndex(null);
    setInputHistory(prev => {
      const next = prev[prev.length - 1] === text ? prev : [...prev, text].slice(-20);
      return next;
    });

    setIsGenerating(true);
    // Simulated generation latency — keep it feeling like a real product.
    const delay = 250 + Math.min(900, text.length * 12);
    setTimeout(() => {
      const result = matchKnowledge(text, KB) as MatchResult | null;
      const entry = result?.entry;
      const content = entry?.text ?? "I'm not sure how to answer that. Try one of the quick prompts below.";
      const card = result?.card;
      const botMsg: Message = {
        id: uid(),
        role: 'bot',
        content,
        card,
        ts: Date.now(),
      };
      setMessages(prev => [...prev.slice(-19), botMsg]);
      if (entry?.action) {
        // Defer the action so the user reads the message first.
        setTimeout(() => executeAction(entry.action), 600);
      }
      setIsGenerating(false);
    }, reduced ? 80 : delay);
  }, [input, isGenerating, rateRemaining, recordRateStamp, setMessages, setInputHistory, reduced, executeAction]);

  // ---------- Copy transcript ----------

  const copyTranscript = useCallback(() => {
    const text = messages
      .map(m => `${m.role === 'user' ? 'You' : 'Elios AI'}: ${m.content}`)
      .join('\n\n');
    try {
      navigator.clipboard.writeText(text);
    } catch {}
  }, [messages]);

  // ---------- Voice ----------

  const toggleVoice = useCallback(() => {
    if (isListening) {
      const r = recognitionRef.current as { stop?: () => void; abort?: () => void } | null;
      try { r?.stop?.(); } catch {}
      setIsListening(false);
      return;
    }
    try {
      const W = window as unknown as {
        webkitSpeechRecognition?: new () => SpeechRecognitionLike;
        SpeechRecognition?: new () => SpeechRecognitionLike;
      };
      const Ctor = W.webkitSpeechRecognition || W.SpeechRecognition;
      if (!Ctor) return;
      const rec = new Ctor();
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.continuous = false;
      rec.onresult = (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
        const text = e.results[0]?.[0]?.transcript ?? '';
        if (text) setInput(prev => (prev ? prev + ' ' : '') + text);
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, [isListening]);

  // ---------- Typing caret (bot) ----------

  const Caret: React.FC<{ visible: boolean }> = ({ visible }) => (
    <span
      aria-hidden
      className="inline-block w-1.5 h-3 ml-0.5 -mb-0.5 align-middle"
      style={{
        background: 'var(--accent-light)',
        opacity: visible ? 1 : 0,
        animation: 'assistant-caret 1s steps(2) infinite',
      }}
    />
  );

  // ---------- Layout ----------

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        width: '100vw',
        height: '100dvh',
        borderRadius: 0,
        margin: 0,
        // iPhone notch + home indicator: pad interactive surfaces so the
        // close button stays reachable and the input isn't hidden behind
        // the indicator when the on-screen keyboard is open.
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }
    : (minimized
      // When minimized, pin the panel ABOVE the trigger button (not on top
      // of it) so the user can see both. The trigger is ~44px tall and sits
      // at `bottom: 24px` (desktop) plus the safe-area inset. We add 8px
      // of breathing room.
      ? {
          position: 'fixed',
          right: 16,
          bottom: 'calc(76px + env(safe-area-inset-bottom))',
          zIndex: 80,
          width: 'min(280px, 60vw)',
          // Match the header's `py-2` + content + 1px border.
          height: 44,
          maxHeight: 44,
        }
      : {
          position: 'fixed',
          right: 24,
          bottom: 88,
          zIndex: 80,
          width: 'min(420px, 92vw)',
          height: 'min(560px, 80vh)',
          maxHeight: '80vh',
        }
    );

  // Trigger button click — closed → open; open & expanded → minimize
  // (desktop) or close (mobile); open & minimized → expand.
  const onTriggerClick = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    if (isMobile) {
      setIsOpen(false);
    } else {
      setMinimized(prev => !prev);
    }
  }, [isOpen, isMobile]);

  // ---------- Render ----------

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={onTriggerClick}
        data-floating-trigger
        data-open={isOpen ? 'true' : 'false'}
        data-minimized={isOpen && minimized ? 'true' : 'false'}
        className="floating-trigger group fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[60] flex items-center gap-2 rounded-full pl-3 pr-3 sm:pr-4 py-3 transition-all duration-300"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(16px)',
          color: 'var(--text-secondary)',
          boxShadow: '0 10px 40px -10px var(--shadow-accent)',
          marginBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-label={isOpen && !isMobile ? (minimized ? 'Expand assistant' : 'Minimize assistant') : 'Open Elios AI assistant'}
        aria-expanded={isOpen}
        data-cursor-hover
      >
        {isOpen && !isMobile ? (
          minimized ? (
            <Sparkles size={18} style={{ color: 'var(--accent)' }} />
          ) : (
            <Minus size={18} style={{ color: 'var(--accent)' }} />
          )
        ) : (
          <Sparkles size={18} style={{ color: 'var(--accent)' }} />
        )}
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">
          {isOpen && !isMobile ? (minimized ? 'Expand' : 'Minimize') : 'Ask Elios AI'}
        </span>
        {isOpen && !isMobile && (
          // Live pulse so the user knows the assistant is still running
          // when the panel is minimized.
          <span
            className="ml-1 w-1.5 h-1.5 rounded-full"
            style={{
              background: 'var(--accent)',
              boxShadow: '0 0 8px var(--shadow-accent)',
              animation: 'pulse-live 2s ease-in-out infinite',
            }}
            aria-hidden
          />
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          ref={combinedRef}
          data-state={minimized ? 'minimized' : 'open'}
          className="assistant-floating flex flex-col"
          style={panelStyle}
          role="dialog"
          aria-modal={isMobile ? 'true' : 'false'}
          aria-label="Elios AI assistant"
        >
          {/* Header — also acts as the click target to expand when minimized */}
          <div
            onClick={minimized ? () => setMinimized(false) : undefined}
            role={minimized ? 'button' : undefined}
            aria-label={minimized ? 'Expand assistant' : undefined}
            className={`flex items-center justify-between select-none transition-colors ${
              minimized
                ? 'px-3 py-2 cursor-pointer hover:bg-[var(--surface-elevated)]'
                : 'border-b px-4 py-3'
            }`}
            style={{
              background: 'var(--bg-elevated, var(--bg-card))',
              borderColor: 'var(--border)',
              cursor: minimized ? 'pointer' : undefined,
              userSelect: 'none',
              // Auto height from padding + content, not `height: 100%` —
              // the latter would make the header fill the whole panel
              // when expanded and crush the body to 0px.
              flexShrink: 0,
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
                aria-hidden
              >
                <Sparkles size={14} style={{ color: 'var(--accent-contrast)' }} />
              </div>
              {minimized ? (
                <span className="flex items-center gap-2 text-sm font-bold truncate"
                  style={{ color: 'var(--text-primary)' }}>
                  Elios AI
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--shadow-accent)',
                      animation: 'pulse-live 2s ease-in-out infinite',
                    }}
                    aria-hidden
                  />
                </span>
              ) : (
                <div className="min-w-0">
                  <div className="text-sm font-bold flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}>
                    Elios AI
                    <span className="status-live">
                      <span className="status-live-dot" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Online</span>
                    </span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)' }}>
                    Offline-ready
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!minimized && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyTranscript(); }}
                    className="p-1.5 rounded opacity-70 hover:opacity-100"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label="Copy transcript"
                    title="Copy transcript"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowInfo(v => !v); }}
                    className="p-1.5 rounded opacity-70 hover:opacity-100 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label="About this assistant"
                    title="About this assistant"
                  >
                    <Info size={14} />
                  </button>
                </>
              )}
              {!isMobile && (
                <button
                  onClick={(e) => { e.stopPropagation(); setMinimized(v => !v); }}
                  className="p-1.5 rounded opacity-70 hover:opacity-100 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label={minimized ? 'Expand' : 'Minimize'}
                  title={minimized ? 'Expand (⌘M)' : 'Minimize (⌘M)'}
                >
                  <Minus size={14} />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="p-1.5 rounded opacity-70 hover:opacity-100 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Close"
                title="Close (Esc)"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {showInfo && (
                <div
                  className="px-4 py-3 text-[11.5px] leading-relaxed border-b"
                  style={{
                    background: 'var(--surface-elevated)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    How this works
                  </p>
                  <p>
                    Replies come from a knowledge base built from this site (projects, services, skills, notes, and a hand-written FAQ). It runs entirely in your browser — no API key, no server calls, no data leaves your device. Regenerated on every <code className="kbd">sync:kb</code> run.
                  </p>
                </div>
              )}

              {/* Body */}
              <div
                ref={bodyRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                aria-live="polite"
                style={{ background: 'var(--bg-primary)' }}
              >
                {/* Quick prompts */}
                {messages.length <= 1 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {QUICK_PROMPTS.map(p => (
                      <button
                        key={p}
                        onClick={() => send(p)}
                        className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border transition-colors hover:border-[var(--accent)]"
                        style={{
                          color: 'var(--text-secondary)',
                          borderColor: 'var(--border)',
                          background: 'var(--surface-elevated)',
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`group flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`relative max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm sm:text-[12.5px] leading-relaxed ${
                        m.role === 'user' ? 'assistant-message-user' : 'assistant-message-bot'
                      }`}
                      style={
                        m.role === 'user'
                          ? { background: 'var(--accent)', color: 'var(--accent-contrast)' }
                          : {
                              background: 'var(--surface-elevated)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border)',
                            }
                      }
                    >
                      <span style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
                      {m.role === 'bot' && m.card && renderCard(m.card, onCardAction)}
                    </div>
                    <div
                      className="flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-[9.5px] uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)' }}>
                        {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <CopyBtn text={m.content} />
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isGenerating && (
                  <div className="flex items-center gap-1 px-2 py-1.5" aria-label="Elios AI is typing">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: 'var(--accent)',
                          animation: 'assistant-caret 1.2s infinite',
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={e => { e.preventDefault(); send(); }}
                className="flex items-end gap-2 px-3 py-2.5 border-t"
                style={{
                  background: 'var(--bg-elevated, var(--bg-card))',
                  borderColor: 'var(--border)',
                }}
              >
                {supportsVoice && (
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{
                      background: isListening ? 'var(--accent)' : 'var(--surface-elevated)',
                      color: isListening ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}
                    aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>
                )}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      send();
                    }
                    if (e.key === 'ArrowUp' && inputHistory.length > 0) {
                      e.preventDefault();
                      const next = hIndex === null ? inputHistory.length - 1 : Math.max(0, hIndex - 1);
                      setHIndex(next);
                      setInput(inputHistory[next] || '');
                    }
                    if (e.key === 'ArrowDown' && hIndex !== null) {
                      e.preventDefault();
                      const next = hIndex + 1;
                      if (next >= inputHistory.length) { setHIndex(null); setInput(''); return; }
                      setHIndex(next);
                      setInput(inputHistory[next] || '');
                    }
                  }}
                  placeholder="Ask me anything…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent border-0 outline-none text-base sm:text-[13px]"
                  style={{
                    color: 'var(--text-primary)',
                    maxHeight: 84,
                    minHeight: 32,
                  }}
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating}
                  className="p-2 rounded-lg flex-shrink-0 transition-opacity disabled:opacity-40"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--accent-contrast)',
                  }}
                  aria-label="Send"
                >
                  <Send size={14} />
                </button>
              </form>

              {/* Footer */}
              <div
                className="flex items-center justify-between gap-2 px-4 py-2 border-t text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: 'var(--bg-elevated, var(--bg-card))',
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={11} />
                  Scripted KB · no data leaves browser
                </span>
                <span>
                  {rateRemaining}/{RATE_MAX} this min
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

// Minimal type stub for the SpeechRecognition API.
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
