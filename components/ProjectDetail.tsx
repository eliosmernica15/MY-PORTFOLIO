'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, LayoutGrid, Calendar, Tag, Layers } from 'lucide-react';
import { Overview } from '@/components/case-study/Overview';
import { Architecture } from '@/components/case-study/Architecture';
import { Gallery } from '@/components/case-study/Gallery';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { RevealSection } from '@/components/RevealSection';
import type { Project } from '@/data/projects';

export default function ProjectDetail({ project }: { project: Project }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-28 pb-24 relative z-[1]">
      <div className="px-4 sm:px-6 max-w-6xl mx-auto mb-10 flex flex-wrap items-center gap-4">
        <Link
          href="/#projects"
          className="flex items-center gap-3 transition-all group hover:text-[var(--accent-light)] text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Showcase
        </Link>
        <Link
          href="/#projects"
          className="flex items-center gap-3 transition-all group hover:text-[var(--accent-light)] text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: 'var(--text-muted)' }}
        >
          <LayoutGrid size={16} className="group-hover:scale-110 transition-transform" />
          View all projects
        </Link>
      </div>

      <Overview project={project} />

      <RevealSection>
        <Architecture project={project} />
      </RevealSection>

      <RevealSection>
        <Gallery project={project} />
      </RevealSection>

      <div className="px-4 sm:px-6 max-w-5xl mx-auto mt-12">
        <PremiumCard glow>
          <div className="p-8 sm:p-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                Want to see it live?
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Every case study ships with a working demo. Click through, kick the tires.
              </p>
            </div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-enterprise btn-enterprise-lg btn-enterprise-primary"
              data-cursor-hover
            >
              <span className="btn-enterprise-shine" aria-hidden />
              <span className="btn-enterprise-label">Open {project.title}</span>
              <span className="btn-enterprise-icon"><ExternalLink size={16} /></span>
            </a>
          </div>
        </PremiumCard>
      </div>
    </main>
  );
}
