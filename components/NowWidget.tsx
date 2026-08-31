'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { NOW } from '@/data/now';

export function NowWidget() {
  const [dismissed, setDismissed] = useLocalStorage<boolean>('now-widget-dismissed', false);
  const [open, setOpen] = useState(true);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="status-live"
          role="status"
          aria-live="polite"
        >
          <Sparkles size={12} className="text-[var(--accent)]" aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
            <span className="opacity-60 mr-1.5">Now:</span>
            {NOW.line}
          </span>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setDismissed(true);
            }}
            className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Dismiss now widget"
          >
            <X size={10} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
