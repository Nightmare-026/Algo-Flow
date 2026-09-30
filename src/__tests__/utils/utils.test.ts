import { describe, it, expect } from "vitest";
import { formatComplexity, formatTime, clamp } from "@/lib/utils";

describe("Formatting and Math Utilities", () => {
  describe("formatComplexity", () => {
    it("transforms caret power notation into unicode superscripts", () => {
      expect(formatComplexity("O(n^2)")).toBe("O(n²)");
      expect(formatComplexity("O(n^3)")).toBe("O(n³)");
      expect(formatComplexity("O(2^k)")).toBe("O(2ᵏ)");
    });

    it("preserves standard asymptotic expressions", () => {
      expect(formatComplexity("O(n log n)")).toBe("O(n log n)");
      expect(formatComplexity("O(1)")).toBe("O(1)");
      expect(formatComplexity("O(V + E)")).toBe("O(V + E)");
    });

    it("handles empty or blank complexity strings", () => {
      expect(formatComplexity("")).toBe("");
    });
  });

  describe("formatTime", () => {
    it("formats seconds, minutes, and hours accurately", () => {
      expect(formatTime(45)).toBe("45s");
      expect(formatTime(90)).toBe("1m 30s");
      expect(formatTime(3665)).toBe("1h 1m");
    });
  });

  describe("clamp", () => {
    it("restricts numbers within min and max boundaries", () => {
      expect(clamp(5, 1, 10)).toBe(5);
      expect(clamp(-5, 0, 100)).toBe(0);
      expect(clamp(150, 0, 100)).toBe(100);
    });
  });
});
