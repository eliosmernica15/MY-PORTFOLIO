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
 * A thin-stroke geometric "E" overlapped by a tilted "M", with a single
 * filled accent dot at the intersection. Used in the nav, footer,
 * OG image, and favicon (`app/icon.tsx`).
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

      {/* Monogram group: E (vertical + 3 arms) overlapped by a tilted M. */}
      <g
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* "E" — upright, anchored on the left half */}
        <line x1="12" y1="8" x2="12" y2="40" />
        <line x1="12" y1="8" x2="22" y2="8" />
        <line x1="12" y1="24" x2="20" y2="24" />
        <line x1="12" y1="40" x2="22" y2="40" />

        {/* "M" — tilted ~12deg clockwise so it visually weaves through the E */}
        <g transform="rotate(12 30 24)">
          <line x1="22" y1="10" x2="22" y2="38" />
          <line x1="22" y1="10" x2="30" y2="22" />
          <line x1="30" y1="22" x2="38" y2="10" />
          <line x1="38" y1="10" x2="38" y2="38" />
        </g>
      </g>

      {/* Accent dot at the intersection of the E's middle arm and the M's center. */}
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
