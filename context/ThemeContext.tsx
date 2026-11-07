/**
 * Theme Context - Re-exports from ThemeProvider
 *
 * This file maintains backward compatibility while using the new
 * comprehensive theme system from ThemeProvider.tsx
 */

export {
  ThemeProvider,
  useTheme,
  usePalette,
  useThemeMode,
  useThemeConfig,
  ThemeContext,
} from './ThemeProvider';

export {
  type ThemeContextValue,
  type ThemeConfig,
  type AccentPalette,
  ACCENT_PALETTES,
  getPalette,
  getDefaultPalette,
  applyPalette,
  getTimeBasedTheme,
  getSystemTheme,
  getStoredThemeConfig,
  saveThemeConfig,
  applyThemeConfig,
  DEFAULT_THEME_CONFIG,
  THEME_STORAGE_KEY,
} from '@/lib/theme.tokens';