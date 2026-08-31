'use client';

import { NOW } from '@/data/now';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function Now() {
  const [dismissed, setDismissed] = useLocalStorage<boolean>('now-dismissed', false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="status-live inline-flex"
      role="status"
      aria-live="polite"
    >
      <Sparkles size={12} className="text-[var(--accent)]" aria-hidden />
      <span>
        <span className="opacity-50 mr-2">Now:</span>
        {NOW.line}
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-2 opacity-50 hover:opacity-100 transition-opacity text-base leading-none"
        aria-label="Dismiss now widget"
      >
        ×
      </button>
    </motion.div>
  );
}
