'use client';

import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, ArrowDown, Mail, Phone, MapPin, Sparkles, Send,
  CheckCircle2, AlertCircle, Star, Quote, Github, Instagram, Linkedin,
  Download, ExternalLink, Layers, Code, Database, MonitorSmartphone, Store,
  ChevronRight, ChevronLeft, Menu, X, Sun, Moon, Twitter, Loader2,
} from 'lucide-react';
import { SITE } from '@/data/site';
import { PROJECTS } from '@/data/projects';
import { SERVICES } from '@/data/services';
import { SKILL_CATEGORIES, SKILLS } from '@/data/skills';
import { TESTIMONIALS } from '@/data/testimonials';
import { EDUCATION } from '@/data/education';
import { EXPERIENCE } from '@/data/experience';
import { SOCIALS } from '@/data/socials';
import { NOW } from '@/data/now';
import { useTheme } from '../context/ThemeContext';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { StackMap } from './StackMap';
import { GitHubActivity } from './GitHubActivity';
import { NotesTeaser } from './NotesTeaser';
import { Now } from './Now';
import { NowWidget } from './NowWidget';
import { SoundToggle } from './SoundToggle';
import ThemeToggle from './ThemeToggle';
import AdvancedButton from './ui/AdvancedButton';
import PremiumCard from './ui/PremiumCard';
import SectionHeader from './ui/SectionHeader';
import Chip from './ui/Chip';
import RevealSection from './RevealSection';
import AnimatedCounter from './AnimatedCounter';
import { getDeviceProfile } from '@/hooks/useDeviceProfile';

// Lazy-load heavy 3D.
const ParticleField = lazy(() => import('./ParticleField'));
const SplineScene = lazy(() => import('./SplineScene'));

// Icon lookup for service cards.
const ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  MonitorSmartphone, Store, Database, Code, Layers,
};

const SOCIAL_ICONS: Record<string, React.FC<{ size?: number }>> = {
  Github, Instagram, Linkedin, Twitter,
};

// ============================================================================
// Hero
// ============================================================================
function Hero() {
  const profile = getDeviceProfile();
  const [loadEffects, setLoadEffects] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);

  const phrases = useMemo(
    () => ['AI Systems', 'Full-Stack Engineering', 'Compilers & Tooling', 'Network Architecture', 'SaaS Platforms'],
    [],
  );

  useEffect(() => {
    if (!profile.enable3D && !profile.enableHeavyEffects) return;
    const run = () => setLoadEffects(true);
    const delay = profile.enable3D ? 500 : 900;
    const id =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(run, { timeout: delay + 400 })
        : window.setTimeout(run, delay);
    return () => {
      if (typeof cancelIdleCallback !== 'undefined') cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, [profile.enable3D, profile.enableHeavyEffects]);

  // Typing effect.
  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const speed = deleting ? 35 : 70;
    const full = phrase;
    const next = deleting ? typed.slice(0, -1) : full.slice(0, typed.length + 1);
    const t = setTimeout(() => {
      setTyped(next);
      if (!deleting && next === full) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && next === '') {
        setDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      }
    }, speed);
    return () => clearTimeout(t);
  }, [typed, deleting, phraseIndex, phrases]);

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center pt-24 pb-20"
    >
      {/* Ambient base */}
      <div className="absolute inset-0" aria-hidden>
        {loadEffects && profile.enable3D && (
          <Suspense fallback={null}>
            <SplineScene />
          </Suspense>
        )}
        {loadEffects && profile.enable3D && (
          <Suspense fallback={null}>
            <ParticleField />
          </Suspense>
        )}
      </div>

      <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
          style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <span className="status-live-dot" />
          {SITE.shortTitle}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          I engineer{' '}
          <span
            aria-live="polite"
            className="text-gradient-accent"
            style={{ minHeight: '1em', display: 'inline-block' }}
          >
            {typed}
            <span
              className="inline-block w-[2px] h-[0.9em] align-middle ml-1"
              style={{ background: 'var(--accent)', animation: 'caret-blink 1s steps(2) infinite' }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link href="#projects" className="btn-enterprise btn-enterprise-lg btn-enterprise-primary" data-cursor-hover>
            <span className="btn-enterprise-shine" aria-hidden />
            <span className="btn-enterprise-label">View my work</span>
            <span className="btn-enterprise-icon"><ArrowDown size={16} /></span>
          </Link>
          <Link href="#contact" className="btn-enterprise btn-enterprise-lg btn-enterprise-secondary" data-cursor-hover>
            <span className="btn-enterprise-label">Get in touch</span>
            <span className="btn-enterprise-icon"><ArrowUpRight size={16} /></span>
          </Link>
        </motion.div>

        <div className="mt-12">
          <NowWidget />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// About
// ============================================================================
function About() {
  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-[1] content-auto">
      <SectionHeader
        eyebrow="About"
        title={
          <>
            Building systems,{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>not just screens.</span>
          </>
        }
        subtitle={`${SITE.name} — ${SITE.title}. ${SITE.summary}`}
      />

      <RevealSection className="mt-12">
        <PremiumCard hover glow>
          <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Capability title="Full-Stack Engineering" />
            <Capability title="System Architecture" />
            <Capability title="Performance Optimization" />
            <Capability title="UI/UX Engineering" />
            <Capability title="Cloud Deployment" />
            <Capability title="API Design" />
          </div>
        </PremiumCard>
      </RevealSection>

      <RevealSection className="mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--accent-light)' }}>
              Where I am
            </h3>
            <p className="text-3xl sm:text-4xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
              {SITE.location}
            </p>
            <p className="mt-3 text-base" style={{ color: 'var(--text-secondary)' }}>
              I work fully remote. Have shipped to clients in the US, UK, Germany, and the Balkans. Aligned with EU, UK, and US Eastern time zones.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--accent-light)' }}>
              What I focus on
            </h3>
            <p className="text-3xl sm:text-4xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
              AI systems, network plumbing, and the rest.
            </p>
            <p className="mt-3 text-base" style={{ color: 'var(--text-secondary)' }}>
              My current frontier is AI — agent systems, custom RAG, compiler work (A++(APL)). Everything else is in service of making the stack reliable enough to ship AI to real users.
            </p>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

function Capability({ title }: { title: string }) {
  return (
    <div
      className="p-5 rounded-xl border"
      style={{ background: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Services
// ============================================================================
function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-[1] content-auto">
      <SectionHeader
        eyebrow="Services"
        title={
          <>
            What I do,{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>end to end.</span>
          </>
        }
        subtitle="From discovery to launch to ongoing support. No handoffs, no surprises."
      />
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Code;
          return (
            <RevealSection key={s.id} delay={i * 0.05}>
              <PremiumCard hover className="h-full">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--surface-elevated)', color: 'var(--accent-light)' }}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      className="text-[10px] font-bold tracking-widest"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {s.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                </div>
              </PremiumCard>
            </RevealSection>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================================
// Projects
// ============================================================================
function Projects() {
  const [count, setCount] = useState(4);

  return (
    <section id="projects" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-[1] content-auto">
      <SectionHeader
        eyebrow="Projects"
        title={
          <>
            Recent work,{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>in production.</span>
          </>
        }
        subtitle="A curated selection. Every project is shipped to real users and still being maintained."
      />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROJECTS.slice(0, count).map((p, i) => (
          <RevealSection key={p.id} delay={i * 0.05}>
            <ProjectCard project={p} featured={i === 0} />
          </RevealSection>
        ))}
      </div>
      {count < PROJECTS.length && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setCount(c => Math.min(c + 4, PROJECTS.length))}
            className="btn-enterprise btn-enterprise-md btn-enterprise-secondary"
            data-cursor-hover
          >
            <span className="btn-enterprise-label">Load more</span>
            <span className="btn-enterprise-icon"><ArrowDown size={14} /></span>
          </button>
        </div>
      )}
    </section>
  );
}

type Project = (typeof PROJECTS)[number];

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="group block"
      data-cursor-hover
    >
      <PremiumCard hover className="h-full">
        <div className={`p-6 sm:p-7 ${featured ? 'sm:p-8' : ''} h-full flex flex-col`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Chip>{project.category}</Chip>
              <span
                className="project-year-badge text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
              >
                {project.year}
              </span>
            </div>
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:rotate-45 transition-all"
              style={{ background: 'var(--surface-elevated)', color: 'var(--text-primary)' }}
            >
              <ArrowUpRight size={16} />
            </span>
          </div>

          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-5" style={{ border: '1px solid var(--border)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <h3
            className={`font-black tracking-tight ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'} mb-2`}
            style={{ color: 'var(--text-primary)' }}
          >
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tech.slice(0, 4).map(t => (
              <span key={t} className="project-tech-pill text-[10px] font-bold px-2 py-0.5 rounded-md">
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="text-[10px] font-bold px-2 py-0.5" style={{ color: 'var(--text-muted)' }}>
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        </div>
      </PremiumCard>
    </Link>
  );
}

// ============================================================================
// Stack Map + Marquee
// ============================================================================
function StackSection() {
  return (
    <section id="stack" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-[1] content-auto">
      <SectionHeader
        eyebrow="Stack"
        title={
          <>
            What I build{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>with.</span>
          </>
        }
        subtitle="Categorized by what they actually do in production."
      />
      <RevealSection className="mt-14">
        <StackMap />
      </RevealSection>

      {/* Marquee */}
      <RevealSection className="mt-16">
        <div className="space-y-3 overflow-hidden marquee-wrap">
          <div className="flex gap-3 marquee-row-left">
            {[...SKILLS, ...SKILLS].map((s, i) => (
              <div
                key={`a-${i}`}
                className="shrink-0 px-5 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap select-none transition-colors duration-300"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

// ============================================================================
// Stats
// ============================================================================
function Stats() {
  const stats = [
    { value: 8, suffix: '+', label: 'Projects Shipped' },
    { value: 120, suffix: '+', label: 'Countries Reached' },
    { value: 5, suffix: '', label: 'Years of Code' },
    { value: 95, suffix: '+', label: 'Lighthouse Avg' },
  ];
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto content-auto relative z-[1]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <RevealSection key={s.label} delay={i * 0.06}>
            <div
              className="stat-card-enterprise p-5 sm:p-7 md:p-8 rounded-2xl border text-center transition-all hover:-translate-y-1"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-gradient-accent mb-2">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
                {s.label}
              </p>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Resume (Education + Experience)
// ============================================================================
function Resume() {
  return (
    <section id="resume" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-[1] content-auto">
      <SectionHeader
        eyebrow="Resume"
        title={
          <>
            How I got{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>here.</span>
          </>
        }
        subtitle="Education, work, and the long detour through compilers."
      />

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: 'var(--accent-light)' }}>
            Education
          </h3>
          <ol className="space-y-5">
            {EDUCATION.map((e, i) => (
              <li
                key={`${e.title}-${i}`}
                className="p-5 rounded-xl border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{e.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                    {e.period}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{e.desc}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: 'var(--accent-light)' }}>
            Experience
          </h3>
          <ol className="space-y-5">
            {EXPERIENCE.map((e, i) => (
              <li
                key={`${e.company}-${i}`}
                className="p-5 rounded-xl border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{e.company}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                    {e.period}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{e.desc}</p>
              </li>
            ))}
          </ol>
          <a
            href="/Elios-Mernica-CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-enterprise btn-enterprise-md btn-enterprise-primary mt-8"
            data-cursor-hover
          >
            <span className="btn-enterprise-shine" aria-hidden />
            <span className="btn-enterprise-label">Download CV</span>
            <span className="btn-enterprise-icon"><Download size={14} /></span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Testimonials
// ============================================================================
function Testimonials() {
  const [idx, setIdx] = useState(0);
  const AUTOPLAY_MS = 7000;
  const t = TESTIMONIALS[idx];

  useEffect(() => {
    const id = setInterval(() => setIdx((idx + 1) % TESTIMONIALS.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [idx]);

  return (
    <section id="testimonials" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-[1] content-auto">
      <SectionHeader
        eyebrow="Kind words"
        title={
          <>
            What clients{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>say.</span>
          </>
        }
      />
      <RevealSection className="mt-12">
        <PremiumCard hover>
          <div className="p-8 sm:p-12 relative">
            <Quote size={40} className="absolute top-6 left-6 opacity-20" style={{ color: 'var(--accent)' }} />
            <AnimatePresence mode="wait">
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <p className="text-lg sm:text-xl leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {t.role}{t.company ? `, ${t.company}` : ''}
                    </div>
                  </div>
                  {t.linkedinUrl && (
                    <a
                      href={t.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
                      aria-label={`${t.name} on LinkedIn`}
                    >
                      <Linkedin size={18} style={{ color: 'var(--accent)' }} />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === idx ? 32 : 6,
                      background: i === idx ? 'var(--accent)' : 'var(--border)',
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIdx((idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setIdx((idx + 1) % TESTIMONIALS.length)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </PremiumCard>
      </RevealSection>
    </section>
  );
}

// ============================================================================
// Contact
// ============================================================================
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formTime] = useState(Date.now());

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(form.email))
      e.email = 'Invalid email';
    if (form.message.trim().length < 20) e.message = 'Tell me a little more — at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (form.company) return; // honeypot
    if (Date.now() - formTime < 2000) {
      setErrors({ form: 'Take a second — that was too fast.' });
      return;
    }
    if (!validate()) return;
    setStatus('loading');
    try {
      const { submitContact } = await import('../app/actions/contact');
      const fd = new FormData();
      fd.set('name', form.name);
      fd.set('email', form.email);
      fd.set('message', form.message);
      fd.set('company', form.company);
      fd.set('formTime', String(formTime));
      const res = await submitContact(fd);
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '', company: '' });
      } else if (res.error === 'validation') {
        setStatus('error');
        setErrors({ form: Object.values(res.fieldErrors)[0] || 'Please fix the errors above.' });
      } else if (res.error === 'rate_limited') {
        setStatus('error');
        setErrors({ form: `Too many requests. Try again in ${Math.ceil(res.retryAfterMs / 1000)}s.` });
      } else if (res.error === 'spam') {
        setStatus('error');
        setErrors({ form: 'Submission flagged. Please email ' + SITE.email + ' directly.' });
      } else {
        const delivery = res as { message?: string };
        setStatus('error');
        setErrors({ form: delivery.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setStatus('error');
      setErrors({ form: 'Network error. Please email ' + SITE.email + ' directly.' });
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-[1] content-auto">
      <SectionHeader
        eyebrow="Contact"
        title={
          <>
            Let&apos;s build{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>something.</span>
          </>
        }
        subtitle={`I reply within 24 hours, Mon–Sat, GMT+1. Or email ${SITE.email} directly.`}
      />
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <RevealSection className="lg:col-span-2 space-y-3">
          <a
            href={`mailto:${SITE.email}`}
            className="block p-6 rounded-2xl border group transition-all hover:-translate-y-1"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            data-cursor-hover
          >
            <Mail size={18} style={{ color: 'var(--accent-light)' }} />
            <div className="mt-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Email</div>
            <div className="text-base font-bold mt-1 break-all" style={{ color: 'var(--text-primary)' }}>{SITE.email}</div>
          </a>
          <a
            href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`}
            className="block p-6 rounded-2xl border group transition-all hover:-translate-y-1"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            data-cursor-hover
          >
            <Phone size={18} style={{ color: 'var(--accent-light)' }} />
            <div className="mt-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Phone</div>
            <div className="text-base font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{SITE.phone}</div>
          </a>
          <div
            className="p-6 rounded-2xl border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <MapPin size={18} style={{ color: 'var(--accent-light)' }} />
            <div className="mt-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Based in</div>
            <div className="text-base font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{SITE.location}</div>
          </div>
        </RevealSection>

        <RevealSection className="lg:col-span-3" delay={0.05}>
          <PremiumCard hover>
            <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-5" noValidate>
              {/* honeypot */}
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute opacity-0 pointer-events-none -left-[9999px] w-px h-px"
              />

              <div>
                <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-enterprise w-full"
                  autoComplete="name"
                  required
                />
                {errors.name && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-enterprise w-full"
                  autoComplete="email"
                  required
                />
                {errors.email && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="input-enterprise w-full resize-none"
                  required
                />
                {errors.message && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.message}</p>}
              </div>

              {errors.form && (
                <div className="flex items-center gap-2 text-xs p-3 rounded-lg" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#fca5a5' }}>
                  <AlertCircle size={14} /> {errors.form}
                </div>
              )}

              {status === 'success' && (
                <div className="flex items-center gap-2 text-xs p-3 rounded-lg" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#6ee7b7' }}>
                  <CheckCircle2 size={14} /> Got it. I&apos;ll reply within 24 hours.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-enterprise btn-enterprise-lg btn-enterprise-primary w-full disabled:opacity-60"
                data-cursor-hover
              >
                <span className="btn-enterprise-shine" aria-hidden />
                <span className="btn-enterprise-label">
                  {status === 'loading' ? 'Sending…' : 'Send message'}
                </span>
                <span className="btn-enterprise-icon">
                  {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </span>
              </button>

              <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
                Protected against bots with honeypot + behavioral heuristics.
              </p>
            </form>
          </PremiumCard>
        </RevealSection>
      </div>
    </section>
  );
}

// ============================================================================
// Nav (sticky top)
// ============================================================================
function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['home', 'about', 'services', 'projects', 'resume', 'testimonials', 'stack', 'github', 'contact'];
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -50% 0px' },
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'stack', label: 'Stack' },
    { id: 'resume', label: 'Resume' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}
      style={{
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" data-cursor-hover>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black transition-transform group-hover:rotate-6"
            style={{ background: 'var(--accent)', color: 'var(--text-on-accent, #fff)' }}
          >
            EM
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{SITE.name}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{SITE.title}</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav-link px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${active === l.id ? 'nav-link-active' : ''}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <SoundToggle />
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
            aria-label="Toggle theme"
            data-cursor-hover
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <a
            href="#contact"
            className="hidden md:inline-flex btn-enterprise btn-enterprise-sm btn-enterprise-primary"
            data-cursor-hover
          >
            <span className="btn-enterprise-label">Hire me</span>
          </a>
          <button
            onClick={() => setOpen(v => !v)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            aria-label="Open menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="lg:hidden mt-2 mx-4 rounded-2xl border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          {links.map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-sm font-bold border-b last:border-0"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// ============================================================================
// Footer
// ============================================================================
function Footer() {
  return (
    <footer
      className="border-t py-12 px-4 sm:px-6 relative z-[1]"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: 'var(--accent)', color: 'var(--text-on-accent, #fff)' }}
            >
              EM
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{SITE.name}</div>
              <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {SITE.location}
              </div>
            </div>
          </div>
          <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>{SITE.tagline}</p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--accent-light)' }}>
            Quick links
          </h4>
          <ul className="space-y-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {['Home', 'About', 'Services', 'Projects', 'Resume', 'Contact'].map(label => (
              <li key={label}>
                <a href={`#${label.toLowerCase()}`} className="hover:text-[var(--accent-light)] transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--accent-light)' }}>
            Connect
          </h4>
          <div className="flex items-center gap-2">
            {SOCIALS.map(s => {
              const Icon = SOCIAL_ICONS[s.icon] ?? Github;
              return (
                <a
                  key={s.name}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:-translate-y-0.5"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
                  aria-label={s.name}
                  data-cursor-hover
                >
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
          <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            Now: {NOW.line}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Built with Next.js · hosted on the edge.
        </p>
      </div>
    </footer>
  );
}

// ============================================================================
// CustomCursor + AmbientBackground (lightweight inline versions)
// ============================================================================
function CustomCursor() {
  const profile = useDeviceProfile();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!profile.enableCustomCursor) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hover = target.closest('[data-cursor-hover], a, button');
      setHovering(!!hover);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [profile.enableCustomCursor]);

  if (!profile.enableCustomCursor) return null;
  return (
    <>
      <div
        className="pointer-events-none fixed z-[9998] rounded-full mix-blend-difference"
        style={{
          left: pos.x - 4, top: pos.y - 4, width: 8, height: 8,
          background: hovering ? 'var(--accent)' : '#fff',
          transition: 'width 0.2s, height 0.2s, transform 0.2s, background 0.2s',
          transform: hovering ? 'scale(2.5)' : 'scale(1)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed z-[9997] rounded-full border"
        style={{
          left: pos.x - 18, top: pos.y - 18, width: 36, height: 36,
          borderColor: hovering ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
          transition: 'width 0.2s, height 0.2s, transform 0.2s, border-color 0.2s',
          transform: hovering ? 'scale(1.5)' : 'scale(1)',
        }}
        aria-hidden
      />
    </>
  );
}

// ============================================================================
// Home composition
// ============================================================================
export default function Home() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <About />
        <Services />
        <Projects />
        <StackSection />
        <Resume />
        <RevealSection>
          <GitHubActivity />
        </RevealSection>
        <Testimonials />
        <RevealSection>
          <NotesTeaser />
        </RevealSection>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
