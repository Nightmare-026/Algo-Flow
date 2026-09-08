import type { CodeLineMapping } from "@/visualizers/registry/types";

const line = (
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping => ({
  logicalLine,
  lines: { javascript, python, cpp, java },
});

const oneLineOperation = (logicalLines: number[]) =>
  logicalLines.map((logicalLine) => line(logicalLine, 1, 1, 3, 3));

export const stackCodeLineMappings = {
  "array-stack": [
    line(1, 1, 1, 1, 1),
    line(2, 2, 3, 5, 5),
    line(3, 3, 4, 6, 6),
    line(4, 4, 6, 11, 11),
  ],
  "stack-push": [
    line(1, 1, 1, 3, 3),
    line(2, 1, 1, 3, 3),
    line(3, 1, 1, 4, 4),
    line(4, 1, 1, 4, 4),
    line(5, 1, 1, 4, 4),
  ],
  "stack-pop": [
    line(1, 1, 1, 3, 3),
    line(2, 1, 1, 3, 3),
    line(3, 1, 1, 3, 3),
    line(4, 1, 1, 4, 3),
    line(5, 1, 1, 4, 3),
  ],
  "stack-peek": oneLineOperation([1, 2, 3, 4]),
  "stack-is-empty": oneLineOperation([1, 2]),
  "stack-is-full": oneLineOperation([1, 2]),
  "stack-size": oneLineOperation([1, 2]),
  "balanced-parentheses": [
    line(1, 1, 1, 1, 1),
    line(2, 3, 5, 3, 3),
    line(3, 4, 6, 5, 5),
    line(4, 4, 6, 6, 6),
    line(5, 6, 8, 9, 9),
  ],
  "infix-to-postfix": [
    line(1, 1, 1, 1, 1),
    line(2, 4, 5, 4, 4),
    line(3, 5, 6, 5, 5),
    line(4, 6, 7, 6, 6),
    line(5, 9, 12, 9, 9),
    line(6, 10, 13, 12, 12),
  ],
  "postfix-evaluation": [
    line(1, 1, 1, 1, 1),
    line(2, 3, 4, 3, 3),
    line(3, 5, 7, 5, 5),
    line(4, 11, 11, 11, 11),
  ],
  "min-stack": [
    line(1, 1, 1, 1, 1),
    line(2, 3, 4, 4, 4),
    line(3, 8, 9, 9, 9),
    line(4, 10, 12, 11, 11),
  ],
  "next-greater-element": [
    line(1, 1, 1, 1, 1),
    line(2, 3, 4, 3, 3),
    line(3, 4, 5, 5, 5),
    line(4, 6, 6, 7, 7),
    line(5, 8, 7, 9, 9),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
