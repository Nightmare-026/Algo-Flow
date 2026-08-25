import { verifySessionIntegrity } from "@/features/mental-math/engine/anti-cheat";
import { SessionSummary } from "@/features/mental-math/core/types";

describe("Anti-Cheat & Session Integrity Verification", () => {
  it("should pass realistic human solve sessions", () => {
    const validSummary: SessionSummary = {
      sessionId: "s1",
      mode: "test",
      operation: "addition",
      difficulty: "easy",
      totalQuestions: 2,
      correctCount: 2,
      incorrectCount: 0,
      accuracyPercentage: 100,
      totalTimeMs: 6000,
      averageSolveTimeMs: 3000,
      fastestSolveTimeMs: 2500,
      slowestSolveTimeMs: 3500,
      questionsPerMinute: 20,
      finalScore: 250,
      maxComboStreak: 2,
      hintsUsedCount: 0,
      scoreVersion: "v1.0.0",
      generatorVersion: "v1.0.0",
      isDailyChallenge: false,
      completedAt: new Date().toISOString(),
      answers: [
        { questionId: "q1", questionSignature: "add:10:20", userAnswer: 30, isCorrect: true, solveTimeMs: 2500, hintUsed: false, attemptsCount: 1, timestamp: 1000 },
        { questionId: "q2", questionSignature: "add:15:25", userAnswer: 40, isCorrect: true, solveTimeMs: 3500, hintUsed: false, attemptsCount: 1, timestamp: 4500 },
      ],
    };

    const res = verifySessionIntegrity(validSummary);
    expect(res.isValid).toBe(true);
    expect(res.recalculatedScore).toBeGreaterThan(0);
  });

  it("should detect bot submissions with impossibly fast solve times (<150ms)", () => {
    const cheatedSummary: SessionSummary = {
      sessionId: "s2",
      mode: "test",
      operation: "multiplication",
      difficulty: "hard",
      totalQuestions: 3,
      correctCount: 3,
      incorrectCount: 0,
      accuracyPercentage: 100,
      totalTimeMs: 150,
      averageSolveTimeMs: 50,
      fastestSolveTimeMs: 20,
      slowestSolveTimeMs: 80,
      questionsPerMinute: 600,
      finalScore: 1000,
      maxComboStreak: 3,
      hintsUsedCount: 0,
      scoreVersion: "v1.0.0",
      generatorVersion: "v1.0.0",
      isDailyChallenge: false,
      completedAt: new Date().toISOString(),
      answers: [
        { questionId: "q1", questionSignature: "mul:55:45", userAnswer: 2475, isCorrect: true, solveTimeMs: 20, hintUsed: false, attemptsCount: 1, timestamp: 20 },
        { questionId: "q2", questionSignature: "mul:65:35", userAnswer: 2275, isCorrect: true, solveTimeMs: 30, hintUsed: false, attemptsCount: 1, timestamp: 50 },
        { questionId: "q3", questionSignature: "mul:75:25", userAnswer: 1875, isCorrect: true, solveTimeMs: 40, hintUsed: false, attemptsCount: 1, timestamp: 90 },
      ],
    };

    const res = verifySessionIntegrity(cheatedSummary);
    expect(res.isValid).toBe(false);
    expect(res.reason).toContain("Unrealistic solve speeds");
  });
});
