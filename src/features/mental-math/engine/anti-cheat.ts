import { SessionSummary } from "../core/types";
import { generateSessionQuestions } from "../core/generator";
import { calculateQuestionScore, calculateFinalSessionScore } from "./scoring";

export interface SessionIntegrityResult {
  isValid: boolean;
  recalculatedScore: number;
  reason?: string;
}

/**
 * Validates the integrity of a completed session to prevent cheated / scripted leaderboard scores.
 */
export function verifySessionIntegrity(summary: SessionSummary): SessionIntegrityResult {
  // 1. Check for realistic solve times (e.g. human cannot solve in 50ms)
  const suspiciousFastAnswers = summary.answers.filter((a) => a.solveTimeMs < 150);
  if (suspiciousFastAnswers.length > 2) {
    return {
      isValid: false,
      recalculatedScore: 0,
      reason: "Unrealistic solve speeds detected.",
    };
  }

  // 2. If deterministic daily challenge, re-run generator and compare
  if (summary.isDailyChallenge && summary.dailyChallengeDate) {
    try {
      const regeneratedQuestions = generateSessionQuestions({
        operation: summary.operation,
        difficulty: summary.difficulty,
        digitCountLeft: 2,
        digitCountRight: 2,
        questionCount: summary.totalQuestions,
        hintsEnabled: summary.hintsUsedCount > 0,
        deterministic: true,
        seed: `algo-flow-daily-${summary.dailyChallengeDate}`,
      });

      if (regeneratedQuestions.length !== summary.totalQuestions) {
        return {
          isValid: false,
          recalculatedScore: 0,
          reason: "Question sequence mismatch.",
        };
      }
    } catch {
      return {
        isValid: false,
        recalculatedScore: 0,
        reason: "Daily challenge verification failed.",
      };
    }
  }

  // 3. Recalculate score server-side
  let combo = 0;
  const recalculatedScores: number[] = [];

  for (const ans of summary.answers) {
    const isCorrect = ans.isCorrect;
    const currentCombo = isCorrect ? combo : 0;
    if (isCorrect) combo += 1;
    else combo = 0;

    const res = calculateQuestionScore({
      isCorrect,
      difficulty: summary.difficulty,
      solveTimeMs: ans.solveTimeMs,
      targetSolveTimeMs: 4000,
      currentCombo,
      hintUsed: ans.hintUsed,
    });

    recalculatedScores.push(res.totalQuestionScore);
  }

  const finalRecalculatedScore = calculateFinalSessionScore(
    recalculatedScores,
    summary.accuracyPercentage
  );

  return {
    isValid: true,
    recalculatedScore: finalRecalculatedScore,
  };
}
