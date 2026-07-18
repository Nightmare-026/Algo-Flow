import type { VisualStep } from "@/types";

type LineMap = Readonly<Record<string, number>>;

const mappings: Readonly<Record<string, LineMap>> = {
  access: { 2: 2, 4: 4 },
  "access-by-index": { 2: 1, 3: 2, 4: 3, 6: 4, 7: 4 },
  "random-access": { 2: 1, 3: 2, 4: 3, 6: 4, 7: 4 },
  "forward-traversal": { 2: 1, 4: 3, 6: 2 },
  "reverse-traversal": { 2: 1, 4: 3, 6: 2 },
  "range-traversal": { 2: 1, 3: 2, 4: 2, 6: 4, 8: 3 },
  "linear-search": { 2: 1, 4: 3, 5: 4, 8: 5 },
  "binary-search": { 2: 2, 4: 4, 6: 5, 8: 6, 10: 7, 13: 8 },
  "jump-search": { 1: 9, 2: 1, 4: 3, 7: 7, 8: 8, 10: 8, 13: 9 },
  "interpolation-search": { 1: 7, 2: 1, 6: 3, 7: 4, 9: 5, 10: 4, 11: 6, 14: 7 },
  "bubble-sort": { 2: 1, 6: 5, 8: 6, 13: 2, 16: 1 },
  "selection-sort": { 2: 1, 4: 2, 6: 4, 7: 5, 10: 6, 12: 2, 14: 1 },
  "insertion-sort": { 2: 1, 4: 3, 6: 5, 8: 6, 10: 8, 14: 1 },
  "merge-sort": { 2: 1, 4: 3, 10: 6, 15: 6, 17: 6, 20: 6, 25: 6, 29: 6, 31: 6, 35: 1 },
  "quick-sort": { 2: 1, 9: 3, 11: 3, 13: 3, 18: 3, 25: 1 },
  "heap-sort": { 2: 1, 4: 1, 12: 4, 13: 4, 18: 3, 20: 2, 23: 2, 25: 1 },
  "counting-sort": { 2: 1, 5: 1, 7: 3, 12: 6, 15: 8 },
  "radix-sort": { 2: 1, 5: 1, 8: 2, 12: 3, 18: 3 },
  "insert-beginning": { 1: 1, 2: 3, 3: 4, 4: 5 },
  "insert-end": { 1: 1, 2: 4, 3: 5 },
  "insert-index": { 1: 1, 2: 3, 3: 4, 4: 5 },
  "delete-beginning": { "1:error": 2, 1: 1, 2: 3, 3: 4, 4: 6 },
  "delete-end": { "1:error": 2, 1: 1, 2: 3, 3: 6 },
  "delete-index": { "1:error": 2, 1: 1, 2: 3, 3: 4, 4: 6 },
  "delete-value": { "1:error": 1, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 4, 7: 5 },
  "update-by-index": { 1: 1, 2: 2, 4: 3, 5: 4 },
  "update-by-value": { 1: 1, 3: 3, 4: 4, 7: 6 },
  "merge-sorted-arrays": { 1: 1, 4: 2, 5: 3, 7: 5, 10: 6, 13: 6, 16: 6 },
  "reverse-array": { 1: 1, 4: 2, 5: 3, 8: 1 },
  "left-rotation": { 1: 1, 3: 1, 5: 3, 7: 4 },
  "right-rotation": { 1: 1, 3: 1, 5: 3, 7: 4 },
  "remove-duplicates": {
    1: 1,
    "2:compare": 4,
    "2:update": 7,
    "2:success": 8,
    3: 9,
  },
};

export function coordinateArraySteps(slug: string, steps: VisualStep[]) {
  const mapping = mappings[slug];
  if (!mapping) return steps;
  return steps.map((step) => {
    if (!step.codeLine) return step;
    const line = mapping[`${step.codeLine}:${step.actionType}`] ?? mapping[String(step.codeLine)];
    return line ? { ...step, pseudocodeLine: line } : step;
  });
}
