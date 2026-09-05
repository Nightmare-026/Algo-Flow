import { MathOperation } from "./types";

export interface EvaluationResult {
  value: number;
  isValid: boolean;
  carriesCount: number;
  borrowsCount: number;
  error?: string;
  explanation: string;
}

/**
 * Calculates the number of carries when adding two non-negative integers.
 */
export function calculateAdditionCarries(a: number, b: number): number {
  if (a < 0 || b < 0) return 0;
  let carries = 0;
  let carry = 0;
  let numA = Math.floor(a);
  let numB = Math.floor(b);

  while (numA > 0 || numB > 0 || carry > 0) {
    const digitA = numA % 10;
    const digitB = numB % 10;
    const sum = digitA + digitB + carry;
    if (sum >= 10) {
      carries++;
      carry = 1;
    } else {
      carry = 0;
    }
    numA = Math.floor(numA / 10);
    numB = Math.floor(numB / 10);
  }
  return carries;
}

/**
 * Calculates the number of borrows when subtracting b from a (a >= b >= 0).
 */
export function calculateSubtractionBorrows(a: number, b: number): number {
  if (a < b || a < 0 || b < 0) return 0;
  let borrows = 0;
  let borrow = 0;
  let numA = Math.floor(a);
  let numB = Math.floor(b);

  while (numA > 0 || numB > 0) {
    const digitA = (numA % 10) - borrow;
    const digitB = numB % 10;

    if (digitA < digitB) {
      borrows++;
      borrow = 1;
    } else {
      borrow = 0;
    }
    numA = Math.floor(numA / 10);
    numB = Math.floor(numB / 10);
  }
  return borrows;
}

/**
 * Generates pedagogical step-by-step mental calculation strategies.
 */
function getMentalStrategy(a: number, b: number, op: MathOperation, value: number): string {
  switch (op) {
    case "addition": {
      if (a < 10 && b < 10) return `${a} + ${b} = ${value}`;
      if (b % 10 >= 7 && b >= 10) {
        const roundUp = Math.ceil(b / 10) * 10;
        const diff = roundUp - b;
        return `Round-up shortcut: ${a} + ${roundUp} − ${diff} = ${a + roundUp} − ${diff} = ${value}`;
      }
      if (a >= 10 && b >= 10) {
        const aTens = Math.floor(a / 10) * 10;
        const aOnes = a % 10;
        const bTens = Math.floor(b / 10) * 10;
        const bOnes = b % 10;
        return `Left-to-right split: (${aTens} + ${bTens}) + (${aOnes} + ${bOnes}) = ${aTens + bTens} + ${aOnes + bOnes} = ${value}`;
      }
      return `${a} + ${b} = ${value}`;
    }

    case "subtraction": {
      if (a < 10 && b < 10) return `${a} − ${b} = ${value}`;
      if (b % 10 >= 7) {
        const roundUp = Math.ceil(b / 10) * 10;
        const diff = roundUp - b;
        return `Round-up subtraction: ${a} − ${roundUp} + ${diff} = ${a - roundUp} + ${diff} = ${value}`;
      }
      if (b >= 10) {
        const bTens = Math.floor(b / 10) * 10;
        const bOnes = b % 10;
        return `Step-by-step subtraction: ${a} − ${bTens} = ${a - bTens}, then ${a - bTens} − ${bOnes} = ${value}`;
      }
      return `${a} − ${b} = ${value}`;
    }

    case "multiplication": {
      if (a >= 10 && b < 10) {
        const aTens = Math.floor(a / 10) * 10;
        const aOnes = a % 10;
        return `Distributive property: (${aTens} × ${b}) + (${aOnes} × ${b}) = ${aTens * b} + ${aOnes * b} = ${value}`;
      }
      if (b === 5) {
        return `Multiply by 5 trick: (${a} × 10) ÷ 2 = ${a * 10} ÷ 2 = ${value}`;
      }
      if (b === 4) {
        return `Double & double: (${a} × 2) × 2 = ${a * 2} × 2 = ${value}`;
      }
      if (b === 9) {
        return `Multiply by 9 trick: (${a} × 10) − ${a} = ${a * 10} − ${a} = ${value}`;
      }
      if (b === 11 && a < 100) {
        const d1 = Math.floor(a / 10);
        const d2 = a % 10;
        return `Multiply by 11 trick: split ${d1}_${d2}, sum middle (${d1} + ${d2} = ${d1 + d2}) ➔ ${value}`;
      }
      return `Distributive product: ${a} × ${b} = ${value}`;
    }

    case "division": {
      if (b === 5) {
        return `Divide by 5 shortcut: (${a} × 2) ÷ 10 = ${a * 2} ÷ 10 = ${value}`;
      }
      if (b === 4) {
        return `Halve twice: (${a} ÷ 2) ÷ 2 = ${a / 2} ÷ 2 = ${value}`;
      }
      const partial = Math.floor(a / (b * 10)) * (b * 10);
      if (partial > 0 && partial < a) {
        return `Chunking: (${partial} ÷ ${b}) + (${a - partial} ÷ ${b}) = ${partial / b} + ${(a - partial) / b} = ${value}`;
      }
      return `${a} ÷ ${b} = ${value}`;
    }

    case "squares": {
      if (a % 10 === 5) {
        const prefix = Math.floor(a / 10);
        return `Ending in 5 shortcut: (${prefix} × ${prefix + 1} = ${prefix * (prefix + 1)}) and append 25 ➔ ${value}`;
      }
      if (a >= 11 && a <= 99) {
        const base = Math.round(a / 10) * 10;
        const diff = a - base;
        const sign = diff >= 0 ? "+" : "−";
        const absDiff = Math.abs(diff);
        return `Algebraic (a${sign}b)²: ${base}² ${sign} 2(${base}×${absDiff}) + ${absDiff}² = ${base * base} ${sign} ${2 * base * absDiff} + ${absDiff * absDiff} = ${value}`;
      }
      return `${a}² = ${value}`;
    }

    case "cubes": {
      if (a <= 10) {
        return `Standard cubic memory: ${a}³ = ${a} × ${a} × ${a} = ${value}`;
      }
      const tens = Math.floor(a / 10) * 10;
      const units = a % 10;
      return `Binomial expansion: (${tens} + ${units})³ ➔ ${value}`;
    }

    case "roots": {
      return `Integer square root: ${value}² = ${a} ➔ √${a} = ${value}`;
    }

    case "percentages": {
      if (a === 10) return `10% shortcut: Move decimal point left 1 place ➔ ${value}`;
      if (a === 50) return `50% shortcut: Half of ${b} ➔ ${b / 2}`;
      if (a === 25) return `25% shortcut: Quarter of ${b} ➔ ${b / 4}`;
      if (a === 15) {
        const tenPct = b * 0.1;
        const fivePct = tenPct / 2;
        return `15% split: 10% (${tenPct}) + 5% (${fivePct}) = ${value}`;
      }
      if (a === 20) {
        const tenPct = b * 0.1;
        return `20% split: 10% (${tenPct}) × 2 = ${value}`;
      }
      return `${a}% of ${b} = (${a} × ${b}) ÷ 100 = ${value}`;
    }

    default:
      return `${a} = ${value}`;
  }
}

/**
 * Evaluates binary arithmetic expression securely and extracts pedagogical metadata.
 */
export function evaluateBinaryExpression(
  a: number,
  b: number,
  operation: MathOperation
): EvaluationResult {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return {
      value: NaN,
      isValid: false,
      carriesCount: 0,
      borrowsCount: 0,
      error: "Operands must be finite numbers.",
      explanation: "Invalid operands.",
    };
  }

  switch (operation) {
    case "addition": {
      const value = a + b;
      const carries = calculateAdditionCarries(a, b);
      const explanation = getMentalStrategy(a, b, "addition", value);
      return {
        value,
        isValid: true,
        carriesCount: carries,
        borrowsCount: 0,
        explanation,
      };
    }

    case "subtraction": {
      const value = a - b;
      const borrows = a >= b ? calculateSubtractionBorrows(a, b) : 0;
      const explanation = getMentalStrategy(a, b, "subtraction", value);
      return {
        value,
        isValid: true,
        carriesCount: 0,
        borrowsCount: borrows,
        explanation,
      };
    }

    case "multiplication": {
      const value = a * b;
      const carries = a >= 10 || b >= 10 ? Math.floor(Math.log10(Math.max(a, b, 1))) : 0;
      const explanation = getMentalStrategy(a, b, "multiplication", value);
      return {
        value,
        isValid: true,
        carriesCount: carries,
        borrowsCount: 0,
        explanation,
      };
    }

    case "division": {
      if (b === 0) {
        return {
          value: NaN,
          isValid: false,
          carriesCount: 0,
          borrowsCount: 0,
          error: "Division by zero is undefined.",
          explanation: "Division by zero is impossible.",
        };
      }
      if (a % b !== 0) {
        return {
          value: a / b,
          isValid: false,
          carriesCount: 0,
          borrowsCount: 0,
          error: "Fractional result not allowed in integer division.",
          explanation: `${a} is not cleanly divisible by ${b}.`,
        };
      }
      const value = a / b;
      const explanation = getMentalStrategy(a, b, "division", value);
      return {
        value,
        isValid: true,
        carriesCount: 0,
        borrowsCount: 0,
        explanation,
      };
    }

    case "squares": {
      const value = a * a;
      const explanation = getMentalStrategy(a, a, "squares", value);
      return {
        value,
        isValid: true,
        carriesCount: 0,
        borrowsCount: 0,
        explanation,
      };
    }

    case "cubes": {
      const value = a * a * a;
      const explanation = getMentalStrategy(a, a, "cubes", value);
      return {
        value,
        isValid: true,
        carriesCount: 0,
        borrowsCount: 0,
        explanation,
      };
    }

    case "roots": {
      const sqrtVal = Math.round(Math.sqrt(a));
      if (sqrtVal * sqrtVal !== a) {
        return {
          value: Math.sqrt(a),
          isValid: false,
          carriesCount: 0,
          borrowsCount: 0,
          error: "Non-perfect square root not allowed in integer mode.",
          explanation: `√${a} is not a whole integer.`,
        };
      }
      const explanation = getMentalStrategy(a, sqrtVal, "roots", sqrtVal);
      return {
        value: sqrtVal,
        isValid: true,
        carriesCount: 0,
        borrowsCount: 0,
        explanation,
      };
    }

    case "percentages": {
      const raw = (a * b) / 100;
      if (!Number.isInteger(raw)) {
        return {
          value: raw,
          isValid: false,
          carriesCount: 0,
          borrowsCount: 0,
          error: "Non-integer percentage result.",
          explanation: `${a}% of ${b} is not a whole integer.`,
        };
      }
      const explanation = getMentalStrategy(a, b, "percentages", raw);
      return {
        value: raw,
        isValid: true,
        carriesCount: 0,
        borrowsCount: 0,
        explanation,
      };
    }

    case "mixed": {
      const value = a + b;
      return {
        value,
        isValid: true,
        carriesCount: 0,
        borrowsCount: 0,
        explanation: getMentalStrategy(a, b, "addition", value),
      };
    }

    default:
      return {
        value: NaN,
        isValid: false,
        carriesCount: 0,
        borrowsCount: 0,
        error: `Unsupported operation: ${operation}`,
        explanation: "Unknown operation.",
      };
  }
}
