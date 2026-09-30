import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteUserAccountAction } from "@/features/account/api";
import { createClient } from "@/lib/supabase/server";
import { resetAllRateLimits } from "@/lib/security/rate-limit";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    auth: {
      admin: {
        deleteUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
      },
    },
  })),
}));

describe("Account Deletion API (GDPR Article 17)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAllRateLimits();
  });

  it("requires authentication to delete an account", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValueOnce({ data: { user: null }, error: null }),
      },
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await deleteUserAccountAction();
    expect(res.ok).toBe(false);
    expect(res.requiresAuth).toBe(true);
  });

  it("successfully purges user data and signs out authenticated user", async () => {
    const mockSignOut = vi.fn().mockResolvedValueOnce({ error: null });
    const mockDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValueOnce({
          data: { user: { id: "test-user-to-delete", email: "delete-me@test.local" } },
          error: null,
        }),
        signOut: mockSignOut,
      },
      from: vi.fn().mockReturnValue({
        delete: mockDelete,
      }),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const res = await deleteUserAccountAction();
    expect(res.ok).toBe(true);
    expect(res.data?.deleted).toBe(true);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
