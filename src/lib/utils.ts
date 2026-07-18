/* ================================================================
   ALGO FLOW — Utility Functions
   ================================================================ */

import { type ClassValue, clsx } from "clsx";

/**
 * Combine class names with conditional logic.
 * Uses clsx for conditional classes (no twMerge needed with Tailwind v4).
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Generate a unique ID for visual steps and elements.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Delay execution for a given number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random array of integers.
 */
export function generateRandomArray(size: number, min: number = 1, max: number = 99): number[] {
  return Array.from({ length: size }, () => randomInt(min, max));
}

/**
 * Generate a sorted array.
 */
export function generateSortedArray(size: number, min: number = 1, max: number = 99): number[] {
  return generateRandomArray(size, min, max).sort((a, b) => a - b);
}

/**
 * Generate a reverse-sorted array.
 */
export function generateReverseSortedArray(
  size: number,
  min: number = 1,
  max: number = 99
): number[] {
  return generateRandomArray(size, min, max).sort((a, b) => b - a);
}

/**
 * Generate a nearly sorted array (few elements out of place).
 */
export function generateNearlySortedArray(
  size: number,
  swaps: number = 2,
  min: number = 1,
  max: number = 99
): number[] {
  const arr = generateSortedArray(size, min, max);
  for (let i = 0; i < swaps && size > 1; i++) {
    const idx1 = randomInt(0, size - 1);
    const idx2 = randomInt(0, size - 1);
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }
  return arr;
}

/**
 * Swap two elements in an array (returns new array).
 */
export function swapElements<T>(arr: T[], i: number, j: number): T[] {
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

/**
 * Format time complexity for display.
 */
export function formatComplexity(complexity: string): string {
  return complexity
    .replace(/O\((.*)\)/, "O($1)")
    .replace(/n\^2/, "n²")
    .replace(/n\^3/, "n³")
    .replace(/log n/, "log n")
    .replace(/n log n/, "n log n");
}

/**
 * Format seconds into readable time.
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

/**
 * Debounce function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Slugify a string for URL use.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
