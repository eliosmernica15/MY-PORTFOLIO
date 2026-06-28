import React, { useState, useMemo, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { PROJECTS } from '../constants';
import RevealSection from './RevealSection';
import TiltCard from './TiltCard';
import MagneticButton from './MagneticButton';

type Project = (typeof PROJECTS)[number];

interface ProjectCardProps {
  project: Project;
  isFeatured: boolean;
  index: number;
}

const ProjectCard = memo(function ProjectCard({ project, isFeatured, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
      className={isFeatured ? 'md:col-span-2' : ''}
    >
      <TiltCard>
        <Link
          to={`/project/${project.id}`}
          className={`block relative overflow-hidden rounded-[2rem] group cursor-pointer transition-transform duration-500 hover:scale-[1.01] ${
            isFeatured ? 'aspect-[2.4/1]' : 'aspect-[16/10]'
          }`}
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              width={isFeatured ? 1200 : 800}
              height={isFeatured ? 500 : 500}
              className="w-full h-full object-cover object-top grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              loading={isFeatured ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={isFeatured ? 'high' : 'low'}
            />
          </div>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-8 md:p-10 transition-opacity duration-400"
            style={{ background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 50%)' }}
          >
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                <span className="text-[var(--accent-light)] text-[10px] font-bold uppercase tracking-[0.3em] block">
                  {project.category}
                </span>
                <h4
                  className={`font-black tracking-tight ${isFeatured ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {project.title}
                </h4>
                <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
                  {project.description}
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--accent)] text-[var(--accent-contrast)] rounded-full flex items-center justify-center shadow-accent shrink-0 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400 delay-75">
                <ArrowUpRight size={24} style={{ color: 'var(--accent-contrast)' }} />
              </div>
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
});

const INITIAL_VISIBLE_COUNT = 4;

const Projects: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const categories = useMemo(
    () => ['All', 'Web Development', 'Mobile Development'],
    []
  );
  const filteredProjects = useMemo(
    () => (filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter)),
    [filter]
  );
  const visibleProjects = useMemo(
    () =>
      filter === 'All' && !showAll
        ? filteredProjects.slice(0, INITIAL_VISIBLE_COUNT)
        : filteredProjects,
    [filter, showAll, filteredProjects]
  );
  const hasMore =
    filter === 'All' &&
    !showAll &&
    filteredProjects.length > INITIAL_VISIBLE_COUNT;
  const remainingCount = filteredProjects.length - INITIAL_VISIBLE_COUNT;

  useEffect(() => {
    setShowAll(false);
  }, [filter]);

  return (
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 max-w-7xl mx-auto snap-section content-auto">
      <RevealSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <span
            className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
            style={{ color: 'var(--accent-light)' }}
          >
            Portfolio
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black">
            Latest{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>
              Works.
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
                type="button"
                onClick={() => setFilter(cat)}
                className={`interactive-btn px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  filter === cat
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-accent'
                    : 'hover:bg-[var(--bg-card)]'
                }`}
                style={filter !== cat ? { color: 'var(--text-muted)' } : undefined}
                aria-label={`Filter projects by ${cat}`}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            </MagneticButton>
          ))}
        </div>
      </RevealSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleProjects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            isFeatured={idx === 0 && filter === 'All'}
            index={idx}
          />
        ))}
      </div>

      {hasMore && (
        <RevealSection className="mt-12 flex justify-center">
          <MagneticButton strength={0.15}>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="interactive-btn group px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 flex items-center gap-3 hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] hover:border-[var(--accent)] hover:shadow-accent-hover shadow-accent"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
              aria-label={`Load ${remainingCount} more projects`}
            >
              Load more
              <span
                className="transition-colors duration-300 group-hover:text-[var(--accent-contrast)]"
                style={{ color: 'var(--accent-light)' }}
              >
                ({remainingCount})
              </span>
              <ChevronDown
                size={16}
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </button>
          </MagneticButton>
        </RevealSection>
      )}
    </section>
  );
};

export default memo(Projects);
