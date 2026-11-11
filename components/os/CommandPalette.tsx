"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Folder,
  SquareTerminal,
  FileText,
  Images,
  CircleUserRound,
  Settings,
  Mail,
  Briefcase,
  ArrowRight,
  CornerDownLeft,
  Command,
  type LucideIcon,
} from "lucide-react";
import { useT, useLocale, useSetLocale } from "@/i18n/LocaleProvider";
import { getProjects, getNotes } from "@/data/i18n";
import { SERVICES } from "@/data/services";
import { SKILL_CATEGORIES } from "@/data/skills";
import { useOs, type AppId } from "./OsContext";

/**
 * Command Palette — ⌘K (macOS) / Ctrl+K (elsewhere).
 * Searches applications, projects, notes, services, skills, destinations
 * and terminal commands. Fully keyboard-navigable; the underlying catalogs
 * are the same data the site is built from.
 */

type Entry = {
  id: string;
  group:
    | "apps"
    | "projects"
    | "notes"
    | "services"
    | "skills"
    | "navigation"
    | "commands";
  label: string;
  hint?: string;
  icon?: LucideIcon;
  run: () => void;
};

const GROUP_ORDER: Entry["group"][] = [
  "apps",
  "projects",
  "notes",
  "services",
  "skills",
  "navigation",
  "commands",
];

const TERMINAL_COMMANDS = [
  "help",
  "about",
  "projects",
  "skills",
  "services",
  "now",
  "cv",
  "whoami",
  "matrix",
  "coffee",
  "theme",
  "github",
];

export default function CommandPalette() {
  const t = useT();
  const locale = useLocale();
  const setLocale = useSetLocale();
  const router = useRouter();
  const os = useOs();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const entries = useMemo<Entry[]>(() => {
    const items: Entry[] = [];

    const app = (
      id: AppId | "terminal",
      icon: LucideIcon,
      labelKey: string,
    ): Entry => ({
      id: `app-${id}`,
      group: "apps",
      label: t(labelKey),
      icon,
      hint: t("palette.open"),
      run: () =>
        id === "terminal"
          ? window.dispatchEvent(new CustomEvent("elios:terminal-toggle"))
          : os.open(id),
    });

    items.push(app("finder", Folder, "dock.finder"));
    items.push(app("terminal", SquareTerminal, "dock.terminal"));
    items.push(app("preview", Images, "dock.preview"));
    items.push(app("notes", FileText, "dock.notes"));
    items.push(app("about", CircleUserRound, "dock.about"));
    items.push(app("preferences", Settings, "dock.preferences"));
    items.push(app("mail", Mail, "dock.mail"));
    items.push(app("hire", Briefcase, "dock.hireMe"));

    for (const p of getProjects(locale)) {
      items.push({
        id: `project-${p.id}`,
        group: "projects",
        label: p.title,
        hint: t("palette.open"),
        icon: Folder,
        run: () => router.push(`/project/${p.id}`),
      });
    }
    for (const n of getNotes(locale)) {
      items.push({
        id: `note-${n.slug}`,
        group: "notes",
        label: n.title,
        hint: t("palette.read"),
        icon: FileText,
        run: () => router.push(`/notes/${n.slug}`),
      });
    }
    SERVICES.forEach((service, idx) => {
      items.push({
        id: `service-${service.id}`,
        group: "services",
        label: t(`services.items.${idx}.title`),
        hint: t("palette.view"),
        icon: Settings,
        run: () => scrollTo("services"),
      });
    });
    for (const category of SKILL_CATEGORIES) {
      for (const skill of category.skills) {
        items.push({
          id: `skill-${category.name}-${skill.name}`,
          group: "skills",
          label: skill.name,
          hint: category.name,
          icon: Command,
          run: () => scrollTo("stack"),
        });
      }
    }
    items.push({
      id: "nav-home",
      group: "navigation",
      label: t("palette.navHome"),
      icon: ArrowRight,
      hint: t("palette.go"),
      run: () => scrollTo("home"),
    });
    items.push({
      id: "nav-projects",
      group: "navigation",
      label: t("palette.navProjects"),
      icon: ArrowRight,
      hint: t("palette.go"),
      run: () => scrollTo("projects"),
    });
    items.push({
      id: "nav-contact",
      group: "navigation",
      label: t("palette.navContact"),
      icon: ArrowRight,
      hint: t("palette.go"),
      run: () => scrollTo("contact"),
    });
    items.push({
      id: "nav-notes",
      group: "navigation",
      label: t("notes.title"),
      icon: ArrowRight,
      hint: t("palette.go"),
      run: () => router.push("/notes"),
    });
    items.push({
      id: "nav-lang",
      group: "navigation",
      label: locale === "sq" ? "Switch to English" : "Kalo në shqip",
      icon: ArrowRight,
      hint: "EN ⇄ SQ",
      run: () => setLocale(locale === "sq" ? "en" : "sq"),
    });
    for (const cmd of TERMINAL_COMMANDS) {
      items.push({
        id: `cmd-${cmd}`,
        group: "commands",
        label: `${cmd}`,
        hint: t("palette.runInTerminal"),
        icon: SquareTerminal,
        run: () => {
          window.dispatchEvent(
            new CustomEvent("elios:terminal-prefill", {
              detail: { command: cmd },
            }),
          );
        },
      });
    }

    return items;
  }, [t, locale, router, os, scrollTo, setLocale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.hint?.toLowerCase().includes(q) ||
        e.group.includes(q),
    );
  }, [entries, query]);

  const grouped = useMemo(() => {
    const groups: { name: Entry["group"]; items: Entry[] }[] = [];
    for (const name of GROUP_ORDER) {
      const items = filtered.filter((e) => e.group === name);
      if (items.length) groups.push({ name, items });
    }
    return groups;
  }, [filtered]);

  // Flat list for arrow-key traversal.
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Global ⌘K / Ctrl+K + the menu-bar button toggle. Capture phase +
  // stopPropagation so the OS layer's Esc/shortcut handling can't double-fire.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (
        isMod &&
        !e.shiftKey &&
        !e.altKey &&
        (e.key === "k" || e.key === "K")
      ) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const dir = e.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((i) =>
          flat.length ? (i + dir + flat.length) % flat.length : 0,
        );
        return;
      }
      if (e.key === "Enter") {
        const item = flat[activeIndex];
        if (item) {
          e.preventDefault();
          item.run();
          close();
        }
      }
    };
    const onToggle = () => setOpen((v) => !v);
    window.addEventListener("elios:palette-toggle", onToggle);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("elios:palette-toggle", onToggle);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open, flat, activeIndex, close]);

  // Keep the active option visible while traversing.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  // Focus the input on open; restore focus to previously focused element on close.
  const restoreRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
    restoreRef.current?.focus?.();
    restoreRef.current = null;
  }, [open]);

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center px-3 pt-[10vh] sm:pt-[14vh]"
      role="presentation"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t("palette.close")}
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[3px]"
        onClick={close}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("palette.label")}
        className="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          borderColor: "var(--border-hover)",
          background: "var(--bg-card)",
          backdropFilter: "blur(20px) saturate(1.1)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
        }}
      >
        {/* Input */}
        <div
          className="flex shrink-0 items-center gap-3 border-b px-4 py-3.5"
          style={{ borderColor: "var(--border)" }}
        >
          <Search
            size={18}
            aria-hidden
            className="shrink-0 text-[var(--text-muted)]"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("palette.placeholder")}
            aria-label={t("palette.label")}
            aria-activedescendant={
              flat[activeIndex]
                ? `palette-option-${flat[activeIndex].id}`
                : undefined
            }
            aria-controls="palette-listbox"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            className="h-7 w-full bg-transparent text-base text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
          <kbd className="shrink-0 rounded border border-[var(--border)] bg-[var(--pill-bg)] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--text-muted)]">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="palette-listbox"
          role="listbox"
          aria-label={t("palette.label")}
          className="min-h-0 flex-1 overflow-y-auto p-2"
        >
          {flat.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-[var(--text-muted)]">
              {t("palette.noResults")}
            </p>
          )}
          {grouped.map((group) => (
            <div
              key={group.name}
              role="group"
              aria-label={t(`palette.groups.${group.name}`)}
            >
              <p className="px-2 pb-1 pt-2 font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                {t(`palette.groups.${group.name}`)}
              </p>
              {group.items.map((item) => {
                flatIndex += 1;
                const index = flatIndex;
                const active = index === activeIndex;
                const Icon = item.icon ?? Command;
                return (
                  <button
                    key={item.id}
                    id={`palette-option-${item.id}`}
                    data-index={index}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      item.run();
                      close();
                    }}
                    className="interactive-btn flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left"
                    style={{
                      background: active ? "var(--pill-border)" : "transparent",
                    }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden
                      className="shrink-0 text-[var(--text-secondary)]"
                    />
                    <span className="min-w-0 flex-1 truncate text-[12px] sm:text-[13px] font-medium text-[var(--text-primary)]">
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="shrink-0 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        {item.hint}
                      </span>
                    )}
                    {active && (
                      <CornerDownLeft
                        size={13}
                        aria-hidden
                        className="shrink-0 text-[var(--text-muted)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div
          className="flex shrink-0 items-center justify-between border-t px-4 py-2 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]"
          style={{ borderColor: "var(--border)" }}
        >
          <span>↑↓ {t("palette.hintNav")}</span>
          <span>↵ {t("palette.hintRun")}</span>
          <span>
            {flat.length} {t("palette.hintCount")}
          </span>
        </div>
      </div>
    </div>
  );
}
