'use client';

import React from 'react';
import CustomCursor from './CustomCursor';
import AmbientBackground from './AmbientBackground';
import Nav from './Nav';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Projects from './Projects';
import StatsSection from './StatsSection';
import Resume from './Resume';
import SkillMarquee from './SkillMarquee';
import Testimonials from './Testimonials';
import Contact from './Contact';
import Footer from './Footer';

const Home: React.FC = () => {
  return (
    <>
      <CustomCursor />
      <Nav />
      <AmbientBackground />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Projects />
        <StatsSection />
        <Resume />
        <SkillMarquee />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;
