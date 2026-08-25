/**
 * Safely parses and normalizes user input into an integer.
 * Rejects empty input, NaN, Infinity, and non-numeric characters.
 */
export function normalizeUserAnswer(rawInput: string | number | null | undefined): {
  isValid: boolean;
  value: number | null;
  error?: string;
} {
  if (rawInput === null || rawInput === undefined) {
    return { isValid: false, value: null, error: "Answer cannot be empty." };
  }

  if (typeof rawInput === "number") {
    if (!Number.isFinite(rawInput) || !Number.isInteger(rawInput)) {
      return { isValid: false, value: null, error: "Invalid numeric answer." };
    }
    return { isValid: true, value: rawInput };
  }

  const trimmed = rawInput.trim();
  if (trimmed === "") {
    return { isValid: false, value: null, error: "Answer cannot be empty." };
  }

  // Check valid integer regex allowing optional leading minus sign
  if (!/^-?\d+$/.test(trimmed)) {
    return { isValid: false, value: null, error: "Please enter digits only." };
  }

  // Prevent JavaScript integer overflow beyond safe integers
  if (trimmed.replace("-", "").length > 15) {
    return { isValid: false, value: null, error: "Number is too large." };
  }

  const parsed = parseInt(trimmed, 10);
  if (!Number.isSafeInteger(parsed)) {
    return { isValid: false, value: null, error: "Number is out of safe range." };
  }

  return {
    isValid: true,
    value: parsed,
  };
}
