import Brand from '@/components/ui/Brand';

export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: 'var(--bg-primary)' }}
      aria-live="polite"
      aria-busy="true"
    >
      <Brand size={48} />
      <div
        className="text-xs font-bold tracking-[0.4em] uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        Loading…
      </div>
    </div>
  );
}
