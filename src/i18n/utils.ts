/**
 * i18n route & format helpers (pure functions, no React, no dependencies).
 */

export const LOCALES = ["en", "sq"] as const;
export type LocaleCode = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: LocaleCode = "en";

export function isValidLocale(locale: string): locale is LocaleCode {
  return (LOCALES as readonly string[]).includes(locale);
}

/** Add locale prefix to a path (e.g. /projects -> /sq/projects). */
export function addLocaleToPath(path: string, locale: LocaleCode): string {
  if (!path.startsWith("/")) path = "/" + path;
  const clean = path.replace(/^\/(en|sq)(\/|$)/, "/");
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Remove locale prefix from a path. */
export function removeLocaleFromPath(path: string): {
  path: string;
  locale: LocaleCode | null;
} {
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isValidLocale(first)) {
    const rest = "/" + segments.slice(1).join("/");
    return { path: rest === "/" ? "/" : rest, locale: first };
  }
  return { path: path.startsWith("/") ? path : "/" + path, locale: null };
}

/** Get the locale from a pathname, or null. */
export function getLocaleFromPathname(pathname: string): LocaleCode | null {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  return first && isValidLocale(first) ? first : null;
}
