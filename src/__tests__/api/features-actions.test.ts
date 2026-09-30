import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitFeedbackAction } from "@/features/feedback/api";
import { getUserPreferencesAction, updateUserPreferencesAction } from "@/features/preferences/api";
import { getStreakAction, updateStreakOnActivity } from "@/features/streak/api";
import { getUserUnifiedXP } from "@/features/xp/api";
import { submitQuizAttemptAction } from "@/features/quizzes/api";
import { saveSession } from "@/features/sessions/api";
import { resetAllRateLimits } from "@/lib/security/rate-limit";

// Mock Supabase Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue("127.0.0.1"),
  }),
}));

import { createClient } from "@/lib/supabase/server";

describe("Consolidated Feature Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAllRateLimits();
  });

  describe("Feedback API", () => {
    it("rejects invalid feedback payload with validation error", async () => {
      const res = await submitFeedbackAction({
        type: "general",
        subject: "",
        message: "",
      });
      expect(res.ok).toBe(false);
      expect(res.error).toContain("Subject is required");
    });

    it("submits valid feedback successfully", async () => {
      const mockInsert = vi.fn().mockResolvedValueOnce({ error: null });
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: "user-123" } } }),
        },
        from: vi.fn().mockReturnValue({ insert: mockInsert }),
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const res = await submitFeedbackAction({
        type: "bug_report",
        subject: "Visualizer animation issue",
        message: "Steps do not highlight correctly on step 4",
      });
      expect(res.ok).toBe(true);
      expect(res.message).toContain("received");
    });
  });

  describe("Preferences API", () => {
    it("returns requiresAuth if user is unauthenticated", async () => {
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const res = await getUserPreferencesAction();
      expect(res.ok).toBe(false);
      expect(res.requiresAuth).toBe(true);
    });

    it("updates preferences when valid attributes are provided", async () => {
      const mockUpsert = vi.fn().mockResolvedValueOnce({ error: null });
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: "user-123" } } }),
        },
        from: vi.fn().mockReturnValue({ upsert: mockUpsert }),
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const res = await updateUserPreferencesAction({
        theme: "dark-neon",
        speed: 2,
      });
      expect(res.ok).toBe(true);
      expect(mockUpsert).toHaveBeenCalled();
    });
  });

  describe("Streak & Timezone API", () => {
    it("calls touch_user_streak RPC with user timezone", async () => {
      const mockRpc = vi.fn().mockResolvedValueOnce({
        data: {
          current_streak: 5,
          max_streak: 10,
          last_activity_date: "2026-09-29",
        },
        error: null,
      });

      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: "user-123" } } }),
        },
        rpc: mockRpc,
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const streak = await updateStreakOnActivity("dsa", "Asia/Kolkata");
      expect(streak?.current_streak).toBe(5);
      expect(mockRpc).toHaveBeenCalledWith("touch_user_streak", {
        p_timezone: "Asia/Kolkata",
        p_domain: "dsa",
      });
    });

    it("loads current streak safely via getStreakAction", async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValueOnce({
        data: {
          current_streak: 3,
          max_streak: 7,
          last_activity_date: "2026-09-29",
        },
        error: null,
      });

      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: "user-123" } } }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: mockMaybeSingle,
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const res = await getStreakAction("Asia/Kolkata");
      expect(res.ok).toBe(true);
      expect(res.data?.current_streak).toBe(3);
    });
  });

  describe("XP IDOR Protection", () => {
    it("blocks access when a user attempts to inspect another user XP ledger", async () => {
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: "user-alice" } } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      // Alice tries to query Bob's XP ledger
      await expect(getUserUnifiedXP("user-bob")).rejects.toThrow("Unauthorized access");
    });
  });

  describe("Quizzes API", () => {
    it("rejects attempt for unpublished or invalid algorithm", async () => {
      const res = await submitQuizAttemptAction("non-existent-alg-999", 5, 5);
      expect(res.ok).toBe(false);
      expect(res.error).toContain("Algorithm not found");
    });
  });

  describe("Saved Sessions API (saveSession with String Slugs)", () => {
    it("requires authentication to save a visualizer session", async () => {
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const res = await saveSession(
        "binary-search",
        "Binary Search Step 3",
        { arr: [1, 2, 3] },
        3,
        { highlighted: [1] }
      );
      expect(res.ok).toBe(false);
      expect(res.requiresAuth).toBe(true);
      expect(res.message).toContain("Log in to save sessions");
    });

    it("persists sessions with non-UUID string slugs cleanly", async () => {
      const mockSingle = vi.fn().mockResolvedValueOnce({
        data: {
          id: "session-123",
          algorithm_id: "binary-search",
          title: "Binary Search Step 3",
          current_step: 3,
        },
        error: null,
      });

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
      });

      const mockActivityInsert = vi.fn().mockResolvedValueOnce({ error: null });

      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: "user-456" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "saved_visualizer_sessions") {
            return { insert: mockInsert };
          }
          if (table === "activity_timeline") {
            return { insert: mockActivityInsert };
          }
          return {};
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const res = await saveSession(
        "binary-search",
        "Binary Search Step 3",
        { array: [10, 20, 30] },
        3,
        { activeIndex: 1 },
        "normal",
        "typescript"
      );

      expect(res.ok).toBe(true);
      expect(res.data?.algorithm_id).toBe("binary-search");
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-456",
          algorithm_id: "binary-search",
          title: "Binary Search Step 3",
          current_step: 3,
        })
      );
    });

    it("rejects invalid algorithm identifiers or negative step indexes", async () => {
      const res = await saveSession("", "Title", {}, 0, {});
      expect(res.ok).toBe(false);
      expect(res.message).toContain("Session state is invalid");

      const resNegative = await saveSession("bubble-sort", "Title", {}, -1, {});
      expect(resNegative.ok).toBe(false);
      expect(resNegative.message).toContain("Session state is invalid");
    });
  });
});
