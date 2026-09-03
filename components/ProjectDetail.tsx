'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, LayoutGrid } from 'lucide-react';
import RevealSection from './RevealSection';
import AdvancedButton from './ui/AdvancedButton';
import PremiumCard from './ui/PremiumCard';
import type { Project } from '@/data/projects';

interface Props {
  project: Project;
}

const ProjectDetail: React.FC<Props> = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pt-32 pb-24 px-6 max-w-6xl mx-auto relative z-[1]"
    >
      <div className="mb-14 flex flex-wrap items-center gap-4 relative z-10">
        <Link
          href="/#projects"
          className="flex items-center gap-3 transition-all group hover:text-[var(--accent-light)]"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Back to projects"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-bold uppercase tracking-[0.3em]">
            Back to Showcase
          </span>
        </Link>
        <Link
          href="/#projects"
          className="flex items-center gap-3 transition-all group hover:text-[var(--accent-light)]"
          style={{ color: 'var(--text-muted)' }}
        >
          <LayoutGrid size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-[0.3em]">
            View all projects
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-14 shadow-2xl relative"
            style={{ border: '1px solid var(--border)' }}
          >
            <Image
              src={project.image}
              alt={project.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
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
          <PremiumCard glow padding={false} className="sticky top-24 lg:top-28">
            <div className="p-8">
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
                      <span key={t} className="project-tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <AdvancedButton
                variant="primary"
                size="lg"
                href={project.link}
                iconRight={<ExternalLink size={16} />}
                className="w-full mt-8"
              >
                Visit Live
              </AdvancedButton>
            </div>
          </PremiumCard>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
