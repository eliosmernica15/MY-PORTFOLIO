'use client';

import React, { useState, useMemo, memo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import RevealSection from './RevealSection';
import SectionHeader from './ui/SectionHeader';
import AdvancedButton from './ui/AdvancedButton';

type Project = (typeof PROJECTS)[number];

interface ProjectCardProps {
  project: Project;
  isFeatured: boolean;
}

// Plain CSS hover. The previous version wrapped every card in a
// `TiltCard` (a 'use client' component with mousemove listeners),
// which forced each card to hydrate as a client component and
// paid the JS cost on every render. The CSS `:hover` state is
// purely declarative and the card now ships as a server-rendered
// subtree.
const ProjectCard = memo(function ProjectCard({ project, isFeatured }: ProjectCardProps) {
  return (
    <div className={isFeatured ? 'md:col-span-2' : ''}>
      <Link
        href={`/project/${project.id}`}
        // `prefetch={true}` (the default for Link) means Next.js
        // starts downloading the page's RSC + JS chunk the moment
        // the link enters the viewport — well before the user
        // clicks. Combined with `dynamicParams = false` in the
        // project route, every project's chunk is prebuilt and
        // cached at the edge, so the click resolves against a
        // warm cache.
        prefetch={true}
        className={`project-card block relative overflow-hidden rounded-2xl sm:rounded-[2rem] group cursor-pointer ${
          isFeatured ? 'aspect-[4/3] sm:aspect-[2.4/1]' : 'aspect-[16/10]'
        }`}
        style={{ border: '1px solid var(--border)' }}
        data-cursor-hover
      >
        <span className="project-year-badge">{project.year}</span>
        <Image
          src={project.image}
          alt={project.title}
          width={isFeatured ? 1200 : 800}
          height={isFeatured ? 500 : 500}
          className="project-card-image w-full h-full object-cover object-top"
          loading={isFeatured ? 'eager' : 'lazy'}
          priority={isFeatured}
          // `sizes` lets Next.js pick the smallest srcset variant
          // that fits the rendered size. The previous default
          // shipped 1200×500 even on mobile.
          sizes={isFeatured ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 50vw, 100vw'}
        />
        <div
          className="project-card-overlay absolute inset-0 md:opacity-0 md:group-hover:opacity-100 flex flex-col justify-end p-5 sm:p-6 md:p-10"
          style={{ background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 55%)' }}
        >
          <div className="flex items-end justify-between gap-3 sm:gap-4">
            <div className="flex-1 space-y-2 project-card-content">
              <span className="text-[var(--accent-light)] text-[10px] font-bold uppercase tracking-[0.3em] block">
                {project.category}
              </span>
              <h4
                className={`font-black tracking-tight ${isFeatured ? 'text-2xl sm:text-3xl md:text-5xl' : 'text-xl sm:text-2xl md:text-3xl'}`}
                style={{ color: 'var(--text-primary)' }}
              >
                {project.title}
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
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
            <div className="project-card-arrow w-10 h-10 sm:w-12 sm:h-12 bg-[var(--accent)] text-[var(--accent-contrast)] rounded-full flex items-center justify-center shadow-accent shrink-0">
              <ArrowUpRight size={20} className="sm:w-6 sm:h-6" style={{ color: 'var(--accent-contrast)' }} />
            </div>
          </div>
        </div>
      </Link>
    </div>
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
    <section id="projects" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 max-w-7xl mx-auto content-auto relative z-[1]">
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
              className={`interactive-btn nav-link px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
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
