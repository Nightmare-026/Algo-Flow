import type { CodeLineMapping } from "@/visualizers/registry/types";
const line = (
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping => ({ logicalLine, lines: { javascript, python, cpp, java } });
export const matrixCodeLineMappings = {
  "row-wise-traversal": [line(1, 1, 1, 1, 1), line(3, 3, 3, 4, 4), line(4, 4, 4, 5, 5)],
  "col-wise-traversal": [line(1, 1, 1, 1, 1), line(3, 3, 3, 4, 4), line(4, 4, 4, 5, 5)],
  "spiral-traversal": [line(1, 2, 2, 2, 2), line(3, 6, 5, 6, 6), line(4, 17, 13, 17, 17)],
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
    line(3, 4, 3, 4, 4),
    line(4, 5, 5, 5, 6),
    line(6, 11, 8, 9, 11),
  ],
  "matrix-multiplication": [line(1, 1, 1, 1, 1), line(4, 9, 8, 9, 9), line(6, 13, 9, 13, 13)],
  "matrix-addition": [line(1, 1, 1, 1, 1), line(4, 7, 6, 6, 6), line(6, 10, 7, 9, 9)],
  "matrix-subtraction": [line(1, 1, 1, 1, 1), line(4, 7, 6, 6, 6), line(6, 10, 7, 9, 9)],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
