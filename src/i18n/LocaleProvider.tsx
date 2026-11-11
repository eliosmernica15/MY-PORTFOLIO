"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Locale,
  defaultLocale,
  localeNames,
  localeFlags,
  isValidLocale,
} from "./config";
import en from "@/messages/en.json";
import sq from "@/messages/sq.json";
import { getLocaleFromPathname, removeLocaleFromPath } from "./utils";
import { useRouter, usePathname } from "next/navigation";

const catalogs = { en, sq } as const;
type Catalog = (typeof catalogs)["en"];
type MessageValue = string | number | boolean | null | MessageMap;
interface MessageMap {
  [key: string]: MessageValue;
}

/** Nested lookup: t('contact.form.name') -> "Emri" */
function lookup(locale: Locale, key: string): string | undefined {
  const tryLookup = (catalog: Catalog): string | undefined => {
    let node: MessageValue | undefined = catalog as unknown as MessageValue;
    for (const part of key.split(".")) {
      if (node === null || typeof node !== "object") return undefined;
      node = (node as MessageMap)[part];
    }
    return typeof node === "string"
      ? node
      : typeof node === "number"
        ? String(node)
        : undefined;
  };
  return tryLookup(catalogs[locale]) ?? tryLookup(catalogs[defaultLocale]);
}

/** Interpolate {vars} into a string. */
function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{${name}}`,
  );
}

export type Translate = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
  localeNames: typeof localeNames;
  localeFlags: typeof localeFlags;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  /** Server-resolved locale (from the request path/cookie) so SSR renders the
   *  correct language and hydration matches. Falls back to pathname, then
   *  the cookie, then the default. */
  initialLocale?: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (initialLocale && isValidLocale(initialLocale)) return initialLocale;
    if (typeof window !== "undefined") {
      const pathLocale = getLocaleFromPathname(window.location.pathname);
      if (pathLocale) return pathLocale;
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("NEXT_LOCALE="));
      const value = cookie?.split("=")[1];
      if (value && isValidLocale(value)) return value;
    }
    return defaultLocale;
  });

  // Track client navigation between /en and /sq routes so the provider stays correct.
  useEffect(() => {
    const pathLocale = getLocaleFromPathname(pathname);
    if (pathLocale && pathLocale !== locale) {
      setLocaleState(pathLocale);
      document.documentElement.lang = pathLocale;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!isValidLocale(newLocale) || newLocale === locale) return;
      setLocaleState(newLocale);
      document.documentElement.lang = newLocale;
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax${
        window.location.protocol === "https:" ? "; Secure" : ""
      }`;
      const { path } = removeLocaleFromPath(pathname);
      const newPath =
        newLocale === defaultLocale
          ? path
          : `/${newLocale}${path === "/" ? "" : path}`;
      router.push(newPath || "/");
      router.refresh();
    },
    [locale, pathname, router],
  );

  const t: Translate = useCallback(
    (key, vars) => interpolate(lookup(locale, key) ?? key, vars),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, localeNames, localeFlags }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx)
    throw new Error("useLocaleContext must be used within a LocaleProvider");
  return ctx;
}

export function useLocale(): Locale {
  return useLocaleContext().locale;
}

export function useSetLocale(): (locale: Locale) => void {
  return useLocaleContext().setLocale;
}

export function useT(): Translate {
  return useLocaleContext().t;
}
