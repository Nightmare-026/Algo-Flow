import type { VisualStep } from "@/types";

type LineMap = Readonly<Record<string, number>>;

const mappings: Readonly<Record<string, LineMap>> = {
  "string-forward-traversal": { 1: 1, 3: 3, 4: 3 },
  "string-reverse-traversal": { 1: 1, 3: 3, 4: 3 },
  "string-palindrome": { 1: 1, 3: 3, 4: 4, 6: 5, 8: 6 },
  "string-naive-search": { 1: 1, 3: 2, 4: 3, 6: 4, 8: 5 },
  "string-kmp-search": { 1: 1, 2: 2, 4: 4, 6: 6, 8: 5, 12: 6 },
  "string-rabin-karp": { 1: 1, 2: 2, 4: 3, 6: 4, 8: 4, 10: 5, 12: 5 },
  "reverse-string": { 1: 1, 3: 3, 4: 4, 6: 5 },
  "string-insert": { 1: 1, 2: 1, 3: 2 },
  "string-delete": { 1: 1, 2: 1, 3: 2 },
  "string-replace": { 1: 1, 2: 1, 3: 2 },
  "string-change-case": { 1: 1, 4: 6 },
};

export function coordinateStringSteps(slug: string, steps: VisualStep[]) {
  const mapping = mappings[slug];
  if (!mapping) return steps;
  return steps.map((step) => {
    if (!step.codeLine) return step;
    const line =
      mapping[`${step.codeLine}:${step.title}`] ??
      mapping[`${step.codeLine}:${step.actionType}`] ??
      mapping[String(step.codeLine)];
    return line ? { ...step, pseudocodeLine: line } : step;
  });
}
