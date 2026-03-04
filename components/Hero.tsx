import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe, Zap, ArrowDown } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import FloatingOrbs from './FloatingOrbs';
import ParticleCanvas from './ParticleCanvas';
import MagneticButton from './MagneticButton';
import { useTypingEffect } from '../hooks/useTypingEffect';

const LazySplineScene = lazy(() => import('./SplineScene'));

const Hero: React.FC = () => {
  const [load3D, setLoad3D] = useState(false);

  useEffect(() => {
    const cb = () => setLoad3D(true);
    let cancelled = false;
    const run = () => {
      if (!cancelled) setLoad3D(true);
    };
    const id =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(run, { timeout: 1200 })
        : window.setTimeout(run, 800);
    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback !== 'undefined') cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, []);

  const typedText = useTypingEffect(
    [
      'Web Development',
      'System Design',
      'Network Infrastructure',
      'Full-Stack Engineering',
    ],
    70,
    35,
    2200
  );

  return (
    <section className="relative pt-28 sm:pt-32 md:pt-40 lg:pt-44 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden min-h-[100dvh] sm:min-h-screen flex flex-col justify-center snap-section">
      <div className="absolute inset-0 z-0">
        {load3D && (
          <Suspense fallback={null}>
            <LazySplineScene />
          </Suspense>
        )}
      </div>
      <FloatingOrbs />
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <ParticleCanvas />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-8 p-6 sm:p-10 md:p-14 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] relative overflow-hidden flex flex-col justify-end min-h-[360px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[520px]"
          style={{
            backgroundColor: 'var(--hero-card-bg)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="absolute top-6 right-6 sm:top-10 sm:right-10 flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full"
            style={{
              backgroundColor: 'var(--hero-card-bg)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" />
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              Available for Work
            </span>
          </div>

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: 'var(--accent-light)' }}
            >
              Software Engineer
            </motion.p>

            {/* Staggered heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-6 sm:mb-8 leading-[0.9]">
              {['Elios', 'Mernica.'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4 + i * 0.15,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-gradient inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Typing effect subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="max-w-lg text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 font-light"
              style={{ color: 'var(--text-secondary)' }}
            >
              Specializing in{' '}
              <span className="text-[var(--accent-light)] font-medium">
                {typedText}
              </span>
              <span className="inline-block w-[2px] h-5 bg-[var(--accent)] ml-0.5 animate-pulse align-middle" />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <MagneticButton strength={0.15}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    document
                      .getElementById('projects')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="px-6 py-3.5 sm:px-8 sm:py-4 bg-[var(--accent)] text-[var(--accent-contrast)] font-bold rounded-xl sm:rounded-2xl hover:shadow-accent-hover shadow-accent transition-shadow flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  View Showcase <ArrowUpRight size={18} />
                </motion.button>
              </MagneticButton>

              <MagneticButton strength={0.15}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    document
                      .getElementById('contact')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="px-6 py-3.5 sm:px-8 sm:py-4 font-bold rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Contact Me
                </motion.button>
              </MagneticButton>
            </motion.div>
          </div>

        </motion.div>

        {/* Side cards */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] flex flex-col justify-between transition-all duration-500 group"
            style={{
              backgroundColor: 'var(--hero-card-bg)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-accent" style={{ backgroundColor: 'var(--glass-accent-bg)', color: 'var(--accent)' }}>
              <Globe size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div className="mt-8 sm:mt-12">
              <h3 className="text-xl sm:text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                Kosovo, EU
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Available for remote engineering and digital missions.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] bg-[var(--accent)] text-[var(--accent-contrast)] flex flex-col justify-between shadow-accent overflow-hidden relative group"
          >
            <div className="relative z-10">
              <h3 className="text-5xl sm:text-6xl font-black tracking-tighter">
                <AnimatedCounter target={9} suffix="+" />
              </h3>
            </div>
            <p className="font-bold text-[10px] sm:text-xs uppercase tracking-widest opacity-70 mt-6 sm:mt-10 relative z-10">
              Years of Growth
            </p>
            <Zap
              size={140}
              className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000 w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] lg:w-[180px] lg:h-[180px]"
              fill="currentColor"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex justify-center mt-12 relative z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-8 h-12 rounded-full flex items-center justify-center"
          style={{ border: '1px solid var(--border)' }}
        >
          <ArrowDown size={14} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
