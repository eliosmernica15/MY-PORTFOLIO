'use client';

import { AdvancedButton } from '@/components/ui/AdvancedButton';
import { SectionHeader } from '@/components/ui/SectionHeader';

export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-[1]">
      <div className="max-w-md text-center space-y-6">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.4em]"
          style={{ color: 'var(--accent-light)' }}
        >
          Offline
        </p>
        <SectionHeader
          align="center"
          eyebrow="No connection"
          title="You're offline."
          subtitle="The portfolio can serve cached pages, but this one isn't cached yet. Reconnect and try again."
        />
        <AdvancedButton variant="primary" onClick={() => window.location.reload()}>
          Retry
        </AdvancedButton>
      </div>
    </div>
  );
}
