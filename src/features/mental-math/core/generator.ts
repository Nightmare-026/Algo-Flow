import {
  DisplayLayout,
  ExpressionNode,
  GeneratorConfig,
  MathOperation,
  MentalMathQuestion,
} from "./types";
import { evaluateBinaryExpression, calculateAdditionCarries, calculateSubtractionBorrows } from "./evaluator";
import { SessionUniquenessTracker } from "./canonical";
import { analyzeComplexity } from "./difficulty";
import { generateDistractors } from "./distractors";

export const GENERATOR_VERSION = "v1.1.0";

/**
 * Deterministic 32-bit PRNG (Mulberry32) for reproducible daily challenges.
 */
export function createSeededRandom(seedInput: string | number): () => number {
  let seed = typeof seedInput === "number" ? seedInput : 0;
  if (typeof seedInput === "string") {
    for (let i = 0; i < seedInput.length; i++) {
      seed = (seed << 5) - seed + seedInput.charCodeAt(i);
      seed |= 0;
    }
  }

  let state = seed | 0;
  return function () {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns min and max bounds for a given digit count.
 */
export function getDigitRange(digits: number): { min: number; max: number } {
  if (digits <= 1) return { min: 1, max: 9 };
  if (digits === 2) return { min: 10, max: 99 };
  if (digits === 3) return { min: 100, max: 999 };
  return { min: 1000, max: 9999 };
}

/**
 * Formats an operator symbol for clean mathematical presentation.
 */
export function getOperatorSymbol(op: MathOperation): string {
  switch (op) {
    case "addition":
      return "+";
    case "subtraction":
      return "−";
    case "multiplication":
      return "×";
    case "division":
      return "÷";
    case "percentages":
      return "% of";
    case "squares":
      return "²";
    case "roots":
      return "√";
    case "mixed":
      return "+";
  }
}

/**
 * Validates generator capacity before starting to prevent exhaustion or infinite loops.
 */
export function validateGeneratorCapacity(config: GeneratorConfig): {
  isFeasible: boolean;
  estimatedCombinations: number;
  reason?: string;
} {
  if (config.operation === "squares" || config.operation === "roots") {
    const range = getDigitRange(config.digitCountLeft);
    const count = Math.max(1, range.max - range.min + 1);
    return {
      isFeasible: count >= Math.min(config.questionCount, 5),
      estimatedCombinations: count,
    };
  }

  if (config.operation === "percentages") {
    return {
      isFeasible: true,
      estimatedCombinations: 120,
    };
  }

  const range1 =
    config.minRange !== undefined && config.maxRange !== undefined
      ? { min: config.minRange, max: config.maxRange }
      : getDigitRange(config.digitCountLeft);
  const range2 =
    config.minRange !== undefined && config.maxRange !== undefined
      ? { min: config.minRange, max: config.maxRange }
      : getDigitRange(config.digitCountRight);

  const count1 = Math.max(1, range1.max - range1.min + 1);
  const count2 = Math.max(1, range2.max - range2.min + 1);

  let rawCombinations = count1 * count2;
  if (config.operation === "addition" || config.operation === "multiplication") {
    rawCombinations = Math.floor(rawCombinations / 2) + 1;
  }

  const maxAllowedByReuse = (count1 + count2) * (config.maxOperandReuse ?? 5);
  const maxPossible = Math.min(rawCombinations, maxAllowedByReuse);

  if (maxPossible < config.questionCount && config.operation !== "mixed") {
    return {
      isFeasible: false,
      estimatedCombinations: maxPossible,
      reason: `Configuration allows at most ~${maxPossible} unique questions. Please increase number range or reduce question count.`,
    };
  }

  return {
    isFeasible: true,
    estimatedCombinations: maxPossible,
  };
}

/**
 * Generates a complete sequence of verified, unique questions for a Mental Math session.
 * Strictly respects user-configured Left and Right operand digit counts.
 */
export function generateSessionQuestions(config: GeneratorConfig): MentalMathQuestion[] {
  const capacity = validateGeneratorCapacity(config);
  if (!capacity.isFeasible) {
    throw new Error(capacity.reason || "Insufficient question space for configuration.");
  }

  const randomFn =
    config.deterministic && config.seed !== undefined
      ? createSeededRandom(config.seed)
      : Math.random;

  const tracker = new SessionUniquenessTracker(config.maxOperandReuse ?? 6);
  const questions: MentalMathQuestion[] = [];

  const range1 =
    config.minRange !== undefined && config.maxRange !== undefined
      ? { min: config.minRange, max: config.maxRange }
      : getDigitRange(config.digitCountLeft);
  const range2 =
    config.minRange !== undefined && config.maxRange !== undefined
      ? { min: config.minRange, max: config.maxRange }
      : getDigitRange(config.digitCountRight);

  const getRandomInRange = (min: number, max: number) => {
    return Math.floor(randomFn() * (max - min + 1)) + min;
  };

  const percentageOptions = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80];
  const percentageBases = [20, 40, 50, 60, 80, 100, 120, 150, 160, 200, 240, 250, 300, 400, 500, 800];
  const mixedPool: MathOperation[] = ["addition", "subtraction", "multiplication", "division"];

  const maxTotalAttempts = config.questionCount * 120;
  let attempts = 0;

  while (questions.length < config.questionCount && attempts < maxTotalAttempts) {
    attempts++;

    let activeOp = config.operation;
    if (config.operation === "mixed") {
      activeOp = mixedPool[Math.floor(randomFn() * mixedPool.length)];
    }

    let a = getRandomInRange(range1.min, range1.max);
    let b = getRandomInRange(range2.min, range2.max);

    if (activeOp === "squares") {
      a = getRandomInRange(range1.min, range1.max);
      b = a;
    } else if (activeOp === "roots") {
      const minRoot = Math.max(2, Math.ceil(Math.sqrt(range1.min)));
      const maxRoot = Math.min(100, Math.floor(Math.sqrt(range1.max)));
      const rootVal = getRandomInRange(minRoot, Math.max(minRoot, maxRoot));
      a = rootVal * rootVal;
      b = rootVal;
    } else if (activeOp === "percentages") {
      a = percentageOptions[Math.floor(randomFn() * percentageOptions.length)];
      b = percentageBases[Math.floor(randomFn() * percentageBases.length)];
    } else if (activeOp === "subtraction") {
      if (!config.allowNegativeResult && a < b) {
        if (config.digitCountLeft === config.digitCountRight) {
          [a, b] = [b, a];
        } else if (config.digitCountLeft > config.digitCountRight) {
          // guaranteed a >= b because range1.min > range2.max
        } else {
          // If user requested 1-digit minus 2-digit with no negative, adjust a to be >= b
          a = getRandomInRange(Math.max(range1.min, b), range1.max);
        }
      }
    } else if (activeOp === "division") {
      b = Math.max(2, b);
      const minQuotient = Math.max(1, Math.ceil(range1.min / b));
      const maxQuotient = Math.max(1, Math.floor(range1.max / b));
      if (minQuotient <= maxQuotient) {
        const quotient = getRandomInRange(minQuotient, maxQuotient);
        a = b * quotient;
      } else {
        const quotient = getRandomInRange(1, 9);
        a = b * quotient;
      }
    }

    // Apply Difficulty Carry / Borrow Constraints
    if (config.difficulty === "easy" && attempts < maxTotalAttempts * 0.75) {
      if (activeOp === "addition") {
        const carries = calculateAdditionCarries(a, b);
        if (carries > 0 && config.digitCountLeft <= 2) continue;
      } else if (activeOp === "subtraction") {
        const borrows = calculateSubtractionBorrows(a, b);
        if (borrows > 0 && config.digitCountLeft <= 2) continue;
      } else if (activeOp === "multiplication") {
        // Prefer friendly multipliers in easy mode
        const friendlyMultipliers = [2, 3, 4, 5, 10, 11, 20, 25];
        if (range2.max <= 9 && ![2, 3, 4, 5].includes(b)) {
          b = [2, 3, 4, 5][Math.floor(randomFn() * 4)];
        } else if (range2.max > 9 && !friendlyMultipliers.includes(b % 10)) {
          // friendly units
        }
      }
    } else if ((config.difficulty === "hard" || config.difficulty === "expert") && attempts < maxTotalAttempts * 0.75) {
      if (activeOp === "addition" && config.digitCountLeft >= 2) {
        const carries = calculateAdditionCarries(a, b);
        if (carries === 0) continue; // Require at least 1 carry in hard mode
      } else if (activeOp === "subtraction" && config.digitCountLeft >= 2) {
        const borrows = calculateSubtractionBorrows(a, b);
        if (borrows === 0) continue; // Require at least 1 borrow in hard mode
      }
    }

    if (!tracker.canAccept([a, b], activeOp)) {
      continue;
    }

    const evaluation = evaluateBinaryExpression(a, b, activeOp);
    if (!evaluation.isValid) {
      continue;
    }

    const signature = tracker.register([a, b], activeOp);
    const complexity = analyzeComplexity([a, b], activeOp);
    const distractorsResult = generateDistractors(
      a,
      b,
      activeOp,
      evaluation.value,
      randomFn
    );

    let formattedInline = "";
    if (activeOp === "squares") {
      formattedInline = `${a}² = ?`;
    } else if (activeOp === "roots") {
      formattedInline = `√${a} = ?`;
    } else if (activeOp === "percentages") {
      formattedInline = `${a}% of ${b} = ?`;
    } else {
      const symbol = getOperatorSymbol(activeOp);
      formattedInline = `${a} ${symbol} ${b} = ?`;
    }

    const isMultiDigit =
      (activeOp === "addition" || activeOp === "subtraction" || activeOp === "multiplication") &&
      ((a >= 100 && b >= 10) || (activeOp === "multiplication" && a >= 10 && b >= 10));

    const displayLayout: DisplayLayout = isMultiDigit ? "vertical" : "inline";

    const expression: ExpressionNode = {
      operands: activeOp === "squares" ? [a] : activeOp === "roots" ? [a] : [a, b],
      operators: [activeOp],
      targetAnswer: evaluation.value,
      formattedInline,
      displayLayout,
      metadata: {
        carriesCount: complexity.carriesCount,
        borrowsCount: complexity.borrowsCount,
        estimatedMentalEffort: complexity.estimatedMentalEffort,
        complexityScore: complexity.complexityScore,
        calculatedTier: complexity.calculatedTier,
      },
    };

    const question: MentalMathQuestion = {
      id: `q_${questions.length + 1}_${signature.canonicalId}`,
      signature,
      expression,
      correctAnswer: evaluation.value,
      distractors: distractorsResult.distractors,
      options: distractorsResult.options,
      explanation: evaluation.explanation,
      targetSolveTimeMs: complexity.targetSolveTimeMs,
      createdAt: Date.now(),
    };

    questions.push(question);
  }

  if (questions.length < config.questionCount) {
    throw new Error(
      `Could only generate ${questions.length} of ${config.questionCount} unique questions with current parameters.`
    );
  }

  return questions;
}
