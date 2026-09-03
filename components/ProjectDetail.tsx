/**
 * ProjectDetail — server component.
 *
 * Previously a client component wrapped in `framer-motion`'s
 * `motion.div` for an entrance animation. The animation added
 * ~30-40KB to the project page's JS bundle AND made the page
 * wait for framer-motion to hydrate before painting. As a server
 * component the markup ships inside the streaming RSC payload —
 * visible the moment the route loads, no client JS required.
 *
 * The entrance animation is replaced with a CSS-based fade that
 * runs on first paint via `animation-fill-mode: both` so the
 * element is visible from frame 1, no JS needed.
 */
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, LayoutGrid } from 'lucide-react';
import AdvancedButton from './ui/AdvancedButton';
import PremiumCard from './ui/PremiumCard';
import type { Project } from '@/data/projects';

interface Props {
  project: Project;
  blurDataURL: string;
}

const ProjectDetail = ({ project, blurDataURL }: Props) => {
  return (
    <div
      className="project-detail-enter pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto relative z-[1]"
    >
      <div className="mb-10 sm:mb-14 flex flex-wrap items-center gap-3 sm:gap-4 relative z-10">
        <Link
          href="/#projects"
          className="flex items-center gap-2 sm:gap-3 transition-all group hover:text-[var(--accent-light)]"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Back to projects"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            Back to Showcase
          </span>
        </Link>
        <Link
          href="/#projects"
          className="flex items-center gap-2 sm:gap-3 transition-all group hover:text-[var(--accent-light)]"
          style={{ color: 'var(--text-muted)' }}
        >
          <LayoutGrid size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            View all projects
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 relative z-10">
        <div className="lg:col-span-8">
          {/* Hero image. priority + responsive sizes lets the
              browser pick the right srcset variant. blurDataURL
              shows a tiny gradient under the image while it
              loads, eliminating the white flash. */}
          <div
            className="aspect-[16/9] rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-10 sm:mb-14 shadow-2xl relative project-detail-image"
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
              placeholder="blur"
              blurDataURL={blurDataURL}
              // fetchPriority is redundant with `priority` but
              // makes the hint visible to non-React tooling.
              // Next.js sets fetchPriority="high" when priority
              // is true on the Image component.
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 tracking-tighter text-gradient leading-[1.05]">
            {project.title}
          </h1>
          <p
            className="text-base sm:text-xl md:text-2xl leading-relaxed font-light"
            style={{ color: 'var(--text-secondary)' }}
          >
            {project.longDescription}
          </p>

          {/* Project meta — server-rendered, no JS needed. */}
          {(project.challenge || project.outcome || project.role || project.duration) && (
            <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {project.challenge && (
                <MetaBlock label="Challenge" body={project.challenge} />
              )}
              {project.outcome && (
                <MetaBlock label="Outcome" body={project.outcome} />
              )}
              {project.role && (
                <MetaBlock label="Role" body={project.role} />
              )}
              {project.duration && (
                <MetaBlock label="Duration" body={project.duration} />
              )}
            </div>
          )}

          {/* Highlights — bullet list. */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mt-10 sm:mt-14">
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.4em] mb-5 sm:mb-6 pb-3"
                style={{
                  color: 'var(--accent-light)',
                  borderBottom: '1px solid var(--glass-accent-border)',
                }}
              >
                Highlights
              </h2>
              <ul className="space-y-2.5">
                {project.highlights.map(h => (
                  <li
                    key={h}
                    className="flex items-start gap-3 text-sm sm:text-[15px] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: 'var(--accent)' }}
                      aria-hidden
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech rationale — only present on a few projects. */}
          {project.techRationale && project.techRationale.length > 0 && (
            <div className="mt-10 sm:mt-14">
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.4em] mb-5 sm:mb-6 pb-3"
                style={{
                  color: 'var(--accent-light)',
                  borderBottom: '1px solid var(--glass-accent-border)',
                }}
              >
                Tech rationale
              </h2>
              <div className="space-y-3.5">
                {project.techRationale.map(t => (
                  <div
                    key={t.name}
                    className="p-4 rounded-xl border"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
                  >
                    <div
                      className="text-xs font-bold uppercase tracking-widest mb-1"
                      style={{ color: 'var(--accent-light)' }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <PremiumCard glow padding={false}>
              <div className="p-6 sm:p-8">
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
      </div>
    </div>
  );
};

function MetaBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p
        className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
        style={{ color: 'var(--accent-light)' }}
      >
        {label}
      </p>
      <p
        className="text-sm sm:text-base leading-relaxed"
        style={{ color: 'var(--text-primary)' }}
      >
        {body}
      </p>
    </div>
  );
}

export default ProjectDetail;
