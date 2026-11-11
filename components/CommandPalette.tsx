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
  FileText,
  ArrowRight,
  ArrowUpRight,
  CornerDownLeft,
  Mail,
  Download,
  Command,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";
import { useT, useLocale, useSetLocale } from "@/i18n/LocaleProvider";
import { getProjects, getNotes } from "@/data/i18n";
import { SERVICES } from "@/data/services";

/**
 * Command Palette — Ctrl/⌘K.
 * Actions, destinations, projects, notes and terminal commands.
 * Keystroke-complete: ↑↓ navigate, Enter runs, Escape closes.
 */

type GroupName =
  "actions" | "navigation" | "projects" | "notes" | "services" | "commands";

type Entry = {
  id: string;
  group: GroupName;
  label: string;
  hint?: string;
  icon?: LucideIcon;
  run: () => void;
};

const GROUP_ORDER: GroupName[] = [
  "actions",
  "navigation",
  "projects",
  "notes",
  "services",
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

    items.push({
      id: "act-hire",
      group: "actions",
      label: t("palette.actions.hire"),
      icon: Mail,
      hint: t("palette.go"),
      run: () => scrollTo("contact"),
    });
    items.push({
      id: "act-cv",
      group: "actions",
      label: t("palette.actions.cv"),
      icon: Download,
      hint: t("palette.open"),
      run: () =>
        window.open("/Elios-Mernica-CV.pdf", "_blank", "noopener,noreferrer"),
    });

    const nav = (id: string, labelKey: string): Entry => ({
      id: `nav-${id}`,
      group: "navigation",
      label: t(labelKey),
      icon: ArrowRight,
      hint: t("palette.go"),
      run: () => scrollTo(id),
    });
    items.push(nav("work", "palette.navWork"));
    items.push(nav("services", "palette.navServices"));
    items.push(nav("about", "palette.navAbout"));
    items.push(nav("contact", "palette.navContact"));
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

    for (const p of getProjects(locale)) {
      items.push({
        id: `project-${p.id}`,
        group: "projects",
        label: p.title,
        hint: t("palette.open"),
        icon: FileText,
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
        icon: ArrowUpRight,
        run: () => scrollTo("services"),
      });
    });
    for (const cmd of TERMINAL_COMMANDS) {
      items.push({
        id: `cmd-${cmd}`,
        group: "commands",
        label: cmd,
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
  }, [t, locale, router, scrollTo, setLocale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => {
      const hay = `${e.label} ${e.hint ?? ""} ${e.group}`.toLowerCase();
      return hay.includes(q);
    });
  }, [entries, query]);

  const grouped = useMemo(() => {
    const groups: { name: GroupName; items: Entry[] }[] = [];
    for (const name of GROUP_ORDER) {
      const items = filtered.filter((e) => e.group === name);
      if (items.length) groups.push({ name, items });
    }
    return groups;
  }, [filtered]);

  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Ctrl/Cmd+K + the footer kbd hint toggle. Capture phase so a shell
  // shortcut can't swallow it.
  useEffect(() => {
    const onToggle = () => setOpen((v) => !v);
    window.addEventListener("elios:palette-toggle", onToggle);
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (
        isMod &&
        !e.shiftKey &&
        !e.altKey &&
        (e.key === "k" || e.key === "K")
      ) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
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
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("elios:palette-toggle", onToggle);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open, flat, activeIndex, close]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

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
      className="fixed inset-0 z-[70] flex items-start justify-center px-3 pt-[12vh] sm:pt-[16vh]"
      role="presentation"
    >
      <button
        type="button"
        aria-label={t("palette.close")}
        className="absolute inset-0 cursor-default"
        style={{
          background: "rgba(28, 26, 23, 0.45)",
          backdropFilter: "blur(2px)",
        }}
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("palette.label")}
        className="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
          boxShadow: "0 24px 70px rgba(28, 26, 23, 0.35)",
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
            className="h-7 w-full bg-transparent text-base outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd
            className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase"
            style={{
              borderColor: "var(--border)",
              background: "var(--pill-bg)",
              color: "var(--text-muted)",
            }}
          >
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
                      background: active
                        ? "var(--glass-accent-bg)"
                        : "transparent",
                    }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden
                      className="shrink-0"
                      style={{ color: "var(--accent)" }}
                    />
                    <span
                      className="min-w-0 flex-1 truncate text-[12px] sm:text-[13px] font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
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
