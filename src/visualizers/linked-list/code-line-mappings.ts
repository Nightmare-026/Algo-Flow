import type { CodeLineMapping } from "@/visualizers/registry/types";

const line = (
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping => ({ logicalLine, lines: { javascript, python, cpp, java } });

export const linkedListCodeLineMappings = {
  "linked-list-types": [line(1, 2, 2, 2, 2), line(2, 7, 8, 8, 8), line(3, 13, 15, 15, 15)],
  "sll-traversal": [
    line(2, 2, 2, 3, 3),
    line(4, 3, 3, 4, 4),
    line(5, 4, 4, 5, 5),
    line(6, 6, 5, 6, 6),
  ],
  "sll-search": [
    line(2, 2, 2, 3, 3),
    line(4, 3, 3, 4, 4),
    line(5, 4, 4, 5, 5),
    line(6, 5, 5, 6, 6),
    line(8, 7, 7, 7, 7),
  ],
  "sll-insert-head": [
    line(2, 1, 1, 1, 1),
    line(3, 2, 2, 2, 2),
    line(4, 2, 2, 3, 3),
    line(5, 2, 2, 4, 4),
    line(6, 3, 2, 5, 5),
  ],
  "sll-insert-tail": [
    line(2, 1, 1, 1, 1),
    line(3, 2, 2, 2, 2),
    line(5, 4, 4, 4, 4),
    line(6, 5, 6, 5, 5),
    line(7, 7, 8, 7, 7),
  ],
  "sll-insert-position": [
    line(1, 1, 1, 1, 1),
    line(2, 2, 2, 2, 2),
    line(4, 4, 4, 4, 4),
    line(5, 6, 6, 6, 6),
    line(7, 10, 9, 10, 10),
    line(8, 13, 12, 13, 13),
  ],
  "sll-delete": [
    line(2, 1, 1, 1, 1),
    line(7, 2, 2, 2, 2),
    line(8, 3, 3, 3, 3),
    line(9, 4, 4, 4, 4),
    line(10, 5, 6, 5, 5),
    line(11, 6, 8, 6, 6),
    line(13, 8, 10, 8, 8),
  ],
  "sll-delete-head": [
    line(1, 1, 1, 1, 1),
    line(2, 2, 2, 2, 2),
    line(4, 3, 3, 5, 3),
    line(5, 4, 3, 7, 4),
  ],
  "sll-reverse": [
    line(1, 2, 2, 2, 2),
    line(4, 4, 4, 4, 4),
    line(5, 5, 5, 5, 5),
    line(7, 9, 7, 10, 9),
  ],
  "sll-detect-cycle": [
    line(1, 2, 2, 2, 2),
    line(4, 4, 4, 4, 4),
    line(5, 5, 5, 5, 5),
    line(7, 8, 7, 8, 8),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
