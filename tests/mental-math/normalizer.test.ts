import { normalizeUserAnswer } from "@/features/mental-math/core/normalizer";

describe("Answer Normalizer", () => {
  it("should parse standard numeric string", () => {
    expect(normalizeUserAnswer("42")).toEqual({ isValid: true, value: 42 });
  });

  it("should strip leading zeros and whitespace", () => {
    expect(normalizeUserAnswer("  007  ")).toEqual({ isValid: true, value: 7 });
    expect(normalizeUserAnswer("0")).toEqual({ isValid: true, value: 0 });
  });

  it("should parse negative numbers", () => {
    expect(normalizeUserAnswer("-15")).toEqual({ isValid: true, value: -15 });
  });

  it("should reject invalid/empty input", () => {
    expect(normalizeUserAnswer("").isValid).toBe(false);
    expect(normalizeUserAnswer("   ").isValid).toBe(false);
    expect(normalizeUserAnswer("abc").isValid).toBe(false);
    expect(normalizeUserAnswer("12.5").isValid).toBe(false);
    expect(normalizeUserAnswer(null).isValid).toBe(false);
  });
});
