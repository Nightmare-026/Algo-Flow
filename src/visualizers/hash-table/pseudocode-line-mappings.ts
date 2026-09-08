import type { VisualStep } from "@/types";

type LineMap = Readonly<Record<string, number>>;

const probingInsert: LineMap = { 1: 1, 2: 1, 4: 1, 5: 2, 7: 2, 8: 3, 10: 4 };
const probingSearch: LineMap = { 1: 1, 2: 1, 4: 2, 5: 3, 7: 4, 10: 5 };
const probingDelete: LineMap = { 1: 1, 2: 1, 4: 2, 6: 4, 8: 6, 11: 6 };

const mappings: Readonly<Record<string, LineMap>> = {
  "division-hash-method": { 2: 1 },
  "hash-insert": probingInsert,
  "linear-probing": probingInsert,
  "probing-insert": probingInsert,
  "hash-search": probingSearch,
  "probing-search": probingSearch,
  "hash-delete": probingDelete,
  "probing-delete": probingDelete,
  rehashing: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 },
  "chaining-insert": { 1: 1, 2: 1, 4: 2, 5: 2, 8: 2 },
  "chaining-search": { 1: 1, 2: 1, 4: 4, 6: 2, 7: 3, 10: 4 },
  "chaining-delete": { 1: 1, 2: 1, 4: 2, 6: 2, 8: 2, 9: 2, 11: 2 },
};

export function coordinateHashTableSteps(slug: string, steps: VisualStep[]) {
  const mapping = mappings[slug];
  if (!mapping) return steps;
  return steps.map((step) => {
    if (step.codeLine == null) return step;
    const line =
      mapping[`${step.codeLine}:${step.title}`] ??
      mapping[`${step.codeLine}:${step.actionType}`] ??
      mapping[String(step.codeLine)];
    return line ? { ...step, pseudocodeLine: line } : step;
  });
}
