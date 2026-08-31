import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { NOTES } from '@/data/notes';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealSection } from '@/components/RevealSection';
import { formatDate, formatReadTime } from '@/lib/format';

export function NotesTeaser() {
  const latest = NOTES.slice(0, 3);

  return (
    <section id="notes" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 max-w-7xl mx-auto content-auto relative z-[1]">
      <RevealSection>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="Writing"
            title={
              <>
                Notes on <span className="italic" style={{ color: 'var(--text-muted)' }}>the work.</span>
              </>
            }
            className="!mb-0"
          />
          <Link
            href="/notes"
            className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 transition-colors hover:text-[var(--accent-light)]"
            style={{ color: 'var(--text-muted)' }}
          >
            All notes <ArrowUpRight size={12} />
          </Link>
        </div>
      </RevealSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {latest.map((n, idx) => (
          <RevealSection key={n.slug} delay={idx * 0.05}>
            <Link
              href={`/notes/${n.slug}`}
              className="block p-6 rounded-2xl border transition-colors h-full hover:border-[var(--border-hover)]"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
              data-cursor-hover
            >
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                <time dateTime={n.date}>{formatDate(n.date)}</time>
                <span>·</span>
                <span>{formatReadTime(n.readMin)}</span>
              </div>
              <h3 className="text-xl font-black tracking-tight mb-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
                {n.title}
              </h3>
              <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                {n.summary}
              </p>
            </Link>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
