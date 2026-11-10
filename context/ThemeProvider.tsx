"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  ThemeMode,
  getStoredTheme,
  saveTheme,
  applyTheme,
} from "@/lib/theme.tokens";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * ThemeProvider - minimal light/dark theme for the monochrome portfolio.
 *
 * No accent palettes, no auto-switching timer, no per-user recoloring.
 * `data-theme` on <html> is the single source of truth; globals.css
 * defines the actual colors. Persisted in localStorage under the same
 * key the pre-hydration bootstrap in app/layout.tsx reads, so
 * pre- and post-hydration always agree.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  // Hydrate from storage on mount; the inline bootstrap already stamped
  // <html data-theme>, so we read the DOM instead of recomputing.
  useEffect(() => {
    const current = (
      document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark"
    ) as ThemeMode;
    setModeState(current);
    setMounted(true);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    applyTheme(next);
    saveTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({ mode, toggleTheme, setMode }),
    [mode, toggleTheme, setMode],
  );

  // `mounted` gates nothing visually - kept for symmetry with the bootstrap.
  void mounted;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
