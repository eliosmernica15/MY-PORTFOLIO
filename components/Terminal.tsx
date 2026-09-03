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
  | { type: 'set_theme'; theme: 'dark' | 'light' | 'toggle' }
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
        // The previous version hard-coded `theme: 'dark'`, so
        // `theme toggle` always switched to dark regardless of the
        // current state. Now we send `theme: 'toggle'` and let
        // `executeAction` invoke the provider's toggleTheme(), which
        // flips based on the current value.
        return { output: 'Toggling theme…', action: { type: 'set_theme', theme: 'toggle' } };
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

// Theme reader. The layout always wraps the tree with `<ThemeProvider>`
// (see app/Providers.tsx), so `useTheme()` is guaranteed to be in
// context. The previous `try/catch` was a defensive wrapper that
// violated the rules of hooks (a thrown `useContext` meant some
// hooks were called less often than expected) and paid a try/catch
// cost on every render of every Terminal instance.
function useOptionalTheme() {
  return useTheme();
}

// ---------- Component ----------

export default function Terminal({}: TerminalProps = {}) {
  // Theme is always available (the layout wraps with ThemeProvider).
  const { theme: currentTheme, toggleTheme } = useOptionalTheme();
  // Set a specific theme value, or toggle. `toggleTheme` flips based
  // on the current state and is what the `theme toggle` command uses
  // (the previous version always set theme to 'dark', which was a
  // bug — toggle from light should go to dark, toggle from dark
  // should go to light).
  const setTheme = useCallback(
    (next: 'dark' | 'light' | 'toggle') => {
      if (next === 'toggle') {
        toggleTheme();
        return;
      }
      if (currentTheme !== next) toggleTheme();
    },
    [currentTheme, toggleTheme]
  );

  const reduced = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  // `position` is the source of truth for what's rendered; the
  // localStorage-backed state is only written on drag END (mouseup).
  // The previous implementation passed `setPosition` into the
  // mousemove handler, which meant a synchronous
  // `JSON.stringify` + `localStorage.setItem` on every frame of
  // the drag (potentially 60+/sec). That's a measurable hitch on
  // mobile and a battery sink on desktop. The `committedPosition`
  // ref tracks the last value that was actually persisted so a
  // later resize-clamp knows what's "live" without re-reading
  // localStorage.
  const [committedPosition, setCommittedPosition] = useLocalStorage<{ x: number; y: number }>(
    'terminal-pos',
    { x: 24, y: 24 }
  );
  const [position, setPosition] = useState(committedPosition);
  const positionRef = useRef(committedPosition);
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
      // stale coords are pure dead weight. We update both the local
      // `position` state and the persisted localStorage value so the
      // snap-back survives a reload.
      if (mobile) {
        positionRef.current = { x: 24, y: 24 };
        setPosition({ x: 24, y: 24 });
        setCommittedPosition({ x: 24, y: 24 });
      }
      // On mobile, `minimized` is meaningless (the panel is fullscreen), so
      // force it off — otherwise a resize that crosses the 640px boundary
      // would leave the panel as a 100dvh strip with only the header.
      if (mobile) setMinimized(false);
      // If a desktop user shrank the window so the dragged position would
      // push the panel off-screen, snap it back to the default corner.
      // The clamp matches the drag handler: `y` is the offset from 80px
      // from the viewport top, so the max is `innerHeight - 80 - panelH`.
      if (!mobile) {
        const panelW = Math.min(560, window.innerWidth * 0.9);
        const panelH = Math.min(420, window.innerHeight * 0.7);
        const maxX = Math.max(0, window.innerWidth - panelW);
        const maxY = Math.max(0, window.innerHeight - 80 - panelH - 16);
        if (positionRef.current.x > maxX || positionRef.current.y > maxY) {
          const reset = { x: 24, y: 24 };
          positionRef.current = reset;
          setPosition(reset);
          setCommittedPosition(reset);
        }
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

  // Keyboard shortcut to toggle the panel (open/close).
  useKeyShortcut({ key: '`', handler: () => setIsOpen(v => !v) }, true);

  // Keyboard shortcut to toggle minimize: ⌘/Ctrl+M. Only meaningful on
  // desktop — on mobile the panel is fullscreen, so minimize = close.
  useKeyShortcut({
    key: 'm',
    meta: true,
    handler: () => {
      setIsOpen(prevOpen => {
        if (!prevOpen) return true;
        if (isMobile) return false; // mobile: Ctrl+M closes
        setMinimized(prevMin => !prevMin);
        return true;
      });
    },
  }, isOpen);

  // Esc handling. On desktop, Esc minimizes so users can dismiss the
  // panel without losing their session. On mobile (fullscreen), Esc
  // closes outright.
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
  }, [isOpen, isMobile]);

  // Note: we intentionally do NOT auto-minimize on click-outside. The
  // user explicitly minimizes via the header dot, the trigger button, or
  // Esc. Auto-minimizing on every outside click interferes with normal
  // page interaction (clicking a project link, a card, etc.) and the
  // session is already preserved by the explicit minimize affordances.

  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen && !minimized);

  // Belt-and-suspenders: when `minimized` flips, force the panel's height
  // directly on the DOM element with `!important`. The CSS rule already
  // does this, but some devices / browsers intermittently ignore the
  // attribute-driven `!important` (especially right after a state flip
  // when the previous frame's height transition is still resolving).
  // Setting the property with `important` priority from JS guarantees
  // the panel collapses to a 44px bar on every device.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (!isMobile && minimized) {
      el.style.setProperty('height', '44px', 'important');
      el.style.setProperty('min-height', '44px', 'important');
      el.style.setProperty('max-height', '44px', 'important');
    } else if (!isMobile && !minimized) {
      // Clear the `!important` overrides so the React inline style and
      // the expanded CSS can take over again.
      el.style.removeProperty('height');
      el.style.removeProperty('min-height');
      el.style.removeProperty('max-height');
    }
  }, [minimized, isMobile, isOpen]);
  // Stable callback ref that writes to both the panel ref and the
  // focus-trap ref. Using a single `useCallback` (rather than a fresh
  // function inline) means React doesn't see a new ref identity on
  // every render — which prevents the ref-callback from being
  // invoked on every render and re-asserting the focus trap.
  // `focusTrapRef` and `panelRef` are `useRef` objects whose identity
  // is stable across renders, so the empty dep array is correct.
  const combinedRef = useCallback(
    (el: HTMLDivElement | null) => {
      (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      (focusTrapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
        setTheme(action.theme);
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
    if (minimized) return; // No drag on a minimized panel — it's a small bar
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: positionRef.current.x,
      baseY: positionRef.current.y,
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
      // The panel is positioned from the top with `top: calc(80px + y)px`.
      // Dragging the mouse up (dy negative) should move the panel up, so
      // `y` should *decrease* as the mouse moves up. The clamp ensures
      // the panel's bottom edge stays at least 16px above the viewport
      // bottom: `80 + y + panelH <= innerHeight - 16` →
      // `y <= innerHeight - 80 - panelH - 16`.
      const panelH = Math.min(420, window.innerHeight * 0.7);
      const maxY = Math.max(0, window.innerHeight - 80 - panelH - 16);
      const next = {
        x: Math.max(0, Math.min(maxX, dragRef.current.baseX + dx)),
        y: Math.max(0, Math.min(maxY, dragRef.current.baseY + dy)),
      };
      // Update the in-memory ref + render state on every move so
      // the panel tracks the cursor, but DO NOT persist to
      // localStorage here. Persistence happens on `mouseup` below.
      positionRef.current = next;
      setPosition(next);
    };
    const onUp = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false;
        document.body.style.userSelect = '';
        // Commit the final position to localStorage now that the
        // drag is over. One write per drag instead of one per
        // frame.
        setCommittedPosition(positionRef.current);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [setPosition, setCommittedPosition]);

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
    // When minimized, pin the panel ABOVE the trigger button (not on top
    // of it) so the user can see both. The trigger is ~44px tall and sits
    // at `bottom: 24px` (desktop) or `bottom: 16px` (mobile), plus the
    // safe-area inset. We add 8px of breathing room.
    if (minimized) {
      return {
        position: 'fixed',
        left: 16,
        bottom: 'calc(76px + env(safe-area-inset-bottom))',
        zIndex: 80,
        width: 'min(360px, 80vw)',
        // Match the header's `py-2` (8px × 2 = 16px) + content (~18px
        // buttons) + the 1px border. 44px is tight and clean.
        height: 44,
        maxHeight: 44,
      };
    }
    return {
      position: 'fixed',
      // `position.y` is the distance from the bottom (set by the drag
      // handler — it increases when the user drags up). We position the
      // panel from the top of the viewport, offset by 80px of breathing
      // room and the safe-area inset. The clamp in the drag handler
      // ensures `position.y` never pushes the panel off the top.
      top: `calc(80px + ${position.y}px + env(safe-area-inset-top))`,
      left: `${position.x}px`,
      zIndex: 80,
      width: 'min(560px, 90vw)',
      height: 'min(420px, 70vh)',
      maxHeight: '70vh',
    };
  }, [isMobile, position, minimized]);

  // Trigger button click — single button that always does the right thing:
  // closed → open; open & expanded → minimize (desktop) or close (mobile);
  // open & minimized → expand.
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

  return (
    <>
      {/* Trigger button — always rendered so the user can re-open
          the panel after closing it. When the panel is open, this
          button toggles the minimize state on desktop. */}
      <button
        type="button"
        onClick={onTriggerClick}
        data-floating-trigger
        data-open={isOpen ? 'true' : 'false'}
        data-minimized={isOpen && minimized ? 'true' : 'false'}
        className="floating-trigger group fixed left-4 sm:left-6 bottom-4 sm:bottom-6 z-[60] flex items-center gap-2 rounded-full pl-3 pr-3 sm:pr-4 py-3 transition-all duration-300"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(16px)',
          color: 'var(--text-secondary)',
          boxShadow: '0 10px 40px -10px var(--shadow-accent)',
          // Keep clear of the iOS home indicator on devices that have one.
          marginBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-label={isOpen && !isMobile ? (minimized ? 'Expand terminal' : 'Minimize terminal') : 'Open terminal'}
        aria-expanded={isOpen}
        data-cursor-hover
      >
        {isOpen && !isMobile ? (
          // When expanded, show a chevron so the button reads as "collapse".
          minimized ? (
            <TerminalIcon size={18} style={{ color: 'var(--accent)' }} />
          ) : (
            <Minus size={18} style={{ color: 'var(--accent)' }} />
          )
        ) : (
          <TerminalIcon size={18} style={{ color: 'var(--accent)' }} />
        )}
        <span className="hidden sm:inline text-xs font-mono font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">
          {isOpen && !isMobile ? (minimized ? 'Expand' : 'Minimize') : 'Terminal'}
        </span>
        {isOpen && !isMobile && (
          // "Live" pulse on the trigger when the panel is open & minimized,
          // so the user knows the session is still running.
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
          className="terminal-floating flex flex-col font-mono"
          style={panelStyle}
          role="dialog"
          aria-modal={isMobile ? 'true' : 'false'}
          aria-label="Terminal"
        >
          {/* Header / drag handle (or expand button when minimized) */}
          <div
            onMouseDown={onHeaderMouseDown}
            onClick={minimized ? () => setMinimized(false) : undefined}
            role={minimized ? 'button' : undefined}
            aria-label={minimized ? 'Expand terminal' : undefined}
            className={`flex items-center justify-between select-none transition-colors ${
              minimized
                ? 'px-3 py-2 cursor-pointer hover:bg-[var(--surface-elevated)]'
                : 'border-b px-4 py-2.5'
            }`}
            style={{
              background: 'var(--bg-elevated, var(--bg-card))',
              borderColor: 'var(--border)',
              cursor: isMobile ? 'default' : (minimized ? 'pointer' : 'move'),
              userSelect: 'none',
              // The header shrinks to its content height (py-2 + buttons).
              // Critically, NOT `height: 100%` — that would make the header
              // fill the whole panel and push the body to 0px.
              flexShrink: 0,
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {!minimized && (
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                    aria-label="Close terminal"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); isMobile ? setIsOpen(false) : setMinimized(v => !v); }}
                    className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors"
                    aria-label={minimized ? 'Expand terminal' : 'Minimize terminal'}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 transition-colors"
                    aria-hidden
                  />
                </div>
              )}
              {minimized ? (
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] truncate"
                  style={{ color: 'var(--text-primary)' }}>
                  <TerminalIcon size={14} style={{ color: 'var(--accent)' }} />
                  Terminal
                  <span
                    className="ml-1 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--shadow-accent)',
                      animation: 'pulse-live 2s ease-in-out infinite',
                    }}
                    aria-hidden
                  />
                </span>
              ) : (
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] ml-2 truncate"
                  style={{ color: 'var(--text-muted)' }}>
                  elios@portfolio: ~$
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {isOpen && !minimized && (
                <span className="text-[10px] mr-2 font-bold uppercase tracking-widest hidden sm:inline"
                  style={{ color: 'var(--text-muted)' }}>
                  {currentTheme}
                </span>
              )}
              {!isMobile && (
                <button
                  onClick={(e) => { e.stopPropagation(); setMinimized(v => !v); }}
                  className="p-1 rounded opacity-70 hover:opacity-100 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label={minimized ? 'Expand' : 'Minimize'}
                  title={minimized ? 'Expand (⌘M)' : 'Minimize (⌘M)'}
                >
                  <Minus size={14} />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="p-1 rounded opacity-70 hover:opacity-100 transition-colors"
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
