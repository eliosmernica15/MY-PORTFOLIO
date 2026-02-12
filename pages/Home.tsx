import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import SkillMarquee from '../components/SkillMarquee';
import StatsSection from '../components/StatsSection';
import Resume from '../components/Resume';
import About from '../components/About';
import CaseStudies from '../components/CaseStudies';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import RevealSection from '../components/RevealSection';

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Hero />
      <Projects />

      {/* Skills Marquee */}
      <section className="py-24 px-6 max-w-7xl mx-auto snap-section">
        <RevealSection className="text-center mb-12">
          <span
            className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
            style={{ color: 'var(--accent-light)' }}
          >
            Technical Arsenal
          </span>
          <h2 className="text-4xl md:text-6xl font-black">
            Tools of{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>
              Choice.
            </span>
          </h2>
        </RevealSection>
        <SkillMarquee />
      </section>

      <StatsSection />
      <Resume />
      <About />
      <CaseStudies />
      <Testimonials />
      <Contact />
    </motion.div>
  );
};

export default Home;
