'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ThemeConfig,
  ThemeContextValue,
  DEFAULT_THEME_CONFIG,
  applyThemeConfig,
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

  // Toggle theme (light <-> dark)
  const toggleTheme = useCallback(() => {
    const currentMode = document.documentElement.getAttribute('data-theme');
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newMode);
    setMode(newMode);

    // If in auto/time mode, temporarily override
    if (config.mode === 'auto' || config.mode === 'time') {
      // Store the manual override
      localStorage.setItem('theme-manual-override', newMode);
    }
  }, [config.mode]);

  // Get current palette
  const palette = useMemo(
    () => ACCENT_PALETTES.find(p => p.id === config.paletteId) || ACCENT_PALETTES[0],
    [config.paletteId]
  );

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