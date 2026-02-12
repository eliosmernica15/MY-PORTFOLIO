import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../constants';
import RevealSection from './RevealSection';
import TiltCard from './TiltCard';
import MagneticButton from './MagneticButton';

const Projects: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = useMemo(
    () => ['All', 'Web Design', 'Web Development', 'Applications'],
    []
  );
  const filteredProjects = useMemo(
    () => (filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter)),
    [filter]
  );

  return (
    <section
      id="projects"
      className="py-28 px-6 max-w-7xl mx-auto scroll-mt-24 snap-section"
    >
      <RevealSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <span
            className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
            style={{ color: 'var(--accent-light)' }}
          >
            Portfolio
          </span>
          <h2 className="text-5xl md:text-7xl font-black">
            Curated{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>
              Labs.
            </span>
          </h2>
        </div>
        <div
          className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          {categories.map(cat => (
            <MagneticButton key={cat} strength={0.1}>
              <button
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  filter === cat
                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-violet-500/20'
                    : 'hover:bg-[var(--bg-card)]'
                }`}
                style={
                  filter !== cat
                    ? { color: 'var(--text-muted)' }
                    : undefined
                }
              >
                {cat}
              </button>
            </MagneticButton>
          ))}
        </div>
      </RevealSection>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`${idx === 0 && filter === 'All' ? 'md:col-span-2' : ''}`}
            >
              <TiltCard>
                <Link
                  to={`/project/${project.id}`}
                  className={`block relative overflow-hidden rounded-[2rem] group cursor-pointer transition-all duration-500 ${
                    idx === 0 && filter === 'All'
                      ? 'aspect-[2.4/1]'
                      : 'aspect-[16/10]'
                  }`}
                  style={{ border: '1px solid var(--border)' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                      loading="lazy"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-8 md:p-10 transition-all duration-500">
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex-1 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[var(--accent-light)] text-[10px] font-bold uppercase tracking-[0.3em] block">
                          {project.category}
                        </span>
                        <h4
                          className={`font-black text-white tracking-tight ${
                            idx === 0 && filter === 'All'
                              ? 'text-3xl md:text-5xl'
                              : 'text-2xl md:text-3xl'
                          }`}
                        >
                          {project.title}
                        </h4>
                        <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                          {project.description}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        <ArrowUpRight size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Projects;
