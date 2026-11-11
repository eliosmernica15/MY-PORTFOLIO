"use client";

import React from "react";
import CustomCursor from "./CustomCursor";
import Nav from "./Nav";
import Hero from "./Hero";
import Ticker from "./Ticker";
import Work from "./Work";
import Showcase from "./Showcase";
import Services from "./Services";
import NotesTeaser from "./NotesTeaser";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import { ErrorBoundary } from "./ui/ErrorBoundary";

const Home: React.FC = () => {
  return (
    <>
      <CustomCursor />
      <ErrorBoundary
        displayName="Nav"
        fallback={
          <nav
            className="fixed inset-x-0 top-0 z-50 border-b"
            role="navigation"
            aria-label="Main navigation (fallback)"
          >
            <div className="mx-auto max-w-6xl px-5 py-3 font-display text-sm font-semibold text-[var(--text-primary)]">
              Elios Mernica.
            </div>
          </nav>
        }
      >
        <Nav />
      </ErrorBoundary>
      <main id="main-content">
        <Hero />
        <Ticker />
        <Work />
        <Showcase />
        <Services />
        <NotesTeaser />
        <About />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default Home;
