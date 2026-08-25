import { DifficultyTier, ScoreBreakdown } from "../core/types";

export const SCORE_VERSION = "v1.0.0";

const DIFFICULTY_MULTIPLIERS: Record<DifficultyTier, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.2,
  expert: 3.2,
  master: 4.5,
};

/**
 * Calculates score for an individual question answer.
 */
export function calculateQuestionScore(params: {
  isCorrect: boolean;
  difficulty: DifficultyTier;
  solveTimeMs: number;
  targetSolveTimeMs: number;
  currentCombo: number;
  hintUsed: boolean;
}): ScoreBreakdown {
  if (!params.isCorrect) {
    return {
      basePoints: 0,
      difficultyMultiplier: DIFFICULTY_MULTIPLIERS[params.difficulty],
      speedBonus: 0,
      comboBonus: 0,
      accuracyBonus: 0,
      hintPenalty: 0,
      totalQuestionScore: 0,
    };
  }

  const basePoints = 100;
  const diffMultiplier = DIFFICULTY_MULTIPLIERS[params.difficulty] || 1.0;

  // Speed Bonus: up to +50 points if answered well under target solve time
  let speedBonus = 0;
  if (params.solveTimeMs < params.targetSolveTimeMs) {
    const ratio = (params.targetSolveTimeMs - params.solveTimeMs) / params.targetSolveTimeMs;
    speedBonus = Math.round(Math.max(0, Math.min(50, ratio * 50)));
  }

  // Combo Bonus: scaling multiplier based on active streak
  let comboBonus = 0;
  if (params.currentCombo >= 20) comboBonus = 50;
  else if (params.currentCombo >= 10) comboBonus = 35;
  else if (params.currentCombo >= 5) comboBonus = 20;
  else if (params.currentCombo >= 3) comboBonus = 10;

  // Hint penalty: -30 points if 4-option hint was used
  const hintPenalty = params.hintUsed ? 30 : 0;

  const totalQuestionScore = Math.max(
    10,
    Math.round(basePoints * diffMultiplier + speedBonus + comboBonus - hintPenalty)
  );

  return {
    basePoints,
    difficultyMultiplier: diffMultiplier,
    speedBonus,
    comboBonus,
    accuracyBonus: 0,
    hintPenalty,
    totalQuestionScore,
  };
}

/**
 * Normalizes final session score considering accuracy and speed.
 */
export function calculateFinalSessionScore(
  questionScores: number[],
  accuracyPercentage: number
): number {
  const sum = questionScores.reduce((a, b) => a + b, 0);
  if (questionScores.length === 0) return 0;

  // Accuracy multiplier reward (e.g., 100% accuracy gives 1.25x session bonus)
  let accuracyBonusMultiplier = 1.0;
  if (accuracyPercentage === 100) accuracyBonusMultiplier = 1.25;
  else if (accuracyPercentage >= 90) accuracyBonusMultiplier = 1.15;
  else if (accuracyPercentage >= 80) accuracyBonusMultiplier = 1.05;

  const finalScore = Math.round(sum * accuracyBonusMultiplier);
  return Math.max(0, finalScore);
}
