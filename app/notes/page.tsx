import type { Metadata } from 'next';
import { NOTES } from '@/data/notes';
import { SITE } from '@/data/site';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealSection } from '@/components/RevealSection';
import { formatDate, formatReadTime } from '@/lib/format';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Notes',
  description: `Writing from ${SITE.name} on AI systems, web performance, and software craft.`,
  alternates: { canonical: '/notes' },
};

export default function NotesIndex() {
  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 max-w-5xl mx-auto relative z-[1]">
      <RevealSection>
        <SectionHeader
          eyebrow="Notes"
          title={
            <>
              Writing on <span className="italic" style={{ color: 'var(--text-muted)' }}>what I build.</span>
            </>
          }
          subtitle="Short, focused pieces on AI systems, web performance, language design, and the craft of shipping software."
        />
      </RevealSection>

      <ul className="space-y-4 mt-12">
        {NOTES.map((n, idx) => (
          <RevealSection key={n.slug} delay={idx * 0.05}>
            <Link
              href={`/notes/${n.slug}`}
              className="block p-6 sm:p-8 rounded-2xl border transition-colors hover:border-[var(--border-hover)]"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                <time dateTime={n.date}>{formatDate(n.date)}</time>
                <span>·</span>
                <span>{formatReadTime(n.readMin)}</span>
                {n.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{n.tags.join(' · ')}</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                {n.title}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {n.summary}
              </p>
            </Link>
          </RevealSection>
        ))}
      </ul>
    </main>
  );
}
