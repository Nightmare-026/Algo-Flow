import type { CodeLineMapping } from "@/visualizers/registry/types";

function line(
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping {
  return { logicalLine, lines: { javascript, python, cpp, java } };
}

export const arrayAccessCodeLineMappings = {
  access: [line(2, 2, 2, 2, 2), line(4, 5, 4, 5, 5)],
  "access-by-index": [
    line(2, 1, 1, 1, 1),
    line(3, 2, 2, 2, 2),
    line(4, 3, 3, 3, 3),
    line(6, 5, 4, 5, 5),
    line(7, 6, 5, 6, 6),
  ],
  "random-access": [
    line(2, 1, 1, 1, 1),
    line(3, 2, 2, 2, 2),
    line(4, 3, 3, 3, 3),
    line(6, 5, 4, 5, 5),
    line(7, 6, 5, 6, 6),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;

export const arrayTraversalCodeLineMappings = {
  "forward-traversal": [line(2, 2, 2, 2, 2), line(4, 3, 3, 3, 3), line(6, 4, 3, 4, 4)],
  "reverse-traversal": [line(2, 2, 2, 2, 2), line(4, 3, 3, 3, 3), line(6, 4, 3, 4, 4)],
  "range-traversal": [
    line(2, 1, 1, 1, 1),
    line(3, 1, 1, 1, 1),
    line(4, 1, 1, 1, 1),
    line(6, 2, 2, 2, 2),
    line(8, 3, 3, 3, 3),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;

export const arraySearchCodeLineMappings = {
  "linear-search": [
    { logicalLine: 2, lines: { javascript: 1, python: 1, cpp: 1, java: 1 } },
    { logicalLine: 4, lines: { javascript: 2, python: 2, cpp: 2, java: 2 } },
    { logicalLine: 5, lines: { javascript: 3, python: 3, cpp: 3, java: 3 } },
    { logicalLine: 8, lines: { javascript: 5, python: 5, cpp: 5, java: 5 } },
  ],
  "binary-search": [
    { logicalLine: 2, lines: { javascript: 2, python: 2, cpp: 2, java: 2 } },
    { logicalLine: 4, lines: { javascript: 4, python: 4, cpp: 4, java: 4 } },
    { logicalLine: 6, lines: { javascript: 5, python: 5, cpp: 5, java: 5 } },
    { logicalLine: 8, lines: { javascript: 6, python: 6, cpp: 6, java: 6 } },
    { logicalLine: 10, lines: { javascript: 7, python: 7, cpp: 7, java: 7 } },
    { logicalLine: 13, lines: { javascript: 9, python: 8, cpp: 9, java: 9 } },
  ],
  "jump-search": [
    { logicalLine: 2, lines: { javascript: 2, python: 3, cpp: 2, java: 2 } },
    { logicalLine: 4, lines: { javascript: 6, python: 7, cpp: 6, java: 6 } },
    { logicalLine: 7, lines: { javascript: 10, python: 11, cpp: 10, java: 10 } },
    { logicalLine: 8, lines: { javascript: 11, python: 12, cpp: 11, java: 11 } },
    { logicalLine: 10, lines: { javascript: 14, python: 13, cpp: 15, java: 15 } },
    { logicalLine: 13, lines: { javascript: 15, python: 14, cpp: 16, java: 16 } },
  ],
  "interpolation-search": [
    { logicalLine: 2, lines: { javascript: 2, python: 2, cpp: 2, java: 2 } },
    { logicalLine: 6, lines: { javascript: 5, python: 5, cpp: 5, java: 5 } },
    { logicalLine: 7, lines: { javascript: 6, python: 6, cpp: 6, java: 6 } },
    { logicalLine: 9, lines: { javascript: 7, python: 7, cpp: 7, java: 7 } },
    { logicalLine: 10, lines: { javascript: 4, python: 4, cpp: 4, java: 4 } },
    { logicalLine: 11, lines: { javascript: 8, python: 8, cpp: 8, java: 8 } },
    { logicalLine: 14, lines: { javascript: 10, python: 9, cpp: 10, java: 10 } },
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;

export const arraySortCodeLineMappings = {
  "bubble-sort": [
    line(2, 3, 3, 4, 4),
    line(6, 6, 6, 7, 7),
    line(8, 7, 7, 8, 9),
    line(13, 11, 9, 12, 14),
    line(16, 13, 10, 13, 15),
  ],
  "selection-sort": [
    line(2, 2, 2, 3, 3),
    line(4, 3, 3, 4, 4),
    line(6, 4, 4, 5, 5),
    line(7, 5, 5, 6, 6),
    line(10, 7, 8, 8, 8),
    line(12, 7, 8, 8, 8),
    line(14, 9, 9, 10, 11),
  ],
  "insertion-sort": [
    line(2, 2, 2, 3, 3),
    line(4, 3, 3, 4, 4),
    line(6, 5, 5, 6, 6),
    line(8, 6, 6, 7, 7),
    line(10, 9, 8, 10, 10),
    line(14, 11, 9, 11, 11),
  ],
  "merge-sort": [
    line(2, 1, 1, 1, 1),
    line(4, 2, 2, 2, 2),
    line(10, 3, 3, 3, 3),
    line(15, 4, 4, 4, 4),
    line(17, 5, 5, 5, 5),
    line(20, 8, 9, 9, 9),
    line(25, 9, 10, 10, 10),
    line(29, 10, 13, 11, 11),
    line(31, 12, 18, 15, 15),
    line(35, 12, 18, 15, 15),
  ],
  "quick-sort": [
    line(2, 1, 1, 1, 1),
    line(9, 3, 3, 3, 3),
    line(11, 5, 5, 5, 5),
    line(13, 6, 6, 6, 6),
    line(18, 8, 8, 8, 9),
    line(25, 15, 12, 16, 16),
  ],
  "heap-sort": [
    line(2, 10, 9, 10, 10),
    line(4, 12, 11, 12, 12),
    line(12, 6, 6, 6, 6),
    line(13, 7, 7, 7, 7),
    line(18, 14, 13, 14, 14),
    line(20, 15, 14, 15, 15),
    line(23, 16, 14, 16, 16),
    line(25, 16, 14, 16, 16),
  ],
  "counting-sort": [
    line(2, 1, 1, 1, 1),
    line(5, 2, 2, 2, 2),
    line(7, 4, 4, 4, 4),
    line(12, 8, 8, 8, 8),
    line(15, 11, 10, 12, 12),
  ],
  "radix-sort": [
    line(2, 11, 11, 11, 11),
    line(5, 12, 11, 11, 11),
    line(8, 13, 12, 12, 12),
    line(12, 14, 13, 13, 13),
    line(18, 15, 15, 15, 15),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;

export const arrayInsertionCodeLineMappings = {
  "insert-beginning": [
    line(1, 1, 1, 1, 1),
    line(2, 2, 3, 3, 3),
    line(3, 5, 5, 6, 6),
    line(4, 6, 6, 7, 7),
  ],
  "insert-end": [line(1, 1, 1, 1, 1), line(2, 2, 2, 2, 3), line(3, 3, 3, 3, 4)],
  "insert-index": [
    line(1, 1, 1, 1, 1),
    line(2, 2, 3, 3, 5),
    line(3, 5, 5, 6, 4),
    line(4, 6, 6, 7, 6),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;

export const arrayDeletionCodeLineMappings = {
  "delete-beginning": [
    line(1, 2, 2, 2, 2),
    line(2, 3, 4, 3, 3),
    line(3, 4, 5, 4, 4),
    line(4, 8, 8, 8, 7),
  ],
  "delete-end": [line(1, 2, 2, 2, 2), line(2, 3, 4, 3, 3), line(3, 4, 5, 4, 4)],
  "delete-index": [
    line(1, 2, 2, 2, 2),
    line(2, 3, 4, 3, 3),
    line(3, 4, 5, 4, 4),
    line(4, 8, 8, 8, 7),
  ],
  "delete-value": [
    line(1, 2, 2, 2, 2),
    line(2, 4, 4, 4, 4),
    line(3, 5, 5, 5, 5),
    line(4, 9, 8, 9, 9),
    line(5, 10, 10, 10, 10),
    line(6, 11, 11, 11, 11),
    line(7, 14, 12, 14, 14),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;

export const arrayOperationCodeLineMappings = {
  "update-by-index": [
    line(1, 1, 1, 1, 1),
    line(2, 2, 2, 2, 2),
    line(4, 5, 4, 5, 5),
    line(5, 6, 5, 6, 6),
  ],
  "update-by-value": [
    line(1, 1, 1, 1, 1),
    line(3, 3, 3, 3, 3),
    line(4, 4, 4, 4, 4),
    line(7, 8, 6, 8, 8),
  ],
  "merge-sorted-arrays": [
    line(1, 2, 2, 2, 3),
    line(4, 4, 3, 4, 4),
    line(5, 5, 5, 5, 5),
    line(7, 6, 8, 6, 6),
    line(10, 8, 10, 8, 8),
    line(13, 8, 11, 9, 9),
    line(16, 8, 12, 10, 10),
  ],
  "reverse-array": [
    line(1, 2, 2, 2, 2),
    line(4, 3, 3, 3, 3),
    line(5, 4, 4, 4, 4),
    line(8, 7, 5, 6, 7),
  ],
  "left-rotation": [
    line(1, 2, 2, 2, 2),
    line(3, 4, 4, 4, 4),
    line(5, 5, 5, 5, 5),
    line(7, 6, 6, 6, 6),
  ],
  "right-rotation": [
    line(1, 2, 2, 2, 2),
    line(3, 4, 4, 4, 4),
    line(5, 5, 5, 5, 5),
    line(7, 6, 6, 6, 6),
  ],
  "remove-duplicates": [line(1, 2, 2, 2, 2), line(2, 2, 2, 4, 2), line(3, 2, 2, 10, 2)],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
