import {
  getCanonicalSignature,
  SessionUniquenessTracker,
} from "@/features/mental-math/core/canonical";

describe("Canonical Signature & Uniqueness Engine", () => {
  it("should normalize commutative addition (24 + 37 === 37 + 24)", () => {
    const sig1 = getCanonicalSignature([24, 37], "addition");
    const sig2 = getCanonicalSignature([37, 24], "addition");
    expect(sig1.canonicalId).toBe(sig2.canonicalId);
    expect(sig1.canonicalId).toBe("addition:24:37");
  });

  it("should normalize commutative multiplication (15 × 8 === 8 × 15)", () => {
    const sig1 = getCanonicalSignature([15, 8], "multiplication");
    const sig2 = getCanonicalSignature([8, 15], "multiplication");
    expect(sig1.canonicalId).toBe(sig2.canonicalId);
    expect(sig1.canonicalId).toBe("multiplication:8:15");
  });

  it("should NOT normalize non-commutative subtraction (24 - 10 !== 10 - 24)", () => {
    const sig1 = getCanonicalSignature([24, 10], "subtraction");
    const sig2 = getCanonicalSignature([10, 24], "subtraction");
    expect(sig1.canonicalId).not.toBe(sig2.canonicalId);
  });

  it("should enforce session uniqueness and reject duplicate problems", () => {
    const tracker = new SessionUniquenessTracker(3);
    expect(tracker.canAccept([24, 37], "addition")).toBe(true);

    tracker.register([24, 37], "addition");
    // Duplicate inverted should be rejected
    expect(tracker.canAccept([37, 24], "addition")).toBe(false);
  });

  it("should enforce max operand reuse limit (max 3 times per number)", () => {
    const tracker = new SessionUniquenessTracker(3);

    // 17 used with 10
    expect(tracker.canAccept([17, 10], "addition")).toBe(true);
    tracker.register([17, 10], "addition");

    // 17 used with 20
    expect(tracker.canAccept([17, 20], "addition")).toBe(true);
    tracker.register([17, 20], "addition");

    // 17 used with 30
    expect(tracker.canAccept([17, 30], "addition")).toBe(true);
    tracker.register([17, 30], "addition");

    // 17 has now been used 3 times. 4th usage must be rejected!
    expect(tracker.canAccept([17, 40], "addition")).toBe(false);
  });
});
