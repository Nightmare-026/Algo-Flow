import type { VisualStep } from "@/types";
import {
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { stackCodeLineMappings } from "@/visualizers/stack/code-line-mappings";
import { queueCodeLineMappings } from "@/visualizers/queue/code-line-mappings";
import type { AuthoredPublicationArtifacts } from "../publication-registry";

const isLinearInput = (input: unknown): input is number[] =>
  Array.isArray(input) && input.length <= 20 && input.every((value) => Number.isInteger(value));

function validateLinearInput(input: number[], options: VisualizerInputOptions) {
  const errors: string[] = [];
  if (!isLinearInput(input)) {
    errors.push("Input must contain at most 20 whole numbers.");
  }
  if (!Number.isInteger(options.capacity) || options.capacity < 1 || options.capacity > 20) {
    errors.push("Capacity must be a whole number between 1 and 20.");
  } else if (options.capacity < input.length) {
    errors.push("Capacity cannot be smaller than the current data size.");
  }
  return errors;
}

const inputGenerators = [
  { id: "short", label: "Short sequence", generate: () => [4, 8, 15] },
  { id: "empty", label: "Empty structure", generate: () => [] },
] as const;

const legend = [
  {
    bucketKey: "active",
    label: "Active end",
    description: "The stack top or queue end currently being inspected.",
    tone: "primary",
  },
  {
    bucketKey: "pointer",
    label: "Top/front pointer",
    description: "The logical pointer used to read the next element.",
    tone: "info",
  },
  {
    bucketKey: "inserted",
    label: "Inserted value",
    description: "A value added by push or enqueue.",
    tone: "success",
  },
  {
    bucketKey: "deleted",
    label: "Removed value",
    description: "A value selected by pop or dequeue.",
    tone: "error",
  },
  {
    bucketKey: "found",
    label: "Returned value",
    description: "A value returned without removing it.",
    tone: "success",
  },
  {
    bucketKey: "sorted",
    label: "Operation complete",
    description: "The value in its completed stack or queue position.",
    tone: "success",
  },
  {
    bucketKey: "error",
    label: "Capacity state",
    description: "An underflow, overflow, or full-capacity result.",
    tone: "error",
  },
] as const;

function options(overrides: Partial<VisualizerInputOptions> = {}) {
  return {
    ...structuredClone(defaultVisualizerInputOptions),
    capacity: 8,
    ...overrides,
  };
}

type LinearState = { elements: ReadonlyArray<{ value: number }> };

function finalValues(steps: ReadonlyArray<VisualStep>) {
  return (steps.at(-1)?.dataState as LinearState | undefined)?.elements.map(
    (element) => element.value
  );
}

function verifyState(expected: number[], requiredActions: ReadonlyArray<VisualStep["actionType"]>) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const failures: string[] = [];
    if (JSON.stringify(finalValues(steps)) !== JSON.stringify(expected)) {
      failures.push(`Final values must be [${expected.join(", ")}].`);
    }
    for (const action of requiredActions) {
      if (!steps.some((step) => step.actionType === action)) {
        failures.push(`Steps must include the ${action} action.`);
      }
    }
    if (steps.at(-1)?.actionType === "error") {
      failures.push("Valid input must not finish with an error step.");
    }
    return failures;
  };
}

function artifacts(
  codeLineMapping: AuthoredPublicationArtifacts["codeLineMapping"],
  input: number[],
  testOptions: VisualizerInputOptions,
  expected: number[],
  requiredActions: ReadonlyArray<VisualStep["actionType"]>
): AuthoredPublicationArtifacts {
  return {
    inputSchema: isLinearInput,
    inputGenerators,
    validateInput: validateLinearInput,
    testCases: [
      {
        name: `preserves the expected linear state [${expected.join(", ")}]`,
        input,
        options: testOptions,
        verify: verifyState(expected, requiredActions),
      },
    ],
    codeLineMapping,
    legend,
  };
}

export const stackPublicationArtifacts: Record<
  keyof typeof stackCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "array-stack": artifacts(
    stackCodeLineMappings["array-stack"],
    [4, 8, 15],
    options(),
    [4, 8, 15],
    ["highlight"]
  ),
  "stack-push": artifacts(
    stackCodeLineMappings["stack-push"],
    [4, 8],
    options({ value: 15 }),
    [4, 8, 15],
    ["push"]
  ),
  "stack-pop": artifacts(
    stackCodeLineMappings["stack-pop"],
    [4, 8, 15],
    options(),
    [4, 8],
    ["pop"]
  ),
  "stack-peek": artifacts(
    stackCodeLineMappings["stack-peek"],
    [4, 8, 15],
    options(),
    [4, 8, 15],
    ["access", "complete"]
  ),
  "stack-is-empty": artifacts(
    stackCodeLineMappings["stack-is-empty"],
    [],
    options(),
    [],
    ["found"]
  ),
  "stack-is-full": artifacts(
    stackCodeLineMappings["stack-is-full"],
    [4, 8],
    options({ capacity: 2 }),
    [4, 8],
    ["found"]
  ),
  "stack-size": artifacts(
    stackCodeLineMappings["stack-size"],
    [4, 8, 15],
    options(),
    [4, 8, 15],
    ["complete"]
  ),
  "balanced-parentheses": artifacts(
    stackCodeLineMappings["balanced-parentheses"],
    [4, 8, 15],
    options({ text: "{[()]}" }),
    [],
    ["push", "pop", "complete"]
  ),
  "infix-to-postfix": artifacts(
    stackCodeLineMappings["infix-to-postfix"],
    [4, 8, 15],
    options({ text: "A + B * C" }),
    [],
    ["push", "pop", "complete"]
  ),
  "postfix-evaluation": artifacts(
    stackCodeLineMappings["postfix-evaluation"],
    [4, 8],
    options({ text: "5 3 + 2 *" }),
    [16],
    ["push", "compare", "complete"]
  ),
  "min-stack": artifacts(
    stackCodeLineMappings["min-stack"],
    [4, 8, 15],
    options(),
    [4, 8],
    ["push", "access", "pop", "complete"]
  ),
  "next-greater-element": artifacts(
    stackCodeLineMappings["next-greater-element"],
    [4, 8, 15],
    options(),
    [],
    ["push", "pop", "complete"]
  ),
};

export const queuePublicationArtifacts: Record<
  keyof typeof queueCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "simple-queue": artifacts(
    queueCodeLineMappings["simple-queue"],
    [4, 8, 15],
    options(),
    [4, 8, 15],
    ["highlight"]
  ),
  "circular-queue": artifacts(
    queueCodeLineMappings["circular-queue"],
    [4, 8],
    options({ value: 15 }),
    [8, 15],
    ["dequeue", "enqueue"]
  ),
  "queue-enqueue": artifacts(
    queueCodeLineMappings["queue-enqueue"],
    [4, 8],
    options({ value: 15 }),
    [4, 8, 15],
    ["enqueue"]
  ),
  "queue-dequeue": artifacts(
    queueCodeLineMappings["queue-dequeue"],
    [4, 8, 15],
    options(),
    [8, 15],
    ["dequeue"]
  ),
  "queue-peek": artifacts(
    queueCodeLineMappings["queue-peek"],
    [4, 8, 15],
    options(),
    [4, 8, 15],
    ["access", "complete"]
  ),
  "queue-front-rear": artifacts(
    queueCodeLineMappings["queue-front-rear"],
    [4, 8, 15],
    options(),
    [4, 8, 15],
    ["access", "complete"]
  ),
  "deque-push-front": artifacts(
    queueCodeLineMappings["deque-push-front"],
    [20, 30, 40],
    options({ value: 10 }),
    [10, 20, 30, 40],
    ["enqueue", "complete"]
  ),
  "deque-pop-rear": artifacts(
    queueCodeLineMappings["deque-pop-rear"],
    [10, 20, 30, 40],
    options(),
    [10, 20, 30],
    ["dequeue", "complete"]
  ),
  "priority-queue-enqueue": artifacts(
    queueCodeLineMappings["priority-queue-enqueue"],
    [40, 30, 20, 10],
    options({ value: 25 }),
    [40, 30, 25, 20, 10],
    ["enqueue", "complete"]
  ),
  "priority-queue-dequeue": artifacts(
    queueCodeLineMappings["priority-queue-dequeue"],
    [50, 40, 30, 20, 10],
    options(),
    [40, 30, 20, 10],
    ["dequeue", "complete"]
  ),
};
