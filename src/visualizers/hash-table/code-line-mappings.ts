import type { CodeLineMapping } from "@/visualizers/registry/types";
const line = (
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping => ({ logicalLine, lines: { javascript, python, cpp, java } });

const probingInsert = [
  line(1, 12, 10, 17, 17),
  line(4, 14, 12, 18, 19),
  line(7, 15, 13, 19, 20),
  line(8, 17, 15, 21, 22),
  line(10, 19, 16, 23, 24),
];
const probingSearch = [
  line(1, 24, 20, 29, 30),
  line(2, 25, 21, 30, 31),
  line(4, 26, 22, 31, 32),
  line(5, 27, 23, 32, 33),
  line(7, 28, 24, 33, 34),
];
const probingDelete = [
  line(1, 36, 29, 40, 41),
  line(2, 37, 30, 41, 42),
  line(4, 38, 31, 42, 43),
  line(6, 39, 32, 43, 44),
  line(8, 40, 33, 44, 45),
];

export const hashTableCodeLineMappings = {
  "division-hash-method": [line(2, 2, 2, 2, 2)],
  "hash-insert": probingInsert,
  "linear-probing": probingInsert,
  "probing-insert": probingInsert,
  "hash-search": probingSearch,
  "probing-search": probingSearch,
  "hash-delete": probingDelete,
  "probing-delete": probingDelete,
  rehashing: [line(1, 2, 2, 2, 2), line(2, 3, 3, 3, 3), line(4, 7, 7, 8, 8)],
  "chaining-insert": [
    line(1, 11, 9, 15, 18),
    line(2, 12, 10, 16, 19),
    line(4, 14, 12, 18, 21),
    line(8, 15, 13, 19, 22),
  ],
  "chaining-search": [
    line(1, 19, 15, 23, 26),
    line(2, 20, 16, 24, 27),
    line(6, 21, 17, 25, 28),
    line(7, 22, 18, 26, 28),
  ],
  "chaining-delete": [
    line(1, 25, 21, 29, 31),
    line(2, 26, 22, 30, 32),
    line(6, 27, 23, 31, 33),
    line(8, 29, 24, 32, 34),
    line(9, 30, 24, 32, 34),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
