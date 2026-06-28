import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, X, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MagneticButton from './MagneticButton';
import AdvancedButton from './ui/AdvancedButton';
import { useRafScroll } from '../hooks/useRafScroll';

const navLinks = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Services', id: 'services' },
  { name: 'Projects', id: 'projects' },
  { name: 'Resume', id: 'resume' },
  { name: 'Contact', id: 'contact' },
];

const Nav: React.FC = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [isOpen, setIsOpen] = useState(false);
  const { scrolled, navVisible } = useRafScroll(50);
  const visible = navVisible;
  const lastActiveUpdate = useRef(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname !== '/') return;

    const sectionIds = navLinks.map(l => l.id);
    const observer = new IntersectionObserver(
      entries => {
        const now = Date.now();
        if (now - lastActiveUpdate.current < 120) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const link = navLinks.find(l => l.id === entry.target.id);
          if (link) {
            lastActiveUpdate.current = now;
            setActiveTab(link.name);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    let observed: HTMLElement[] = [];
    const observeAll = () => {
      observed.forEach(el => observer.unobserve(el));
      observed = sectionIds
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el != null);
      observed.forEach(el => observer.observe(el));
    };

    observeAll();
    const t = setTimeout(observeAll, 800);
    return () => {
      clearTimeout(t);
      observed.forEach(el => observer.unobserve(el));
    };
  }, [pathname]);

  const scrollToSection = useCallback((id: string) => {
    const clearNavScrolling = () => {
      document.documentElement.removeAttribute('data-nav-scrolling');
    };
    const doScroll = (el: HTMLElement) => {
      document.documentElement.setAttribute('data-nav-scrolling', 'true');
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const timeout = setTimeout(clearNavScrolling, 1200);
      if ('onscrollend' in window) {
        window.addEventListener(
          'scrollend',
          () => {
            clearTimeout(timeout);
            clearNavScrolling();
          },
          { once: true }
        );
      }
    };
    const scroll = (): boolean => {
      const el = document.getElementById(id);
      if (el) {
        doScroll(el);
        return true;
      }
      return false;
    };
    if (scroll()) return;
    const deadline = Date.now() + 4000;
    const interval = setInterval(() => {
      if (Date.now() > deadline) {
        clearInterval(interval);
        return;
      }
      if (scroll()) clearInterval(interval);
    }, 50);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, link: { name: string; id: string }) => {
      e.preventDefault();
      setActiveTab(link.name);
      if (pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToSection(link.id), 150);
      } else {
        scrollToSection(link.id);
      }
      setIsOpen(false);
    },
    [pathname, navigate, scrollToSection]
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4 pt-[env(safe-area-inset-top)] sm:top-6">
        <motion.nav
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="pointer-events-auto max-w-fit px-3 py-2 rounded-full flex items-center justify-center gap-2 transition-colors duration-500 nav-blur"
          style={{
            backgroundColor: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--border)',
            boxShadow: scrolled ? '0 8px 32px var(--shadow-color)' : 'none',
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            onClick={() => setActiveTab('About')}
            className="flex items-center px-1"
            aria-label="Home"
          >
            <MagneticButton strength={0.2}>
              <div className="interactive-btn w-10 h-10 bg-[var(--accent)] text-[var(--accent-contrast)] rounded-xl flex items-center justify-center font-bold text-xs shadow-accent">
                EM
              </div>
            </MagneticButton>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(link => {
              const isActive = activeTab === link.name;
              return (
                <MagneticButton key={link.name} strength={0.15}>
                  <button
                    type="button"
                    onClick={e => handleNavClick(e, link)}
                    className={`nav-link relative px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 z-10 rounded-full ${
                      isActive ? 'nav-link-active' : ''
                    }`}
                    style={{
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.name}
                  </button>
                </MagneticButton>
              );
            })}
          </div>

          <ThemeToggle />

          <AdvancedButton
            variant="primary"
            size="sm"
            icon={<Sparkles size={12} />}
            onClick={() => {
              setActiveTab('Hire');
              if (pathname !== '/') {
                navigate('/');
                setTimeout(() => scrollToSection('contact'), 150);
              } else {
                scrollToSection('contact');
              }
              setIsOpen(false);
            }}
            className="hidden lg:inline-flex"
          >
            Hire Me
          </AdvancedButton>

          <button
            type="button"
            className="lg:hidden p-2 interactive-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            style={{ color: 'var(--text-primary)' }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 nav-overlay lg:hidden"
            style={{ backgroundColor: 'var(--overlay-bg)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex flex-col justify-center h-full px-10">
              <div className="flex flex-col gap-6">
                {navLinks.map((link, idx) => {
                  const isActive = activeTab === link.name;
                  return (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.25 }}
                      key={link.name}
                      onClick={e => handleNavClick(e, link)}
                      className="text-left flex items-center justify-between py-2 interactive-btn"
                      style={{
                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      <span className="flex items-center gap-4 text-3xl font-bold">
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
                        )}
                        {link.name}
                      </span>
                      <ChevronRight
                        size={20}
                        className={isActive ? 'text-[var(--accent)]' : 'opacity-30'}
                      />
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                onClick={e => handleNavClick(e, { name: 'Hire', id: 'contact' })}
                className="interactive-btn mt-12 w-full py-4 bg-[var(--accent)] text-[var(--accent-contrast)] font-bold rounded-2xl text-center text-sm uppercase tracking-widest"
              >
                Get in Touch
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Nav);
