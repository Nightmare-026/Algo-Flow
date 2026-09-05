import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  resetRateLimit,
  resetAllRateLimits,
  isDistributedRateLimitAvailable,
} from "@/lib/security/rate-limit";

describe("Rate Limiter (Hybrid In-Memory Sliding Window Fallback)", () => {
  beforeEach(() => {
    resetAllRateLimits();
  });

  it("identifies fallback mode when Upstash environment variables are absent", () => {
    expect(isDistributedRateLimitAvailable()).toBe(false);
  });

  it("permits requests within the defined threshold", async () => {
    const key = "test:user:permit";
    const limit = 5;

    for (let i = 1; i <= limit; i++) {
      const result = await checkRateLimit(key, limit, 60000);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(limit - i);
    }
  });

  it("blocks requests that exceed the limit", async () => {
    const key = "test:user:block";
    const limit = 3;

    for (let i = 0; i < limit; i++) {
      const result = await checkRateLimit(key, limit, 60000);
      expect(result.success).toBe(true);
    }

    const exceededResult = await checkRateLimit(key, limit, 60000);
    expect(exceededResult.success).toBe(false);
    expect(exceededResult.remaining).toBe(0);
    expect(exceededResult.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });

  it("isolates counters between different rate limit keys", async () => {
    const keyA = "test:user:alpha";
    const keyB = "test:user:beta";
    const limit = 2;

    await checkRateLimit(keyA, limit, 60000);
    await checkRateLimit(keyA, limit, 60000);
    const blockedA = await checkRateLimit(keyA, limit, 60000);
    expect(blockedA.success).toBe(false);

    // keyB should still have its full quota
    const freshB = await checkRateLimit(keyB, limit, 60000);
    expect(freshB.success).toBe(true);
    expect(freshB.remaining).toBe(1);
  });

  it("allows resetting a specific key", async () => {
    const key = "test:user:resettable";
    const limit = 2;

    await checkRateLimit(key, limit, 60000);
    await checkRateLimit(key, limit, 60000);
    const blocked = await checkRateLimit(key, limit, 60000);
    expect(blocked.success).toBe(false);

    resetRateLimit(key);

    const renewed = await checkRateLimit(key, limit, 60000);
    expect(renewed.success).toBe(true);
    expect(renewed.remaining).toBe(1);
  });

  it("clears all keys when resetAllRateLimits is invoked", async () => {
    const keyA = "test:bulk:a";
    const keyB = "test:bulk:b";

    await checkRateLimit(keyA, 1, 60000);
    await checkRateLimit(keyB, 1, 60000);

    expect((await checkRateLimit(keyA, 1, 60000)).success).toBe(false);
    expect((await checkRateLimit(keyB, 1, 60000)).success).toBe(false);

    resetAllRateLimits();

    expect((await checkRateLimit(keyA, 1, 60000)).success).toBe(true);
    expect((await checkRateLimit(keyB, 1, 60000)).success).toBe(true);
  });

  it("expires old timestamps outside the sliding window", async () => {
    const key = "test:window:expiry";
    const limit = 2;
    const windowMs = 50; // short 50ms window

    await checkRateLimit(key, limit, windowMs);
    await checkRateLimit(key, limit, windowMs);
    const blocked = await checkRateLimit(key, limit, windowMs);
    expect(blocked.success).toBe(false);

    // Wait for the window to pass
    await new Promise((resolve) => setTimeout(resolve, 60));

    const fresh = await checkRateLimit(key, limit, windowMs);
    expect(fresh.success).toBe(true);
  });
});
