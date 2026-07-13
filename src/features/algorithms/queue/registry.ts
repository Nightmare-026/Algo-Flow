import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getQueueCodeExamples } from "./code-examples";
import { generateQueueEnqueueSteps } from "./enqueue";
import { generateQueueDequeueSteps } from "./dequeue";
import { generateQueueFrontRearSteps, generateQueuePeekSteps } from "./peek";
import { generateSimpleQueueSteps, generateCircularQueueSteps } from "./additional";

export const queueRegistry: AlgorithmVisualizerDefinition[] = [
  { slug: "simple-queue", generateSteps: (data, opts) => generateSimpleQueueSteps(data, opts.capacity!), getCodeExamples: getQueueCodeExamples },
  { slug: "circular-queue", generateSteps: (data, opts) => generateCircularQueueSteps(data, opts.value!, opts.capacity!), getCodeExamples: getQueueCodeExamples },
  { slug: "queue-enqueue", generateSteps: (data, opts) => generateQueueEnqueueSteps(data, opts.value!, opts.capacity!), getCodeExamples: getQueueCodeExamples },
  { slug: "queue-dequeue", generateSteps: (data, opts) => generateQueueDequeueSteps(data, opts.capacity!), getCodeExamples: getQueueCodeExamples },
  { slug: "queue-peek", generateSteps: (data, opts) => generateQueuePeekSteps(data, opts.capacity!), getCodeExamples: getQueueCodeExamples },
  { slug: "queue-front-rear", generateSteps: (data, opts) => generateQueueFrontRearSteps(data, opts.capacity!), getCodeExamples: getQueueCodeExamples },
];
