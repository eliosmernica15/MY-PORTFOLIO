/** Format an ISO date as a human date, localized. */
export function formatDate(iso: string, locale: string = "en-US"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Returns the year of an ISO date. */
export function formatYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return String(d.getFullYear());
}

/** A simple relative time string, localized. */
export function formatRelative(iso: string, locale: string = "en-US"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return rtf.format(0, "second");
    return rtf.format(-Math.abs(diffHours), "hour");
  }
  if (Math.abs(diffDays) < 30) return rtf.format(-Math.abs(diffDays), "day");
  if (Math.abs(diffDays) < 365)
    return rtf.format(-Math.round(Math.abs(diffDays) / 30), "month");
  return rtf.format(-Math.round(Math.abs(diffDays) / 365), "year");
}

/** Format a number with thousands separators. */
export function formatNumber(n: number, locale: string = "en-US"): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(locale);
}

/** Format a duration in minutes as a localized "N min read" string. */
export function formatReadTime(min: number, locale: string = "en-US"): string {
  if (!Number.isFinite(min) || min <= 0) min = 1;
  const rounded = Math.max(1, Math.round(min));
  if (locale.startsWith("sq")) {
    return `${rounded} min leximi`;
  }
  return `${rounded} min read`;
}
