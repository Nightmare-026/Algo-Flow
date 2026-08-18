import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { getQueueCodeExamples } from "./code-examples";
import { queueCodeLineMappings } from "./code-line-mappings";
import { coordinateQueueSteps } from "./pseudocode-line-mappings";
import { generateQueueEnqueueSteps } from "./enqueue";
import { generateQueueDequeueSteps } from "./dequeue";
import { generateQueueFrontRearSteps, generateQueuePeekSteps } from "./peek";
import { generateSimpleQueueSteps, generateCircularQueueSteps } from "./additional";
import { generateDequePushFrontSteps, generateDequePopRearSteps } from "./deque";
import {
  generatePriorityQueueEnqueueSteps,
  generatePriorityQueueDequeueSteps,
} from "./priority-queue";

const rawQueueRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "simple-queue",
    generateSteps: (data, opts) => generateSimpleQueueSteps(data, opts.capacity!),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["simple-queue"],
  },
  {
    slug: "circular-queue",
    generateSteps: (data, opts) => generateCircularQueueSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["circular-queue"],
  },
  {
    slug: "queue-enqueue",
    generateSteps: (data, opts) => generateQueueEnqueueSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["queue-enqueue"],
  },
  {
    slug: "queue-dequeue",
    generateSteps: (data, opts) => generateQueueDequeueSteps(data, opts.capacity!),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["queue-dequeue"],
  },
  {
    slug: "queue-peek",
    generateSteps: (data, opts) => generateQueuePeekSteps(data, opts.capacity!),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["queue-peek"],
  },
  {
    slug: "queue-front-rear",
    generateSteps: (data, opts) => generateQueueFrontRearSteps(data, opts.capacity!),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["queue-front-rear"],
  },
  {
    slug: "deque-push-front",
    generateSteps: (data, opts) =>
      generateDequePushFrontSteps(data, opts.value ?? 10, opts.capacity ?? 8),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["deque-push-front"],
  },
  {
    slug: "deque-pop-rear",
    generateSteps: (data, opts) => generateDequePopRearSteps(data, opts.capacity ?? 8),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["deque-pop-rear"],
  },
  {
    slug: "priority-queue-enqueue",
    generateSteps: (data, opts) =>
      generatePriorityQueueEnqueueSteps(data, opts.value ?? 25, opts.capacity ?? 8),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["priority-queue-enqueue"],
  },
  {
    slug: "priority-queue-dequeue",
    generateSteps: (data, opts) => generatePriorityQueueDequeueSteps(data, opts.capacity ?? 8),
    getCodeExamples: getQueueCodeExamples,
    codeLineMapping: queueCodeLineMappings["priority-queue-dequeue"],
  },
];

export const queueRegistry: AlgorithmVisualizerDefinition[] = rawQueueRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateQueueSteps(definition.slug, definition.generateSteps(data, options)),
  })
);
