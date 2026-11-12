"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealSection } from "@/components/RevealSection";
import { formatDate, formatReadTime } from "@/lib/format";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Plus, X, Trash2, Check } from "lucide-react";
import { NoteRenderer } from "@/components/notes/Renderer";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { getNotes } from "@/data/i18n";
import {
  loadUserNotes,
  createUserNote,
  deleteUserNote,
  type UserNote,
} from "@/lib/user-notes";

/* ---------------------------------- Toast --------------------------------- */

const Toast: React.FC<{ message: string; onDone: () => void }> = ({
  message,
  onDone,
}) => {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setLeaving(true), 3200);
    const done = window.setTimeout(onDone, 3750);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast-enter ${leaving ? "toast-leave" : ""} flex items-center gap-3 rounded-full border py-2.5 pl-3 pr-5 shadow-2xl`}
      style={{
        position: "fixed",
        bottom: "1.25rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 80,
        background: "var(--text-primary)",
        color: "var(--bg-primary)",
        borderColor: "var(--text-primary)",
      }}
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full"
        style={{ background: "var(--accent)", color: "var(--bg-primary)" }}
      >
        <Check size={13} strokeWidth={3} aria-hidden />
      </span>
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] whitespace-nowrap">
        {message}
      </span>
    </div>
  );
};

/* --------------------------------- Modal ---------------------------------- */

const AddNoteModal: React.FC<{
  onClose: () => void;
  onSaved: (note: UserNote) => void;
}> = ({ onClose, onSaved }) => {
  const t = useT();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    if (title.trim().length < 3 || body.trim().length < 20) {
      setError(t("notes.noteInvalid"));
      return;
    }
    const note = createUserNote({
      title,
      body,
      tags: tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    onSaved(note);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
      role="presentation"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t("notes.cancel")}
        className="absolute inset-0 cursor-default modal-backdrop-enter"
        style={{
          background: "rgba(28,26,23,0.45)",
          backdropFilter: "blur(3px)",
        }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-note-title"
        className="modal-card-enter relative w-full sm:max-w-lg border shadow-2xl"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-hover)",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between border-b px-5 sm:px-6 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-sm"
              style={{
                background: "var(--accent)",
                color: "var(--bg-primary)",
              }}
            >
              <Plus size={12} strokeWidth={3} aria-hidden />
            </span>
            {t("notes.modalTitle")}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("notes.cancel")}
            className="interactive-btn rounded-md border p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            style={{ borderColor: "var(--border)" }}
          >
            <X size={14} aria-hidden />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-5 flex flex-col gap-4">
          <div>
            <label htmlFor="un-title" className="os-label">
              {t("notes.noteTitleLabel")}
            </label>
            <input
              ref={inputRef}
              id="un-title"
              type="text"
              maxLength={90}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("notes.noteTitlePlaceholder")}
              className="os-field font-display text-base font-semibold"
            />
          </div>

          <div>
            <label htmlFor="un-body" className="os-label">
              {t("notes.noteBodyLabel")}
            </label>
            <textarea
              id="un-body"
              rows={5}
              maxLength={12000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t("notes.noteBodyPlaceholder")}
              className="os-field resize-y leading-relaxed"
            />
          </div>

          <div>
            <label htmlFor="un-tags" className="os-label">
              {t("notes.noteTagsLabel")}
            </label>
            <input
              id="un-tags"
              type="text"
              maxLength={120}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={t("notes.noteTagsPlaceholder")}
              className="os-field"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-[11px] leading-snug"
              style={{ color: "var(--accent-dark)" }}
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="interactive-btn rounded-full border border-[var(--border-hover)] px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {t("notes.cancel")}
            </button>
            <button
              type="button"
              onClick={save}
              className="interactive-btn btn-lift inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--bg-primary)]"
              style={{ background: "var(--accent)" }}
            >
              {t("notes.saveNote")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------- Index page ------------------------------- */

export function NotesIndexClient() {
  const t = useT();
  const locale = useLocale();
  const intl = locale === "sq" ? "sq" : "en-US";
  const notes = getNotes(locale);

  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setUserNotes(loadUserNotes());
  }, []);

  const handleSaved = useCallback(
    (note: UserNote) => {
      setUserNotes((prev) => [note, ...prev]);
      setModalOpen(false);
      setToast(t("notes.noteAdded"));
    },
    [t],
  );

  const handleDelete = useCallback(
    (slug: string) => {
      setUserNotes(deleteUserNote(slug));
      setToast(t("notes.noteRemoved"));
    },
    [t],
  );

  return (
    <>
      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {/* Modal */}
      {modalOpen && (
        <AddNoteModal
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      <main
        id="main-content"
        className="pt-24 pb-28 px-5 sm:px-8 max-w-5xl mx-auto relative"
      >
        {/* Chrome bar: Home + Add Note */}
        <div
          className="flex items-center justify-between gap-4 border-b pb-5"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            href="/"
            className="interactive-btn link-draw inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: "var(--text-primary)" }}
          >
            <ArrowLeft size={14} strokeWidth={2.25} aria-hidden />
            {t("navigation.home")}
          </Link>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="interactive-btn btn-lift inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--bg-primary)]"
            style={{ background: "var(--accent)" }}
            aria-label={t("notes.addNote")}
          >
            <Plus size={13} strokeWidth={2.75} aria-hidden />
            {t("notes.addNote")}
          </button>
        </div>

        {/* Header */}
        <div className="mt-12 sm:mt-16">
          <p
            className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "var(--accent)" }}
          >
            {t("notes.notesTitle")}
          </p>
          <h1
            className="font-display mt-3 text-5xl sm:text-7xl font-semibold tracking-[-0.02em] leading-[0.98]"
            style={{ color: "var(--text-primary)" }}
          >
            {t("notes.notesHero")}
          </h1>
          <p
            className="mt-4 max-w-md text-base sm:text-lg leading-snug"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("notes.notesDescription")}
          </p>
        </div>

        {/* User notes */}
        {userNotes.length > 0 && (
          <ul
            className="mt-10 flex flex-col divide-y border"
            style={{ borderColor: "var(--border)" }}
          >
            {userNotes.map((n) => (
              <li key={n.slug} className="group relative">
                <Link
                  href={`/notes/${n.slug}`}
                  className="block px-4 sm:px-5 py-5 transition-colors hover:bg-[var(--pill-bg)] relative row-accent"
                >
                  <span
                    className="inline-flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: "var(--accent)" }}
                  >
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                    {t("notes.yourNote")}
                    <span aria-hidden style={{ color: "var(--text-muted)" }}>
                      ·
                    </span>
                    <time
                      dateTime={n.date}
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatDate(n.date, intl)}
                    </time>
                    <span aria-hidden style={{ color: "var(--text-muted)" }}>
                      ·
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {formatReadTime(n.readMin, intl)}
                    </span>
                  </span>
                  <span
                    className="font-display mt-1.5 block text-xl sm:text-2xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-[var(--accent)]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {n.title}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(n.slug)}
                  aria-label={t("notes.deleteNote")}
                  title={t("notes.deleteNote")}
                  className="interactive-btn absolute right-4 top-4 rounded-md border p-1.5 opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-70"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  <Trash2 size={13} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Curated notes */}
        <ul
          className="mt-10 flex flex-col divide-y border-t border-b"
          style={{ borderColor: "var(--border)" }}
        >
          {notes.map((n) => (
            <li key={n.slug}>
              <Link
                href={`/notes/${n.slug}`}
                className="group grid grid-cols-[1fr_auto] sm:grid-cols-[7.5rem_1fr_auto] items-baseline gap-4 sm:gap-6 py-5 sm:py-6 transition-colors hover:bg-[var(--pill-bg)] px-2 sm:px-4"
              >
                <time
                  dateTime={n.date}
                  className="hidden sm:block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] pt-1"
                >
                  {formatDate(n.date, intl)}
                </time>
                <span className="min-w-0">
                  <span
                    className="font-display block text-xl sm:text-2xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-[var(--accent)]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {n.title}
                  </span>
                  <span
                    className="mt-1 block text-[12px] sm:text-sm leading-snug line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {n.summary}
                  </span>
                  <span className="mt-2 block font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    {formatDate(n.date, intl)} ·{" "}
                    {formatReadTime(n.readMin, intl)}
                    {n.tags.length > 0 && <> · {n.tags.join(" · ")}</>}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden
                  className="arrow-nudge self-center text-[var(--text-muted)] group-hover:text-[var(--accent)]"
                />
              </Link>
            </li>
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

/* ------------------------------- Detail page ------------------------------ */

export function NoteDetailClient({ slug }: { slug: string }) {
  const t = useT();
  const locale = useLocale();
  const intl = locale === "sq" ? "sq" : "en-US";
  const notes = getNotes(locale);
  const note = notes.find((n) => n.slug === slug);
  const isUserNote = slug.startsWith("user-");

  const [userNote, setUserNote] = useState<UserNote | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isUserNote) {
      setUserNote(loadUserNotes().find((n) => n.slug === slug) ?? null);
      setChecked(true);
    }
  }, [isUserNote, slug]);

  // User note loading state — or a proper not-found
  if (isUserNote && !checked) {
    return (
      <main
        className="pt-32 pb-24 px-6 max-w-3xl mx-auto relative min-h-[60vh]"
        aria-busy="true"
      />
    );
  }
  if (isUserNote && !userNote) {
    return (
      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto relative text-center">
        <h1
          className="font-display text-3xl font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {t("errors.notFound")}
        </h1>
        <Link
          href="/notes"
          className="link-draw text-sm"
          style={{ color: "var(--accent)" }}
        >
          ← {t("notes.backToNotes")}
        </Link>
      </main>
    );
  }

  if (!note && !userNote) {
    return (
      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto relative text-center">
        <h1
          className="font-display text-3xl font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {t("errors.notFound")}
        </h1>
        <Link
          href="/notes"
          className="link-draw text-sm"
          style={{ color: "var(--accent)" }}
        >
          ← {t("notes.backToNotes")}
        </Link>
      </main>
    );
  }

  const meta = userNote ?? note!;
  const summary = userNote ? undefined : note!.summary;
  const tags = userNote ? userNote.tags : note!.tags;

  return (
    <>
      <main
        id="main-content"
        className="pt-24 pb-28 px-5 sm:px-8 max-w-3xl mx-auto relative"
      >
        {/* Chrome bar */}
        <div
          className="flex items-center justify-between gap-4 border-b pb-5"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            href="/"
            className="interactive-btn link-draw inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: "var(--text-primary)" }}
          >
            <ArrowLeft size={14} strokeWidth={2.25} aria-hidden />
            {t("navigation.home")}
          </Link>
          <Link
            href="/notes"
            className="interactive-btn link-draw inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] hover:text-[var(--accent)]"
          >
            {t("notes.backToNotes")}
            <ArrowUpRight size={12} strokeWidth={2.25} aria-hidden />
          </Link>
        </div>

        <div className="mt-10 sm:mt-14">
          <div className="flex items-center gap-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
            {userNote && (
              <span style={{ color: "var(--accent)" }}>
                {t("notes.yourNote")}
              </span>
            )}
            <time dateTime={meta.date}>{formatDate(meta.date, intl)}</time>
            <span aria-hidden>·</span>
            <span>{formatReadTime(meta.readMin, intl)}</span>
          </div>
          <h1 className="font-display mt-3 text-4xl sm:text-6xl font-semibold leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)]">
            {meta.title}
          </h1>
          {summary && (
            <p className="mt-4 text-lg sm:text-xl leading-snug text-[var(--text-secondary)]">
              {summary}
            </p>
          )}
        </div>

        <article className="prose-content mt-10">
          {userNote ? (
            userNote.body.split(/\n{2,}/).map((paragraph, i) => (
              <p
                key={i}
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {paragraph}
              </p>
            ))
          ) : (
            <NoteRenderer blocks={note!.body} />
          )}
        </article>

        {tags.length > 0 && (
          <div
            className="mt-14 flex flex-wrap gap-2 border-t pt-6"
            style={{ borderColor: "var(--border)" }}
          >
            {tags.map((tag) => (
              <span key={tag} className="os-chip">
                {tag}
              </span>
            ))}
          </div>
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
