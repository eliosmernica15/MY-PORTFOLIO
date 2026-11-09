'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ThemeConfig,
  ThemeContextValue,
  DEFAULT_THEME_CONFIG,
  applyThemeConfig,
  applyPalette,
  getStoredThemeConfig,
  saveThemeConfig,
  ACCENT_PALETTES,
  AccentPalette,
} from '@/lib/theme.tokens';

// Create context with default values
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * ThemeProvider - Manages theme state and applies to document
 * Features:
 * - 8 curated accent color palettes
 * - Light/Dark/Auto/Time-based modes
 * - Time-of-day auto-switching
 * - LocalStorage persistence
 * - CSS custom property injection
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize theme on mount
  useEffect(() => {
    const storedConfig = getStoredThemeConfig();
    setConfig(storedConfig);
    applyThemeConfig(storedConfig);
    setMode(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    setMounted(true);
  }, []);

  // Apply theme whenever config changes
  useEffect(() => {
    if (!mounted) return;
    applyThemeConfig(config);
    saveThemeConfig(config);
    setMode(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, [config, mounted]);

  // Auto-switch based on time (for 'time' mode)
  useEffect(() => {
    if (!mounted || config.mode !== 'time' || !config.autoSwitch) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      const newMode = (hour >= 6 && hour < 20) ? 'light' : 'dark';
      if (newMode !== mode) {
        document.documentElement.setAttribute('data-theme', newMode);
        setMode(newMode);
      }
    };

    // Check immediately
    checkTime();

    // Check every minute
    intervalRef.current = setInterval(checkTime, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [config.mode, config.autoSwitch, mode, mounted]);

  // Listen for system theme changes (for 'auto' mode)
  useEffect(() => {
    if (!mounted || config.mode !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newMode = mediaQuery.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newMode);
      setMode(newMode);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [config.mode, mounted]);

  // Palette setter
  const setPalette = useCallback((paletteId: string) => {
    setConfig(prev => ({ ...prev, paletteId }));
  }, []);

  // Mode setter
  const setModeConfig = useCallback((newMode: ThemeConfig['mode']) => {
    setConfig(prev => ({ ...prev, mode: newMode }));
  }, []);

  // Auto-switch toggle
  const setAutoSwitch = useCallback((enabled: boolean) => {
    setConfig(prev => ({ ...prev, autoSwitch: enabled }));
  }, []);

  // Toggle theme (light <-> dark). The resolved mode is persisted as an
  // explicit config mode (the single source of truth); the config effect
  // then applies it via applyThemeConfig, which sets data-theme AND the
  // palette vars together. Writing data-theme directly here used to
  // desync the inline palette vars from the theme, producing
  // mixed/wrong colors.
  const toggleTheme = useCallback(() => {
    setConfig(prev => {
      const current =
        prev.mode === 'light' || prev.mode === 'dark'
          ? prev.mode
          : (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
      return { ...prev, mode: current === 'light' ? 'dark' : 'light' };
    });
  }, []);

  // Get current palette
  const palette = useMemo(
    () => ACCENT_PALETTES.find(p => p.id === config.paletteId) || ACCENT_PALETTES[0],
    [config.paletteId]
  );

  // Keep the inline palette variables in sync whenever data-theme
  // changes. Several writers set data-theme directly (toggleTheme, the
  // time/auto effects above, and the pre-hydration bootstrap script in
  // the layout), bypassing applyThemeConfig. Without this sync, the
  // inline palette vars from the previous theme stay on <html> and
  // override the new theme's CSS vars — producing mixed/wrong colors
  // (e.g. dark accent vars on a light page, invisible form fields).
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const sync = () => {
      const theme = root.getAttribute('data-theme');
      if (theme === 'light' || theme === 'dark') {
        applyPalette(palette, theme);
      }
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [mounted, palette]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      config,
      palette,
      mode,
      setPalette,
      setMode: setModeConfig,
      setAutoSwitch,
      toggleTheme,
      availablePalettes: ACCENT_PALETTES,
    }),
    [config, palette, mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Ref for interval
const intervalRef = { current: null as NodeJS.Timeout | null };

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get current palette
 */
export function usePalette(): AccentPalette {
  const { palette } = useTheme();
  return palette;
}

/**
 * Hook to get current mode
 */
export function useThemeMode(): 'light' | 'dark' {
  const { mode } = useTheme();
  return mode;
}

/**
 * Hook to get theme config
 */
export function useThemeConfig(): ThemeConfig {
  const { config } = useTheme();
  return config;
}

export { ThemeContext };
export default ThemeProvider;