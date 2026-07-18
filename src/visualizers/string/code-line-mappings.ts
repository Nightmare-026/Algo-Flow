import type { CodeLineMapping } from "@/visualizers/registry/types";
const line = (
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping => ({ logicalLine, lines: { javascript, python, cpp, java } });
export const stringCodeLineMappings = {
  "string-forward-traversal": [line(1, 1, 1, 1, 1), line(3, 2, 2, 2, 2), line(4, 5, 3, 5, 5)],
  "string-reverse-traversal": [line(1, 1, 1, 1, 1), line(3, 2, 2, 2, 2), line(4, 5, 3, 5, 5)],
  "string-palindrome": [
    line(1, 2, 2, 2, 2),
    line(3, 3, 3, 3, 3),
    line(4, 4, 4, 4, 4),
    line(6, 5, 5, 5, 5),
    line(8, 7, 7, 7, 7),
  ],
  "string-naive-search": [
    line(1, 1, 1, 1, 1),
    line(3, 3, 3, 3, 3),
    line(4, 4, 4, 4, 4),
    line(6, 6, 5, 6, 6),
    line(8, 11, 7, 10, 10),
  ],
  "string-kmp-search": [
    line(1, 10, 11, 10, 10),
    line(2, 11, 12, 11, 11),
    line(4, 14, 15, 14, 14),
    line(6, 17, 18, 17, 17),
    line(8, 20, 22, 20, 20),
    line(12, 28, 31, 28, 28),
  ],
  "string-rabin-karp": [
    line(1, 2, 2, 2, 2),
    line(2, 5, 5, 5, 5),
    line(4, 8, 7, 8, 8),
    line(6, 11, 9, 11, 11),
    line(8, 14, 11, 14, 14),
    line(10, 18, 13, 19, 19),
    line(12, 22, 16, 23, 23),
  ],
  "reverse-string": [
    line(1, 2, 2, 2, 2),
    line(3, 3, 3, 3, 3),
    line(4, 4, 4, 4, 5),
    line(6, 8, 7, 7, 10),
  ],
  "string-insert": [line(1, 1, 1, 1, 1), line(2, 1, 1, 1, 1), line(3, 2, 2, 3, 2)],
  "string-delete": [line(1, 1, 1, 1, 1), line(2, 1, 1, 1, 1), line(3, 2, 2, 3, 2)],
  "string-replace": [line(1, 1, 1, 1, 1), line(2, 1, 1, 1, 1), line(3, 2, 2, 3, 3)],
  "string-change-case": [line(1, 1, 1, 1, 1), line(3, 2, 2, 4, 5), line(4, 3, 2, 6, 8)],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
