import {
  generateSessionQuestions,
  validateGeneratorCapacity,
} from "@/features/mental-math/core/generator";

describe("Question Generator & Capacity Validation", () => {
  it("should generate exact requested count of valid unique questions", () => {
    const questions = generateSessionQuestions({
      operation: "addition",
      difficulty: "easy",
      digitCountLeft: 2,
      digitCountRight: 2,
      questionCount: 10,
      hintsEnabled: true,
      maxOperandReuse: 3,
    });

    expect(questions.length).toBe(10);
    const idSet = new Set(questions.map((q) => q.signature.canonicalId));
    expect(idSet.size).toBe(10);

    for (const q of questions) {
      expect(q.correctAnswer).toBe(q.expression.operands[0] + q.expression.operands[1]);
      expect(q.options.length).toBe(4);
      expect(q.options).toContain(q.correctAnswer);
    }
  });

  it("should produce deterministic reproducible sequence for seeded challenges", () => {
    const config1 = {
      operation: "multiplication" as const,
      difficulty: "medium" as const,
      digitCountLeft: 2,
      digitCountRight: 1,
      questionCount: 5,
      hintsEnabled: false,
      seed: "daily-challenge-2026-08-21",
      deterministic: true,
    };

    const config2 = { ...config1 };

    const sessionA = generateSessionQuestions(config1);
    const sessionB = generateSessionQuestions(config2);

    expect(sessionA.length).toBe(sessionB.length);
    for (let i = 0; i < sessionA.length; i++) {
      expect(sessionA[i].signature.canonicalId).toBe(sessionB[i].signature.canonicalId);
      expect(sessionA[i].correctAnswer).toBe(sessionB[i].correctAnswer);
    }
  });

  it("should fail gracefully when parameter space is insufficient", () => {
    const invalidConfig = {
      operation: "addition" as const,
      difficulty: "easy" as const,
      digitCountLeft: 1,
      digitCountRight: 1,
      minRange: 1,
      maxRange: 2, // range 1..2 allows very few combinations
      questionCount: 20,
      hintsEnabled: false,
    };

    const capacity = validateGeneratorCapacity(invalidConfig);
    expect(capacity.isFeasible).toBe(false);
    expect(() => generateSessionQuestions(invalidConfig)).toThrow();
  });

  it("should generate valid questions for squares, roots, percentages, and mixed", () => {
    const squares = generateSessionQuestions({
      operation: "squares",
      difficulty: "easy",
      digitCountLeft: 2,
      digitCountRight: 2,
      questionCount: 5,
      hintsEnabled: true,
    });
    expect(squares.length).toBe(5);
    for (const q of squares) {
      expect(q.correctAnswer).toBe(q.expression.operands[0] * q.expression.operands[0]);
    }

    const roots = generateSessionQuestions({
      operation: "roots",
      difficulty: "easy",
      digitCountLeft: 2,
      digitCountRight: 2,
      questionCount: 5,
      hintsEnabled: true,
    });
    expect(roots.length).toBe(5);
    for (const q of roots) {
      expect(q.correctAnswer * q.correctAnswer).toBe(q.expression.operands[0]);
    }

    const percentages = generateSessionQuestions({
      operation: "percentages",
      difficulty: "easy",
      digitCountLeft: 2,
      digitCountRight: 2,
      questionCount: 5,
      hintsEnabled: true,
    });
    expect(percentages.length).toBe(5);
    for (const q of percentages) {
      expect(Number.isInteger(q.correctAnswer)).toBe(true);
    }
  });
});
