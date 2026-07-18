import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { getQueueCodeExamples } from "./code-examples";
import { queueCodeLineMappings } from "./code-line-mappings";
import { coordinateQueueSteps } from "./pseudocode-line-mappings";
import { generateQueueEnqueueSteps } from "./enqueue";
import { generateQueueDequeueSteps } from "./dequeue";
import { generateQueueFrontRearSteps, generateQueuePeekSteps } from "./peek";
import { generateSimpleQueueSteps, generateCircularQueueSteps } from "./additional";

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
];

export const queueRegistry: AlgorithmVisualizerDefinition[] = rawQueueRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateQueueSteps(definition.slug, definition.generateSteps(data, options)),
  })
);
