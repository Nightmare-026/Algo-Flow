import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitRecord = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetInMs: number;
  retryAfterSeconds?: number;
};

// In-memory sliding window fallback for local development or when Redis keys are not configured
const inMemoryStore = new Map<string, RateLimitRecord>();

export function checkInMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const record = inMemoryStore.get(key);

  // Clean up stale keys periodically
  if (inMemoryStore.size > 5000) {
    for (const [k, rec] of inMemoryStore.entries()) {
      if (rec.resetAt < now) {
        inMemoryStore.delete(k);
      }
    }
  }

  if (!record || record.resetAt < now) {
    inMemoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetInMs: windowMs,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    const resetInMs = Math.max(0, record.resetAt - now);
    return {
      success: false,
      remaining: 0,
      resetInMs,
      retryAfterSeconds: Math.ceil(resetInMs / 1000),
    };
  }

  record.count += 1;
  const resetInMs = Math.max(0, record.resetAt - now);
  return {
    success: true,
    remaining: limit - record.count,
    resetInMs,
    retryAfterSeconds: Math.ceil(resetInMs / 1000),
  };
}

export function resetRateLimit(key: string): void {
  inMemoryStore.delete(key);
}

export function resetAllRateLimits(): void {
  inMemoryStore.clear();
}

export function resetInMemoryStore(): void {
  inMemoryStore.clear();
}

export function isDistributedRateLimitAvailable(): boolean {
  return Boolean(
    !upstashDisabled && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

let sharedRedis: Redis | null = null;
const upstashInstances = new Map<string, Ratelimit>();
let upstashDisabled = false;

function getUpstashRatelimit(limit: number, windowMs: number): Ratelimit | null {
  if (upstashDisabled) return null;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  const cacheKey = `${limit}:${windowSeconds}`;
  const existing = upstashInstances.get(cacheKey);
  if (existing) {
    return existing;
  }

  try {
    if (!sharedRedis) {
      sharedRedis = new Redis({ url, token });
    }
    const instance = new Ratelimit({
      redis: sharedRedis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
      analytics: false,
      prefix: "algoflow",
    });
    upstashInstances.set(cacheKey, instance);
    return instance;
  } catch (e) {
    console.warn("Failed to initialize Upstash Redis rate limiter, falling back to in-memory:", e);
    upstashDisabled = true;
    return null;
  }
}

/**
 * Hybrid rate limiter:
 * - Uses distributed Upstash Redis if configured (production/edge/serverless).
 * - Transparently falls back to in-memory sliding window if Redis is not configured (local dev, CI).
 *
 * @param key Unique key for user and action (e.g. `user_123:bookmark`)
 * @param limit Maximum allowed actions per window (default 30)
 * @param windowMs Time window in milliseconds (default 60000ms / 1 min)
 */
export async function checkRateLimit(
  key: string,
  limit: number = 30,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const upstash = getUpstashRatelimit(limit, windowMs);

  if (upstash) {
    try {
      const res = await upstash.limit(key);
      const now = Date.now();
      return {
        success: res.success,
        remaining: res.remaining,
        resetInMs: Math.max(0, res.reset - now),
      };
    } catch (err) {
      console.warn("Upstash rate limit call failed, falling back to in-memory:", err);
    }
  }

  return checkInMemoryRateLimit(key, limit, windowMs);
}
