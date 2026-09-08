import type { VisualStep } from "@/types";

type LineMap = Readonly<Record<string, number>>;

const mappings: Readonly<Record<string, LineMap>> = {
  "inorder-traversal": { 1: 1, 2: 2, 3: 3, 5: 4, 6: 5, 8: 6 },
  "preorder-traversal": { 1: 1, 2: 3, 8: 6 },
  "postorder-traversal": { 1: 1, 2: 2, 6: 5, 8: 6 },
  "level-order-traversal": { 1: 1, 4: 5, 8: 9 },
  "bst-search": { 1: 1, 3: 2, 4: 3, 6: 4, 8: 5, 11: 6 },
  "bst-insertion": { 1: 1, 4: 4, 6: 6, 8: 7, 11: 9, 13: 10 },
  "heap-insert": { 1: 1, 2: 2, 4: 3, 5: 4, 6: 5 },
  "trie-insert-word": { 3: 4, 5: 6 },
  "build-segment-tree": { 1: 1, 4: 4 },
};

export function coordinateTreeSteps(slug: string, steps: VisualStep[]) {
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
