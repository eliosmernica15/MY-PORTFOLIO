export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="text-xs font-bold tracking-[0.4em] uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        Loading…
      </div>
    </div>
  );
}
