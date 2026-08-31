'use client';
import { useEffect, useState, useRef } from 'react';

export interface UseTypewriterOptions {
  speed?: number;          // ms per char when typing
  startDelay?: number;     // initial delay
  enabled?: boolean;       // if false, immediately shows the full text
}

export function useTypewriter(text: string, opts: UseTypewriterOptions = {}): { display: string; done: boolean } {
  const { speed = 14, startDelay = 0, enabled = true } = opts;
  const [display, setDisplay] = useState(enabled ? '' : text);
  const [done, setDone] = useState(!enabled);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    if (!enabled) { setDisplay(text); setDone(true); return; }
    setDisplay(''); setDone(false);
    let i = 0;
    const start = () => {
      const tick = () => {
        if (cancelled.current) return;
        i++;
        setDisplay(text.slice(0, i));
        if (i >= text.length) setDone(true);
        else setTimeout(tick, speed);
      };
      setTimeout(tick, startDelay);
    };
    start();
    return () => { cancelled.current = true; };
  }, [text, speed, startDelay, enabled]);

  return { display, done };
}
