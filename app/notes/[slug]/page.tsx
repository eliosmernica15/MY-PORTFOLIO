import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NOTES } from '@/data/notes';
import { SITE } from '@/data/site';
import { NoteRenderer } from '@/components/notes/Renderer';
import { formatDate, formatReadTime } from '@/lib/format';
import { buildBreadcrumbs } from '@/lib/breadcrumbs';
import { RevealSection } from '@/components/RevealSection';

export const dynamicParams = false;

export function generateStaticParams() {
  return NOTES.map(n => ({ slug: n.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES.find(n => n.slug === slug);
  if (!note) return { title: 'Note not found' };
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: {
      type: 'article',
      title: note.title,
      description: note.summary,
      url: `${SITE.url}/notes/${note.slug}`,
      publishedTime: note.date,
      tags: note.tags,
    },
  };
}

export default async function NotePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const note = NOTES.find(n => n.slug === slug);
  if (!note) notFound();
  const breadcrumbs = buildBreadcrumbs(`/notes/${slug}`);

  return (
    <>
      <main className="pt-28 pb-24 px-4 sm:px-6 max-w-3xl mx-auto relative z-[1]">
        <RevealSection>
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] transition-colors hover:text-[var(--accent-light)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={14} />
            All notes
          </Link>
        </RevealSection>

        <RevealSection className="mt-10">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent-light)' }}>
            <time dateTime={note.date}>{formatDate(note.date)}</time>
            <span className="mx-2">·</span>
            <span>{formatReadTime(note.readMin)}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-4">
            {note.title}
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {note.summary}
          </p>
        </RevealSection>

        <RevealSection className="mt-12">
          <article className="prose-content">
            <NoteRenderer blocks={note.body} />
          </article>
        </RevealSection>

        {note.tags.length > 0 && (
          <RevealSection className="mt-16 flex flex-wrap gap-2">
            {note.tags.map(t => (
              <span key={t} className="chip-enterprise">{t}</span>
            ))}
          </RevealSection>
        )}
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
