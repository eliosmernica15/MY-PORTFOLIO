/**
 * Tiny classnames helper. No clsx dep — keeps the bundle lean.
 * Accepts strings, falsy values, and arrays of the same. Skips empty / false / null / undefined / 0.
 */
export type ClassValue = string | number | false | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return;
    if (Array.isArray(v)) { v.forEach(walk); return; }
    const s = String(v).trim();
    if (s) out.push(s);
  };
  inputs.forEach(walk);
  return out.join(' ');
}
