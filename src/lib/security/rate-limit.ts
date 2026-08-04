type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter for server actions.
 * @param key Unique key for user and action (e.g. `user_123:bookmark`)
 * @param limit Maximum allowed actions per window (default 30)
 * @param windowMs Time window in milliseconds (default 60000ms / 1 min)
 */
export function checkRateLimit(
  key: string,
  limit: number = 30,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Clean up stale keys periodically
  if (rateLimitStore.size > 5000) {
    for (const [k, rec] of rateLimitStore.entries()) {
      if (rec.resetAt < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!record || record.resetAt < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetInMs: Math.max(0, record.resetAt - now),
  };
}
