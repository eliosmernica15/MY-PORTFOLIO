import React, { useState, useMemo, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { PROJECTS } from '../constants';
import RevealSection from './RevealSection';
import TiltCard from './TiltCard';
import SectionHeader from './ui/SectionHeader';
import AdvancedButton from './ui/AdvancedButton';

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
          data-cursor-hover
        >
          <span className="project-year-badge">{project.year}</span>
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              width={isFeatured ? 1200 : 800}
              height={isFeatured ? 500 : 500}
              className="w-full h-full object-cover object-top grayscale-[0.45] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              loading={isFeatured ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={isFeatured ? 'high' : 'low'}
            />
          </div>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-8 md:p-10 transition-opacity duration-400"
            style={{ background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 55%)' }}
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
                <div className="project-tech-row">
                  {project.tech.slice(0, 4).map(tech => (
                    <span key={tech} className="project-tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
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
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 max-w-7xl mx-auto snap-section content-auto relative z-[1]">
      <RevealSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <SectionHeader
          eyebrow="Portfolio"
          title={
            <>
              Latest <span className="italic" style={{ color: 'var(--text-muted)' }}>Works.</span>
            </>
          }
          className="!mb-0"
        />
        <div
          className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl shrink-0"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
          role="tablist"
          aria-label="Filter projects"
        >
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              role="tab"
              onClick={() => setFilter(cat)}
              className={`interactive-btn nav-link px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                filter === cat
                  ? 'nav-link-active bg-[var(--accent)] text-[var(--accent-contrast)] shadow-accent'
                  : ''
              }`}
              style={filter !== cat ? { color: 'var(--text-muted)' } : undefined}
              aria-label={`Filter projects by ${cat}`}
              aria-selected={filter === cat}
            >
              {cat}
            </button>
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
          <AdvancedButton
            variant="secondary"
            size="md"
            onClick={() => setShowAll(true)}
            iconRight={<ChevronDown size={16} />}
            aria-label={`Load ${remainingCount} more projects`}
          >
            Load more ({remainingCount})
          </AdvancedButton>
        </RevealSection>
      )}
    </section>
  );
};

export default memo(Projects);
