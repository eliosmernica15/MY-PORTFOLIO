'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Command, ChevronRight, ExternalLink, FileText,
  Code, BookOpen, Settings, Sparkles, Keyboard, X,
  ArrowUp, ArrowDown, Github, Mail, Link2,
} from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { SKILL_CATEGORIES } from '@/data/skills';
import { NOTES } from '@/data/notes';
import { SERVICES } from '@/data/services';
import { SITE } from '@/data/site';
import { CONTACT_INFO } from '@/data/contact-info';
import { useKeyShortcut } from '@/hooks/useKeyShortcut';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import AdvancedButton from './ui/AdvancedButton';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
  shortcut?: string;
}

interface CommandPaletteProps {
  /** Whether the palette is open */
  isOpen: boolean;
  /** Callback when palette closes */
  onClose: () => void;
}

/**
 * CommandPalette - Global fuzzy search interface (⌘K)
 * Features:
 * - Fuzzy search across projects, skills, notes, commands, settings
 * - Keyboard navigation (↑/↓, Enter, Esc)
 * - Categorized results with icons
 * - Keyboard shortcuts display
 * - Respects reduced motion
 * - Accessible (ARIA roles, keyboard navigation)
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Build command items
  const allCommands = useMemo((): CommandItem[] => {
    const commands: CommandItem[] = [];

    // Projects
    PROJECTS.forEach((project) => {
      commands.push({
        id: `project-${project.id}`,
        title: project.title,
        description: project.description,
        category: 'Projects',
        icon: <Code size={16} />,
        action: () => window.open(`/project/${project.id}`, '_self'),
        keywords: [project.title, project.category, ...project.tech, project.id],
        shortcut: `⌘K → ${project.title}`,
      });
    });

    // Skills
    SKILL_CATEGORIES.forEach((category) => {
      category.skills.forEach((skill) => {
        commands.push({
          id: `skill-${skill.name.toLowerCase()}`,
          title: skill.name,
          description: `${category.name} • Level ${skill.level}/5`,
          category: 'Skills',
          icon: <Sparkles size={16} />,
          action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }),
          keywords: [skill.name, category.name, 'skill', 'technology'],
        });
      });
    });

    // Notes/Blog posts
    NOTES.forEach((note) => {
      commands.push({
        id: `note-${note.slug}`,
        title: note.title,
        description: note.summary,
        category: 'Writings',
        icon: <FileText size={16} />,
        action: () => window.open(`/notes/${note.slug}`, '_self'),
        keywords: [note.title, note.summary, note.slug, ...note.tags || []],
      });
    });

    // Services
    SERVICES.forEach((service) => {
      commands.push({
        id: `service-${service.id}`,
        title: service.title,
        description: service.desc,
        category: 'Services',
        icon: <Code size={16} />,
        action: () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }),
        keywords: [service.title, service.desc, 'service'],
      });
    });

    // Navigation/Sections
    const sections = [
      { id: 'home', title: 'Home', desc: 'Go to hero section', icon: <Sparkles size={16} />, target: '#home' },
      { id: 'about', title: 'About Me', desc: 'View about section', icon: <BookOpen size={16} />, target: '#about' },
      { id: 'projects', title: 'Projects', desc: 'View all projects', icon: <Code size={16} />, target: '#projects' },
      { id: 'services', title: 'Services', desc: 'View services offered', icon: <Settings size={16} />, target: '#services' },
      { id: 'skills', title: 'Skills', desc: 'View skills & expertise', icon: <Sparkles size={16} />, target: '#skills' },
      { id: 'resume', title: 'Resume', desc: 'View experience & education', icon: <FileText size={16} />, target: '#resume' },
      { id: 'contact', title: 'Contact', desc: 'Get in touch', icon: <Mail size={16} />, target: '#contact' },
    ];

    sections.forEach((section) => {
      commands.push({
        id: `nav-${section.id}`,
        title: section.title,
        description: section.desc,
        category: 'Navigation',
        icon: section.icon,
        action: () => document.querySelector(section.target)?.scrollIntoView({ behavior: 'smooth' }),
        keywords: [section.title.toLowerCase(), 'go to', 'navigate', section.id],
        shortcut: `⌘K → ${section.title}`,
      });
    });

    // External links
    commands.push(
      {
        id: 'github',
        title: 'GitHub Profile',
        description: 'Open GitHub profile in new tab',
        category: 'External',
        icon: <Github size={16} />,
        action: () => window.open('https://github.com/eliosmernica15', '_blank', 'noopener,noreferrer'),
        keywords: ['github', 'profile', 'code', 'repositories'],
        shortcut: '⌘K → gh',
      },
      {
        id: 'linkedin',
        title: 'LinkedIn Profile',
        description: 'Open LinkedIn profile in new tab',
        category: 'External',
        icon: <Link2 size={16} />,
        action: () => window.open('https://www.linkedin.com/in/elios-mernica-880562204/', '_blank', 'noopener,noreferrer'),
        keywords: ['linkedin', 'profile', 'professional'],
        shortcut: '⌘K → li',
      },
      {
        id: 'email',
        title: 'Email Me',
        description: 'Open email client',
        category: 'External',
        icon: <Mail size={16} />,
        action: () => window.open(`mailto:${CONTACT_INFO.email}`, '_self'),
        keywords: ['email', 'contact', 'mail', 'hire'],
        shortcut: '⌘K → em',
      }
    );

    // Settings/Actions
    commands.push(
      {
        id: 'theme-toggle',
        title: 'Toggle Theme',
        description: 'Switch between light and dark mode',
        category: 'Settings',
        icon: <Sparkles size={16} />,
        action: () => {
          // Persist through the unified theme config (the single source
          // of truth ThemeProvider reads); data-theme itself is applied
          // by ThemeProvider's config effect (and the palette sync
          // observer keeps colors consistent).
          const html = document.documentElement;
          const current = html.getAttribute('data-theme');
          const newMode = current === 'dark' ? 'light' : 'dark';
          html.setAttribute('data-theme', newMode);
          try {
            const raw = localStorage.getItem('elios-theme-config');
            const cfg = raw ? JSON.parse(raw) : {};
            localStorage.setItem('elios-theme-config', JSON.stringify({ ...cfg, mode: newMode }));
          } catch {}
        },
        keywords: ['theme', 'dark', 'light', 'toggle', 'mode'],
        shortcut: '⌘K → th',
      },
      {
        id: 'download-cv',
        title: 'Download CV',
        description: 'Download resume as PDF',
        category: 'Actions',
        icon: <FileText size={16} />,
        action: () => window.open('/Elios-Mernica-CV.pdf', '_blank', 'noopener,noreferrer'),
        keywords: ['cv', 'resume', 'download', 'pdf'],
        shortcut: '⌘K → cv',
      },
      {
        id: 'copy-email',
        title: 'Copy Email',
        description: 'Copy email address to clipboard',
        category: 'Actions',
        icon: <Mail size={16} />,
        action: () => navigator.clipboard.writeText(CONTACT_INFO.email),
        keywords: ['copy', 'email', 'clipboard'],
        shortcut: '⌘K → ce',
      }
    );

    return commands;
  }, []);

  // Fuzzy search function
  const fuzzyMatch = (query: string, text: string): { score: number; indices: number[] } => {
    if (!query.trim()) return { score: 0, indices: [] };
    if (!text) return { score: -1, indices: [] };

    const q = query.toLowerCase();
    const t = text.toLowerCase();

    let score = 0;
    let lastIndex = -1;
    const indices: number[] = [];

    for (let i = 0, j = 0; i < q.length && j < t.length; i++, j++) {
      const qChar = q[i];
      const found = t.indexOf(qChar, j);
      if (found === -1) return { score: -1, indices: [] };

      indices.push(found);
      score += found === j ? 10 : 1; // Bonus for consecutive matches
      j = found;
    }

    // Bonus for exact matches at start of words
    const words = t.split(/\s+/);
    if (words.some(w => w.startsWith(q))) score += 50;

    return { score, indices };
  };

  // Filter and sort commands
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;

    return allCommands
      .map(cmd => {
        const titleMatch = fuzzyMatch(query, cmd.title);
        const descMatch = fuzzyMatch(query, cmd.description);
        const keywordMatch = cmd.keywords.some(k => fuzzyMatch(query, k).score > 0);

        if (titleMatch.score < 0 && descMatch.score < 0 && !keywordMatch) {
          return null;
        }

        return {
          ...cmd,
          matchScore: Math.max(titleMatch.score, descMatch.score, keywordMatch ? 5 : 0),
          matchIndices: titleMatch.indices,
        };
      })
      .filter((cmd): cmd is NonNullable<typeof cmd> => Boolean(cmd))
      .sort((a, b) => b!.matchScore - a!.matchScore);
  }, [query, allCommands]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case '?':
          if (e.shiftKey) {
            e.preventDefault();
            setShowHelp(prev => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const item = listRef.current.querySelector('[data-selected="true"]');
    if (item) {
      item.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-20"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0"
          style={{ background: 'var(--overlay-bg)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 60px var(--shadow-color)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border text-base"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
                onKeyDown={e => {
                  if (e.key === 'Escape') onClose();
                }}
                autoComplete="off"
                spellCheck={false}
                aria-label="Command palette search"
                aria-autocomplete="list"
                aria-controls="command-results"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[10px] font-mono" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                ⌘K
              </kbd>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[var(--surface-elevated)] transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close command palette"
            >
              <X size={18} />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredCommands.length > 0 ? (
              <ul
                ref={listRef}
                id="command-results"
                role="listbox"
                aria-label="Command results"
                className="py-2"
              >
                {filteredCommands.map((cmd, index) => (
                  <li
                    key={cmd.id}
                    role="option"
                    aria-selected={index === selectedIndex}
                    data-selected={index === selectedIndex}
                    onClick={() => { cmd.action(); onClose(); }}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      index === selectedIndex ? 'bg-[var(--surface-elevated)]' : 'hover:bg-[var(--bg-card)]'
                    }`}
                    style={{
                      color: index === selectedIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: 'var(--glass-accent-bg)', color: 'var(--accent)' }}>
                      {cmd.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{cmd.title}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-sm truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {cmd.description}
                      </p>
                    </div>
                    {cmd.shortcut && (
                      <kbd className="px-2 py-1 rounded text-[10px] font-mono shrink-0" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                <Search className="w-8 h-8 mx-auto mb-2" style={{ opacity: 0.5 }}/>
                <p className="font-medium">No commands found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer - Keyboard shortcuts */}
          <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            <details className={showHelp ? 'open' : ''}>
              <summary className="flex items-center justify-between cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-2">
                  <Keyboard size={14} style={{ color: 'var(--accent)' }} />
                  <span className="text-sm font-medium">Keyboard shortcuts</span>
                </span>
                <ChevronRight className="text-[var(--text-muted)] transition-transform" style={{ transform: showHelp ? 'rotate(90deg)' : 'rotate(0)' }} size={14} />
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div><kbd>⌘K</kbd> <span>Open palette</span></div>
                <div><kbd>↑/↓</kbd> <span>Navigate</span></div>
                <div><kbd>Enter</kbd> <span>Select</span></div>
                <div><kbd>Esc</kbd> <span>Close</span></div>
                <div><kbd>⇧?</kbd> <span>Toggle help</span></div>
              </div>
            </details>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * CommandPaletteTrigger - Wrapper that handles global ⌘K shortcut
 */
export const CommandPaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Global ⌘K shortcut
  useKeyShortcut({ key: 'k', meta: true, handler: () => setIsOpen(true) }, true);

  // Close on escape is handled by CommandPalette

  return (
    <>
      {children}
      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default CommandPalette;