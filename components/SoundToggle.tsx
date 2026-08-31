'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { isSoundEnabled, setSoundEnabled } from '@/lib/sound';
import { useEffect } from 'react';

export function SoundToggle() {
  const [enabled, setEnabled] = useLocalStorage<boolean>('sound-enabled', false);

  useEffect(() => {
    setSoundEnabled(enabled);
  }, [enabled]);

  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className="interactive-btn w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 nav-link hover:border-[var(--border-hover)]"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
        color: 'var(--text-secondary)',
      }}
      aria-label={enabled ? 'Mute sound' : 'Enable sound'}
      aria-pressed={enabled}
      title={enabled ? 'Sound on' : 'Sound off'}
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
}
