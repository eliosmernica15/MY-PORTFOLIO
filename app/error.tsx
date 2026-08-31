'use client';

import { useEffect } from 'react';
import { AdvancedButton } from '@/components/ui/AdvancedButton';
import Brand from '@/components/ui/Brand';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof console !== 'undefined') console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <Brand size={48} />
        </div>
        <p
          className="text-[10px] font-bold uppercase tracking-[0.4em]"
          style={{ color: 'var(--accent-light)' }}
        >
          Unexpected error
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Something broke.
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          The page hit an unrecoverable error. You can retry, or head back to the home page.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            ref: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <AdvancedButton variant="primary" onClick={reset}>
            Try again
          </AdvancedButton>
          <AdvancedButton variant="secondary" href="/">
            Back home
          </AdvancedButton>
        </div>
      </div>
    </div>
  );
}
