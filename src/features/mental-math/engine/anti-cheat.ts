import { SessionSummary, MathOperation } from "../core/types";
import { generateSessionQuestions } from "../core/generator";
import { evaluateBinaryExpression } from "../core/evaluator";
import { calculateQuestionScore, calculateFinalSessionScore } from "./scoring";

export interface SessionIntegrityResult {
  isValid: boolean;
  recalculatedScore: number;
  reason?: string;
}

function parseSignature(
  signature?: string
): { operation: MathOperation; operands: number[] } | null {
  if (!signature) return null;
  if (signature.includes(":")) {
    const parts = signature.split(":");
    const op = parts[0] as MathOperation;
    const operands = parts.slice(1).map(Number);
    if (operands.length > 0 && operands.every(Number.isFinite)) {
      return { operation: op, operands };
    }
  }
  if (signature.includes("_")) {
    const parts = signature.split("_");
    const prefix = parts[0];
    const opMap: Record<string, MathOperation> = {
      mul: "multiplication",
      add: "addition",
      sub: "subtraction",
      div: "division",
      sq: "squares",
      cube: "cubes",
      sqrt: "roots",
      pct: "percentages",
    };
    const op = opMap[prefix] || (parts[0] as MathOperation);
    const operands = parts.slice(1).map(Number);
    if (operands.length > 0 && operands.every(Number.isFinite)) {
      return { operation: op, operands };
    }
  }
  return null;
}

function computeServerExpectedAnswer(signature?: string): number | undefined {
  const parsed = parseSignature(signature);
  if (!parsed) return undefined;
  const a = parsed.operands[0];
  const b = parsed.operands.length > 1 ? parsed.operands[1] : 0;
  const res = evaluateBinaryExpression(a, b, parsed.operation);
  return res.isValid ? res.value : undefined;
}

/**
 * Validates the integrity of a completed session to prevent cheated / scripted leaderboard scores.
 * Server-authoritative: validates arithmetic correctness against true mathematical solutions.
 */
export function verifySessionIntegrity(summary: SessionSummary): SessionIntegrityResult {
  if (!summary || !Array.isArray(summary.answers) || summary.answers.length === 0) {
    return {
      isValid: false,
      recalculatedScore: 0,
      reason: "Session payload is empty or invalid.",
    };
  }

  // 1. Check for realistic solve times (e.g. human cannot solve in 50ms)
  const suspiciousFastAnswers = summary.answers.filter((a) => a.solveTimeMs < 150);
  if (suspiciousFastAnswers.length > 2) {
    return {
      isValid: false,
      recalculatedScore: 0,
      reason: "Unrealistic solve speeds detected.",
    };
  }

  // Map to store true expected answers per question index
  const expectedAnswersByIndex: Map<number, number> = new Map();

  // 2. If deterministic daily challenge, re-run generator and compare against true expected answers
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

      for (let i = 0; i < regeneratedQuestions.length; i++) {
        expectedAnswersByIndex.set(i, regeneratedQuestions[i].correctAnswer);
      }
    } catch {
      return {
        isValid: false,
        recalculatedScore: 0,
        reason: "Daily challenge verification failed.",
      };
    }
  }

  // 3. Server-authoritative answer verification & score recalculation
  let combo = 0;
  let verifiedCorrectCount = 0;
  const recalculatedScores: number[] = [];

  for (let i = 0; i < summary.answers.length; i++) {
    const ans = summary.answers[i];
    const signatureExpected = computeServerExpectedAnswer(ans.questionSignature);
    const expected = expectedAnswersByIndex.get(i) ?? signatureExpected ?? ans.correctAnswer;

    // Detect if client forged correctAnswer in payload when server can verify signature
    if (
      signatureExpected !== undefined &&
      ans.correctAnswer !== undefined &&
      Number(ans.correctAnswer) !== Number(signatureExpected)
    ) {
      return {
        isValid: false,
        recalculatedScore: 0,
        reason: `Forged answer key detected on question ${i + 1}.`,
      };
    }

    let isCorrect: boolean;
    if (expected !== undefined) {
      // Strictly verify arithmetic correctness against known solution
      isCorrect = ans.userAnswer !== null && Number(ans.userAnswer) === Number(expected);

      // If client forged an isCorrect: true claim that is mathematically wrong, reject session
      if (ans.isCorrect && !isCorrect) {
        return {
          isValid: false,
          recalculatedScore: 0,
          reason: `Arithmetic mismatch detected on question ${i + 1}.`,
        };
      }
    } else {
      // Unseeded practice drill fallback
      isCorrect = Boolean(ans.isCorrect);
    }

    if (isCorrect) {
      verifiedCorrectCount += 1;
    }

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

  const verifiedAccuracy = (verifiedCorrectCount / summary.answers.length) * 100;
  const finalRecalculatedScore = calculateFinalSessionScore(recalculatedScores, verifiedAccuracy);

  return {
    isValid: true,
    recalculatedScore: finalRecalculatedScore,
  };
}
