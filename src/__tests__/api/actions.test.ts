import { describe, it, expect, vi, beforeEach } from "vitest";
import { toggleBookmark } from "@/features/bookmarks/api";
import { markCompleted } from "@/features/progress/api";
import { resetAllRateLimits } from "@/lib/security/rate-limit";

// Mock Supabase Server Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

describe("API Server Actions (Bookmarks & Progress)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAllRateLimits();
  });

  describe("toggleBookmark", () => {
    it("rejects blank or invalid algorithm ID before touching database", async () => {
      const result = await toggleBookmark("   ", true);
      expect(result.ok).toBe(false);
      expect(result.message).toContain("valid algorithm");
    });

    it("returns requiresAuth when no authenticated session exists", async () => {
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const result = await toggleBookmark("bubble-sort", true);
      expect(result.ok).toBe(false);
      expect(result.requiresAuth).toBe(true);
      expect(result.message).toContain("Log in");
    });

    it("saves bookmark when user is authenticated", async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === "bookmarks" || table === "activity_timeline") {
          return { insert: mockInsert };
        }
        return {};
      });

      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({
            data: { user: { id: "user_test_123" } },
          }),
        },
        from: mockFrom,
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const result = await toggleBookmark("bubble-sort", true);
      expect(result.ok).toBe(true);
      expect(result.message).toBe("Bookmark saved.");
      expect(mockFrom).toHaveBeenCalledWith("bookmarks");
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: "user_test_123",
        algorithm_id: "bubble-sort",
      });
    });

    it("enforces rate limiting on rapid repeated bookmark calls", async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      // Run 30 requests to exhaust rate limit
      for (let i = 0; i < 30; i++) {
        vi.mocked(createClient).mockResolvedValueOnce({
          auth: {
            getUser: vi.fn().mockResolvedValueOnce({
              data: { user: { id: "rate_limit_user" } },
            }),
          },
          from: mockFrom,
        } as unknown as Awaited<ReturnType<typeof createClient>>);

        await toggleBookmark("bubble-sort", true);
      }

      // 31st request should hit rate limit
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({
            data: { user: { id: "rate_limit_user" } },
          }),
        },
        from: mockFrom,
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const blockedResult = await toggleBookmark("bubble-sort", true);
      expect(blockedResult.ok).toBe(false);
      expect(blockedResult.message).toContain("Too many requests");
    });
  });

  describe("markCompleted", () => {
    it("rejects invalid algorithm ID", async () => {
      const result = await markCompleted("");
      expect(result.ok).toBe(false);
      expect(result.message).toContain("valid algorithm");
    });

    it("returns requiresAuth when user is unauthenticated", async () => {
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const result = await markCompleted("quick-sort");
      expect(result.ok).toBe(false);
      expect(result.requiresAuth).toBe(true);
    });

    it("invokes mark_algorithm_completed RPC when authenticated", async () => {
      const mockRpc = vi.fn().mockResolvedValueOnce({ error: null });

      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({
            data: { user: { id: "user_test_progress" } },
          }),
        },
        rpc: mockRpc,
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const result = await markCompleted("quick-sort");
      expect(result.ok).toBe(true);
      expect(result.message).toBe("Progress saved.");
      expect(mockRpc).toHaveBeenCalledWith("mark_algorithm_completed", {
        p_algorithm_id: "quick-sort",
      });
    });
  });
});
