export interface ParseNumberListResult {
  values: number[];
  error: string | null;
}

export interface VisualizerInputOptions {
  index: number;
  target: number;
  value: number;
  capacity: number;
  rows: number;
  cols: number;
  text: string;
  pattern: string;
}

export const defaultVisualizerInputOptions: VisualizerInputOptions = {
  index: 0,
  target: 23,
  value: 50,
  capacity: 8,
  rows: 4,
  cols: 4,
  text: "ALGOFLOW",
  pattern: "FLOW",
};

export function parseNumberList(input: string, maxLength: number = 20): ParseNumberListResult {
  const rawValues = input.split(",").map((item) => item.trim());

  if (rawValues.length === 0 || rawValues.every((item) => item.length === 0)) {
    return { values: [], error: "Enter at least one number." };
  }

  const invalid = rawValues.find((item) => item.length === 0 || !Number.isFinite(Number(item)));
  if (invalid !== undefined) {
    return { values: [], error: `"${invalid}" is not a valid number.` };
  }

  const values = rawValues.map((item) => Number(item));
  if (values.length > maxLength) {
    return { values: [], error: `Use ${maxLength} values or fewer for a clear visualization.` };
  }

  if (values.some((value) => !Number.isInteger(value))) {
    return { values: [], error: "Use whole numbers only." };
  }

  return { values, error: null };
}

export function validateIndex(index: number, length: number, allowEnd: boolean = false): string | null {
  const max = allowEnd ? length : length - 1;
  if (!Number.isInteger(index)) return "Index must be a whole number.";
  if (index < 0 || index > max) return `Index must be between 0 and ${Math.max(0, max)}.`;
  return null;
}

export function validateCapacity(capacity: number, length: number): string | null {
  if (!Number.isInteger(capacity)) return "Capacity must be a whole number.";
  if (capacity < 1) return "Capacity must be at least 1.";
  if (capacity > 20) return "Capacity must be 20 or less for a clear visualization.";
  if (capacity < length) return "Capacity cannot be smaller than the current data size.";
  return null;
}

export function clampOperationOptions(options: VisualizerInputOptions, length: number): VisualizerInputOptions {
  return {
    index: Math.min(Math.max(0, options.index), Math.max(0, length - 1)),
    target: options.target,
    value: options.value,
    capacity: Math.min(Math.max(length, options.capacity), 20),
    rows: Math.min(Math.max(1, options.rows), 10),
    cols: Math.min(Math.max(1, options.cols), 10),
    text: options.text || "ALGOFLOW",
    pattern: options.pattern || "",
  };
}
