/**
 * Simple in-memory rate limiter (fixed window). Good enough for a single
 * server. On multi-instance hosting, replace with a shared store (Phase 7).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): { allowed: boolean; retryAfterMs: number } {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    return { allowed: true, retryAfterMs: 0 };
  }
  if (bucket.count >= limit) return { allowed: false, retryAfterMs: bucket.resetAt - now };
  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

export function resetRateLimits() {
  buckets.clear();
}
