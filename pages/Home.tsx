import React, { lazy } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import RevealSection from '../components/RevealSection';
import LazySection from '../components/LazySection';

const Projects = lazy(() => import('../components/Projects'));
const SkillMarquee = lazy(() => import('../components/SkillMarquee'));
const StatsSection = lazy(() => import('../components/StatsSection'));
const Resume = lazy(() => import('../components/Resume'));
const CaseStudies = lazy(() => import('../components/CaseStudies'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Contact = lazy(() => import('../components/Contact'));

const sectionFallback = <div className="min-h-[200px]" aria-hidden="true" />;

/** Order and set of below-the-fold lazy sections (after Skills). Single place to reorder or add sections. */
const LAZY_SECTIONS = [
  { id: 'stats', Component: StatsSection },
  { id: 'resume', Component: Resume },
  { id: 'case-studies', Component: CaseStudies },
  { id: 'testimonials', Component: Testimonials },
  { id: 'contact', Component: Contact },
] as const;

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Hero />
      <About />
      <LazySection id="projects" fallback={sectionFallback}>
        <Projects />
      </LazySection>

      {/* Skills Marquee */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto snap-section">
        <RevealSection className="text-center mb-12">
          <span
            className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
            style={{ color: 'var(--accent-light)' }}
          >
            Technical Arsenal
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
            Tools of{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>
              Choice.
            </span>
          </h2>
        </RevealSection>
        <LazySection fallback={sectionFallback}>
          <SkillMarquee />
        </LazySection>
      </section>

      {LAZY_SECTIONS.map(({ id, Component }) => (
        <LazySection key={id} id={id} fallback={sectionFallback}>
          <Component />
        </LazySection>
      ))}
    </motion.div>
  );
};

export default Home;
