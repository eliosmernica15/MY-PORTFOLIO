/**
 * i18n Request Configuration for next-intl
 *
 * Server-side configuration for next-intl that provides
 * locale detection, message loading, and formatting functions.
 */

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Locale, locales, defaultLocale, isValidLocale, getLocaleFromPath } from './config';

// Import all locale messages
import en from '../messages/en.json';
import sq from '../messages/sq.json';

const messages = {
  en,
  sq,
} as const;

export type Messages = typeof en;

/**
 * Get the locale from the request
 * Priority: cookie > Accept-Language header > default
 */
async function getLocaleFromRequest(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

  if (cookieLocale && (['en', 'sq'] as const).includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // In a real app, you might also check Accept-Language header
  // For now, return default
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await getLocaleFromRequest();

  // Load messages for the locale
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: 'Europe/Tirane',
    now: new Date(),
  };
});

// Re-export types
export type { Locale } from './config';
export { locales, defaultLocale, localeNames, localeFlags } from './config';