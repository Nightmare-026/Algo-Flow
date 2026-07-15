import { normalizeAlgorithmId } from "@/lib/validation/algorithm-id";

describe("normalizeAlgorithmId", () => {
  test("trims valid registry identifiers", () => {
    expect(normalizeAlgorithmId("  alg_arr_bubble_sort  ")).toBe("alg_arr_bubble_sort");
  });

  test("rejects blank and oversized identifiers", () => {
    expect(normalizeAlgorithmId("   ")).toBeNull();
    expect(normalizeAlgorithmId("a".repeat(201))).toBeNull();
  });
});
