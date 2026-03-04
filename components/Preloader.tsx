import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldExit(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldExit) {
      const exitTimer = setTimeout(onComplete, 80);
      return () => clearTimeout(exitTimer);
    }
  }, [shouldExit, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      animate={shouldExit ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            className="w-20 h-20 bg-[var(--accent)] text-[var(--accent-contrast)] rounded-2xl flex items-center justify-center shadow-accent"
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="text-2xl font-black select-none" style={{ color: 'var(--accent-contrast)' }}>EM</span>
          </motion.div>
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.4, 1.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            style={{
              background: 'radial-gradient(circle, var(--shadow-accent), transparent 70%)',
            }}
          />
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent rounded-full"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 120, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-[10px] font-bold uppercase tracking-[0.4em]"
          style={{ color: 'var(--text-muted)' }}
        >
          Loading Experience
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Preloader;
