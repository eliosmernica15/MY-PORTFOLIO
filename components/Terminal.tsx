'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Minus, X, Maximize2 } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useKeyShortcut } from '@/hooks/useKeyShortcut';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { PROJECTS } from '@/data/projects';
import { SERVICES } from '@/data/services';
import { SKILL_CATEGORIES } from '@/data/skills';
import { NOTES } from '@/data/notes';
import { NOW } from '@/data/now';
import { SITE } from '@/data/site';
import { useTheme } from '../context/ThemeContext';
import { play } from '@/lib/sound';

// ---------- Types ----------

type TerminalAction =
  | { type: 'scroll_to'; target: string }
  | { type: 'open_link'; target: string }
  | { type: 'open_route'; target: string }
  | { type: 'set_theme'; theme: 'dark' | 'light' }
  | { type: 'clear' };

type CommandOutput = string | { output: string; action?: TerminalAction };

type TerminalMessage = {
  id: string;
  prompt: string;
  text: string;
  ts: number;
};

interface TerminalProps {
  // optional — when not provided, the `theme` command degrades gracefully.
}

// ---------- Command map ----------

const COMMANDS: Record<string, { description: string; run: (args: string[]) => CommandOutput }> = {
  help: {
    description: 'List every command with a one-line description.',
    run: () => {
      const list = Object.entries(COMMANDS)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, c]) => `  ${name.padEnd(14)}  ${c.description}`)
        .join('\n');
      return {
        output: `Available commands:\n${list}\n\nTip: ⌘/ctrl+L clears the buffer. Esc closes.`,
      };
    },
  },

  about: {
    description: 'A short bio.',
    run: () => `${SITE.name} — ${SITE.title}. ${SITE.tagline}`,
  },

  whoami: {
    description: 'Easter egg.',
    run: () => 'elios@worldwide',
  },

  projects: {
    description: 'List projects with id, title, year.',
    run: () => {
      const lines = PROJECTS.map(
        p => `  ${p.id.padEnd(12)}  ${p.title}  (${p.year})  [${p.category}]`,
      );
      return `Projects (${PROJECTS.length}):\n${lines.join('\n')}\n\nTry \`repo <id>\` to open a case study.`;
    },
  },

  skills: {
    description: 'Categorized skill list.',
    run: () => {
      const sections = SKILL_CATEGORIES.map(cat => {
        const list = cat.skills.map(s => `    ${s.name.padEnd(28)} ${'●'.repeat(s.level)}`).join('\n');
        return `[${cat.name}]\n${list}`;
      });
      return sections.join('\n\n');
    },
  },

  services: {
    description: 'List the services I offer.',
    run: () => {
      const lines = SERVICES.map(s => `  ${s.number}  ${s.title}\n      ${s.desc}`);
      return `Services (${SERVICES.length}):\n${lines.join('\n\n')}`;
    },
  },

  now: {
    description: 'What I am focused on right now.',
    run: () => `Now: ${NOW.line}\nLast updated: ${NOW.updatedAt}`,
  },

  contact: {
    description: 'Scroll to the contact form.',
    run: () => ({
      output: `Email ${SITE.email} or use the form below. Opening it…`,
      action: { type: 'scroll_to' as const, target: '#contact' },
    }),
  },

  cv: {
    description: 'Download the CV.',
    run: () => ({
      output: 'Downloading CV…',
      action: { type: 'open_link' as const, target: '/Elios-Mernica-CV.pdf' },
    }),
  },

  theme: {
    description: 'theme dark|light|toggle',
    run: (args) => {
      const arg = (args[0] || '').toLowerCase();
      if (arg === 'dark' || arg === 'light') {
        return { output: `Switching to ${arg}…`, action: { type: 'set_theme', theme: arg } };
      }
      if (arg === 'toggle' || arg === '') {
        return { output: 'Toggling theme…', action: { type: 'set_theme', theme: 'dark' } }; // ThemeProvider applies the toggle effect
      }
      return 'Usage: theme dark | light | toggle';
    },
  },

  clear: {
    description: 'Clear the message buffer.',
    run: () => ({ output: '', action: { type: 'clear' } }),
  },

  history: {
    description: 'Show recently run commands.',
    run: () => '(history is shown as you scroll with ↑/↓)',
  },

  sudo: {
    description: 'Easter egg.',
    run: (args) =>
      args.length === 0
        ? "sudo what? Try \`sudo rm -rf /\` for a laugh."
        : "Permission denied: you're not in the sudoers file. This incident will be reported (to nobody, because I have no logs).",
  },

  matrix: {
    description: 'Easter egg.',
    run: () =>
      'There is no spoon. There is only the codebase.\n(Tip: the hero has a live particle field — go look.)',
  },

  coffee: {
    description: 'Easter egg.',
    run: () => 'I run on espresso and well-named variables. Ratio: 1:3, espresso to variables, on a good day.',
  },

  github: {
    description: 'Open the GitHub activity section.',
    run: () => ({
      output: 'Opening the GitHub section…',
      action: { type: 'scroll_to' as const, target: '#github' },
    }),
  },

  echo: {
    description: 'echo <text>',
    run: (args) => args.join(' '),
  },

  date: {
    description: 'Current date and time.',
    run: () => new Date().toString(),
  },

  repo: {
    description: 'repo <projectId> — open a project case study.',
    run: (args) => {
      const id = (args[0] || '').toLowerCase();
      const p = PROJECTS.find(p => p.id === id);
      if (!p) {
        const known = PROJECTS.map(p => p.id).join(', ');
        return `Unknown project "${id}". Try one of: ${known}.`;
      }
      return {
        output: `Opening /project/${p.id}…`,
        action: { type: 'open_link' as const, target: `/project/${p.id}` },
      };
    },
  },

  note: {
    description: 'note <slug> — open a writing post.',
    run: (args) => {
      const slug = (args[0] || '').toLowerCase();
      const n = NOTES.find(n => n.slug === slug);
      if (!n) {
        const known = NOTES.map(n => n.slug).join(', ');
        return `Unknown note "${slug}". Try one of: ${known}.`;
      }
      return {
        output: `Opening /notes/${n.slug}…`,
        action: { type: 'open_link' as const, target: `/notes/${n.slug}` },
      };
    },
  },

  open: {
    description: 'open <sectionId> — scroll to a section by id.',
    run: (args) => {
      const id = args[0] || '';
      if (!id) return 'Usage: open <sectionId>';
      return {
        output: `Scrolling to #${id}…`,
        action: { type: 'scroll_to' as const, target: `#${id}` },
      };
    },
  },
};

const COMMAND_NAMES = Object.keys(COMMANDS);

function longestCommonPrefix(items: string[]): string {
  if (items.length === 0) return '';
  let prefix = items[0];
  for (let i = 1; i < items.length; i++) {
    const s = items[i];
    let j = 0;
    while (j < prefix.length && j < s.length && prefix[j] === s[j]) j++;
    prefix = prefix.slice(0, j);
    if (!prefix) return '';
  }
  return prefix;
}

// Optional theme reader. Always returns the same shape regardless of whether
// the provider is mounted, so the rules-of-hooks lint rule passes.
function useOptionalTheme(): { theme: 'dark' | 'light'; toggleTheme?: () => void } {
  try {
    return useTheme();
  } catch {
    return { theme: 'dark' as const };
  }
}

// ---------- Component ----------

export default function Terminal({}: TerminalProps = {}) {
  // Optional theme — if the provider isn't mounted we just no-op the theme command.
  const themeResult = useOptionalTheme();
  const currentTheme: 'dark' | 'light' = themeResult.theme;
  const setTheme = useCallback((next: 'dark' | 'light') => {
    if (themeResult.theme !== next) themeResult.toggleTheme?.();
  }, [themeResult]);

  const reduced = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useLocalStorage<{ x: number; y: number }>('terminal-pos', { x: 24, y: 24 });
  const [history, setHistory] = useLocalStorage<string[]>('terminal-history', []);
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [input, setInput] = useState('');
  const [hIndex, setHIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; baseX: number; baseY: number }>({
    active: false, startX: 0, startY: 0, baseX: 0, baseY: 0,
  });

  // Mobile check.
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      // Reset stale desktop drag position when entering mobile width — the
      // `position.x/y` from a 1920×1080 drag would push the panel off-screen
      // on a 375×667 phone. Mobile uses full-bleed `inset: 0` anyway, so the
      // stale coords are pure dead weight.
      if (mobile && (position.x !== 24 || position.y !== 24)) {
        setPosition({ x: 24, y: 24 });
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Seed welcome on first open.
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: '0', prompt: 'elios', text: 'Welcome — type \`help\` to list commands. Esc to close. ⌘/ctrl+L to clear.', ts: Date.now() },
      ]);
      play('boot');
    }
  }, [isOpen, messages.length]);

  // Autoscroll to bottom.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  // Focus input when open.
  useEffect(() => {
    if (isOpen && !minimized) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, minimized]);

  // Keyboard shortcut to open.
  useKeyShortcut({ key: '`', handler: () => setIsOpen(v => !v) }, true);

  // Esc closes.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
      // Ctrl/Cmd+L clears
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        runClear();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen && !minimized);
  const combinedRef = (el: HTMLDivElement | null) => {
    (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    (focusTrapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  const runClear = useCallback(() => {
    setMessages([{ id: String(Date.now()), prompt: 'elios', text: 'Buffer cleared.', ts: Date.now() }]);
  }, []);

  const executeAction = useCallback((action: TerminalAction | undefined) => {
    if (!action) return;
    switch (action.type) {
      case 'scroll_to': {
        const el = document.querySelector(action.target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'open_link':
      case 'open_route': {
        window.open(action.target, '_blank', 'noopener,noreferrer');
        break;
      }
      case 'clear':
        runClear();
        break;
      case 'set_theme':
        if (setTheme) setTheme(action.theme);
        break;
    }
  }, [runClear, setTheme]);

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    const args = cmd.split(/\s+/);
    const name = args[0].toLowerCase();
    setInput('');
    setHIndex(null);

    // Push to history (de-duped consecutive).
    setHistory(prev => {
      const next = prev[prev.length - 1] === cmd ? prev : [...prev, cmd].slice(-50);
      return next;
    });

    // Find the command.
    const command = COMMANDS[name];
    const ts = Date.now();
    const userMsg: TerminalMessage = { id: `u-${ts}`, prompt: '$', text: cmd, ts };
    setMessages(prev => [...prev, userMsg]);

    if (!command) {
      play('error');
      setMessages(prev => [...prev, { id: `b-${ts}`, prompt: '', text: `command not found: ${name}. Type \`help\` for a list.`, ts }]);
      return;
    }

    const result = command.run(args.slice(1));
    const { output, action } = typeof result === 'string' ? { output: result, action: undefined } : result;
    if (action?.type !== 'clear') {
      setMessages(prev => [...prev, { id: `b-${ts}`, prompt: '', text: output, ts }]);
    }
    executeAction(action);
  }, [input, setHistory, executeAction]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistory(prev => {
        if (prev.length === 0) return prev;
        const next = hIndex === null ? prev.length - 1 : Math.max(0, hIndex - 1);
        setHIndex(next);
        setInput(prev[next] || '');
        return prev;
      });
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistory(prev => {
        if (prev.length === 0 || hIndex === null) return prev;
        const next = hIndex + 1;
        if (next >= prev.length) {
          setHIndex(null);
          setInput('');
          return prev;
        }
        setHIndex(next);
        setInput(prev[next] || '');
        return prev;
      });
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial || partial.includes(' ')) return;
      const matches = COMMAND_NAMES.filter(c => c.startsWith(partial));
      if (matches.length === 1) {
        setInput(matches[0] + ' ');
        return;
      }
      if (matches.length > 1) {
        const lcp = longestCommonPrefix(matches);
        if (lcp.length > partial.length) {
          setInput(lcp);
        } else {
          setMessages(prev => [
            ...prev,
            { id: `b-${Date.now()}`, prompt: '', text: matches.join('  '), ts: Date.now() },
          ]);
        }
      }
    }
  }, [input, hIndex, setHistory]);

  // ---- Drag handling ----
  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: position.x,
      baseY: position.y,
    };
    document.body.style.userSelect = 'none';
  };
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      // Panel width on desktop is min(560px, 90vw). Mirror that math so the
      // panel can't slide past the right edge of the viewport.
      const panelW = Math.min(560, window.innerWidth * 0.9);
      const maxX = Math.max(0, window.innerWidth - panelW);
      const maxY = window.innerHeight - 80;
      setPosition({
        x: Math.max(0, Math.min(maxX, dragRef.current.baseX + dx)),
        y: Math.max(0, Math.min(maxY, dragRef.current.baseY - dy)),
      });
    };
    const onUp = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false;
        document.body.style.userSelect = '';
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [setPosition]);

  // Build style based on mobile vs. floating.
  const panelStyle = useMemo<React.CSSProperties>(() => {
    if (isMobile) {
      return {
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        margin: 0,
        width: '100vw',
        height: '100dvh',
        // iPhone notch + home indicator: pad the panel's interactive surfaces
        // so the close button stays reachable and the input isn't hidden
        // behind the indicator.
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        borderRadius: 0,
      };
    }
    return {
      position: 'fixed',
      bottom: `calc(80px - ${position.y}px)`,
      left: `${position.x}px`,
      zIndex: 80,
      width: 'min(560px, 90vw)',
      height: minimized ? 'auto' : 'min(420px, 70vh)',
      maxHeight: '70vh',
    };
  }, [isMobile, position, minimized]);

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        className="group fixed left-4 sm:left-6 bottom-4 sm:bottom-6 z-[60] flex items-center gap-2 rounded-full pl-3 pr-3 sm:pr-4 py-3 transition-all duration-300"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(16px)',
          color: 'var(--text-secondary)',
          boxShadow: '0 10px 40px -10px var(--shadow-accent)',
          // Keep clear of the iOS home indicator on devices that have one.
          marginBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-label="Open terminal"
        data-cursor-hover
      >
        <TerminalIcon size={18} style={{ color: 'var(--accent)' }} />
        <span className="hidden sm:inline text-xs font-mono font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">
          Terminal
        </span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          ref={combinedRef}
          className="terminal-floating flex flex-col font-mono"
          style={panelStyle}
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
        >
          {/* Header / drag handle */}
          <div
            onMouseDown={onHeaderMouseDown}
            className="flex items-center justify-between px-4 py-2.5 border-b select-none"
            style={{
              background: 'var(--bg-elevated, var(--bg-card))',
              borderColor: 'var(--border)',
              cursor: isMobile ? 'default' : 'move',
              userSelect: 'none',
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                  aria-label="Close terminal"
                />
                <button
                  onClick={() => setMinimized(v => !v)}
                  className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors"
                  aria-label={minimized ? 'Expand terminal' : 'Minimize terminal'}
                />
                <button
                  onClick={() => setMinimized(false)}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors"
                  aria-label="Restore terminal"
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] ml-2 truncate"
                style={{ color: 'var(--text-muted)' }}>
                elios@portfolio: ~$
              </span>
            </div>
            <div className="flex items-center gap-1">
              {isOpen && !minimized && (
                <span className="text-[10px] mr-2 font-bold uppercase tracking-widest hidden sm:inline"
                  style={{ color: 'var(--text-muted)' }}>
                  {currentTheme}
                </span>
              )}
              <button
                onClick={() => setMinimized(v => !v)}
                className="p-1 rounded opacity-70 hover:opacity-100"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Minimize"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded opacity-70 hover:opacity-100"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Body */}
              <div
                ref={bodyRef}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 text-sm sm:text-[12.5px] leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
                aria-live="polite"
              >
                {messages.map(m => (
                  <div key={m.id} className="whitespace-pre-wrap break-words">
                    {m.prompt && (
                      <span className="mr-1.5" style={{ color: 'var(--accent)' }}>
                        {m.prompt === '$' ? '$' : `${m.prompt}@portfolio`}
                      </span>
                    )}
                    <span style={{ color: m.prompt ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={onSubmit}
                className="flex items-center gap-2 px-4 py-3 border-t"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated, var(--bg-card))' }}
              >
                <span style={{ color: 'var(--accent)' }} className="font-bold text-sm">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent border-0 outline-none text-base sm:text-[12.5px] font-mono"
                  style={{ color: 'var(--text-primary)' }}
                  placeholder="type \`help\` for commands"
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
                <Maximize2 size={11} className="opacity-30" style={{ color: 'var(--text-muted)' }} />
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
