
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  HashRouter, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  ArrowUpRight, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Zap, 
  Cpu, 
  Palette, 
  Camera,
  ChevronRight, 
  ChevronLeft,
  Globe, 
  Menu, 
  X,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Quote,
  MapPin,
  Phone,
  Sparkles,
  Send,
  ArrowDown
} from 'lucide-react';
import { PROJECTS, SKILLS, SERVICES, SOCIALS, TESTIMONIALS, EDUCATION, EXPERIENCE, SKILLS_PROGRESS, CONTACT_INFO, BLOG_POSTS } from './constants';

/* ================================================================
   UTILITY: Scroll to top on route change
   ================================================================ */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

/* ================================================================
   NEW COMPONENT: Scroll Progress Bar
   ================================================================ */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#6d28d9] z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};

/* ================================================================
   NEW COMPONENT: Animated Counter (counts up on view)
   ================================================================ */
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start: number;
          const duration = 2000;
          const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ================================================================
   NEW COMPONENT: Infinite Skill Marquee (2 rows, opposite dirs)
   ================================================================ */
const SkillMarquee = () => {
  const row1 = [...SKILLS, ...SKILLS, ...SKILLS];
  const row2 = [...[...SKILLS].reverse(), ...[...SKILLS].reverse(), ...[...SKILLS].reverse()];

  const pillClass = "shrink-0 px-5 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] text-sm font-medium text-neutral-300 hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/10 hover:text-white transition-colors duration-300 cursor-default whitespace-nowrap select-none";

  return (
    <div className="space-y-3 overflow-hidden py-2 [&:hover_div]:![animation-play-state:paused]">
      <div className="flex gap-3" style={{ animation: 'marquee-left 40s linear infinite', width: 'max-content' }}>
        {row1.map((skill, i) => <div key={`a-${i}`} className={pillClass}>{skill}</div>)}
      </div>
      <div className="flex gap-3" style={{ animation: 'marquee-right 45s linear infinite', width: 'max-content' }}>
        {row2.map((skill, i) => <div key={`b-${i}`} className={pillClass}>{skill}</div>)}
      </div>
    </div>
  );
};

/* ================================================================
   COMPONENT: Section Wrapper with scroll reveal
   ================================================================ */
const RevealSection = ({ children, className = "", id, delay = 0 }: { children?: React.ReactNode; className?: string; id?: string; delay?: number }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ================================================================
   COMPONENT: Floating Background Orbs
   ================================================================ */
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', animation: 'float 20s ease-in-out infinite' }} />
    <div className="absolute bottom-20 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', animation: 'floatReverse 25s ease-in-out infinite' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', animation: 'floatSlow 30s ease-in-out infinite' }} />
  </div>
);

/* ================================================================
   COMPONENT: Navigation (hides on scroll down, shows on scroll up)
   ================================================================ */
const Nav = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y > lastY.current + 8 && y > 100) setVisible(false);
      else if (y < lastY.current - 4) setVisible(true);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', id: 'projects' },
    { name: 'Resume', id: 'resume' },
    { name: 'About', id: 'about' },
    { name: 'Blog', id: 'blog' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavClick = useCallback((e: React.MouseEvent, link: { name: string; id: string }) => {
    e.preventDefault();
    setActiveTab(link.name);
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  }, [pathname, navigate]);

  return (
    <>
      <motion.nav
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-fit px-3 py-2 rounded-full flex items-center gap-2 transition-colors duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
            : 'bg-black/50 backdrop-blur-xl border border-white/[0.06]'
        }`}
      >
        <Link to="/" onClick={() => setActiveTab('About')} className="flex items-center px-1" aria-label="Home">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-lg shadow-violet-500/20">
            EM
          </motion.div>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <button key={link.name} onClick={(e) => handleNavClick(e, link)} className={`relative px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 z-10 rounded-full ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`}>
                {isActive && (
                  <motion.div layoutId="pill-bg" className="absolute inset-0 bg-white/[0.08] border border-white/[0.08] rounded-full -z-10" transition={{ type: "spring", duration: 0.5, bounce: 0.15 }} />
                )}
                {link.name}
              </button>
            );
          })}
        </div>

        <button onClick={(e) => handleNavClick(e, { name: 'Hire', id: 'contact' })} className="hidden lg:flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold rounded-full uppercase tracking-widest bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105">
          <Sparkles size={12} /> Hire Me
        </button>

        <button className="lg:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl lg:hidden">
            <div className="flex flex-col justify-center h-full px-10">
              <div className="flex flex-col gap-6">
                {navLinks.map((link, idx) => {
                  const isActive = activeTab === link.name;
                  return (
                    <motion.button initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }} key={link.name} onClick={(e) => handleNavClick(e, link)} className={`text-left flex items-center justify-between py-2 ${isActive ? 'text-white' : 'text-neutral-500 hover:text-white'}`}>
                      <span className="flex items-center gap-4 text-3xl font-bold">
                        {isActive && <motion.div layoutId="mob-dot" className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-[0_0_12px_#8b5cf6]" />}
                        {link.name}
                      </span>
                      <ChevronRight size={20} className={isActive ? 'text-[#8b5cf6]' : 'opacity-30'} />
                    </motion.button>
                  );
                })}
              </div>
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} onClick={(e) => handleNavClick(e, { name: 'Hire', id: 'contact' })} className="mt-12 w-full py-4 bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white font-bold rounded-2xl text-center text-sm uppercase tracking-widest">
                Get in Touch
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ================================================================
   COMPONENT: Contact Form
   ================================================================ */
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const e: { [key: string]: string } = {};
    if (formData.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(formData.email)) e.email = 'Please enter a valid email';
    if (formData.message.trim().length < 20) e.message = 'Message must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setTimeout(() => { setStatus('success'); setFormData({ name: '', email: '', message: '' }); setTimeout(() => setStatus('idle'), 5000); }, 1500);
  };

  const ic = (hasErr: boolean) => `w-full bg-white/[0.03] border ${hasErr ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-2xl px-5 py-4 text-white transition-all duration-300 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 focus:shadow-[0_0_20px_rgba(139,92,246,0.15)] placeholder:text-neutral-600`;

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] p-8 md:p-12 rounded-[2rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#8b5cf6]/10 rounded-full blur-[80px] pointer-events-none" />
      {status === 'success' ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.1 }} className="w-16 h-16 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-[#8b5cf6]" />
          </motion.div>
          <h3 className="text-3xl font-bold mb-3 text-white">Sent!</h3>
          <p className="text-neutral-400">Thanks for reaching out. I'll be in touch soon.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={ic(!!errors.name)} placeholder="Your Name" />
            {errors.name && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">{errors.name}</motion.p>}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={ic(!!errors.email)} placeholder="eliosmernica@gmail.com" />
            {errors.email && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">{errors.email}</motion.p>}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Message</label>
            <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={ic(!!errors.message) + " resize-none"} placeholder="How can I help?" />
            {errors.message && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">{errors.message}</motion.p>}
          </div>
          <motion.button type="submit" disabled={status === 'loading'} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            <Send size={16} /> {status === 'loading' ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      )}
    </div>
  );
};

/* ================================================================
   COMPONENT: Testimonial Carousel (auto-advance, pause on hover)
   ================================================================ */
const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setIndex((p) => (p + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setIndex((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex items-center justify-center min-h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.98 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="p-10 md:p-14 rounded-[3rem] glass-accent max-w-3xl w-full text-center relative">
            <Quote size={50} className="text-[#8b5cf6]/15 absolute top-8 left-8" />
            <p className="text-lg md:text-2xl font-medium leading-relaxed mb-8 text-neutral-200">"{TESTIMONIALS[index].text}"</p>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full mb-3 border-2 border-[#8b5cf6]/30 p-0.5 overflow-hidden">
                <img src={TESTIMONIALS[index].avatar} alt={TESTIMONIALS[index].name} className="w-full h-full rounded-full object-cover" />
              </div>
              <h4 className="font-bold text-lg text-white">{TESTIMONIALS[index].name}</h4>
              <p className="text-[10px] uppercase tracking-widest text-[#a78bfa] font-bold mt-1">{TESTIMONIALS[index].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-5 mt-6">
        <button onClick={prev} className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center hover:bg-[#8b5cf6] hover:border-[#8b5cf6] transition-all duration-300"><ChevronLeft size={16} /></button>
        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`rounded-full transition-all duration-300 ${i === index ? 'w-6 h-2 bg-[#8b5cf6]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
        <button onClick={next} className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center hover:bg-[#8b5cf6] hover:border-[#8b5cf6] transition-all duration-300"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
};

/* ================================================================
   PAGE: Project Detail
   ================================================================ */
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === id);
  if (!project) return <div className="min-h-screen flex items-center justify-center text-white text-xl">Project Not Found</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="pt-32 pb-24 px-6 max-w-6xl mx-auto text-white relative">
      <FloatingOrbs />
      <button onClick={() => navigate(-1)} className="mb-14 flex items-center gap-3 text-neutral-500 hover:text-[#a78bfa] transition-all group relative z-10">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-[0.3em]">Back to Showcase</span>
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-white/[0.06] mb-14 shadow-2xl">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </motion.div>
          <RevealSection>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-gradient leading-tight">{project.title}</h1>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed font-light">{project.longDescription}</p>
          </RevealSection>
        </div>
        <div className="lg:col-span-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-8 rounded-[2.5rem] glass-accent sticky top-32">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a78bfa] mb-6 border-b border-[#8b5cf6]/10 pb-3">Project Specs</h3>
            <div className="space-y-5">
              <div><p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Year</p><p className="text-white font-bold">{project.year}</p></div>
              <div><p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Category</p><p className="text-white font-bold">{project.category}</p></div>
              <div><p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Stack</p>
                <div className="flex flex-wrap gap-2 mt-2">{project.tech.map(t => <span key={t} className="px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-lg text-[10px] font-bold text-[#c4b5fd]">{t}</span>)}</div>
              </div>
            </div>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-8 w-full py-4 bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white rounded-2xl flex items-center justify-center gap-3 font-bold hover:shadow-lg hover:shadow-violet-500/25 transition-all">
              Visit Live <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ================================================================
   PAGE: Home
   ================================================================ */
const Home = () => {
  const [filter, setFilter] = useState('All');
  const categories = useMemo(() => ['All', 'Web Design', 'Web Development', 'Applications'], []);
  const filteredProjects = useMemo(() => filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter), [filter]);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative pt-44 pb-20 px-6 max-w-7xl mx-auto overflow-hidden text-white min-h-screen flex flex-col justify-center">
        <FloatingOrbs />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* Main card */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-8 p-10 md:p-16 rounded-[3rem] bg-white/[0.02] border border-white/[0.06] relative overflow-hidden flex flex-col justify-end min-h-[520px]">
            <div className="absolute top-10 right-10 flex items-center gap-3 bg-white/[0.04] px-4 py-2 rounded-full border border-white/[0.06]">
              <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse shadow-[0_0_8px_#8b5cf6]" />
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Available for Work</span>
            </div>
            <div className="relative z-10">
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-[#a78bfa] text-xs font-bold uppercase tracking-[0.3em] mb-6">Software Engineer</motion.p>
              {/* Staggered heading words */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9]">
                {['Elios', 'Mernica.'].map((word, i) => (
                  <motion.span key={word} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-gradient inline-block mr-4">
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="max-w-lg text-neutral-400 text-lg md:text-xl leading-relaxed mb-10 font-light">
                Specializing in web development, system design, and network infrastructure.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-wrap gap-4">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-violet-500/30 transition-shadow flex items-center gap-3">
                  View Showcase <ArrowUpRight size={18} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 bg-white/[0.04] border border-white/10 text-white font-bold rounded-2xl hover:bg-white/[0.08] transition-all">
                  Contact Me
                </motion.button>
              </motion.div>
            </div>
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#8b5cf6]/[0.06] blur-[100px] rounded-full pointer-events-none" />
          </motion.div>

          {/* Side cards */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between hover:border-[#8b5cf6]/20 transition-all duration-500 group">
              <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center text-[#a78bfa] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"><Globe size={24} /></div>
              <div className="mt-12"><h3 className="text-2xl font-black mb-2">Kosovo, EU</h3><p className="text-neutral-500 text-sm leading-relaxed">Available for remote engineering and digital missions.</p></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white flex flex-col justify-between shadow-2xl shadow-violet-500/20 overflow-hidden relative group">
              <div className="relative z-10"><h3 className="text-6xl font-black tracking-tighter"><AnimatedCounter target={9} suffix="+" /></h3></div>
              <p className="font-bold text-xs uppercase tracking-widest opacity-70 mt-10 relative z-10">Years of Growth</p>
              <Zap size={180} className="absolute -bottom-8 -right-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000" fill="currentColor" />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex justify-center mt-12 relative z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-8 h-12 rounded-full border border-white/10 flex items-center justify-center">
            <ArrowDown size={14} className="text-neutral-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== PROJECTS (Bento Grid) ===== */}
      <section id="projects" className="py-28 px-6 max-w-7xl mx-auto scroll-mt-24 text-white">
        <RevealSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-[#a78bfa] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">Portfolio</span>
            <h2 className="text-5xl md:text-7xl font-black">Curated <span className="text-neutral-500 italic">Labs.</span></h2>
          </div>
          <div className="flex flex-wrap gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${filter === cat ? 'bg-[#8b5cf6] text-white shadow-lg shadow-violet-500/20' : 'text-neutral-500 hover:text-white hover:bg-white/[0.04]'}`}>{cat}</button>
            ))}
          </div>
        </RevealSection>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, delay: idx * 0.05 }} className={`group cursor-pointer ${idx === 0 && filter === 'All' ? 'md:col-span-2' : ''}`}>
                <Link to={`/project/${project.id}`} className={`block relative overflow-hidden rounded-[2rem] border border-white/[0.06] hover:border-[#8b5cf6]/30 transition-all duration-500 ${idx === 0 && filter === 'All' ? 'aspect-[2.4/1]' : 'aspect-[16/10]'}`}>
                  <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }} className="absolute inset-0 w-full h-full">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover object-center grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-8 md:p-10 transition-all duration-500">
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex-1 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[#a78bfa] text-[10px] font-bold uppercase tracking-[0.3em] block">{project.category}</span>
                        <h4 className={`font-black text-white tracking-tight ${idx === 0 && filter === 'All' ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>{project.title}</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed max-w-md">{project.description}</p>
                      </div>
                      <div className="w-12 h-12 bg-[#8b5cf6] rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        <ArrowUpRight size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ===== SKILLS MARQUEE ===== */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-white">
        <RevealSection className="text-center mb-12">
          <span className="text-[#a78bfa] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">Technical Arsenal</span>
          <h2 className="text-4xl md:text-6xl font-black">Tools of <span className="text-neutral-500 italic">Choice.</span></h2>
        </RevealSection>
        <SkillMarquee />
      </section>

      {/* ===== RESUME ===== */}
      <section id="resume" className="py-28 px-6 scroll-mt-24 text-white relative">
        <FloatingOrbs />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealSection className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-10">
              <div>
                <span className="text-[#a78bfa] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">Resume</span>
                <h2 className="text-5xl font-black mb-8 leading-tight">Career <span className="text-neutral-500 italic">Core.</span></h2>
              </div>
              <div className="space-y-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                {[{ icon: Mail, text: CONTACT_INFO.email }, { icon: Phone, text: CONTACT_INFO.phone }, { icon: MapPin, text: CONTACT_INFO.location }].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-4 text-neutral-400 hover:text-[#a78bfa] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center"><Icon size={14} className="text-[#a78bfa]" /></div>
                    <span className="text-xs tracking-wide font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Education */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs border-b border-white/[0.06] pb-4">
                  <div className="w-6 h-6 rounded-md bg-[#8b5cf6]/10 flex items-center justify-center"><Sparkles size={12} className="text-[#a78bfa]" /></div>
                  Education
                </div>
                <div className="space-y-6 border-l border-white/[0.06] pl-6">
                  {EDUCATION.map((edu, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="relative group">
                      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#8b5cf6] border-2 border-black shadow-[0_0_8px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.7)] transition-all" />
                      <span className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-widest">{edu.period}</span>
                      <h4 className="text-base font-bold mt-1 text-white">{edu.title}</h4>
                      <p className="text-neutral-500 text-xs mt-1 leading-relaxed">{edu.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Experience */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs border-b border-white/[0.06] pb-4">
                  <div className="w-6 h-6 rounded-md bg-[#8b5cf6]/10 flex items-center justify-center"><Zap size={12} className="text-[#a78bfa]" /></div>
                  Experience
                </div>
                <div className="space-y-6 border-l border-white/[0.06] pl-6">
                  {EXPERIENCE.map((exp, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="relative group">
                      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#8b5cf6] border-2 border-black shadow-[0_0_8px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.7)] transition-all" />
                      <span className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-widest">{exp.period}</span>
                      <h4 className="text-base font-bold mt-1 text-white">{exp.company}</h4>
                      <p className="text-neutral-500 text-xs mt-1 leading-relaxed">{exp.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Skills Progress */}
          <RevealSection className="mt-24 p-10 rounded-[2.5rem] border border-white/[0.06] bg-white/[0.01]">
            <h3 className="text-xs font-bold mb-10 text-center uppercase tracking-[0.4em] text-[#a78bfa]">System Proficiency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {SKILLS_PROGRESS.map((skill, idx) => (
                <div key={idx} className="space-y-2.5">
                  <div className="flex justify-between font-bold text-[10px] uppercase tracking-widest text-neutral-400">
                    <span>{skill.name}</span>
                    <span className="text-white">{skill.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.value}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-28 px-6 scroll-mt-24 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <RevealSection className="lg:col-span-7 p-10 md:p-14 rounded-[3rem] bg-white/[0.02] border border-white/[0.06] relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#8b5cf6]/[0.05] blur-[80px] rounded-full pointer-events-none" />
              <span className="text-[#a78bfa] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">About</span>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Pure <br /><span className="text-neutral-500 italic">Logic.</span></h2>
              <p className="text-neutral-400 text-lg md:text-xl leading-relaxed font-light mb-10">
                As a skilled IT engineer, I specialize in web development, system design, and network infrastructure. With expertise in both front-end and back-end development, I create responsive, user-friendly websites and robust software systems. Additionally, I hold certifications in network configuration and administration, ensuring seamless connectivity and secure IT environments.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/[0.06]">
                <div><h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a78bfa] mb-3">Focus</h4><p className="text-white text-base font-bold">Web & Infrastructure</p></div>
                <div><h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a78bfa] mb-3">Principle</h4><p className="text-white text-base font-bold">Minimalism & Speed</p></div>
              </div>
            </RevealSection>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {SERVICES.map((s, idx) => (
                <RevealSection key={idx} delay={idx * 0.1} className={`p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between hover:border-[#8b5cf6]/25 transition-all duration-500 group ${idx === 3 ? 'col-span-2' : ''}`}>
                  <div className="w-11 h-11 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center mb-10 text-[#a78bfa] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] group-hover:bg-[#8b5cf6]/20 transition-all">
                    {s.icon === "Cpu" && <Cpu size={20} />}
                    {s.icon === "Palette" && (s.title === "Photography" ? <Camera size={20} /> : <Palette size={20} />)}
                    {s.icon === "Zap" && <Zap size={20} />}
                  </div>
                  <div><h3 className="font-black text-lg mb-3 tracking-tight">{s.title}</h3><p className="text-xs text-neutral-500 leading-relaxed">{s.desc}</p></div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section id="blog" className="py-28 px-6 scroll-mt-24 text-white">
        <div className="max-w-7xl mx-auto">
          <RevealSection className="text-center mb-16">
            <span className="text-[#a78bfa] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">Journal</span>
            <h2 className="text-5xl md:text-7xl font-black">Digital <span className="text-neutral-500 italic">Notes.</span></h2>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, idx) => (
              <RevealSection key={idx} delay={idx * 0.06}>
                <div className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/[0.06] mb-6 relative group-hover:border-[#8b5cf6]/25 transition-all duration-500">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                  <div className="px-1">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest mb-3">
                      <span className="text-[#a78bfa]">{post.category}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-700" />
                      <span className="text-neutral-500">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 group-hover:text-white text-neutral-200 transition-colors tracking-tight">{post.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">{post.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-28 px-6 max-w-7xl mx-auto text-white">
        <RevealSection className="text-center mb-16">
          <span className="text-[#a78bfa] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">Feedback</span>
          <h2 className="text-5xl md:text-7xl font-black">Verified <span className="text-neutral-500 italic">Trust.</span></h2>
        </RevealSection>
        <Testimonials />
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-32 px-6 scroll-mt-24 relative overflow-hidden text-white">
        <FloatingOrbs />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <RevealSection>
            <span className="text-[#a78bfa] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">Get in Touch</span>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-gradient leading-none">Craft the<br />Future.</h2>
            <p className="text-neutral-400 text-lg md:text-xl mb-12 max-w-md font-light leading-relaxed">Architecting the next generation of digital excellence. Let's build something remarkable together.</p>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-neutral-400 hover:text-[#a78bfa] hover:border-[#8b5cf6]/30 transition-all"><Mail size={14} /> {CONTACT_INFO.email}</a>
              <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-neutral-400 hover:text-[#a78bfa] hover:border-[#8b5cf6]/30 transition-all"><Phone size={14} /> {CONTACT_INFO.phone}</a>
            </div>
          </RevealSection>
          <RevealSection delay={0.2}><ContactForm /></RevealSection>
        </div>
      </section>
    </>
  );
};

/* ================================================================
   ROOT APP
   ================================================================ */
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <ScrollProgress />
      <div className="min-h-screen bg-black text-white">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>

        <footer className="pt-24 border-t border-white/[0.06] px-6 max-w-7xl mx-auto text-white pb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-violet-500/20">EM</div>
              <span className="text-sm font-bold text-neutral-500 group-hover:text-white transition-colors">Elios Mernica</span>
            </Link>
            <div className="flex gap-4">
              {SOCIALS.map(s => (
                <motion.a key={s.name} href={s.link} whileHover={{ scale: 1.1, y: -2 }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] text-neutral-400 hover:text-white hover:border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/10 transition-all duration-300">
                  {s.icon === 'Github' && <Github size={18} />}
                  {s.icon === 'Twitter' && <Twitter size={18} />}
                  {s.icon === 'Linkedin' && <Linkedin size={18} />}
                </motion.a>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 border-t border-white/[0.04] text-[10px] font-medium uppercase tracking-[0.2em]">
            <p className="text-neutral-600">&copy; 2025 Elios Mernica. All rights reserved.</p>
            <div className="flex gap-4 text-neutral-500">
              <span className="hover:text-[#a78bfa] transition-colors cursor-default">React</span>
              <span className="text-neutral-700">/</span>
              <span className="hover:text-[#a78bfa] transition-colors cursor-default">TypeScript</span>
              <span className="text-neutral-700">/</span>
              <span className="hover:text-[#a78bfa] transition-colors cursor-default">Framer Motion</span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
