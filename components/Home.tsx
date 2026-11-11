"use client";

import React from "react";
import CustomCursor from "./CustomCursor";
import Nav from "./Nav";
import Hero from "./Hero";
import Work from "./Work";
import Services from "./Services";
import NotesTeaser from "./NotesTeaser";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
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
        <Work />
        <Services />
        <NotesTeaser />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;
