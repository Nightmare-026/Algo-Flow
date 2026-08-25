import { MathOperation, QuestionSignature } from "./types";

/**
 * Normalizes an expression into its unique canonical problem signature.
 * Commutative operations (+, ×) normalize operands into sorted ascending order,
 * ensuring 24 + 37 and 37 + 24 produce the exact same signature.
 * Non-commutative operations (-, ÷) preserve the operand sequence.
 */
export function getCanonicalSignature(
  operands: number[],
  operation: MathOperation
): QuestionSignature {
  const isCommutative = operation === "addition" || operation === "multiplication";
  const normalizedOperands = isCommutative ? [...operands].sort((a, b) => a - b) : [...operands];

  const canonicalId = `${operation}:${normalizedOperands.join(":")}`;

  return {
    canonicalId,
    operation,
    operandsNormalized: normalizedOperands,
  };
}

/**
 * SessionUniquenessTracker enforces:
 * 1. No exact equivalent problem repeats within the same session.
 * 2. Each individual number (operand) appears at most `maxOperandReuse` times (default: 3).
 */
export class SessionUniquenessTracker {
  private signatureSet: Set<string>;
  private numberUsageMap: Map<number, number>;
  private maxOperandReuse: number;

  constructor(maxOperandReuse: number = 3) {
    this.signatureSet = new Set();
    this.numberUsageMap = new Map();
    this.maxOperandReuse = maxOperandReuse;
  }

  /**
   * Checks if a candidate question satisfies uniqueness and reuse limit constraints.
   */
  public canAccept(operands: number[], operation: MathOperation): boolean {
    const signature = getCanonicalSignature(operands, operation);

    // 1. Signature uniqueness check
    if (this.signatureSet.has(signature.canonicalId)) {
      return false;
    }

    // 2. Operand reuse limit check
    // Count occurrences within the current candidate expression
    const candidateCounts = new Map<number, number>();
    for (const num of operands) {
      candidateCounts.set(num, (candidateCounts.get(num) ?? 0) + 1);
    }

    for (const [num, count] of candidateCounts.entries()) {
      const currentUsage = this.numberUsageMap.get(num) ?? 0;
      if (currentUsage + count > this.maxOperandReuse) {
        return false;
      }
    }

    return true;
  }

  /**
   * Registers an accepted question signature and increments operand counts.
   */
  public register(operands: number[], operation: MathOperation): QuestionSignature {
    const signature = getCanonicalSignature(operands, operation);
    this.signatureSet.add(signature.canonicalId);

    for (const num of operands) {
      const currentUsage = this.numberUsageMap.get(num) ?? 0;
      this.numberUsageMap.set(num, currentUsage + 1);
    }

    return signature;
  }

  /**
   * Returns current count of registered questions.
   */
  public get registeredCount(): number {
    return this.signatureSet.size;
  }

  /**
   * Gets usage count of a specific number.
   */
  public getNumberUsage(num: number): number {
    return this.numberUsageMap.get(num) ?? 0;
  }

  /**
   * Resets the tracker for a new session.
   */
  public reset(): void {
    this.signatureSet.clear();
    this.numberUsageMap.clear();
  }
}
