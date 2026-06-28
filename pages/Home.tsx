import React, { lazy } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import RevealSection from '../components/RevealSection';
import LazySection from '../components/LazySection';

const Projects = lazy(() => import('../components/Projects'));
const Services = lazy(() => import('../components/Services'));
const SkillMarquee = lazy(() => import('../components/SkillMarquee'));
const StatsSection = lazy(() => import('../components/StatsSection'));
const Resume = lazy(() => import('../components/Resume'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Contact = lazy(() => import('../components/Contact'));
const sectionFallback = <div className="min-h-[200px]" aria-hidden="true" />;

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Hero />
      <About />
      <LazySection id="services" fallback={sectionFallback}>
        <Services />
      </LazySection>

      <LazySection id="projects" fallback={sectionFallback}>
        <Projects />
      </LazySection>

      <LazySection id="stats" fallback={sectionFallback}>
        <StatsSection />
      </LazySection>

      <LazySection id="resume" fallback={sectionFallback}>
        <Resume />
      </LazySection>

      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto snap-section content-auto">
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

      <LazySection id="testimonials" fallback={sectionFallback}>
        <Testimonials />
      </LazySection>

      <LazySection id="contact" fallback={sectionFallback}>
        <Contact />
      </LazySection>
    </motion.div>
  );
};

export default Home;
