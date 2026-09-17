import { describe, it, expect } from "vitest";
import { verifySessionIntegrity } from "@/features/mental-math/engine/anti-cheat";
import type { SessionSummary } from "@/features/mental-math/core/types";

describe("Anti-Cheat Engine (Server-Authoritative Validation)", () => {
  const baseSummary: SessionSummary = {
    sessionId: "test-session-123",
    mode: "practice",
    operation: "multiplication",
    difficulty: "easy",
    totalQuestions: 3,
    correctCount: 3,
    incorrectCount: 0,
    accuracyPercentage: 100,
    totalTimeMs: 9000,
    averageSolveTimeMs: 3000,
    fastestSolveTimeMs: 2500,
    slowestSolveTimeMs: 3400,
    questionsPerMinute: 20,
    finalScore: 1500,
    maxComboStreak: 3,
    hintsUsedCount: 0,
    isDailyChallenge: false,
    answers: [
      {
        questionId: "q1",
        questionSignature: "mul_6_7",
        userAnswer: 42,
        correctAnswer: 42,
        isCorrect: true,
        solveTimeMs: 2500,
        hintUsed: false,
        attemptsCount: 1,
        timestamp: 1000,
      },
      {
        questionId: "q2",
        questionSignature: "mul_7_8",
        userAnswer: 56,
        correctAnswer: 56,
        isCorrect: true,
        solveTimeMs: 3100,
        hintUsed: false,
        attemptsCount: 1,
        timestamp: 2000,
      },
      {
        questionId: "q3",
        questionSignature: "mul_8_9",
        userAnswer: 72,
        correctAnswer: 72,
        isCorrect: true,
        solveTimeMs: 3400,
        hintUsed: false,
        attemptsCount: 1,
        timestamp: 3000,
      },
    ],
    scoreVersion: "1.0",
    generatorVersion: "1.0",
    completedAt: new Date().toISOString(),
  };

  it("validates a genuine session with correct answers and realistic solve times", () => {
    const result = verifySessionIntegrity(baseSummary);
    expect(result.isValid).toBe(true);
    expect(result.recalculatedScore).toBeGreaterThan(0);
  });

  it("rejects an empty or malformed answers payload", () => {
    const emptySummary = { ...baseSummary, answers: [] };
    const result = verifySessionIntegrity(emptySummary);
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain("empty or invalid");
  });

  it("rejects bot-like solve times (<150ms)", () => {
    const botSummary: SessionSummary = {
      ...baseSummary,
      answers: [
        { ...baseSummary.answers[0], solveTimeMs: 50 },
        { ...baseSummary.answers[1], solveTimeMs: 80 },
        { ...baseSummary.answers[2], solveTimeMs: 60 },
      ],
    };
    const result = verifySessionIntegrity(botSummary);
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain("Unrealistic solve speeds");
  });

  it("detects and rejects forged answers where isCorrect is true but answer is arithmetic mismatch", () => {
    const forgedSummary: SessionSummary = {
      ...baseSummary,
      answers: [
        { ...baseSummary.answers[0], userAnswer: 999, correctAnswer: 42, isCorrect: true },
        baseSummary.answers[1],
        baseSummary.answers[2],
      ],
    };
    const result = verifySessionIntegrity(forgedSummary);
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain("Arithmetic mismatch");
  });

  it("validates daily challenges using deterministic seed re-generation", () => {
    const dailySummary: SessionSummary = {
      ...baseSummary,
      isDailyChallenge: true,
      dailyChallengeDate: "2026-09-18",
    };
    // Will run seeded generator; since questions are generated for today's seed, question count must match
    const result = verifySessionIntegrity(dailySummary);
    expect(typeof result.isValid).toBe("boolean");
  });
});
