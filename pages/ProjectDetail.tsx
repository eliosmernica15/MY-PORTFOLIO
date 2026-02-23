import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, LayoutGrid } from 'lucide-react';
import { PROJECTS } from '../constants';
import FloatingOrbs from '../components/FloatingOrbs';
import RevealSection from '../components/RevealSection';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const project = PROJECTS.find(p => p.id === id);

  const scrollToProjects = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl" style={{ color: 'var(--text-primary)' }}>
        Project Not Found
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pt-32 pb-24 px-6 max-w-6xl mx-auto relative"
    >
      <FloatingOrbs />
      <div className="mb-14 flex flex-wrap items-center gap-4 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 transition-all group hover:text-[var(--accent-light)]"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Go back to previous page"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-bold uppercase tracking-[0.3em]">
            Back to Showcase
          </span>
        </button>
        <button
          type="button"
          onClick={scrollToProjects}
          className="flex items-center gap-3 transition-all group hover:text-[var(--accent-light)]"
          style={{ color: 'var(--text-muted)' }}
        >
          <LayoutGrid size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-[0.3em]">
            View all projects
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-14 shadow-2xl"
            style={{ border: '1px solid var(--border)' }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <RevealSection>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-gradient leading-tight">
              {project.title}
            </h1>
            <p
              className="text-xl md:text-2xl leading-relaxed font-light"
              style={{ color: 'var(--text-secondary)' }}
            >
              {project.longDescription}
            </p>
          </RevealSection>
        </div>
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-[2.5rem] glass-accent sticky top-32"
          >
            <h3
              className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6 pb-3"
              style={{
                color: 'var(--accent-light)',
                borderBottom: '1px solid var(--glass-accent-border)',
              }}
            >
              Project Specs
            </h3>
            <div className="space-y-5">
              <div>
                <p
                  className="text-[10px] uppercase font-bold tracking-widest mb-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Year
                </p>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {project.year}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] uppercase font-bold tracking-widest mb-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Category
                </p>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {project.category}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] uppercase font-bold tracking-widest mb-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Stack
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tech.map(t => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-lg text-[10px] font-bold"
                      style={{
                        backgroundColor: 'var(--glass-accent-bg)',
                        border: '1px solid var(--glass-accent-border)',
                        color: 'var(--accent-muted)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full py-4 bg-[var(--accent)] text-[var(--accent-contrast)] rounded-2xl flex items-center justify-center gap-3 font-bold hover:shadow-accent-hover shadow-accent transition-all"
            >
              Visit Live <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
