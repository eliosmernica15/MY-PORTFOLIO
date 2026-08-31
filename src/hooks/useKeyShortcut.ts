'use client';
import { useEffect } from 'react';

export interface Shortcut {
  key: string;                 // e.g. 'k', '`', '?'
  meta?: boolean;              // require Meta (Cmd on Mac) or Ctrl
  shift?: boolean;
  alt?: boolean;
  description?: string;
  preventDefault?: boolean;
  handler: (e: KeyboardEvent) => void;
}

export function useKeyShortcut(shortcut: Shortcut, active: boolean = true) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== shortcut.key.toLowerCase()) return;
      if (!!shortcut.meta !== (e.metaKey || e.ctrlKey)) return;
      if (!!shortcut.shift !== e.shiftKey) return;
      if (!!shortcut.alt !== e.altKey) return;
      // ignore when typing in an input/textarea (unless meta held)
      const target = e.target as HTMLElement | null;
      const inField = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (inField && !shortcut.meta) return;
      if (shortcut.preventDefault !== false) e.preventDefault();
      shortcut.handler(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shortcut, active]);
}
