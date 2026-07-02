import React, { lazy } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import RevealSection from '../components/RevealSection';
import LazySection from '../components/LazySection';
import SectionHeader from '../components/ui/SectionHeader';

const Projects = lazy(() => import('../components/Projects'));
const Services = lazy(() => import('../components/Services'));
const SkillMarquee = lazy(() => import('../components/SkillMarquee'));
const StatsSection = lazy(() => import('../components/StatsSection'));
const Resume = lazy(() => import('../components/Resume'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Contact = lazy(() => import('../components/Contact'));
const sectionFallback = <div className="min-h-[200px]" aria-hidden="true" />;

const Home: React.FC = () => (
  <>
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

    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto content-auto relative z-[1]">
      <RevealSection>
        <SectionHeader
          align="center"
          eyebrow="Technical Arsenal"
          title={
            <>
              Tools of <span className="italic" style={{ color: 'var(--text-muted)' }}>Choice.</span>
            </>
          }
          subtitle="The stack I reach for when building fast, scalable, production-grade applications."
        />
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
  </>
);

export default Home;
