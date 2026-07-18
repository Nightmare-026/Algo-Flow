import type { CodeLineMapping } from "@/visualizers/registry/types";

const line = (
  logicalLine: number,
  javascript: number,
  python: number,
  cpp: number,
  java: number
): CodeLineMapping => ({ logicalLine, lines: { javascript, python, cpp, java } });

export const graphCodeLineMappings = {
  bfs: [
    line(1, 1, 1, 1, 1),
    line(3, 3, 3, 3, 3),
    line(6, 7, 7, 8, 8),
    line(8, 10, 10, 12, 11),
    line(9, 11, 11, 13, 12),
    line(10, 13, 13, 15, 14),
    line(14, 6, 6, 7, 7),
  ],
  dfs: [
    line(1, 1, 1, 1, 1),
    line(3, 3, 3, 4, 4),
    line(6, 6, 6, 7, 7),
    line(7, 8, 8, 10, 9),
    line(8, 10, 10, 12, 11),
    line(11, 13, 13, 15, 14),
    line(14, 5, 5, 6, 6),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
