import Brand from '@/components/ui/Brand';

export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--bg-primary)' }}
      aria-live="polite"
      aria-busy="true"
    >
      <Brand size={32} />
      <div
        className="text-[10px] font-bold tracking-[0.4em] uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        Loading…
      </div>
      <div
        className="text-[10px] font-normal tracking-wide max-w-xs text-center px-4"
        style={{ color: 'var(--text-muted)', opacity: 0.6 }}
      >
        If this takes more than a few seconds, try reloading the page.
      </div>
    </div>
  );
}
