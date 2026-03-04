import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import SkillMarquee from '../components/SkillMarquee';
import About from '../components/About';
import RevealSection from '../components/RevealSection';

const StatsSection = lazy(() => import('../components/StatsSection'));
const Resume = lazy(() => import('../components/Resume'));
const CaseStudies = lazy(() => import('../components/CaseStudies'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Contact = lazy(() => import('../components/Contact'));

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
      <Projects />

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
        <SkillMarquee />
      </section>

      <Suspense fallback={null}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={null}>
        <Resume />
      </Suspense>
      <Suspense fallback={null}>
        <CaseStudies />
      </Suspense>
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
    </motion.div>
  );
};

export default Home;
