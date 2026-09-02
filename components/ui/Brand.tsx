import * as React from 'react';

export interface BrandProps {
  /** Width & height in pixels. Default 32. */
  size?: number;
  /** When true, color the central dot with `var(--accent)`. Default true. */
  accent?: boolean;
  /** Optional title for accessibility (announces as the brand). */
  title?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Brand — the Elios Mernica custom SVG monogram.
 *
 * Two thin-stroke geometric letters ("E" + "M") sitting side-by-side
 * with a single filled accent dot at their midpoint. Both letters are
 * upright (no rotation) so they stay legible at favicon size. Used in
 * the nav, footer, OG image, and favicon (`app/icon.tsx`).
 *
 * Strokes use `currentColor`; the dot uses `var(--accent)`.
 */
export default function Brand({
  size = 32,
  accent = true,
  title = 'Elios Mernica',
  className,
  'aria-label': ariaLabel,
}: BrandProps) {
  return (
    <svg
      role="img"
      aria-label={ariaLabel ?? title}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
    >
      {title ? <title>{title}</title> : null}

      {/* Monogram: an "E" on the left half and an "M" on the right half,
          separated by a small gap and joined by a single accent dot.
          Both letters are upright (no rotation) so each stays legible at
          favicon size (16px). The M is slightly narrower than the E for
          optical balance. */}
      <g
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* "E" — left half: vertical spine at x=10, three arms to x=20 */}
        <line x1="10" y1="8" x2="10" y2="40" />
        <line x1="10" y1="8" x2="20" y2="8" />
        <line x1="10" y1="24" x2="18" y2="24" />
        <line x1="10" y1="40" x2="20" y2="40" />

        {/* "M" — right half: two verticals at x=28 and x=38, V meeting at (33, 24) */}
        <line x1="28" y1="10" x2="28" y2="38" />
        <line x1="28" y1="10" x2="33" y2="24" />
        <line x1="33" y1="24" x2="38" y2="10" />
        <line x1="38" y1="10" x2="38" y2="38" />
      </g>

      {/* Accent dot at the midpoint between the E and the M. */}
      {accent && (
        <circle
          cx="24"
          cy="24"
          r="2.25"
          fill="var(--accent)"
        />
      )}
    </svg>
  );
}
