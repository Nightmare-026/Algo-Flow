import type { CodeLineMapping } from "@/visualizers/registry/types";
const line = (
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping => ({ logicalLine, lines: { javascript, python, cpp, java } });
export const matrixCodeLineMappings = {
  "row-wise-traversal": [line(1, 1, 1, 1, 1), line(3, 3, 3, 4, 4), line(4, 8, 4, 9, 9)],
  "col-wise-traversal": [line(1, 1, 1, 1, 1), line(3, 3, 3, 4, 4), line(4, 8, 6, 9, 9)],
  "spiral-traversal": [line(1, 2, 2, 2, 2), line(3, 6, 5, 6, 6), line(4, 18, 14, 18, 18)],
  "matrix-search": [
    line(1, 1, 1, 1, 1),
    line(3, 4, 3, 5, 5),
    line(4, 5, 3, 6, 6),
    line(6, 9, 5, 10, 10),
  ],
  "row-column-sorted-search": [
    line(1, 2, 2, 2, 2),
    line(3, 4, 4, 4, 4),
    line(4, 5, 5, 5, 5),
    line(6, 8, 8, 9, 9),
  ],
  "transpose-matrix": [line(1, 1, 1, 1, 1), line(4, 5, 4, 5, 5)],
  "rotate-matrix-90": [
    line(1, 1, 1, 1, 1),
    line(3, 4, 3, 4, 5),
    line(4, 7, 5, 7, 10),
    line(6, 11, 8, 10, 16),
  ],
  "matrix-multiplication": [line(1, 2, 2, 2, 2), line(4, 7, 6, 7, 7), line(6, 13, 9, 13, 13)],
  "matrix-addition": [line(1, 1, 1, 1, 1), line(4, 5, 2, 5, 5), line(6, 10, 2, 9, 9)],
  "matrix-subtraction": [line(1, 1, 1, 1, 1), line(4, 5, 2, 5, 5), line(6, 10, 2, 9, 9)],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
