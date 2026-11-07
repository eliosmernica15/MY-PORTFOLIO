/**
 * i18n Configuration
 *
 * Configuration for next-intl internationalization.
 * Supports English (en) and Albanian (sq) with extensibility for more locales.
 */

export const locales = ['en', 'sq'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  sq: 'Shqip',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  sq: '🇦🇱',
};

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  sq: 'ltr',
};

export const localeDateFormats: Record<Locale, Intl.DateTimeFormatOptions> = {
  en: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  sq: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
};

export const localeNumberFormats: Record<Locale, Intl.NumberFormatOptions> = {
  en: {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
  sq: {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
};

export const localeCurrencyFormats: Record<Locale, Intl.NumberFormatOptions> = {
  en: {
    style: 'currency',
    currency: 'USD',
  },
  sq: {
    style: 'currency',
    currency: 'EUR',
  },
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }
  return null;
}

export function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] && isValidLocale(segments[0])) {
    return '/' + segments.slice(1).join('/');
  }
  return pathname;
}

export function addLocaleToPath(pathname: string, locale: Locale): string {
  const cleanPath = getPathnameWithoutLocale(pathname);
  return `/${locale}${cleanPath}`;
}

export const localeCookieName = 'NEXT_LOCALE';
export const localeCookieOptions = {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};