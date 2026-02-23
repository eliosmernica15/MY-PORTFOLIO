import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  HashRouter, 
  Routes, 
  Route, 
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

/* Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/* Animated route transitions */
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--bg-primary)' }} />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      <HashRouter>
        <ScrollToTop />

        {/* Preloader */}
      <AnimatePresence>
          {loading && <Preloader onComplete={() => setLoading(false)} />}
        </AnimatePresence>

        {!loading && (
          <>
            <CustomCursor />
            <ScrollProgress />

            {/* Skip to content - Accessibility */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            <Nav />

            <main id="main-content" className="snap-container">
              <AnimatedRoutes />
            </main>

            <Footer />
          </>
        )}
    </HashRouter>
    </ThemeProvider>
  );
}
