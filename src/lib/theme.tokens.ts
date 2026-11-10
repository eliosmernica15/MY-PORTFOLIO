/**
 * Theme - minimal light/dark monochrome theme for the portfolio.
 *
 * The site is black & white by design: no accent palettes, no time-based
 * auto-switching, no per-user recoloring. One toggle: light <-> dark.
 * globals.css owns all color values for `:root` / `[data-theme="light"]`;
 * this module only reads/writes the mode and stamps `<html data-theme>`.
 */

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "elios-theme-config";

export function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function resolveTheme(mode?: ThemeMode | string | null): ThemeMode {
  if (mode === "light" || mode === "dark") return mode;
  // Accept legacy stored values ('auto', 'time') by falling back to system.
  return getSystemTheme();
}

/** Returns the persisted mode, resolved (legacy 'auto'/'time' -> system). */
export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return getSystemTheme();
    const parsed = JSON.parse(raw);
    const mode = parsed?.mode;
    if (mode === "light" || mode === "dark") return mode;
    return getSystemTheme();
  } catch {
    return getSystemTheme();
  }
}

export function saveTheme(mode: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    // Keep the same storage shape the inline bootstrap in app/layout.tsx reads.
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode }));
  } catch {
    // Ignore storage errors (private mode, etc.)
  }
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", mode);
}
