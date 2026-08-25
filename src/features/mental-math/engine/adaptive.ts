import {
  AnswerEvent,
  DifficultyTier,
  MathOperation,
  MentalMathQuestion,
  WeaknessPattern,
} from "../core/types";

/**
 * Evaluates performance over recent answers and detects specific weakness patterns.
 */
export function detectWeaknessPatterns(
  answers: AnswerEvent[],
  questions: MentalMathQuestion[]
): WeaknessPattern[] {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const buckets = new Map<
    string,
    { total: number; errors: number; sampleProblem: string; operation: MathOperation }
  >();

  for (const ans of answers) {
    const q = questionMap.get(ans.questionId);
    if (!q) continue;

    const op = q.signature.operation;
    const op1 = q.expression.operands[0];
    const op2 = q.expression.operands[1];
    const d1 = Math.max(1, Math.floor(Math.log10(Math.max(1, op1))) + 1);
    const d2 = Math.max(1, Math.floor(Math.log10(Math.max(1, op2))) + 1);

    const bucketKey = `${op}:${d1}d_x_${d2}d`;

    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, {
        total: 0,
        errors: 0,
        sampleProblem: q.expression.formattedInline.replace(" = ?", ""),
        operation: op,
      });
    }

    const b = buckets.get(bucketKey)!;
    b.total++;
    if (!ans.isCorrect) {
      b.errors++;
    }
  }

  const weaknesses: WeaknessPattern[] = [];

  for (const [key, stat] of buckets.entries()) {
    if (stat.total >= 3 && stat.errors / stat.total >= 0.33) {
      const parts = key.split(":");
      const digitStr = parts[1].replace("_x_", " × ");
      weaknesses.push({
        id: `weakness_${key}`,
        operation: stat.operation,
        digitComplexity: digitStr,
        errorRate: Math.round((stat.errors / stat.total) * 100),
        sampleProblem: stat.sampleProblem,
        suggestedAction: `Focus on ${stat.operation} with ${digitStr} operands.`,
        detectedAt: new Date().toISOString(),
      });
    }
  }

  return weaknesses;
}

/**
 * Calculates adaptive difficulty adjustment recommendations based on rolling accuracy.
 */
export function calculateAdaptiveDifficultyAdjustment(
  recentAnswers: AnswerEvent[],
  currentDifficulty: DifficultyTier
): {
  recommendedDifficulty: DifficultyTier;
  shouldAdjust: boolean;
  reason?: string;
} {
  if (recentAnswers.length < 4) {
    return { recommendedDifficulty: currentDifficulty, shouldAdjust: false };
  }

  const correctCount = recentAnswers.filter((a) => a.isCorrect).length;
  const accuracy = correctCount / recentAnswers.length;

  const tiers: DifficultyTier[] = ["easy", "medium", "hard", "expert", "master"];
  const currentIndex = tiers.indexOf(currentDifficulty);

  // Upgrade difficulty if 100% accurate over rolling window
  if (accuracy === 1.0 && currentIndex < tiers.length - 1) {
    return {
      recommendedDifficulty: tiers[currentIndex + 1],
      shouldAdjust: true,
      reason: "High accuracy streak detected. Increasing challenge.",
    };
  }

  // Downgrade if accuracy drops below 50%
  if (accuracy < 0.5 && currentIndex > 0) {
    return {
      recommendedDifficulty: tiers[currentIndex - 1],
      shouldAdjust: true,
      reason: "Adjusting to reinforce fundamentals.",
    };
  }

  return { recommendedDifficulty: currentDifficulty, shouldAdjust: false };
}
