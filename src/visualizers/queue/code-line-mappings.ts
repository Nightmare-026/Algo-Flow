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
  logicalLines.map((logicalLine) => line(logicalLine, 1, 1, 3, 4));

export const queueCodeLineMappings = {
  "simple-queue": [line(1, 2, 3, 8, 9), line(2, 3, 4, 16, 16)],
  "circular-queue": [line(1, 2, 2, 7, 8), line(3, 13, 12, 19, 20), line(5, 6, 6, 12, 13)],
  "queue-enqueue": [
    line(2, 1, 1, 3, 4),
    line(3, 1, 1, 3, 4),
    line(4, 1, 1, 3, 4),
    line(5, 1, 1, 4, 5),
    line(6, 1, 1, 4, 5),
  ],
  "queue-dequeue": [
    line(2, 1, 1, 3, 4),
    line(3, 1, 1, 3, 4),
    line(4, 1, 1, 3, 4),
    line(5, 1, 1, 3, 4),
    line(6, 1, 1, 4, 4),
    line(7, 1, 1, 4, 4),
  ],
  "queue-peek": oneLineOperation([1, 2, 3, 4]),
  "queue-front-rear": [
    line(1, 1, 1, 3, 4),
    line(2, 1, 1, 3, 4),
    line(3, 2, 2, 4, 5),
    line(4, 2, 2, 4, 5),
  ],
  "deque-push-front": oneLineOperation([1, 2, 3, 4]),
  "deque-pop-rear": oneLineOperation([1, 2, 3, 4, 5]),
  "priority-queue-enqueue": oneLineOperation([1, 2, 3, 4, 5]),
  "priority-queue-dequeue": oneLineOperation([1, 2, 3, 4, 5]),
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
