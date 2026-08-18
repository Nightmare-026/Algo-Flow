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
  dijkstra: [
    line(1, 4, 3, 4, 4),
    line(3, 8, 8, 8, 9),
    line(5, 11, 10, 11, 13),
    line(7, 12, 12, 13, 15),
    line(9, 15, 14, 17, 18),
  ],
  "bellman-ford": [
    line(1, 3, 3, 3, 3),
    line(2, 4, 4, 4, 4),
    line(4, 6, 6, 7, 7),
    line(5, 7, 7, 8, 8),
    line(7, 8, 7, 10, 10),
  ],
  kruskal: [
    line(1, 2, 2, 2, 2),
    line(3, 7, 8, 7, 6),
    line(4, 8, 9, 8, 7),
    line(5, 8, 10, 8, 7),
    line(7, 10, 12, 10, 9),
  ],
  prim: [
    line(1, 4, 4, 4, 4),
    line(3, 7, 8, 7, 7),
    line(5, 10, 10, 10, 10),
    line(7, 13, 13, 13, 13),
  ],
  "topological-sort": [
    line(1, 3, 3, 3, 3),
    line(3, 5, 5, 5, 5),
    line(5, 8, 8, 9, 9),
    line(7, 10, 11, 11, 11),
    line(8, 10, 12, 11, 12),
    line(10, 12, 13, 13, 13),
  ],
  "detect-cycle-graph": [
    line(1, 2, 2, 2, 2),
    line(3, 4, 4, 4, 4),
    line(4, 7, 7, 8, 8),
    line(5, 6, 6, 7, 7),
    line(7, 9, 9, 10, 10),
    line(9, 12, 12, 13, 13),
  ],
  "connected-components": [
    line(1, 3, 3, 3, 3),
    line(3, 5, 5, 5, 5),
    line(5, 9, 9, 9, 9),
    line(7, 11, 11, 11, 11),
    line(8, 13, 13, 13, 13),
    line(10, 15, 14, 15, 15),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
