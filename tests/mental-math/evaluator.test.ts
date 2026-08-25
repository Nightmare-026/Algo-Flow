import {
  evaluateBinaryExpression,
  calculateAdditionCarries,
  calculateSubtractionBorrows,
} from "@/features/mental-math/core/evaluator";

describe("Mental Math Evaluator", () => {
  describe("Addition", () => {
    it("should calculate simple addition correctly", () => {
      const res = evaluateBinaryExpression(24, 35, "addition");
      expect(res.isValid).toBe(true);
      expect(res.value).toBe(59);
      expect(res.carriesCount).toBe(0);
    });

    it("should detect carries properly", () => {
      const carries = calculateAdditionCarries(87, 45); // 7+5=12 (1 carry), 8+4+1=13 (1 carry) -> 2 carries
      expect(carries).toBe(2);

      const res = evaluateBinaryExpression(87, 45, "addition");
      expect(res.value).toBe(132);
      expect(res.carriesCount).toBe(2);
    });
  });

  describe("Subtraction", () => {
    it("should calculate subtraction correctly", () => {
      const res = evaluateBinaryExpression(85, 32, "subtraction");
      expect(res.isValid).toBe(true);
      expect(res.value).toBe(53);
      expect(res.borrowsCount).toBe(0);
    });

    it("should detect borrows properly", () => {
      const borrows = calculateSubtractionBorrows(52, 27); // 2 < 7 -> 1 borrow
      expect(borrows).toBe(1);

      const res = evaluateBinaryExpression(52, 27, "subtraction");
      expect(res.value).toBe(25);
      expect(res.borrowsCount).toBe(1);
    });
  });

  describe("Multiplication", () => {
    it("should multiply numbers accurately", () => {
      const res = evaluateBinaryExpression(12, 11, "multiplication");
      expect(res.isValid).toBe(true);
      expect(res.value).toBe(132);
    });
  });

  describe("Division", () => {
    it("should cleanly divide exact multiples", () => {
      const res = evaluateBinaryExpression(72, 8, "division");
      expect(res.isValid).toBe(true);
      expect(res.value).toBe(9);
    });

    it("should reject non-integer division", () => {
      const res = evaluateBinaryExpression(73, 8, "division");
      expect(res.isValid).toBe(false);
    });

    it("should reject division by zero", () => {
      const res = evaluateBinaryExpression(10, 0, "division");
      expect(res.isValid).toBe(false);
    });
  });
});
