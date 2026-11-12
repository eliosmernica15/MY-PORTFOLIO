"use client";

/**
 * User notes — personal notes stored locally in the browser.
 * Curated notes ship with the site; whatever the visitor writes here
 * lives only on this device (localStorage) and never leaves it.
 */

export interface UserNote {
  id: string;
  slug: string;
  title: string;
  body: string;
  date: string; // ISO
  tags: string[];
  readMin: number;
}

const KEY = "elios-user-notes";

function estimateReadMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function safeParse(raw: string | null): UserNote[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as UserNote[]).filter(
      (n) =>
        n &&
        typeof n.id === "string" &&
        typeof n.title === "string" &&
        typeof n.body === "string" &&
        typeof n.date === "string",
    );
  } catch {
    return [];
  }
}

export function loadUserNotes(): UserNote[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(KEY)).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  } catch {
    return [];
  }
}

export function loadUserNote(slug: string): UserNote | null {
  return loadUserNotes().find((n) => n.slug === slug) ?? null;
}

export function createUserNote(input: {
  title: string;
  body: string;
  tags: string[];
}): UserNote {
  const note: UserNote = {
    id: `un-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    slug: `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title.trim(),
    body: input.body.trim(),
    date: new Date().toISOString(),
    tags: input.tags
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6),
    readMin: estimateReadMinutes(input.body),
  };
  try {
    const existing = loadUserNotes();
    window.localStorage.setItem(KEY, JSON.stringify([note, ...existing]));
  } catch {
    /* storage full / blocked — toast still confirms intent */
  }
  return note;
}

export function deleteUserNote(slug: string): UserNote[] {
  if (typeof window === "undefined") return [];
  const next = loadUserNotes().filter((n) => n.slug !== slug);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota — nothing to persist */
  }
  return next;
}
