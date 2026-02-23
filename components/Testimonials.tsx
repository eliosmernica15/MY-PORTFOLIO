import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import RevealSection from './RevealSection';
import MagneticButton from './MagneticButton';

const StarRating: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="flex gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
    ))}
  </div>
);

const TestimonialCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(
    () => setIndex(p => (p + 1) % TESTIMONIALS.length),
    []
  );
  const prev = useCallback(
    () => setIndex(p => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-center min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl w-full text-center relative"
          >
            {/* Gradient border wrapper */}
            <div className="p-px rounded-[3rem] bg-gradient-to-br from-[var(--glass-accent-border)] via-transparent to-[var(--glass-accent-bg)]">
              <div
                className="p-10 md:p-14 rounded-[3rem] relative overflow-hidden"
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <Quote
                  size={60}
                  className="absolute top-6 left-8 opacity-[0.08]"
                  style={{ color: 'var(--accent)' }}
                />

                {/* Stars */}
                <div className="flex justify-center mb-6">
                  <StarRating />
                </div>

                <p
                  className="text-lg md:text-2xl font-medium leading-relaxed mb-8"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  &ldquo;{TESTIMONIALS[index].text}&rdquo;
                </p>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full mb-3 p-0.5 overflow-hidden" style={{ border: '2px solid var(--accent)' }}>
                    <img
                      src={TESTIMONIALS[index].avatar}
                      alt={TESTIMONIALS[index].name}
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    {TESTIMONIALS[index].name}
                  </h4>
                  <p
                    className="text-[10px] uppercase tracking-widest font-bold mt-1"
                    style={{ color: 'var(--accent-light)' }}
                  >
                    {TESTIMONIALS[index].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-6">
        <MagneticButton strength={0.2}>
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[var(--accent)] hover:border-[var(--accent)]"
            style={{
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={16} />
          </button>
        </MagneticButton>
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-bold uppercase tracking-widest tabular-nums"
            style={{ color: 'var(--text-muted)' }}
            aria-live="polite"
          >
            {index + 1} of {TESTIMONIALS.length}
          </span>
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-6 h-2 bg-[var(--accent)]'
                    : 'w-2 h-2 hover:opacity-60'
                }`}
                style={
                  i !== index
                    ? { backgroundColor: 'var(--border)' }
                    : undefined
                }
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
        <MagneticButton strength={0.2}>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[var(--accent)] hover:border-[var(--accent)]"
            style={{
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
            aria-label="Next testimonial"
          >
            <ChevronRight size={16} />
          </button>
        </MagneticButton>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 max-w-7xl mx-auto snap-section">
      <RevealSection className="text-center mb-16">
        <span
          className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
          style={{ color: 'var(--accent-light)' }}
        >
          Feedback
        </span>
        <h2 className="text-5xl md:text-7xl font-black">
          Verified{' '}
          <span className="italic" style={{ color: 'var(--text-muted)' }}>
            Trust.
          </span>
        </h2>
      </RevealSection>
      <TestimonialCarousel />
    </section>
  );
};

export default Testimonials;
