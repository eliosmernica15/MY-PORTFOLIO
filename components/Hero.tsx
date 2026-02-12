import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe, Zap, ArrowDown } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import FloatingOrbs from './FloatingOrbs';
import ParticleCanvas from './ParticleCanvas';
import MagneticButton from './MagneticButton';
import { useTypingEffect } from '../hooks/useTypingEffect';

const Hero: React.FC = () => {
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
    <section className="relative pt-44 pb-20 px-6 max-w-7xl mx-auto overflow-hidden min-h-screen flex flex-col justify-center snap-section">
      <FloatingOrbs />
      <div className="absolute inset-0 pointer-events-none">
        <ParticleCanvas />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-8 p-10 md:p-16 rounded-[3rem] relative overflow-hidden flex flex-col justify-end min-h-[520px]"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="absolute top-10 right-10 flex items-center gap-3 px-4 py-2 rounded-full"
            style={{
              backgroundColor: 'var(--bg-card)',
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
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9]">
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
              className="max-w-lg text-lg md:text-xl leading-relaxed mb-10 font-light"
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
              className="flex flex-wrap gap-4"
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
                  className="px-8 py-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-violet-500/30 transition-shadow flex items-center gap-3"
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
                  className="px-8 py-4 font-bold rounded-2xl transition-all"
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

          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[rgba(139,92,246,0.06)] blur-[100px] rounded-full pointer-events-none" />
        </motion.div>

        {/* Side cards */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-[2.5rem] flex flex-col justify-between transition-all duration-500 group"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[rgba(139,92,246,0.1)] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all" style={{ color: 'var(--accent-light)' }}>
              <Globe size={24} />
            </div>
            <div className="mt-12">
              <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
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
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] text-white flex flex-col justify-between shadow-2xl shadow-violet-500/20 overflow-hidden relative group"
          >
            <div className="relative z-10">
              <h3 className="text-6xl font-black tracking-tighter">
                <AnimatedCounter target={9} suffix="+" />
              </h3>
            </div>
            <p className="font-bold text-xs uppercase tracking-widest opacity-70 mt-10 relative z-10">
              Years of Growth
            </p>
            <Zap
              size={180}
              className="absolute -bottom-8 -right-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000"
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
