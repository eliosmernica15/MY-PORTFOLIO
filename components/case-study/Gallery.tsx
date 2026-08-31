import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Project } from '@/data/projects';

export function Gallery({ project }: { project: Project }) {
  const metrics = project.metrics || [
    { label: 'Performance', value: '95+', suffix: 'Lighthouse' },
    { label: 'TTFB', value: '<200', suffix: 'ms' },
    { label: 'Bundle', value: '<100', suffix: 'KB' },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Gallery & Metrics"
        title={
          <>
            By the <span className="italic" style={{ color: 'var(--text-muted)' }}>numbers.</span>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="case-study-metric-card p-8 rounded-2xl border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border)',
              borderBottomWidth: 2,
              borderBottomColor: project.color || 'var(--accent)',
            }}
          >
            <div className="text-4xl sm:text-5xl font-black tracking-tighter mb-1 text-gradient-accent">
              {m.value}
              {m.suffix && <span className="text-2xl ml-1 opacity-70">{m.suffix}</span>}
            </div>
            <div
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-2xl overflow-hidden group relative"
            style={{ border: '1px solid var(--border)' }}
          >
            <Image
              src={project.image}
              alt={`${project.title} preview ${i + 1}`}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              loading="lazy"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
