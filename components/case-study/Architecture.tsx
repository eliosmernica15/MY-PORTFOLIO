import { SectionHeader } from '@/components/ui/SectionHeader';
import { Chip } from '@/components/ui/Chip';
import type { Project } from '@/data/projects';

export function Architecture({ project }: { project: Project }) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Architecture"
        title={
          <>
            How it was <span className="italic" style={{ color: 'var(--text-muted)' }}>built.</span>
          </>
        }
        subtitle="The thinking behind the technical decisions — what was chosen, what was avoided, and why."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-8 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--accent-light)' }}>
            Challenge
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {project.challenge || project.description}
          </p>
        </div>
        <div className="p-8 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--accent-light)' }}>
            Solution
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {project.longDescription}
          </p>
        </div>
        <div className="p-8 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--accent-light)' }}>
            Outcome
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {project.outcome || 'Shipped to production. Active users and stable performance.'}
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: 'var(--accent-light)' }}>
          The Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.tech.map(t => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>

      {project.techRationale && project.techRationale.length > 0 && (
        <div className="mt-12">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: 'var(--accent-light)' }}>
            Why this stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.techRationale.map((r) => (
              <div key={r.name} className="p-5 rounded-xl border" style={{ background: 'var(--surface-elevated)', borderColor: 'var(--border)' }}>
                <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {r.name}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {r.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
