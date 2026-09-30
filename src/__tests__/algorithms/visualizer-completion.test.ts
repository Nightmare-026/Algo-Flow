import { describe, it, expect, vi, beforeEach } from "vitest";
import { markCompleted } from "@/features/progress/api";
import { resetAllRateLimits } from "@/lib/security/rate-limit";

// Mock Supabase Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

describe("Visualizer Completion Tracking & Progress Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAllRateLimits();
  });

  describe("markCompleted Action", () => {
    it("rejects non-existent algorithms", async () => {
      const res = await markCompleted("completely-invalid-slug-999");
      expect(res.ok).toBe(false);
      expect(res.message).toContain("not available");
    });

    it("requires authenticated user", async () => {
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const res = await markCompleted("bubble-sort");
      expect(res.ok).toBe(false);
      expect(res.requiresAuth).toBe(true);
      expect(res.message).toContain("Log in to save progress");
    });

    it("successfully calls mark_algorithm_completed RPC for authenticated user", async () => {
      const mockRpc = vi.fn().mockResolvedValueOnce({ error: null });

      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: "user-789" } } }),
        },
        rpc: mockRpc,
      } as unknown as Awaited<ReturnType<typeof createClient>>);

      const res = await markCompleted("bubble-sort");
      expect(res.ok).toBe(true);
      expect(res.message).toBe("Progress saved.");
      expect(mockRpc).toHaveBeenCalledWith("mark_algorithm_completed", {
        p_algorithm_id: "bubble-sort",
      });
    });
  });

  describe("Completion Tracking Invariant (hasCompletedRef Reset)", () => {
    it("re-arms completion tracker when switching between algorithms", () => {
      // Simulate the logic in useVisualizerCompletion:
      // hasCompletedRef is reset whenever algorithmId changes.
      let currentAlgorithmId = "bubble-sort";
      const hasCompletedRef = { current: false };

      const onAlgorithmChange = (newAlgorithmId: string) => {
        currentAlgorithmId = newAlgorithmId;
        hasCompletedRef.current = false;
      };

      const checkAndComplete = (
        currentStep: number,
        totalSteps: number,
        callback: (id: string) => void
      ) => {
        if (totalSteps > 0 && currentStep === totalSteps - 1 && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          callback(currentAlgorithmId);
        }
      };

      const completedCalls: string[] = [];
      const onComplete = (id: string) => completedCalls.push(id);

      // Alg 1: steps 0 to 4 (5 total)
      checkAndComplete(0, 5, onComplete);
      expect(hasCompletedRef.current).toBe(false);
      expect(completedCalls.length).toBe(0);

      // Reach final step
      checkAndComplete(4, 5, onComplete);
      expect(hasCompletedRef.current).toBe(true);
      expect(completedCalls).toEqual(["bubble-sort"]);

      // Re-triggering on final step should NOT call again
      checkAndComplete(4, 5, onComplete);
      expect(completedCalls.length).toBe(1);

      // Now switch algorithm to "merge-sort"
      onAlgorithmChange("merge-sort");
      expect(hasCompletedRef.current).toBe(false);

      // Alg 2: reaches final step
      checkAndComplete(9, 10, onComplete);
      expect(hasCompletedRef.current).toBe(true);
      expect(completedCalls).toEqual(["bubble-sort", "merge-sort"]);
    });
  });
});
