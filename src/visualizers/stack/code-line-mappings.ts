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
  "array-stack": [line(1, 2, 3, 5, 7), line(2, 3, 4, 8, 8)],
  "stack-push": [
    line(2, 1, 1, 3, 3),
    line(3, 1, 1, 3, 3),
    line(4, 1, 1, 3, 3),
    line(5, 1, 1, 4, 4),
    line(6, 1, 1, 4, 4),
  ],
  "stack-pop": [
    line(2, 1, 1, 3, 3),
    line(3, 1, 1, 3, 3),
    line(4, 1, 1, 3, 3),
    line(5, 1, 1, 3, 3),
    line(6, 1, 1, 4, 3),
    line(7, 1, 1, 4, 3),
  ],
  "stack-peek": oneLineOperation([1, 2, 3, 4]),
  "stack-is-empty": oneLineOperation([1, 2]),
  "stack-is-full": oneLineOperation([1, 2]),
  "stack-size": oneLineOperation([1, 2]),
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
