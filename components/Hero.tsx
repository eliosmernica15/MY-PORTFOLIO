import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe, Zap, ArrowDown } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import AnimatedCounter from './AnimatedCounter';
import AdvancedButton from './ui/AdvancedButton';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { getDeviceProfile } from '../hooks/useDeviceProfile';

const LazySplineScene = lazy(() => import('./SplineScene'));
const LazyFloatingOrbs = lazy(() => import('./FloatingOrbs'));
const LazyParticleCanvas = lazy(() => import('./ParticleCanvas'));

const profile = getDeviceProfile();

const Hero: React.FC = () => {
  const [loadEffects, setLoadEffects] = useState(false);

  useEffect(() => {
    if (!profile.enable3D && !profile.enableHeavyEffects) return;

    let cancelled = false;
    const run = () => {
      if (!cancelled) setLoadEffects(true);
    };
    const delay = profile.enable3D ? 400 : 700;
    const id =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(run, { timeout: delay + 300 })
        : window.setTimeout(run, delay);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback !== 'undefined') cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, []);

  const heroPhrases = useMemo(
    () => [
      'Web Development',
      'System Design',
      'Network Infrastructure',
      'Full-Stack Engineering',
    ],
    []
  );
  const typedText = useTypingEffect(heroPhrases, 70, 35, 2200);

  return (
    <section
      id="home"
      className="relative pt-28 sm:pt-32 md:pt-40 lg:pt-44 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden min-h-[100dvh] sm:min-h-screen flex flex-col justify-center snap-section z-[1]"
    >
      {loadEffects && profile.enable3D && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <LazySplineScene />
          </Suspense>
        </div>
      )}

      {loadEffects && profile.enableHeavyEffects && (
        <Suspense fallback={null}>
          <LazyFloatingOrbs />
          <div className="absolute inset-0 pointer-events-none z-[1]">
            <LazyParticleCanvas />
          </div>
        </Suspense>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-8 p-6 sm:p-10 md:p-14 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] relative overflow-hidden flex flex-col justify-end min-h-[360px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[520px]"
          style={{
            backgroundColor: 'var(--hero-card-bg)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 status-live">
            <span className="status-live-dot" aria-hidden />
            Available for Work
          </div>

          <div className="relative z-10">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-6 animate-fade-up"
              style={{ color: 'var(--accent-light)', animationDelay: '0.15s' }}
            >
              Software Engineer
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-6 sm:mb-8 leading-[0.9]">
              {PERSONAL_INFO.name.split(' ').map((word, i) => (
                <span
                  key={word + i}
                  className="text-gradient inline-block mr-4 animate-fade-up"
                  style={{ animationDelay: `${0.25 + i * 0.1}s` }}
                >
                  {word}
                  {i === PERSONAL_INFO.name.split(' ').length - 1 ? '.' : ''}
                </span>
              ))}
            </h1>

            <p
              className="max-w-lg text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 font-light animate-fade-up"
              style={{ color: 'var(--text-secondary)', animationDelay: '0.45s' }}
            >
              Specializing in{' '}
              <span className="text-[var(--accent-light)] font-medium">{typedText}</span>
              <span className="inline-block w-[2px] h-5 bg-[var(--accent)] ml-0.5 animate-pulse align-middle" />
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 animate-fade-up" style={{ animationDelay: '0.55s' }}>
              <AdvancedButton
                variant="primary"
                size="lg"
                iconRight={<ArrowUpRight size={18} />}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Showcase
              </AdvancedButton>
              <AdvancedButton
                variant="secondary"
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Me
              </AdvancedButton>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] flex flex-col justify-between transition-all duration-500 group hover:shadow-accent"
            style={{
              backgroundColor: 'var(--hero-card-bg)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-accent"
              style={{ backgroundColor: 'var(--glass-accent-bg)', color: 'var(--accent)' }}
            >
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
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.55 }}
            className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] bg-[var(--accent)] text-[var(--accent-contrast)] flex flex-col justify-between shadow-accent overflow-hidden relative group"
          >
            <div className="relative z-10">
              <h3 className="text-5xl sm:text-6xl font-black tracking-tighter">
                <AnimatedCounter target={4} suffix="+" />
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

      <div className="flex justify-center mt-12 relative z-10 animate-fade-up" style={{ animationDelay: '0.75s' }}>
        <div
          className="scroll-indicator w-8 h-12 rounded-full flex items-center justify-center"
          style={{ border: '1px solid var(--border)' }}
        >
          <ArrowDown size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
