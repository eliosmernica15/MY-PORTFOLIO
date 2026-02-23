import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import FloatingOrbs from '../components/FloatingOrbs';
import MagneticButton from '../components/MagneticButton';

const NotFound: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
    >
      <FloatingOrbs />
      <div className="text-center relative z-10 max-w-lg">
        {/* 404 number */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[10rem] md:text-[14rem] font-black leading-none text-gradient-accent select-none"
          style={{ lineHeight: 0.85 }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className="text-3xl md:text-4xl font-black mt-6 mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Page Not Found
          </h2>
          <p
            className="text-lg mb-10 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton strength={0.15}>
            <Link
              to="/"
              className="flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[var(--accent-contrast)] font-bold rounded-2xl hover:shadow-accent-hover shadow-accent transition-shadow"
            >
              <Home size={18} /> Back to Home
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.15}>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-3 px-8 py-4 font-bold rounded-2xl transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              <ArrowLeft size={18} /> Go Back
            </button>
          </MagneticButton>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;
