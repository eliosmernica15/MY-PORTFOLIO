/**
 * Deterministic date/number formatting.
 *
 * Server (Node) and client (Chromium) ship different ICU tables — most
 * notably `sq`, which Chromium falls back to English. Rendering through
 * `toLocaleDateString` therefore produced different text on server vs
 * client and broke hydration (React error #418). All formatting here is
 * hand-rolled so both runtimes emit byte-identical strings, and date-only
 * ISO strings are parsed by their UTC parts so the day never drifts with
 * the local timezone.
 */

const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const SQ_MONTHS = [
  "janar",
  "shkurt",
  "mars",
  "prill",
  "maj",
  "qershor",
  "korrik",
  "gusht",
  "shtator",
  "tetor",
  "nëntor",
  "dhjetor",
];

interface DateParts {
  y: number;
  mo: number; // 0-based
  d: number;
}

function parseISO(iso: string): DateParts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (m) return { y: +m[1], mo: +m[2] - 1, d: +m[3] };
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return null;
  return { y: dt.getUTCFullYear(), mo: dt.getUTCMonth(), d: dt.getUTCDate() };
}

const isSq = (locale: string) => locale.toLowerCase().startsWith("sq");

/** Format an ISO date as a human date, e.g. "October 31, 2026" / "31 tetor 2026". */
export function formatDate(iso: string, locale: string = "en-US"): string {
  const p = parseISO(iso);
  if (!p) return iso;
  const sq = isSq(locale);
  const month = (sq ? SQ_MONTHS : EN_MONTHS)[p.mo];
  return sq ? `${p.d} ${month} ${p.y}` : `${month} ${p.d}, ${p.y}`;
}

/** Returns the year of an ISO date. */
export function formatYear(iso: string): string {
  const p = parseISO(iso);
  return p ? String(p.y) : iso;
}

/** A simple relative time string, localized. */
export function formatRelative(iso: string, locale: string = "en-US"): string {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso;
  const diffMs = Date.now() - dt.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const sq = isSq(locale);
  if (diffSec < 60) return sq ? "tani" : "now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return sq ? `${diffMin} min më parë` : `${diffMin} min ago`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24)
    return sq ? `${diffHours} orë më parë` : `${diffHours} hours ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30)
    return sq ? `${diffDays} ditë më parë` : `${diffDays} days ago`;
  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12)
    return sq ? `${diffMonths} muaj më parë` : `${diffMonths} months ago`;
  const diffYears = Math.round(diffMonths / 12);
  return sq ? `${diffYears} vite më parë` : `${diffYears} years ago`;
}

/** Format a number with thousands separators ('.' for sq, ',' otherwise). */
export function formatNumber(n: number, locale: string = "en-US"): string {
  if (!Number.isFinite(n)) return "0";
  const sep = isSq(locale) ? "." : ",";
  const negative = n < 0;
  const int = String(Math.abs(Math.trunc(n)));
  return (negative ? "-" : "") + int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/** Format a duration in minutes as a localized "N min read" string. */
export function formatReadTime(min: number, locale: string = "en-US"): string {
  if (!Number.isFinite(min) || min <= 0) min = 1;
  const rounded = Math.max(1, Math.round(min));
  if (isSq(locale)) {
    return `${rounded} min leximi`;
  }
  return `${rounded} min read`;
}
