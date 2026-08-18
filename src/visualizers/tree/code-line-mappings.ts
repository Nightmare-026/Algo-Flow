import type { CodeLineMapping } from "@/visualizers/registry/types";

const line = (
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping => ({ logicalLine, lines: { javascript, python, cpp, java } });

export const treeCodeLineMappings = {
  "inorder-traversal": [
    line(1, 1, 1, 1, 1),
    line(2, 2, 2, 2, 2),
    line(3, 3, 3, 3, 3),
    line(5, 4, 3, 4, 4),
    line(6, 5, 4, 5, 5),
    line(8, 7, 5, 7, 7),
  ],
  "preorder-traversal": [line(1, 1, 1, 1, 1), line(2, 2, 2, 2, 2), line(8, 7, 5, 7, 7)],
  "postorder-traversal": [
    line(1, 1, 1, 1, 1),
    line(2, 2, 2, 2, 2),
    line(6, 5, 4, 5, 5),
    line(8, 7, 5, 7, 7),
  ],
  "level-order-traversal": [line(1, 2, 2, 2, 2), line(4, 5, 4, 5, 5), line(8, 9, 7, 10, 10)],
  "bst-insertion": [
    line(1, 1, 1, 1, 1),
    line(4, 4, 4, 4, 4),
    line(11, 10, 11, 10, 10),
    line(13, 13, 14, 13, 13),
  ],
  "bst-search": [
    line(1, 1, 1, 1, 1),
    line(3, 3, 3, 3, 3),
    line(4, 4, 4, 4, 4),
    line(6, 5, 5, 5, 5),
    line(8, 6, 5, 6, 6),
    line(11, 8, 6, 8, 8),
  ],
  "heap-insert": [
    line(1, 2, 2, 2, 2),
    line(2, 3, 3, 3, 3),
    line(4, 5, 5, 5, 5),
    line(5, 6, 6, 6, 6),
    line(6, 9, 7, 9, 11),
  ],
  "trie-insert-word": [line(3, 4, 4, 4, 4), line(5, 7, 6, 7, 7)],
  "build-segment-tree": [line(1, 2, 2, 2, 2), line(4, 6, 5, 6, 6)],
  "bst-deletion": [
    line(1, 1, 1, 1, 1),
    line(2, 2, 2, 2, 2),
    line(3, 3, 3, 3, 3),
    line(4, 3, 3, 3, 3),
    line(5, 4, 4, 4, 4),
    line(6, 6, 6, 6, 6),
    line(7, 7, 7, 7, 7),
    line(8, 8, 8, 8, 8),
    line(10, 10, 10, 10, 10),
    line(11, 11, 11, 11, 11),
    line(13, 12, 12, 12, 12),
  ],
  "avl-rotations": [
    line(1, 1, 1, 1, 1),
    line(3, 2, 2, 2, 2),
    line(5, 4, 4, 4, 4),
    line(7, 6, 6, 6, 6),
  ],
  "heap-extract-max": [
    line(1, 2, 2, 2, 2),
    line(2, 4, 4, 4, 4),
    line(4, 4, 4, 4, 4),
    line(6, 8, 8, 8, 8),
    line(8, 11, 11, 11, 11),
    line(10, 13, 13, 13, 13),
  ],
  heapify: [
    line(1, 2, 2, 2, 2),
    line(3, 7, 6, 7, 7),
    line(5, 10, 8, 10, 10),
    line(7, 12, 10, 10, 10),
    line(9, 3, 2, 11, 11),
  ],
  "trie-search": [line(1, 1, 1, 1, 1), line(3, 4, 4, 4, 4), line(5, 6, 6, 6, 6)],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
