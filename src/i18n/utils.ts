/**
 * i18n Utility Functions
 *
 * Client-side utilities for internationalization.
 * Provides hooks for translations, locale switching, formatting, etc.
 */

'use client';

import { useLocale, useTranslations, useFormatter, DateTimeFormatOptions, NumberFormatOptions } from 'next-intl';
import { Locale, locales, defaultLocale, isValidLocale, localeNames, localeFlags, localeDirections } from './config';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

// ============================================================
// Translation Hooks
// ============================================================

/**
 * Hook to access translations for the current locale
 * Usage: const t = useT(); t('common.loading')
 */
export function useT() {
  const locale = useLocale();
  const t = useTranslations();
  return t;
}

/**
 * Hook to get translations for a specific namespace
 * Usage: const t = useT('common'); t('loading')
 */
export function useNamespaceT(namespace: string) {
  return useTranslations(namespace);
}

/**
 * Hook to get the current locale
 */
export function useCurrentLocale(): Locale {
  return useLocale() as Locale;
}

/**
 * Hook to get all available locales
 */
export function useLocales(): typeof locales {
  return useMemo(() => locales, []);
}

/**
 * Hook to get locale metadata
 */
export function useLocaleInfo(locale?: Locale): {
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
} {
  const resolvedLocale = useLocale();
  const currentLocale = (locale ?? resolvedLocale) as Locale;
  return useMemo(() => ({
    name: localeNames[currentLocale],
    flag: localeFlags[currentLocale],
    direction: localeDirections[currentLocale],
  }), [currentLocale, resolvedLocale]);
}

// ============================================================
// Formatting Hooks
// ============================================================

/**
 * Hook for formatting dates, numbers, and relative time
 */
export function useFormat() {
  const formatter = useFormatter();
  return formatter;
}

/**
 * Hook for formatting dates in the current locale
 */
export function useDateFormat() {
  const formatter = useFormatter();
  return {
    format: (date: Date | string | number, options?: DateTimeFormatOptions) => {
      const dateObj = date instanceof Date ? date : new Date(date);
      return formatter.dateTime(dateObj, options || {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    formatRelative: (date: Date | string | number) => {
      const dateObj = date instanceof Date ? date : new Date(date);
      return formatter.relativeTime(dateObj);
    },
  };
}

/**
 * Hook for formatting numbers in the current locale
 */
export function useNumberFormat() {
  const formatter = useFormatter();
  return {
    format: (value: number, options?: NumberFormatOptions) => {
      return formatter.number(value, options || {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },
    formatCompact: (value: number) => {
      return formatter.number(value, {
        notation: 'compact',
        maximumFractionDigits: 1,
      });
    },
    formatPercent: (value: number) => {
      return formatter.number(value, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
    },
  };
}

/**
 * Hook for formatting currency in the current locale
 */
export function useCurrencyFormat() {
  const formatter = useFormatter();
  return {
    format: (value: number, currency?: string) => {
      return formatter.number(value, {
        style: 'currency',
        currency: currency || 'USD',
      });
    },
  };
}

// ============================================================
// Locale Switching
// ============================================================

/**
 * Hook for locale switching functionality
 */
export function useLocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  const localesList = useMemo(() => [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
  ], []);

  const changeLocale = useCallback(async (newLocale: Locale) => {
    if (!['en', 'sq'].includes(newLocale)) return;

    // Update the locale cookie
    const response = await fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: newLocale }),
    });

    if (response.ok) {
      // Get the pathname without the current locale
      const pathWithoutLocale = pathname.replace(/^\/(en|sq)/, '') || '/';
      const newPath = `/${newLocale}${pathWithoutLocale}`;
      router.push(newPath);
      router.refresh();
    }
  }, [router, pathname]);

  return {
    locale,
    locales: localesList,
    changeLocale,
    isLocale: (l: Locale) => locale === l,
  };
}

/**
 * Client-side locale cookie management
 */
export function useLocaleCookie() {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='));
      if (cookie) {
        const value = cookie.split('=')[1];
        if (['en', 'sq'].includes(value)) return value as Locale;
      }
    }
    return 'en';
  });

  const setLocale = useCallback((newLocale: Locale) => {
    if (!['en', 'sq'].includes(newLocale)) return;

    setLocaleState(newLocale);

    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;

    // Reload page to apply new locale
    window.location.reload();
  }, []);

  return { locale, setLocale };
}

// Need to import useState
import { useState } from 'react';

// ============================================================
// Formatting Helpers (Non-hook versions for non-component usage)
// ============================================================

/**
 * Format a date according to locale
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a number according to locale
 */
export function formatNumber(
  value: number,
  locale: Locale = 'en',
  options: Intl.NumberFormatOptions = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(
  value: number,
  locale: Locale = 'en',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: Locale = 'en'
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffMs = dateObj.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
  return rtf.format(diffYear, 'year');
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number, locale: Locale = 'en'): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format date for SEO (ISO format)
 */
export function formatDateISO(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString().split('T')[0];
}

/**
 * Get reading time for text
 */
export function getReadingTime(text: string, wordsPerMinute: number = 200): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// ============================================================
// Route Helpers
// ============================================================

/**
 * Add locale prefix to a path
 */
export function addLocaleToPath(path: string, locale: Locale): string {
  if (!path.startsWith('/')) path = '/' + path;
  return `/${locale}${path}`;
}

/**
 * Remove locale prefix from a path
 */
export function removeLocaleFromPath(path: string): { path: string; locale: Locale | null } {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (['en', 'sq'].includes(firstSegment)) {
    const locale = firstSegment as Locale;
    const newPath = '/' + segments.slice(1).join('/');
    return { path: newPath || '/', locale };
  }
  return { path, locale: null };
}

/**
 * Get locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (['en', 'sq'].includes(firstSegment)) {
    return firstSegment as Locale;
  }
  return null;
}

/**
 * Generate alternate URLs for hreflang
 */
export function getAlternateUrls(pathname: string, baseUrl: string): Record<Locale | 'x-default', string> {
  const { path, locale } = removeLocaleFromPath(pathname);
  const alternates: Record<Locale | 'x-default', string> = {} as Record<Locale | 'x-default', string>;

  for (const locale of ['en', 'sq'] as const) {
    alternates[locale] = `${baseUrl}/${locale}${path}`;
  }

  // Add x-default
  alternates['x-default'] = `${baseUrl}/en${path}`;

  return alternates;
}