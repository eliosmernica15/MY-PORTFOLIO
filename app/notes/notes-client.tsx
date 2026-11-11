"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealSection } from "@/components/RevealSection";
import { formatDate, formatReadTime } from "@/lib/format";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NoteRenderer } from "@/components/notes/Renderer";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { getNotes } from "@/data/i18n";

export function NotesIndexClient() {
  const t = useT();
  const locale = useLocale();
  const intl = locale === "sq" ? "sq" : "en-US";
  const notes = getNotes(locale);

  return (
    <>
      <main className="pt-32 pb-24 px-4 sm:px-6 max-w-5xl mx-auto relative z-[1]">
        <RevealSection>
          <SectionHeader
            eyebrow={t("notes.notesTitle")}
            title={t("notes.notesHero")}
            subtitle={t("notes.notesDescription")}
          />
        </RevealSection>

        <ul className="space-y-4 mt-12">
          {notes.map((n, idx) => (
            <RevealSection key={n.slug} delay={idx * 0.05}>
              <Link
                href={`/notes/${n.slug}`}
                className="block p-6 sm:p-8 rounded-2xl border transition-colors hover:border-[var(--border-hover)]"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  <time dateTime={n.date}>{formatDate(n.date, intl)}</time>
                  <span>·</span>
                  <span>{formatReadTime(n.readMin, intl)}</span>
                  {n.tags.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{n.tags.join(" · ")}</span>
                    </>
                  )}
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-black tracking-tight mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {n.title}
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {n.summary}
                </p>
              </Link>
            </RevealSection>
          ))}
        </ul>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbs("/notes")),
        }}
      />
    </>
  );
}

export function NoteDetailClient({ slug }: { slug: string }) {
  const t = useT();
  const locale = useLocale();
  const intl = locale === "sq" ? "sq" : "en-US";
  const notes = getNotes(locale);
  const note = notes.find((n) => n.slug === slug);

  if (!note) {
    return (
      <main className="pt-32 pb-24 px-4 sm:px-6 max-w-3xl mx-auto relative z-[1] text-center">
        <h1
          className="text-2xl font-black mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {t("errors.notFound")}
        </h1>
        <Link
          href="/notes"
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          ← {t("notes.backToNotes")}
        </Link>
      </main>
    );
  }

  return (
    <>
      <main className="pt-28 pb-24 px-4 sm:px-6 max-w-3xl mx-auto relative z-[1]">
        <RevealSection>
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] transition-colors hover:text-[var(--accent-light)]"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={14} />
            {t("notes.backToNotes")}
          </Link>
        </RevealSection>

        <RevealSection className="mt-10">
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "var(--accent-light)" }}
          >
            <time dateTime={note.date}>{formatDate(note.date, intl)}</time>
            <span className="mx-2">·</span>
            <span>{formatReadTime(note.readMin, intl)}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-4">
            {note.title}
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
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
            {note.tags.map((tag) => (
              <span key={tag} className="chip-enterprise">
                {tag}
              </span>
            ))}
          </RevealSection>
        )}
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbs(`/notes/${slug}`)),
        }}
      />
    </>
  );
}
