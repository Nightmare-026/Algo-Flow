import {
  calculateQuestionScore,
  calculateFinalSessionScore,
} from "@/features/mental-math/engine/scoring";

describe("Scoring Engine", () => {
  it("should reward correct answers with base points and difficulty multiplier", () => {
    const easyRes = calculateQuestionScore({
      isCorrect: true,
      difficulty: "easy",
      solveTimeMs: 4000,
      targetSolveTimeMs: 4000,
      currentCombo: 0,
      hintUsed: false,
    });
    expect(easyRes.totalQuestionScore).toBe(100);

    const hardRes = calculateQuestionScore({
      isCorrect: true,
      difficulty: "hard",
      solveTimeMs: 5000,
      targetSolveTimeMs: 5000,
      currentCombo: 0,
      hintUsed: false,
    });
    expect(hardRes.totalQuestionScore).toBe(220);
  });

  it("should reward fast solve speed with speed bonus", () => {
    const fastRes = calculateQuestionScore({
      isCorrect: true,
      difficulty: "easy",
      solveTimeMs: 1000,
      targetSolveTimeMs: 4000,
      currentCombo: 0,
      hintUsed: false,
    });
    expect(fastRes.speedBonus).toBeGreaterThan(0);
    expect(fastRes.totalQuestionScore).toBeGreaterThan(100);
  });

  it("should reward combo streaks", () => {
    const comboRes = calculateQuestionScore({
      isCorrect: true,
      difficulty: "easy",
      solveTimeMs: 4000,
      targetSolveTimeMs: 4000,
      currentCombo: 5,
      hintUsed: false,
    });
    expect(comboRes.comboBonus).toBe(20);
  });

  it("should apply hint penalty when 4-option hint was used", () => {
    const hintRes = calculateQuestionScore({
      isCorrect: true,
      difficulty: "easy",
      solveTimeMs: 4000,
      targetSolveTimeMs: 4000,
      currentCombo: 0,
      hintUsed: true,
    });
    expect(hintRes.hintPenalty).toBe(30);
    expect(hintRes.totalQuestionScore).toBe(70);
  });

  it("should award 0 points for incorrect answers", () => {
    const wrongRes = calculateQuestionScore({
      isCorrect: false,
      difficulty: "hard",
      solveTimeMs: 2000,
      targetSolveTimeMs: 4000,
      currentCombo: 4,
      hintUsed: false,
    });
    expect(wrongRes.totalQuestionScore).toBe(0);
  });

  it("should boost final session score with 100% accuracy multiplier", () => {
    const finalScore = calculateFinalSessionScore([100, 100, 100, 100], 100);
    expect(finalScore).toBe(500); // 400 * 1.25 = 500
  });
});
