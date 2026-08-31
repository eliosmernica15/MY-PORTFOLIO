/**
 * AboutTimeline — a 5-stop horizontal dot timeline at the top of the About section.
 *
 * Pure CSS + ARIA. No JS. Each dot is keyboard-focusable; hovering or focusing
 * reveals a one-line description. Uses `peer-hover` / `peer-focus-visible` so the
 * description swap is instant and SSR-safe.
 */
const STOPS = [
  { id: 'now',    label: 'Now',     desc: 'Shipping ESMP v2 + A++(APL) v1.2' },
  { id: '2026',   label: '2026',    desc: 'AI agent systems, custom RAG, and a public compiler.' },
  { id: '2025',   label: '2025',    desc: 'Founding Flixverse; first 1k monthly users in week three.' },
  { id: '2024',   label: '2024',    desc: 'Shipped Eltrix Cloud to production; remote work worldwide.' },
  { id: '2023',   label: '2023',    desc: 'Founding ForexPulse; full-stack SaaS from zero to paying users.' },
] as const;

export function AboutTimeline() {
  return (
    <div className="mt-10 mb-2" aria-labelledby="about-timeline-label">
      <p
        id="about-timeline-label"
        className="text-[10px] font-bold uppercase tracking-[0.3em] mb-5"
        style={{ color: 'var(--accent-light)' }}
      >
        Where I&apos;ve been
      </p>

      <ol
        className="relative flex items-center justify-between gap-1 sm:gap-2"
        role="list"
        style={{ minHeight: 64 }}
      >
        {/* Connector line */}
        <span
          aria-hidden
          className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-px"
          style={{ background: 'var(--border)' }}
        />

        {STOPS.map((stop, i) => (
          <li key={stop.id} className="relative z-10 flex-1 flex flex-col items-center group/timeline">
            <input
              type="checkbox"
              id={`timeline-${stop.id}`}
              className="peer sr-only"
              aria-label={`${stop.label} — ${stop.desc}`}
            />
            <label
              htmlFor={`timeline-${stop.id}`}
              className="block w-3 h-3 rounded-full cursor-pointer transition-transform duration-300
                         peer-hover:scale-150 peer-focus-visible:scale-150 peer-hover:shadow-[0_0_0_4px_var(--surface-elevated)]
                         peer-focus-visible:shadow-[0_0_0_4px_var(--surface-elevated)]"
              style={{
                background: i === 0 ? 'var(--accent)' : 'var(--bg-card)',
                border: '2px solid var(--accent)',
              }}
              tabIndex={0}
            />
            <span
              className="mt-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
              style={{ color: i === 0 ? 'var(--accent-light)' : 'var(--text-muted)' }}
            >
              {stop.label}
            </span>

            {/* Hover/focus description pop */}
            <span
              className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2
                         w-44 text-center text-[11px] leading-snug px-2.5 py-1.5 rounded-md
                         opacity-0 translate-y-1 transition-all duration-200
                         peer-hover:opacity-100 peer-hover:translate-y-0
                         peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0"
              style={{
                background: 'var(--surface-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 24px -8px rgba(0,0,0,0.4)',
              }}
              role="tooltip"
            >
              {stop.desc}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
