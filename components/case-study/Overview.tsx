import { CheckCircle2, ExternalLink, Calendar, User, Clock } from 'lucide-react';
import { AdvancedButton } from '@/components/ui/AdvancedButton';
import type { Project } from '@/data/projects';

export function Overview({ project }: { project: Project }) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-10" style={{ border: '1px solid var(--border)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={`${project.title} hero`}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--accent-light)' }}>
            <span className="chip-enterprise">{project.category}</span>
            {project.role && <span className="chip-enterprise">{project.role}</span>}
            {project.duration && <span className="chip-enterprise">{project.duration}</span>}
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6 text-gradient">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>
            {project.longDescription}
          </p>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {project.highlights && project.highlights.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: 'var(--accent-light)' }}>
                Highlights
              </h3>
              <ul className="space-y-3">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <AdvancedButton
              variant="primary"
              size="lg"
              href={project.link}
              iconRight={<ExternalLink size={16} />}
              className="w-full"
            >
              Visit Live
            </AdvancedButton>
          </div>
        </div>
      </div>
    </section>
  );
}
