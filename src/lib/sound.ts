export type SoundName = 'tick' | 'reveal' | 'click' | 'boot' | 'error';

let ctx: AudioContext | null = null;
let enabled = false;

export function setSoundEnabled(v: boolean) { enabled = v; }
export function isSoundEnabled() { return enabled; }

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      const W = window as typeof window & { webkitAudioContext?: typeof AudioContext };
      ctx = new (window.AudioContext || W.webkitAudioContext!)();
    } catch { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.05) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

const SOUNDS: Record<SoundName, () => void> = {
  tick: () => tone(880, 0.04, 'square', 0.02),
  reveal: () => tone(660, 0.12, 'triangle', 0.04),
  click: () => tone(520, 0.06, 'sine', 0.05),
  boot: () => {
    tone(440, 0.1, 'sine', 0.05);
    setTimeout(() => tone(660, 0.1, 'sine', 0.05), 80);
    setTimeout(() => tone(880, 0.15, 'sine', 0.05), 160);
  },
  error: () => tone(220, 0.18, 'sawtooth', 0.04),
};

export function play(name: SoundName) { SOUNDS[name](); }
