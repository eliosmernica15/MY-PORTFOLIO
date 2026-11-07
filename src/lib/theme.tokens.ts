/**
 * Theme Tokens & Dynamic Theming System
 *
 * Provides:
 * - 8 curated accent color palettes
 * - Time-of-day based auto-theme switching
 * - CSS custom property injection
 * - LocalStorage persistence
 * - React hooks for theme management
 */

export interface AccentPalette {
  id: string;
  name: string;
  light: {
    accent: string;
    accentLight: string;
    accentDark: string;
    accentMuted: string;
    accentContrast: string;
    textOnAccent: string;
    shadowAccent: string;
    ringFocus: string;
    gradientFrom: string;
    gradientMid: string;
    gradientTo: string;
    scrollbarThumb: string;
    selectionBg: string;
  };
  dark: {
    accent: string;
    accentLight: string;
    accentDark: string;
    accentMuted: string;
    accentContrast: string;
    textOnAccent: string;
    shadowAccent: string;
    ringFocus: string;
    gradientFrom: string;
    gradientMid: string;
    gradientTo: string;
    scrollbarThumb: string;
    selectionBg: string;
  };
}

/**
 * 8 Curated Accent Color Palettes
 * Each palette works in both light and dark modes
 */
export const ACCENT_PALETTES: AccentPalette[] = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    light: {
      accent: '#171717',
      accentLight: '#262626',
      accentDark: '#000000',
      accentMuted: 'rgba(23, 23, 23, 0.15)',
      accentContrast: '#ffffff',
      textOnAccent: '#ffffff',
      shadowAccent: 'rgba(23, 23, 23, 0.2)',
      ringFocus: 'rgba(23, 23, 23, 0.4)',
      gradientFrom: '#171717',
      gradientMid: '#262626',
      gradientTo: '#404040',
      scrollbarThumb: '#525252',
      selectionBg: 'rgba(23, 23, 23, 0.15)',
    },
    dark: {
      accent: '#ffffff',
      accentLight: '#e5e5e5',
      accentDark: '#cccccc',
      accentMuted: 'rgba(255, 255, 255, 0.15)',
      accentContrast: '#171717',
      textOnAccent: '#171717',
      shadowAccent: 'rgba(255, 255, 255, 0.2)',
      ringFocus: 'rgba(255, 255, 255, 0.4)',
      gradientFrom: '#ffffff',
      gradientMid: '#e5e5e5',
      gradientTo: '#cccccc',
      scrollbarThumb: '#525252',
      selectionBg: 'rgba(255, 255, 255, 0.2)',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    light: {
      accent: '#059669',
      accentLight: '#10b981',
      accentDark: '#047857',
      accentMuted: 'rgba(5, 150, 105, 0.15)',
      accentContrast: '#ffffff',
      textOnAccent: '#ffffff',
      shadowAccent: 'rgba(5, 150, 105, 0.25)',
      ringFocus: 'rgba(5, 150, 105, 0.4)',
      gradientFrom: '#059669',
      gradientMid: '#10b981',
      gradientTo: '#34d399',
      scrollbarThumb: '#6ee7b7',
      selectionBg: 'rgba(5, 150, 105, 0.15)',
    },
    dark: {
      accent: '#10b981',
      accentLight: '#34d399',
      accentDark: '#059669',
      accentMuted: 'rgba(16, 185, 129, 0.15)',
      accentContrast: '#064e3b',
      textOnAccent: '#064e3b',
      shadowAccent: 'rgba(16, 185, 129, 0.3)',
      ringFocus: 'rgba(16, 185, 129, 0.4)',
      gradientFrom: '#10b981',
      gradientMid: '#34d399',
      gradientTo: '#6ee7b7',
      scrollbarThumb: '#6ee7b7',
      selectionBg: 'rgba(16, 185, 129, 0.2)',
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    light: {
      accent: '#d97706',
      accentLight: '#f59e0b',
      accentDark: '#b45309',
      accentMuted: 'rgba(217, 119, 6, 0.15)',
      accentContrast: '#ffffff',
      textOnAccent: '#ffffff',
      shadowAccent: 'rgba(217, 119, 6, 0.25)',
      ringFocus: 'rgba(217, 119, 6, 0.4)',
      gradientFrom: '#d97706',
      gradientMid: '#f59e0b',
      gradientTo: '#fbbf24',
      scrollbarThumb: '#fcd34d',
      selectionBg: 'rgba(217, 119, 6, 0.15)',
    },
    dark: {
      accent: '#f59e0b',
      accentLight: '#fbbf24',
      accentDark: '#d97706',
      accentMuted: 'rgba(245, 158, 11, 0.15)',
      accentContrast: '#1c1917',
      textOnAccent: '#1c1917',
      shadowAccent: 'rgba(245, 158, 11, 0.3)',
      ringFocus: 'rgba(245, 158, 11, 0.4)',
      gradientFrom: '#f59e0b',
      gradientMid: '#fbbf24',
      gradientTo: '#fde047',
      scrollbarThumb: '#fcd34d',
      selectionBg: 'rgba(245, 158, 11, 0.2)',
    },
  },
  {
    id: 'violet',
    name: 'Violet',
    light: {
      accent: '#7c3aed',
      accentLight: '#8b5cf6',
      accentDark: '#6d28d9',
      accentMuted: 'rgba(124, 58, 237, 0.15)',
      accentContrast: '#ffffff',
      textOnAccent: '#ffffff',
      shadowAccent: 'rgba(124, 58, 237, 0.25)',
      ringFocus: 'rgba(124, 58, 237, 0.4)',
      gradientFrom: '#7c3aed',
      gradientMid: '#8b5cf6',
      gradientTo: '#a78bfa',
      scrollbarThumb: '#c4b5fd',
      selectionBg: 'rgba(124, 58, 237, 0.15)',
    },
    dark: {
      accent: '#8b5cf6',
      accentLight: '#a78bfa',
      accentDark: '#7c3aed',
      accentMuted: 'rgba(139, 92, 246, 0.15)',
      accentContrast: '#1e1b4b',
      textOnAccent: '#1e1b4b',
      shadowAccent: 'rgba(139, 92, 246, 0.3)',
      ringFocus: 'rgba(139, 92, 246, 0.4)',
      gradientFrom: '#8b5cf6',
      gradientMid: '#a78bfa',
      gradientTo: '#c4b5fd',
      scrollbarThumb: '#c4b5fd',
      selectionBg: 'rgba(139, 92, 246, 0.2)',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    light: {
      accent: '#e11d48',
      accentLight: '#f43f5e',
      accentDark: '#be123c',
      accentMuted: 'rgba(225, 29, 72, 0.15)',
      accentContrast: '#ffffff',
      textOnAccent: '#ffffff',
      shadowAccent: 'rgba(225, 29, 72, 0.25)',
      ringFocus: 'rgba(225, 29, 72, 0.4)',
      gradientFrom: '#e11d48',
      gradientMid: '#f43f5e',
      gradientTo: '#fb7185',
      scrollbarThumb: '#fda4af',
      selectionBg: 'rgba(225, 29, 72, 0.15)',
    },
    dark: {
      accent: '#f43f5e',
      accentLight: '#fb7185',
      accentDark: '#e11d48',
      accentMuted: 'rgba(244, 63, 94, 0.15)',
      accentContrast: '#1c1917',
      textOnAccent: '#1c1917',
      shadowAccent: 'rgba(244, 63, 94, 0.3)',
      ringFocus: 'rgba(244, 63, 94, 0.4)',
      gradientFrom: '#f43f5e',
      gradientMid: '#fb7185',
      gradientTo: '#fda4af',
      scrollbarThumb: '#fda4af',
      selectionBg: 'rgba(244, 63, 94, 0.2)',
    },
  },
  {
    id: 'sky',
    name: 'Sky',
    light: {
      accent: '#0284c7',
      accentLight: '#0ea5e9',
      accentDark: '#0369a1',
      accentMuted: 'rgba(2, 132, 199, 0.15)',
      accentContrast: '#ffffff',
      textOnAccent: '#ffffff',
      shadowAccent: 'rgba(2, 132, 199, 0.25)',
      ringFocus: 'rgba(2, 132, 199, 0.4)',
      gradientFrom: '#0284c7',
      gradientMid: '#0ea5e9',
      gradientTo: '#38bdf8',
      scrollbarThumb: '#7dd3fc',
      selectionBg: 'rgba(2, 132, 199, 0.15)',
    },
    dark: {
      accent: '#0ea5e9',
      accentLight: '#38bdf8',
      accentDark: '#0284c7',
      accentMuted: 'rgba(14, 165, 233, 0.15)',
      accentContrast: '#0c1222',
      textOnAccent: '#0c1222',
      shadowAccent: 'rgba(14, 165, 233, 0.3)',
      ringFocus: 'rgba(14, 165, 233, 0.4)',
      gradientFrom: '#0ea5e9',
      gradientMid: '#38bdf8',
      gradientTo: '#7dd3fc',
      scrollbarThumb: '#7dd3fc',
      selectionBg: 'rgba(14, 165, 233, 0.2)',
    },
  },
  {
    id: 'orange',
    name: 'Orange',
    light: {
      accent: '#ea580c',
      accentLight: '#f97316',
      accentDark: '#c2410c',
      accentMuted: 'rgba(234, 88, 12, 0.15)',
      accentContrast: '#ffffff',
      textOnAccent: '#ffffff',
      shadowAccent: 'rgba(234, 88, 12, 0.25)',
      ringFocus: 'rgba(234, 88, 12, 0.4)',
      gradientFrom: '#ea580c',
      gradientMid: '#f97316',
      gradientTo: '#fb923c',
      scrollbarThumb: '#fdba74',
      selectionBg: 'rgba(234, 88, 12, 0.15)',
    },
    dark: {
      accent: '#f97316',
      accentLight: '#fb923c',
      accentDark: '#ea580c',
      accentMuted: 'rgba(249, 115, 22, 0.15)',
      accentContrast: '#1c1917',
      textOnAccent: '#1c1917',
      shadowAccent: 'rgba(249, 115, 22, 0.3)',
      ringFocus: 'rgba(249, 115, 22, 0.4)',
      gradientFrom: '#f97316',
      gradientMid: '#fb923c',
      gradientTo: '#fdba74',
      scrollbarThumb: '#fdba74',
      selectionBg: 'rgba(249, 115, 22, 0.2)',
    },
  },
  {
    id: 'fuchsia',
    name: 'Fuchsia',
    light: {
      accent: '#d946ef',
      accentLight: '#e879f9',
      accentDark: '#c026d3',
      accentMuted: 'rgba(217, 70, 239, 0.15)',
      accentContrast: '#ffffff',
      textOnAccent: '#ffffff',
      shadowAccent: 'rgba(217, 70, 239, 0.25)',
      ringFocus: 'rgba(217, 70, 239, 0.4)',
      gradientFrom: '#d946ef',
      gradientMid: '#e879f9',
      gradientTo: '#f0abfc',
      scrollbarThumb: '#f5d0fe',
      selectionBg: 'rgba(217, 70, 239, 0.15)',
    },
    dark: {
      accent: '#e879f9',
      accentLight: '#f0abfc',
      accentDark: '#d946ef',
      accentMuted: 'rgba(232, 121, 249, 0.15)',
      accentContrast: '#1c1917',
      textOnAccent: '#1c1917',
      shadowAccent: 'rgba(232, 121, 249, 0.3)',
      ringFocus: 'rgba(232, 121, 249, 0.4)',
      gradientFrom: '#e879f9',
      gradientMid: '#f0abfc',
      gradientTo: '#f5d0fe',
      scrollbarThumb: '#f5d0fe',
      selectionBg: 'rgba(232, 121, 249, 0.2)',
    },
  },
];

/**
 * Get palette by ID
 */
export function getPalette(id: string): AccentPalette | undefined {
  return ACCENT_PALETTES.find(p => p.id === id);
}

/**
 * Get default palette
 */
export function getDefaultPalette(): AccentPalette {
  return ACCENT_PALETTES[0]; // Obsidian
}

/**
 * Apply palette to CSS custom properties
 */
export function applyPalette(palette: AccentPalette, mode: 'light' | 'dark' = 'light'): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const colors = mode === 'dark' ? palette.dark : palette.light;

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

/**
 * Get current time-based theme recommendation
 * Returns 'light' for day, 'dark' for night
 */
export function getTimeBasedTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';

  const hour = new Date().getHours();
  // Day: 6am - 8pm, Night: 8pm - 6am
  return (hour >= 6 && hour < 20) ? 'light' : 'dark';
}

/**
 * Check if system prefers dark mode
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  paletteId: string;
  mode: 'light' | 'dark' | 'auto' | 'time';
  autoSwitch: boolean;
}

/**
 * Default theme configuration
 */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  paletteId: 'obsidian',
  mode: 'auto',
  autoSwitch: true,
};

/**
 * Storage key for theme config
 */
export const THEME_STORAGE_KEY = 'elios-theme-config';

/**
 * Get stored theme config
 */
export function getStoredThemeConfig(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME_CONFIG;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_THEME_CONFIG;
}

/**
 * Save theme config
 */
export function saveThemeConfig(config: ThemeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Apply theme config to document
 */
export function applyThemeConfig(config: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const palette = getPalette(config.paletteId) || getDefaultPalette();
  let mode = config.mode;

  // Resolve auto/time modes
  if (mode === 'auto') {
    mode = getSystemTheme();
  } else if (mode === 'time') {
    mode = getTimeBasedTheme();
  }

  // Apply palette colors
  applyPalette(palette, mode);

  // Set data-theme attribute
  document.documentElement.setAttribute('data-theme', mode);
  document.documentElement.setAttribute('data-palette', config.paletteId);
}

/**
 * Theme context for React
 */
export interface ThemeContextValue {
  config: ThemeConfig;
  palette: AccentPalette;
  mode: 'light' | 'dark';
  setPalette: (paletteId: string) => void;
  setMode: (mode: ThemeConfig['mode']) => void;
  setAutoSwitch: (enabled: boolean) => void;
  toggleTheme: () => void;
  availablePalettes: AccentPalette[];
}