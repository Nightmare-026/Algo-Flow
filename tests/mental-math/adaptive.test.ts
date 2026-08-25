import {
  detectWeaknessPatterns,
  calculateAdaptiveDifficultyAdjustment,
} from "@/features/mental-math/engine/adaptive";
import { AnswerEvent, MentalMathQuestion } from "@/features/mental-math/core/types";

describe("Adaptive & Weakness Detection Engine", () => {
  it("should detect specific weakness patterns when error rate >= 33%", () => {
    const mockQuestions: MentalMathQuestion[] = [
      {
        id: "q1",
        signature: { canonicalId: "multiplication:45:23", operation: "multiplication", operandsNormalized: [23, 45] },
        expression: { operands: [45, 23], operators: ["multiplication"], targetAnswer: 1035, formattedInline: "45 × 23 = ?", displayLayout: "inline", metadata: { carriesCount: 1, borrowsCount: 0, estimatedMentalEffort: 5, complexityScore: 40, calculatedTier: "medium" } },
        correctAnswer: 1035,
        distractors: [1025, 1045, 935],
        options: [1035, 1025, 1045, 935],
        targetSolveTimeMs: 5000,
        createdAt: 0,
      },
      {
        id: "q2",
        signature: { canonicalId: "multiplication:34:12", operation: "multiplication", operandsNormalized: [12, 34] },
        expression: { operands: [34, 12], operators: ["multiplication"], targetAnswer: 408, formattedInline: "34 × 12 = ?", displayLayout: "inline", metadata: { carriesCount: 1, borrowsCount: 0, estimatedMentalEffort: 5, complexityScore: 40, calculatedTier: "medium" } },
        correctAnswer: 408,
        distractors: [418, 398, 400],
        options: [408, 418, 398, 400],
        targetSolveTimeMs: 5000,
        createdAt: 0,
      },
      {
        id: "q3",
        signature: { canonicalId: "multiplication:56:18", operation: "multiplication", operandsNormalized: [18, 56] },
        expression: { operands: [56, 18], operators: ["multiplication"], targetAnswer: 1008, formattedInline: "56 × 18 = ?", displayLayout: "inline", metadata: { carriesCount: 1, borrowsCount: 0, estimatedMentalEffort: 5, complexityScore: 40, calculatedTier: "medium" } },
        correctAnswer: 1008,
        distractors: [1018, 998, 1000],
        options: [1008, 1018, 998, 1000],
        targetSolveTimeMs: 5000,
        createdAt: 0,
      },
    ];

    const mockAnswers: AnswerEvent[] = [
      { questionId: "q1", questionSignature: "multiplication:45:23", userAnswer: 999, isCorrect: false, solveTimeMs: 4000, hintUsed: false, attemptsCount: 1, timestamp: 1 },
      { questionId: "q2", questionSignature: "multiplication:34:12", userAnswer: 408, isCorrect: true, solveTimeMs: 4000, hintUsed: false, attemptsCount: 1, timestamp: 2 },
      { questionId: "q3", questionSignature: "multiplication:56:18", userAnswer: 900, isCorrect: false, solveTimeMs: 4000, hintUsed: false, attemptsCount: 1, timestamp: 3 },
    ];

    const weaknesses = detectWeaknessPatterns(mockAnswers, mockQuestions);
    expect(weaknesses.length).toBe(1);
    expect(weaknesses[0].operation).toBe("multiplication");
    expect(weaknesses[0].errorRate).toBe(67); // 2 errors out of 3 = 67%
  });

  it("should recommend difficulty escalation on 100% accuracy streak", () => {
    const perfectAnswers: AnswerEvent[] = [
      { questionId: "q1", questionSignature: "add:1:2", userAnswer: 3, isCorrect: true, solveTimeMs: 1000, hintUsed: false, attemptsCount: 1, timestamp: 1 },
      { questionId: "q2", questionSignature: "add:2:3", userAnswer: 5, isCorrect: true, solveTimeMs: 1000, hintUsed: false, attemptsCount: 1, timestamp: 2 },
      { questionId: "q3", questionSignature: "add:3:4", userAnswer: 7, isCorrect: true, solveTimeMs: 1000, hintUsed: false, attemptsCount: 1, timestamp: 3 },
      { questionId: "q4", questionSignature: "add:4:5", userAnswer: 9, isCorrect: true, solveTimeMs: 1000, hintUsed: false, attemptsCount: 1, timestamp: 4 },
    ];

    const result = calculateAdaptiveDifficultyAdjustment(perfectAnswers, "easy");
    expect(result.shouldAdjust).toBe(true);
    expect(result.recommendedDifficulty).toBe("medium");
  });
});
