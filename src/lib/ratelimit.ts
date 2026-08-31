type Bucket = { tokens: number; last: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  capacity: number;        // max tokens
  refillPerSecond: number; // tokens added per second
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterMs: number;
  remaining: number;
}

/**
 * Sliding-window-ish rate limit. Returns whether the action is allowed.
 * In production, swap with Upstash/Redis; for now, in-memory is fine for a single-instance Next.js server.
 */
export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: opts.capacity, last: now };
  const elapsed = (now - b.last) / 1000;
  b.tokens = Math.min(opts.capacity, b.tokens + elapsed * opts.refillPerSecond);
  b.last = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return { ok: false, retryAfterMs: Math.ceil((1 - b.tokens) / opts.refillPerSecond * 1000), remaining: 0 };
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return { ok: true, retryAfterMs: 0, remaining: Math.floor(b.tokens) };
}

/** Get client IP from a NextRequest. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
