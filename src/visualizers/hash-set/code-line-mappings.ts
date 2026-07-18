import type { CodeLineMapping } from "@/visualizers/registry/types";
const line = (
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping => ({ logicalLine, lines: { javascript, python, cpp, java } });

export const hashSetCodeLineMappings = {
  "hash-set-insert": [
    line(1, 12, 1, 4, 1),
    line(2, 13, 2, 5, 2),
    line(4, 14, 4, 8, 5),
    line(5, 18, 8, 15, 9),
    line(7, 17, 7, 14, 8),
    line(8, 19, 10, 17, 11),
    line(10, 22, 14, 21, 15),
  ],
  "hash-set-search": [
    line(1, 1, 1, 4, 1),
    line(2, 2, 4, 7, 4),
    line(4, 5, 7, 13, 7),
    line(5, 6, 8, 14, 8),
    line(7, 7, 10, 15, 9),
    line(10, 10, 14, 19, 13),
  ],
  "hash-set-delete": [
    line(1, 1, 1, 4, 1),
    line(2, 2, 4, 8, 5),
    line(4, 5, 7, 14, 8),
    line(5, 7, 8, 16, 10),
    line(7, 11, 10, 19, 13),
    line(10, 14, 14, 23, 17),
  ],
  "set-union": [line(1, 2, 1, 3, 1), line(3, 4, 2, 8, 3)],
  "set-intersection": [line(1, 2, 1, 3, 1), line(3, 5, 2, 10, 3)],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
