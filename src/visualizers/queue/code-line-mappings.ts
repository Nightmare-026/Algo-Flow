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

export const queueCodeLineMappings = {
  "simple-queue": [line(1, 2, 3, 8, 9), line(2, 3, 4, 16, 16)],
  "circular-queue": [line(1, 2, 2, 7, 8), line(3, 13, 12, 19, 20), line(5, 6, 6, 12, 13)],
  "queue-enqueue": [
    line(2, 2, 2, 3, 4),
    line(3, 3, 3, 4, 5),
    line(4, 4, 4, 5, 6),
    line(5, 6, 5, 7, 8),
    line(6, 7, 6, 8, 9),
  ],
  "queue-dequeue": [
    line(2, 2, 2, 3, 4),
    line(3, 3, 3, 4, 5),
    line(4, 4, 4, 5, 6),
    line(5, 6, 5, 7, 8),
    line(6, 7, 6, 8, 9),
    line(7, 8, 7, 9, 10),
  ],
  "queue-peek": [
    line(1, 1, 1, 3, 4),
    line(2, 2, 2, 4, 5),
    line(3, 5, 4, 7, 8),
    line(4, 5, 4, 7, 8),
  ],
  "queue-front-rear": [
    line(1, 1, 1, 3, 4),
    line(2, 2, 2, 4, 5),
    line(3, 3, 3, 5, 6),
    line(4, 5, 5, 5, 6),
  ],
  "deque-push-front": [
    line(1, 1, 1, 3, 4),
    line(2, 2, 2, 4, 5),
    line(3, 3, 3, 5, 6),
    line(4, 4, 4, 6, 7),
  ],
  "deque-pop-rear": [
    line(1, 1, 1, 3, 4),
    line(2, 2, 2, 4, 5),
    line(3, 3, 3, 5, 6),
    line(4, 4, 4, 6, 7),
    line(5, 5, 5, 7, 8),
  ],
  "priority-queue-enqueue": [
    line(1, 1, 1, 3, 4),
    line(2, 2, 2, 4, 5),
    line(3, 3, 3, 5, 6),
    line(4, 3, 3, 5, 6),
    line(5, 5, 5, 6, 7),
  ],
  "priority-queue-dequeue": [
    line(1, 1, 1, 3, 4),
    line(2, 2, 2, 4, 5),
    line(3, 3, 3, 5, 6),
    line(4, 4, 4, 6, 7),
    line(5, 5, 5, 7, 8),
  ],
} as const satisfies Record<string, ReadonlyArray<CodeLineMapping>>;
