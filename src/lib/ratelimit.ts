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

// Check if we're in a Vercel environment with KV available
const hasVercelKV = typeof process.env.KV_REST_API_URL === 'string' && typeof process.env.KV_REST_API_TOKEN === 'string';
// Check if we're in an Upstash Redis environment
const hasUpstashRedis = typeof process.env.UPSTASH_REDIS_REST_URL === 'string' && typeof process.env.UPSTASH_REDIS_REST_TOKEN === 'string';

/**
 * In-memory rate limit (fallback for local development and single-instance deployments)
 */
function rateLimitMemory(key: string, opts: RateLimitOptions): RateLimitResult {
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

/**
 * Vercel KV rate limit (for production on Vercel)
 * Uses sliding window log algorithm with sorted sets
 */
async function rateLimitVercelKV(key: string, opts: RateLimitOptions): Promise<RateLimitResult> {
  const { kv } = await import('@vercel/kv');
  const now = Date.now();
  const windowMs = Math.ceil(opts.capacity / opts.refillPerSecond * 1000);
  const windowStart = now - windowMs;

  const redisKey = `ratelimit:${key}`;

  // Use a pipeline for atomic operations
  const pipeline = kv.pipeline();

  // Remove expired entries
  pipeline.zremrangebyscore(redisKey, 0, windowStart);

  // Count current requests in window
  pipeline.zcard(redisKey);

  const results = await pipeline.exec();
  const currentCount = (results?.[1] as number) ?? 0;

  if (currentCount >= opts.capacity) {
    // Get the oldest entry to calculate retry-after
    const oldest = await kv.zrange(redisKey, 0, 0, { withScores: true }) as Array<[string, number]>;
    const oldestTimestamp = oldest?.[0]?.[1] ?? now;
    const retryAfterMs = Math.max(0, oldestTimestamp + windowMs - now);
    return { ok: false, retryAfterMs, remaining: 0 };
  }

  // Add current request
  await kv.zadd(redisKey, { score: now, member: `${now}-${Math.random()}` });
  // Set expiry on the key
  await kv.expire(redisKey, Math.ceil(windowMs / 1000) + 1);

  return { ok: true, retryAfterMs: 0, remaining: opts.capacity - currentCount - 1 };
}

/**
 * Upstash Redis rate limit (alternative Redis provider)
 */
async function rateLimitUpstash(key: string, opts: RateLimitOptions): Promise<RateLimitResult> {
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const now = Date.now();
  const windowMs = Math.ceil(opts.capacity / opts.refillPerSecond * 1000);
  const windowStart = now - windowMs;

  const redisKey = `ratelimit:${key}`;

  // Remove expired entries and count in one pipeline
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(redisKey, 0, windowStart);
  pipeline.zcard(redisKey);

  const results = await pipeline.exec();
  const currentCount = (results?.[1] as number) ?? 0;

  if (currentCount >= opts.capacity) {
    const oldest = await redis.zrange(redisKey, 0, 0, { withScores: true }) as Array<[string, number]>;
    const oldestTimestamp = oldest?.[0]?.[1] ?? now;
    const retryAfterMs = Math.max(0, oldestTimestamp + windowMs - now);
    return { ok: false, retryAfterMs, remaining: 0 };
  }

  // Add current request
  await redis.zadd(redisKey, { score: now, member: `${now}-${Math.random()}` });
  await redis.expire(redisKey, Math.ceil(windowMs / 1000) + 1);

  return { ok: true, retryAfterMs: 0, remaining: opts.capacity - currentCount - 1 };
}

/**
 * Unified rate limit function that automatically selects the best available backend.
 * Priority: Vercel KV > Upstash Redis > In-memory
 *
 * For the in-memory fallback, this is synchronous.
 * For Redis backends, this is asynchronous.
 *
 * To maintain backward compatibility with existing code, we provide both
 * sync and async versions. The async version is preferred for production.
 */
export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  // Synchronous version - uses in-memory only
  // This maintains backward compatibility
  return rateLimitMemory(key, opts);
}

/**
 * Async rate limit that uses distributed backends when available.
 * Use this in server actions and API routes for production-grade rate limiting.
 */
export async function rateLimitAsync(key: string, opts: RateLimitOptions): Promise<RateLimitResult> {
  if (hasVercelKV) {
    return rateLimitVercelKV(key, opts);
  }
  if (hasUpstashRedis) {
    return rateLimitUpstash(key, opts);
  }
  // Fallback to in-memory
  return rateLimitMemory(key, opts);
}

/** Get client IP from a NextRequest. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Create a rate limiter with a specific key prefix.
 * Useful for creating separate limiters for different endpoints.
 */
export function createRateLimiter(prefix: string) {
  return {
    limit: (key: string, opts: RateLimitOptions) => rateLimit(`${prefix}:${key}`, opts),
    limitAsync: (key: string, opts: RateLimitOptions) => rateLimitAsync(`${prefix}:${key}`, opts),
  };
}