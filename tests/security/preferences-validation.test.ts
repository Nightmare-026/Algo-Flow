import { jest } from "@jest/globals";
import { updateUserPreferences } from "@/lib/api/preferences";

const mockCreateClient = jest.fn<() => Promise<Record<string, unknown>>>();

jest.mock("@/lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));

const user = { id: "22222222-2222-4222-8222-222222222222" };

function authenticatedClient(overrides: Record<string, unknown> = {}) {
  return {
    auth: { getUser: jest.fn(async () => ({ data: { user } })) },
    ...overrides,
  };
}

describe("preferences security & validation", () => {
  beforeEach(() => {
    mockCreateClient.mockReset();
  });

  test("rejects unauthenticated preference update", async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn(async () => ({ data: { user: null } })) },
    });

    await expect(updateUserPreferences({ theme: "dark-neon" })).rejects.toThrow(
      "Not authenticated"
    );
  });

  test("filters out invalid theme and malicious fields during upsert", async () => {
    const upsert = jest.fn(async () => ({ data: null, error: null }));
    const from = jest.fn(() => ({ upsert }));
    mockCreateClient.mockResolvedValue(authenticatedClient({ from }));

    await updateUserPreferences({
      theme: "dark-neon",
      // @ts-expect-error testing malicious extra field
      malicious_field: "injection_payload",
      speed: 2,
    });

    expect(from).toHaveBeenCalledWith("preferences");
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.id,
        theme: "dark-neon",
        speed: 2,
      }),
      { onConflict: "id" }
    );
    const passedPayload = (upsert as jest.Mock).mock.calls[0][0] as Record<string, unknown>;
    expect(passedPayload).not.toHaveProperty("malicious_field");
  });
});
