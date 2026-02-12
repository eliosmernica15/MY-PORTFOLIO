
import React, { useState, useEffect, useMemo } from 'react';
import { 
  HashRouter, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Zap, 
  Cpu, 
  Palette, 
  ChevronRight, 
  ChevronLeft,
  Globe, 
  Menu, 
  X,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Quote,
  Calendar,
  MapPin,
  Phone,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { PROJECTS, SKILLS, SERVICES, SOCIALS, TESTIMONIALS, EDUCATION, EXPERIENCE, SKILLS_PROGRESS, CONTACT_INFO, BLOG_POSTS } from './constants';

/**
 * UTILITY: Scroll to top on route change
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * COMPONENT: Section Wrapper for Scroll Animations
 */
const RevealSection = ({ children, className = "", id }: { children?: React.ReactNode, className?: string, id?: string }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * COMPONENT: Navigation
 */
const Nav = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Projects', id: 'projects' },
    { name: 'Resume', id: 'resume' },
    { name: 'About', id: 'about' },
    { name: 'Blog', id: 'blog' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (e: React.MouseEvent, link: { name: string, id: string }) => {
    e.preventDefault();
    setActiveTab(link.name);
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(link.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(link.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 max-w-fit px-4 py-2 rounded-full flex items-center gap-4 border border-white/40 bg-white/70 backdrop-blur-xl shadow-xl">
        {/* Logo Section */}
        <Link to="/" onClick={() => setActiveTab('About')} className="flex items-center px-2" aria-label="Go to Homepage">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-black rounded-xl flex items-center justify-center font-bold text-xs text-white"
          >
            EM
          </motion.div>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <button 
                key={link.name}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300 z-10 ${isActive ? 'text-[#ffffff]' : 'text-[#000000]'}`}
              >
                {isActive && (
                  <>
                    <motion.div 
                      layoutId="pill-active-bg"
                      className="absolute inset-0 bg-[#000000] rounded-full -z-10 shadow-lg shadow-black/20"
                      transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
                    />
                    <motion.div 
                      layoutId="active-underline"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </>
                )}
                {link.name}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button 
          onClick={(e) => handleNavClick(e, { name: 'Hire', id: 'contact' })}
          className={`hidden lg:block px-6 py-3 text-[11px] font-black rounded-full uppercase tracking-widest transition-all z-10 relative ${activeTab === 'Hire' ? 'text-[#ffffff]' : 'text-[#000000]'}`}
        >
          {activeTab === 'Hire' && (
            <>
              <motion.div 
                layoutId="pill-active-bg"
                className="absolute inset-0 bg-[#000000] rounded-full -z-10 shadow-lg shadow-black/20"
                transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
              />
              <motion.div 
                layoutId="active-underline"
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
              />
            </>
          )}
          Hire
        </button>

        <button 
          className="lg:hidden p-2 text-black transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl lg:hidden pt-32 px-10"
          >
            <div className="flex flex-col gap-8 text-3xl font-bold">
              {navLinks.map((link, idx) => {
                const isActive = activeTab === link.name;
                return (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={link.name}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`text-left transition-all flex items-center justify-between group ${isActive ? 'text-[#ffffff] scale-105' : 'text-neutral-400 hover:text-white'}`}
                  >
                    <span className="flex items-center gap-4">
                      {isActive && <motion.div layoutId="mobile-dot" className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />}
                      {link.name}
                    </span>
                    <ChevronRight className={isActive ? 'opacity-100' : 'opacity-40'} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * COMPONENT: Contact Form
 */
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (formData.message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  const inputClasses = (hasError: boolean) => `
    w-full bg-black border ${hasError ? 'border-red-500/50' : 'border-white/10'} 
    rounded-2xl px-5 py-4 text-white transition-all duration-300
    focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 
    focus:shadow-[0_0_25px_rgba(255,255,255,0.3)]
    focus:animate-[pulse_3s_infinite]
  `;

  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2rem] glass shadow-2xl">
      {status === 'success' ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
          <CheckCircle2 size={40} className="text-white mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-3 text-white">Sent!</h3>
          <p className="text-neutral-400">Thanks for reaching out, I'll be in touch.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClasses(!!errors.name)} 
              placeholder="Your Name" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClasses(!!errors.email)} 
              placeholder="eliosmernica@gmail.com" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Message</label>
            <textarea 
              rows={4} 
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={inputClasses(!!errors.message) + " resize-none"} 
              placeholder="How can I help?" 
            />
          </div>
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-neutral-200 transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

/**
 * COMPONENT: Testimonial Carousel
 */
const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="relative">
      <div className="flex items-center justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-10 md:p-14 rounded-[3rem] glass max-w-3xl w-full text-center relative border border-white/5"
          >
            <Quote size={50} className="text-white/10 absolute top-10 left-10" />
            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 text-neutral-200">"{TESTIMONIALS[index].text}"</p>
            <div className="flex flex-col items-center">
              <img src={TESTIMONIALS[index].avatar} alt={TESTIMONIALS[index].name} className="w-16 h-16 rounded-full mb-4 border border-white/10 grayscale" />
              <h4 className="font-bold text-xl text-white">{TESTIMONIALS[index].name}</h4>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">{TESTIMONIALS[index].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-6 mt-8">
        <button onClick={prev} className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><ChevronLeft size={20} /></button>
        <button onClick={next} className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
};

/**
 * PAGE: Project Detail View
 */
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) return <div className="min-h-screen flex items-center justify-center text-white">Project Not Found</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 px-6 max-w-6xl mx-auto text-white">
      <button onClick={() => navigate(-1)} className="mb-14 flex items-center gap-3 text-neutral-500 hover:text-white transition-all group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-[0.3em]">Back to Showcase</span>
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <motion.div layoutId={`img-${project.id}`} className="aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/5 mb-16 shadow-2xl">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover object-center grayscale-[0.5]" />
          </motion.div>
          <RevealSection>
            <h1 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter text-gradient leading-tight">{project.title}</h1>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed mb-14 font-light">{project.longDescription}</p>
          </RevealSection>
        </div>
        <div className="lg:col-span-4">
          <div className="p-10 rounded-[2.5rem] glass border border-white/5 sticky top-32">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-8 border-b border-white/5 pb-4">Specs</h3>
            <div className="space-y-6">
              <div><p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Year</p><p className="text-white font-bold">{project.year}</p></div>
              <div><p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Category</p><p className="text-white font-bold">{project.category}</p></div>
              <div><p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Stack</p>
                <div className="flex flex-wrap gap-2 mt-2">{project.tech.map(t => <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-neutral-400">{t}</span>)}</div>
              </div>
            </div>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-12 w-full py-5 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-neutral-200 transition-all">Visit Live <ExternalLink size={18} /></a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * PAGE: Home
 */
const Home = () => {
  const [filter, setFilter] = useState('All');
  const categories = useMemo(() => ['All', 'Web Design', 'Web Development', 'Applications'], []);
  const filteredProjects = useMemo(() => filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter), [filter]);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSkillClick = (skill: string) => {
    console.log(`Skill selected: ${skill}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 max-w-7xl mx-auto overflow-hidden text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="lg:col-span-8 p-10 md:p-16 rounded-[4rem] glass relative overflow-hidden flex flex-col justify-end min-h-[600px] shadow-2xl">
            <div className="absolute top-12 right-12 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_#fff]" />
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">Operating Globally</span>
            </div>
            <div className="relative z-10">
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[1] text-gradient">Elios <br />Mernica.</h1>
              <p className="max-w-xl text-neutral-400 text-xl md:text-2xl leading-relaxed mb-12 font-light">
                Software Engineer specializing in web development, system design, and network infrastructure.
              </p>
              <div className="flex flex-wrap gap-5">
                <button 
                  onClick={scrollToProjects}
                  className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-3"
                >
                  Showcase <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
          </motion.div>
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            <div className="p-10 rounded-[3rem] glass flex flex-col justify-between border border-white/5 hover:border-white/20 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white"><Globe size={28} /></div>
              <div className="mt-16"><h3 className="text-2xl font-black mb-3">Kosovo, EU</h3><p className="text-neutral-500 leading-relaxed">Available for elite digital missions and remote engineering.</p></div>
            </div>
            <div className="p-10 rounded-[3rem] bg-white text-black flex flex-col justify-between shadow-2xl overflow-hidden relative group">
              <div className="relative z-10"><h3 className="text-6xl font-black tracking-tighter">9+</h3><p className="font-black text-xs uppercase tracking-widest opacity-60 mt-12">Years of Growth</p></div>
              <Zap size={200} className="absolute -bottom-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000" fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-24 text-white">
        <RevealSection className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <div><span className="text-neutral-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Work</span><h2 className="text-5xl md:text-7xl font-black">Curated <span className="text-neutral-500 italic">Labs.</span></h2></div>
          <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-[2rem] border border-white/5">
            {categories.map(cat => <button key={cat} onClick={() => setFilter(cat)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>{cat}</button>)}
          </div>
        </RevealSection>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div 
                key={project.id} 
                layout 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="group cursor-pointer"
              >
                <Link to={`/project/${project.id}`} className="block relative overflow-hidden rounded-[2.5rem] border border-white/10 aspect-[16/10]">
                  {/* Image with improved centering */}
                  <motion.div 
                    whileHover={{ scale: 1.15 }} 
                    transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }} 
                    className="absolute inset-0 w-full h-full"
                  >
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000" 
                    />
                  </motion.div>
                  
                  {/* Unified Overlay matching reference screenshot */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-14 transition-all duration-500"
                  >
                    <div className="flex items-end justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <span className="text-[#a78bfa] text-[10px] font-black uppercase tracking-[0.4em] block">
                          {project.category}
                        </span>
                        <h4 className="text-3xl md:text-4xl font-black text-white tracking-tighter brightness-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                          {project.title}
                        </h4>
                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-sm font-medium">
                          {project.description}
                        </p>
                      </div>
                      
                      {/* Circular Action Button */}
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)] shrink-0">
                        <ArrowUpRight size={32} className="text-black" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Interactive Skills Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-white overflow-hidden">
        <RevealSection className="text-center mb-16">
          <span className="text-neutral-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Technical Arsenal</span>
          <h2 className="text-4xl md:text-6xl font-black">Tools of <span className="text-neutral-500 italic">Choice.</span></h2>
        </RevealSection>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {SKILLS.map((skill, idx) => (
            <motion.button
              key={skill}
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: '#ffffff', 
                color: '#000000',
                boxShadow: "0 0 30px rgba(255,255,255,0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSkillClick(skill)}
              className="px-8 py-4 rounded-full border border-white/10 bg-white/5 text-sm font-bold tracking-tight transition-all duration-300"
            >
              {skill}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="py-32 px-6 bg-black scroll-mt-24 text-white">
        <div className="max-w-7xl mx-auto">
          <RevealSection className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-12">
              <div>
                <span className="text-neutral-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Resume</span>
                <h2 className="text-5xl font-black mb-10 leading-tight">Career <span className="text-neutral-500 italic">Core.</span></h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-neutral-500"><Mail size={16} /> <span className="text-xs uppercase tracking-widest font-bold">{CONTACT_INFO.email}</span></div>
                  <div className="flex items-center gap-4 text-neutral-500"><Phone size={16} /> <span className="text-xs uppercase tracking-widest font-bold">{CONTACT_INFO.phone}</span></div>
                  <div className="flex items-center gap-4 text-neutral-500"><MapPin size={16} /> <span className="text-xs uppercase tracking-widest font-bold">{CONTACT_INFO.location}</span></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-3 text-white mb-6 font-black uppercase tracking-widest text-xs border-b border-white/5 pb-4">Education</div>
                <div className="space-y-10 border-l border-white/5 pl-8">
                  {EDUCATION.map((edu, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-10 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-black shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{edu.period}</span>
                      <h4 className="text-lg font-bold mt-1 text-white">{edu.title}</h4>
                      <p className="text-neutral-500 text-xs mt-2">{edu.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex items-center gap-3 text-white mb-6 font-black uppercase tracking-widest text-xs border-b border-white/5 pb-4">Experience</div>
                <div className="space-y-10 border-l border-white/5 pl-8">
                  {EXPERIENCE.map((exp, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-10 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-black shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{exp.period}</span>
                      <h4 className="text-lg font-bold mt-1 text-white">{exp.company}</h4>
                      <p className="text-neutral-500 text-xs mt-2">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
          
          <RevealSection className="mt-32 p-12 rounded-[3rem] border border-white/5 bg-white/[0.01]">
            <h3 className="text-xs font-black mb-12 text-center uppercase tracking-[0.4em] text-neutral-500">System Proficiency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
              {SKILLS_PROGRESS.map((skill, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between font-black text-[10px] uppercase tracking-widest text-neutral-400">
                    <span>{skill.name}</span>
                    <span className="text-white">{skill.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 scroll-mt-24 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <RevealSection className="lg:col-span-7 p-12 md:p-16 rounded-[4rem] glass border border-white/5 relative overflow-hidden">
              <h2 className="text-5xl font-black mb-10 leading-tight">Pure <br /><span className="text-neutral-500 italic">Logic.</span></h2>
              <p className="text-neutral-400 text-xl md:text-2xl leading-relaxed font-light mb-12">
                As a skilled IT engineer, I specialize in web development, system design, and network infrastructure. With expertise in both front-end and back-end development, I create responsive, user-friendly websites and robust software systems. Additionally, I hold certifications in network configuration and administration, ensuring seamless connectivity and secure IT environments.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/5">
                <div><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-4">Focus</h4><p className="text-white text-lg font-bold">Web & Infrastructure</p></div>
                <div><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-4">Principle</h4><p className="text-white text-lg font-bold">Minimalism & Speed</p></div>
              </div>
            </RevealSection>
            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              {SERVICES.map((s, idx) => (
                <div key={idx} className={`p-10 rounded-[3rem] glass flex flex-col justify-between border border-white/5 hover:border-white/20 transition-all ${idx === 3 ? 'col-span-2' : ''}`}>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-12 text-white">
                    {s.icon === "Cpu" && <Cpu size={24} />}
                    {s.icon === "Palette" && <Palette size={24} />}
                    {s.icon === "Zap" && <Zap size={24} />}
                  </div>
                  <div><h3 className="font-black text-xl mb-4 uppercase tracking-tighter">{s.title}</h3><p className="text-xs text-neutral-500 leading-relaxed font-medium">{s.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-32 px-6 bg-black scroll-mt-24 text-white">
        <div className="max-w-7xl mx-auto">
          <RevealSection className="text-center mb-24">
            <span className="text-neutral-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Journal</span>
            <h2 className="text-5xl md:text-7xl font-black">Digital <span className="text-neutral-500 italic">Notes.</span></h2>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {BLOG_POSTS.map((post, idx) => (
              <motion.div key={idx} className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 mb-8 grayscale hover:grayscale-0 transition-all duration-700">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover object-center" />
                </div>
                <div className="px-2">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">
                    <span>{post.category}</span> <span className="w-1 h-1 rounded-full bg-neutral-800" /> <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-black mb-4 group-hover:text-white transition-colors uppercase tracking-tighter">{post.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">{post.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 max-w-7xl mx-auto text-white">
        <RevealSection className="text-center mb-24"><span className="text-neutral-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Feedback</span><h2 className="text-5xl md:text-7xl font-black">Verified <span className="text-neutral-500 italic">Trust.</span></h2></RevealSection>
        <Testimonials />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 px-6 scroll-mt-24 relative overflow-hidden text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <RevealSection>
            <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter text-gradient leading-none">Craft the <br />Future.</h2>
            <p className="text-neutral-400 text-xl md:text-2xl mb-16 max-w-md font-light leading-relaxed italic">Architecting the next generation of digital excellence.</p>
          </RevealSection>
          <RevealSection><ContactForm /></RevealSection>
        </div>
      </section>
    </>
  );
};

/**
 * ROOT APP
 */
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white selection:bg-white/20">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>

        <footer className="pt-32 border-t border-white/5 px-6 max-w-7xl mx-auto text-white pb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-lg text-black">EM</div>
            </div>
            <div className="flex gap-8">
              {SOCIALS.map(s => (
                <motion.a 
                  key={s.name} 
                  href={s.link} 
                  whileHover={{ scale: 1.3, rotate: 5 }}
                  className="text-white bg-white/5 p-3 rounded-xl border border-white/10 hover:border-white transition-all shadow-lg hover:shadow-[0_0_15px_#ffffff]"
                >
                  {s.icon === 'Github' && <Github size={24} />}
                  {s.icon === 'Twitter' && <Twitter size={24} />}
                  {s.icon === 'Linkedin' && <Linkedin size={24} />}
                </motion.a>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 border-t border-white/5 text-neutral-600 text-[9px] font-black uppercase tracking-[0.3em]">
            <p className="text-neutral-500">© 2024 Elios Mernica. Zero latency guaranteed.</p>
            <div className="flex gap-6 text-neutral-400">
              <span className="hover:text-white transition-colors cursor-default">TS</span>
              <span className="hover:text-white transition-colors cursor-default">NEXT</span>
              <span className="hover:text-white transition-colors cursor-default">FRAMER</span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
