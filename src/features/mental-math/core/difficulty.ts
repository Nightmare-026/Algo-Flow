import { DifficultyTier, MathOperation } from "./types";
import { calculateAdditionCarries, calculateSubtractionBorrows } from "./evaluator";

export interface ComplexityMetrics {
  carriesCount: number;
  borrowsCount: number;
  digitCountTotal: number;
  operationWeight: number;
  estimatedMentalEffort: number;
  targetSolveTimeMs: number;
  complexityScore: number;
  calculatedTier: DifficultyTier;
}

const OPERATION_BASE_WEIGHTS: Record<MathOperation, number> = {
  addition: 1.0,
  subtraction: 1.25,
  multiplication: 1.75,
  division: 2.0,
  percentages: 1.8,
  squares: 1.7,
  roots: 1.9,
  mixed: 1.6,
};

/**
 * Computes computational complexity and target solve time for a math problem.
 */
export function analyzeComplexity(operands: number[], operation: MathOperation): ComplexityMetrics {
  const op1 = Math.abs(operands[0] ?? 0);
  const op2 = Math.abs(operands[1] ?? 0);

  const digits1 = Math.max(1, Math.floor(Math.log10(Math.max(1, op1))) + 1);
  const digits2 = Math.max(1, Math.floor(Math.log10(Math.max(1, op2))) + 1);
  const digitCountTotal = digits1 + digits2;

  let carriesCount = 0;
  let borrowsCount = 0;

  if (operation === "addition") {
    carriesCount = calculateAdditionCarries(op1, op2);
  } else if (operation === "subtraction") {
    borrowsCount = op1 >= op2 ? calculateSubtractionBorrows(op1, op2) : 0;
  } else if (operation === "multiplication") {
    carriesCount = digits1 > 1 || digits2 > 1 ? Math.min(digits1 * digits2, 4) : 0;
  }

  const opWeight = OPERATION_BASE_WEIGHTS[operation] || 1.0;

  // Base mental effort in estimated seconds to solve
  let baseSeconds = 2.0;

  switch (operation) {
    case "addition":
      baseSeconds = 1.5 + (digits1 + digits2 - 2) * 1.5 + carriesCount * 1.2;
      break;
    case "subtraction":
      baseSeconds = 2.0 + (digits1 + digits2 - 2) * 1.8 + borrowsCount * 1.5;
      break;
    case "multiplication":
      if (digits1 === 1 && digits2 === 1) {
        baseSeconds = 2.0;
      } else {
        baseSeconds = 3.0 + digits1 * digits2 * 2.2 + carriesCount * 1.5;
      }
      break;
    case "division":
      baseSeconds = 2.5 + digits1 * 1.8;
      break;
  }

  // Cap target solve time sensibly
  const targetSolveTimeMs = Math.round(Math.max(1500, Math.min(30000, baseSeconds * 1000)));

  // Continuous complexity score between 0 and 100
  const rawScore =
    (digitCountTotal - 2) * 12 +
    carriesCount * 10 +
    borrowsCount * 12 +
    (opWeight - 1.0) * 18 +
    (baseSeconds - 2.0) * 5;

  const complexityScore = Math.max(5, Math.min(98, Math.round(rawScore)));

  // Map to discrete tier
  let calculatedTier: DifficultyTier = "easy";
  if (complexityScore >= 80) calculatedTier = "master";
  else if (complexityScore >= 62) calculatedTier = "expert";
  else if (complexityScore >= 42) calculatedTier = "hard";
  else if (complexityScore >= 22) calculatedTier = "medium";
  else calculatedTier = "easy";

  return {
    carriesCount,
    borrowsCount,
    digitCountTotal,
    operationWeight: opWeight,
    estimatedMentalEffort: Number(baseSeconds.toFixed(1)),
    targetSolveTimeMs,
    complexityScore,
    calculatedTier,
  };
}
