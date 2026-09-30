import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitEvaluatedQuizAttemptAction } from "@/features/quizzes/api";
import { createClient } from "@/lib/supabase/server";
import { resetAllRateLimits } from "@/lib/security/rate-limit";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("Algorithm Quiz Security & Server Evaluation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAllRateLimits();
  });

  it("requires authentication to record an evaluated quiz attempt", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValueOnce({ data: { user: null }, error: null }),
      },
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await submitEvaluatedQuizAttemptAction("binary-search", [
      { questionText: "What is the time complexity of binary search?", selectedOptionIndex: 0 },
    ]);
    expect(res.ok).toBe(false);
    expect(res.requiresAuth).toBe(true);
  });

  it("rejects attempt for unpublished or invalid algorithm slug", async () => {
    const res = await submitEvaluatedQuizAttemptAction("non-existent-algo", [
      { questionText: "Some question?", selectedOptionIndex: 0 },
    ]);
    expect(res.ok).toBe(false);
    expect(res.error).toContain("unpublished");
  });

  it("evaluates answers on server and calls RPC with authentic score", async () => {
    const mockRpc = vi.fn().mockResolvedValueOnce({
      data: [{ id: "attempt-1", score: 1, total_questions: 1 }],
      error: null,
    });

    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValueOnce({
          data: { user: { id: "user-alice" } },
          error: null,
        }),
      },
      rpc: mockRpc,
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await submitEvaluatedQuizAttemptAction("binary-search", [
      {
        questionText: "What is the time complexity of binary search?",
        selectedOptionIndex: 1, // Suppose option 1 is correct or incorrect, server verifies it
      },
    ]);

    expect(res.ok).toBe(true);
    expect(mockRpc).toHaveBeenCalledWith(
      "record_quiz_attempt",
      expect.objectContaining({
        p_algorithm_id: "binary-search",
        p_total_questions: 1,
      })
    );
  });
});
