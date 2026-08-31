/** Returns a tiny base64 dataURL (1×1 solid color) suitable for next/image placeholder. */
export function tinyBlur(color: string = '#111111'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect width="1" height="1" fill="${color}"/></svg>`;
  // base64-encode in a way that works in both Node and the browser.
  const b64 = typeof btoa !== 'undefined'
    ? btoa(svg)
    : (globalThis as { Buffer?: { from(s: string, enc: string): { toString(enc: string): string } } }).Buffer
      ? ((globalThis as unknown as { Buffer: { from(s: string, enc: string): { toString(enc: string): string } } }).Buffer.from(svg, 'utf-8').toString('base64'))
      : '';
  return `data:image/svg+xml;base64,${b64}`;
}

/** Returns a slightly nicer 4×3 gradient blur (an inline SVG) for cards. */
export function gradientBlur(from: string, to: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="4" height="3" fill="url(%23g)"/></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}
