import { describe, it, expect } from "vitest";
import { generateSessionQuestions } from "@/features/mental-math/core/generator";
import { verifySessionIntegrity } from "@/features/mental-math/engine/anti-cheat";
import { evaluateBinaryExpression } from "@/features/mental-math/core/evaluator";
import { SessionSummary, AnswerEvent } from "@/features/mental-math/core/types";

describe("Mental Math Generator & Evaluator", () => {
  describe("Arithmetic correctness across operations", () => {
    it("generates correct addition questions", () => {
      const questions = generateSessionQuestions({
        operation: "addition",
        difficulty: "easy",
        digitCountLeft: 2,
        digitCountRight: 2,
        questionCount: 10,
        hintsEnabled: true,
      });

      expect(questions).toHaveLength(10);
      for (const q of questions) {
        const [a, b] = q.expression.operands;
        expect(a + b).toBe(q.correctAnswer);
        expect(q.options).toContain(q.correctAnswer);
        expect(new Set(q.options).size).toBe(q.options.length); // All choices unique
        expect(q.distractors).not.toContain(q.correctAnswer);
      }
    });

    it("generates correct subtraction questions without negative results on easy/medium", () => {
      const questions = generateSessionQuestions({
        operation: "subtraction",
        difficulty: "medium",
        digitCountLeft: 2,
        digitCountRight: 2,
        questionCount: 10,
        hintsEnabled: true,
      });

      expect(questions).toHaveLength(10);
      for (const q of questions) {
        const [a, b] = q.expression.operands;
        expect(a - b).toBe(q.correctAnswer);
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.options).toContain(q.correctAnswer);
      }
    });

    it("generates correct multiplication questions", () => {
      const questions = generateSessionQuestions({
        operation: "multiplication",
        difficulty: "easy",
        digitCountLeft: 1,
        digitCountRight: 2,
        questionCount: 10,
        hintsEnabled: true,
      });

      expect(questions).toHaveLength(10);
      for (const q of questions) {
        const [a, b] = q.expression.operands;
        expect(a * b).toBe(q.correctAnswer);
        expect(q.options).toContain(q.correctAnswer);
      }
    });

    it("generates correct division questions with whole integer results", () => {
      const questions = generateSessionQuestions({
        operation: "division",
        difficulty: "medium",
        digitCountLeft: 2,
        digitCountRight: 1,
        questionCount: 10,
        hintsEnabled: true,
      });

      expect(questions).toHaveLength(10);
      for (const q of questions) {
        const [dividend, divisor] = q.expression.operands;
        expect(dividend % divisor).toBe(0); // must divide evenly
        expect(dividend / divisor).toBe(q.correctAnswer);
        expect(q.options).toContain(q.correctAnswer);
      }
    });

    it("generates correct squares questions", () => {
      const questions = generateSessionQuestions({
        operation: "squares",
        difficulty: "easy",
        digitCountLeft: 2,
        digitCountRight: 2,
        questionCount: 5,
        hintsEnabled: true,
      });

      expect(questions).toHaveLength(5);
      for (const q of questions) {
        const a = q.expression.operands[0];
        expect(a * a).toBe(q.correctAnswer);
        expect(q.options).toContain(q.correctAnswer);
      }
    });
  });

  describe("Deterministic Generation (Mulberry32 PRNG)", () => {
    it("produces identical question sequences for identical seeds", () => {
      const config = {
        operation: "multiplication" as const,
        difficulty: "medium" as const,
        digitCountLeft: 2,
        digitCountRight: 1,
        questionCount: 5,
        hintsEnabled: true,
        deterministic: true,
        seed: "daily-challenge-2026-09-05",
      };

      const run1 = generateSessionQuestions(config);
      const run2 = generateSessionQuestions(config);

      expect(run1.map((q) => q.correctAnswer)).toEqual(run2.map((q) => q.correctAnswer));
      expect(run1.map((q) => q.expression.formattedInline)).toEqual(
        run2.map((q) => q.expression.formattedInline)
      );
    });

    it("produces different question sequences for distinct seeds", () => {
      const configA = {
        operation: "addition" as const,
        difficulty: "easy" as const,
        digitCountLeft: 2,
        digitCountRight: 2,
        questionCount: 5,
        hintsEnabled: true,
        deterministic: true,
        seed: "seed-alpha",
      };

      const configB = {
        ...configA,
        seed: "seed-beta",
      };

      const runA = generateSessionQuestions(configA);
      const runB = generateSessionQuestions(configB);

      expect(runA.map((q) => q.id)).not.toEqual(runB.map((q) => q.id));
    });
  });

  describe("Expression Evaluator Unit Tests", () => {
    it("correctly evaluates binary expressions with explanations", () => {
      const addition = evaluateBinaryExpression(47, 38, "addition");
      expect(addition.isValid).toBe(true);
      expect(addition.value).toBe(85);

      const multiplication = evaluateBinaryExpression(12, 11, "multiplication");
      expect(multiplication.isValid).toBe(true);
      expect(multiplication.value).toBe(132);

      const invalidDiv = evaluateBinaryExpression(10, 0, "division");
      expect(invalidDiv.isValid).toBe(false);
    });
  });

  describe("Session Anti-Cheat & Integrity Engine", () => {
    const createSampleAnswers = (count: number, solveTimeMs: number): AnswerEvent[] => {
      return Array.from({ length: count }, (_, i) => ({
        questionId: `q_${i}`,
        questionSignature: `sig_${i}`,
        userAnswer: 42,
        correctAnswer: 42,
        isCorrect: true,
        solveTimeMs,
        hintUsed: false,
        attemptsCount: 1,
        timestamp: Date.now(),
      }));
    };

    it("flags suspicious superhuman solve times (< 150ms)", () => {
      const summary: SessionSummary = {
        sessionId: "cheat_session_1",
        mode: "speed",
        operation: "addition",
        difficulty: "medium",
        totalQuestions: 5,
        correctCount: 5,
        incorrectCount: 0,
        accuracyPercentage: 100,
        totalTimeMs: 400,
        averageSolveTimeMs: 80,
        fastestSolveTimeMs: 50,
        slowestSolveTimeMs: 100,
        questionsPerMinute: 750,
        finalScore: 5000,
        maxComboStreak: 5,
        hintsUsedCount: 0,
        scoreVersion: "v1.0",
        generatorVersion: "v1.1.0",
        isDailyChallenge: false,
        completedAt: new Date().toISOString(),
        answers: createSampleAnswers(5, 75), // 75ms per answer is superhuman
      };

      const result = verifySessionIntegrity(summary);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain("Unrealistic solve speeds detected.");
    });

    it("approves realistic human solve speeds and recalculates score", () => {
      const summary: SessionSummary = {
        sessionId: "honest_session_1",
        mode: "speed",
        operation: "addition",
        difficulty: "medium",
        totalQuestions: 5,
        correctCount: 5,
        incorrectCount: 0,
        accuracyPercentage: 100,
        totalTimeMs: 12000,
        averageSolveTimeMs: 2400,
        fastestSolveTimeMs: 1800,
        slowestSolveTimeMs: 3100,
        questionsPerMinute: 25,
        finalScore: 1250,
        maxComboStreak: 5,
        hintsUsedCount: 0,
        scoreVersion: "v1.0",
        generatorVersion: "v1.1.0",
        isDailyChallenge: false,
        completedAt: new Date().toISOString(),
        answers: createSampleAnswers(5, 2400),
      };

      const result = verifySessionIntegrity(summary);
      expect(result.isValid).toBe(true);
      expect(result.recalculatedScore).toBeGreaterThan(0);
    });
  });
});
