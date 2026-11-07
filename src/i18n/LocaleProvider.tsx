'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Locale, locales, defaultLocale, localeNames, localeFlags, localeDirections } from './config';
import { getLocaleFromPathname, addLocaleToPath, removeLocaleFromPath } from './utils';
import { useRouter, usePathname } from 'next/navigation';
import { useRouter as useNextRouter } from 'next/navigation';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  locales: typeof locales;
  localeNames: typeof localeNames;
  localeFlags: typeof localeFlags;
  localeDirections: typeof localeDirections;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: React.ReactNode;
}

/**
 * LocaleProvider - Client-side locale management
 * Handles locale state, switching, and persistence
 */
export function LocaleProvider({ children }: LocaleProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Initialize from pathname or cookie
    if (typeof window !== 'undefined') {
      // Try to get from pathname first
      const pathLocale = getLocaleFromPathname(window.location.pathname);
      if (pathLocale) return pathLocale;

      // Fallback to cookie
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='));
      if (cookie) {
        const value = cookie.split('=')[1];
        if (['en', 'sq'].includes(value)) return value as Locale;
      }
    }
    return defaultLocale;
  });

  const [mounted, setMounted] = useState(false);

  // Initialize locale from pathname on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const pathLocale = getLocaleFromPathname(window.location.pathname);
      if (pathLocale) {
        setLocaleState(pathLocale);
      }
    }
  }, []);

  // Listen for locale changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'NEXT_LOCALE' && event.newValue) {
        if (['en', 'sq'].includes(event.newValue)) {
          setLocaleState(event.newValue as Locale);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update locale and persist
  const setLocale = useCallback((newLocale: Locale) => {
    if (!['en', 'sq'].includes(newLocale)) return;

    setLocaleState(newLocale);

    // Update cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;

    // Navigate to new locale path
    const { path } = removeLocaleFromPath(window.location.pathname);
    const newPath = addLocaleToPath(path, newLocale);
    window.location.href = newPath;
  }, []);

  // Provide locale info
  const value = useMemo<{
    locale: Locale;
    setLocale: (locale: Locale) => void;
    locales: typeof locales;
    localeNames: typeof localeNames;
    localeFlags: typeof localeFlags;
    localeDirections: typeof localeDirections;
  }>(() => ({
    locale,
    setLocale,
    locales,
    localeNames,
    localeFlags,
    localeDirections,
  }), [locale]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Hook to access locale context
 */
export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within a LocaleProvider');
  }
  return context;
}

/**
 * Hook to get current locale
 */
export function useLocale(): Locale {
  const { locale } = useLocaleContext();
  return locale;
}

/**
 * Hook to get locale switching function
 */
export function useSetLocale(): (locale: Locale) => void {
  const { setLocale } = useLocaleContext();
  return setLocale;
}

/**
 * Hook to get all available locales
 */
export function useLocales(): typeof locales {
  return locales;
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
  const currentLocale = locale ?? resolvedLocale;
  return useMemo(() => ({
    name: localeNames[currentLocale],
    flag: localeFlags[currentLocale],
    direction: localeDirections[currentLocale],
  }), [currentLocale, resolvedLocale]);
}