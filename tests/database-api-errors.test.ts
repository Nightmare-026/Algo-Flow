import { jest } from "@jest/globals";
import { markCompleted } from "@/features/progress/api";
import { deleteSession } from "@/features/sessions/api";
import { updateStreakOnActivity } from "@/features/streak/api";
import { submitQuizAttempt } from "@/lib/api/quizzes";

const mockCreateClient = jest.fn<() => Promise<Record<string, unknown>>>();

jest.mock("@/lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));

const user = { id: "11111111-1111-4111-8111-111111111111" };

function authenticatedClient(overrides: Record<string, unknown> = {}) {
  return {
    auth: { getUser: jest.fn(async () => ({ data: { user } })) },
    ...overrides,
  };
}

describe("database API failure semantics", () => {
  beforeEach(() => {
    mockCreateClient.mockReset();
  });

  test("markCompleted does not report success when the transaction fails", async () => {
    const rpc = jest.fn(async () => ({ data: null, error: { code: "42501" } }));
    mockCreateClient.mockResolvedValue(authenticatedClient({ rpc }));

    await expect(markCompleted("alg_arr_bubble_sort")).resolves.toEqual({
      ok: false,
      message: "Progress could not be saved.",
    });
    expect(rpc).toHaveBeenCalledWith("mark_algorithm_completed", {
      p_algorithm_id: "alg_arr_bubble_sort",
    });
  });

  test("quiz submission propagates transaction failure and validates scores", async () => {
    const rpc = jest.fn(async () => ({ data: null, error: { code: "23514" } }));
    mockCreateClient.mockResolvedValue(authenticatedClient({ rpc }));

    await expect(submitQuizAttempt("alg_arr_bubble_sort", 4, 5)).rejects.toThrow(
      "Quiz attempt could not be saved."
    );
    await expect(submitQuizAttempt("alg_arr_bubble_sort", 6, 5)).rejects.toThrow(
      "Invalid quiz score."
    );
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  test("streak update surfaces RPC errors", async () => {
    const rpc = jest.fn(async () => ({ data: null, error: { code: "42501" } }));
    mockCreateClient.mockResolvedValue(authenticatedClient({ rpc }));

    await expect(updateStreakOnActivity()).rejects.toThrow("Streak could not be updated.");
  });

  test("deleteSession returns false on an explicit database error", async () => {
    const maybeSingle = jest.fn(async () => ({ data: null, error: { code: "42501" } }));
    const select = jest.fn(() => ({ maybeSingle }));
    const secondEq = jest.fn(() => ({ select }));
    const firstEq = jest.fn(() => ({ eq: secondEq }));
    const remove = jest.fn(() => ({ eq: firstEq }));
    const from = jest.fn(() => ({ delete: remove }));
    mockCreateClient.mockResolvedValue(authenticatedClient({ from }));

    await expect(deleteSession("session-id")).resolves.toBe(false);
    expect(from).toHaveBeenCalledWith("saved_visualizer_sessions");
  });
});
