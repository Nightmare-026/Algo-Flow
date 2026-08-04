import type { VisualStep } from "@/types";
import {
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { hashTableCodeLineMappings } from "@/visualizers/hash-table/code-line-mappings";
import { hashSetCodeLineMappings } from "@/visualizers/hash-set/code-line-mappings";
import type { AuthoredPublicationArtifacts } from "../publication-registry";

const isHashInput = (input: unknown): input is number[] =>
  Array.isArray(input) &&
  input.length > 0 &&
  input.length <= 12 &&
  input.every((value) => Number.isInteger(value) && value >= 0);

function validateHashInput(input: number[], options: VisualizerInputOptions) {
  const errors: string[] = [];
  if (!isHashInput(input)) errors.push("Input must contain 1 to 12 non-negative whole numbers.");
  if (!Number.isInteger(options.capacity) || options.capacity < 2 || options.capacity > 20) {
    errors.push("Table capacity must be a whole number between 2 and 20.");
  } else if (input.length >= options.capacity) {
    errors.push("Input must leave at least one empty bucket for bounded probing.");
  }
  return errors;
}

const inputGenerators = [
  { id: "collisions", label: "Colliding keys", generate: () => [1, 9, 17] },
  { id: "spread", label: "Distributed keys", generate: () => [2, 5, 11, 20] },
] as const;

const legend = [
  {
    bucketKey: "active",
    label: "Hash bucket",
    description: "The bucket selected by the hash function.",
    tone: "primary",
  },
  {
    bucketKey: "compared",
    label: "Probe candidate",
    description: "A bucket or entry checked during collision resolution.",
    tone: "info",
  },
  {
    bucketKey: "inserted",
    label: "Inserted key",
    description: "A key written to the table or set.",
    tone: "success",
  },
  {
    bucketKey: "found",
    label: "Found key",
    description: "The entry whose key matches the search target.",
    tone: "success",
  },
  {
    bucketKey: "deleted",
    label: "Deleted key",
    description: "The removed entry or tombstone location.",
    tone: "error",
  },
  {
    bucketKey: "visited",
    label: "Old bucket visited",
    description: "An old-table bucket already processed during rehashing.",
    tone: "info",
  },
  {
    bucketKey: "success",
    label: "Rehash complete",
    description: "An entry retained in the completed replacement table.",
    tone: "success",
  },
  {
    bucketKey: "error",
    label: "Rehash skipped",
    description: "The load factor is below the rehash threshold.",
    tone: "error",
  },
] as const;

function options(overrides: Partial<VisualizerInputOptions> = {}) {
  return { ...structuredClone(defaultVisualizerInputOptions), capacity: 8, ...overrides };
}

type HashEntry = { key: number; isDeleted?: boolean };
type HashState = {
  buckets: ReadonlyArray<HashEntry | null | ReadonlyArray<HashEntry>>;
  tableSize?: number;
  setSize?: number;
};

function stateKeys(state: HashState | undefined) {
  if (!state) return undefined;
  return state.buckets
    .flatMap((bucket) => (Array.isArray(bucket) ? bucket : bucket ? [bucket] : []))
    .filter((entry) => !entry.isDeleted)
    .map((entry) => entry.key)
    .sort((a, b) => a - b);
}

function verifyKeys(expected: number[], actions: ReadonlyArray<VisualStep["actionType"]>) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const failures: string[] = [];
    const actual = stateKeys(steps.at(-1)?.dataState as HashState | undefined);
    const sortedExpected = [...expected].sort((a, b) => a - b);
    if (JSON.stringify(actual) !== JSON.stringify(sortedExpected)) {
      failures.push(`Final hash keys must be [${sortedExpected.join(", ")}].`);
    }
    for (const action of actions) {
      if (!steps.some((step) => step.actionType === action))
        failures.push(`Steps must include the ${action} action.`);
    }
    if (steps.at(-1)?.actionType === "error")
      failures.push("Valid hash input must not finish with an error.");
    return failures;
  };
}

function verifyHashStep(steps: ReadonlyArray<VisualStep>) {
  const failures: string[] = [];
  if (steps.length !== 1 || steps[0].actionType !== "hash")
    failures.push("Division hashing must emit one hash step.");
  if (!steps[0]?.highlights.active?.includes("bucket-7"))
    failures.push("23 mod 8 must select bucket 7.");
  return failures;
}

function artifacts(
  codeLineMapping: AuthoredPublicationArtifacts["codeLineMapping"],
  input: number[],
  testOptions: VisualizerInputOptions,
  verify: AuthoredPublicationArtifacts["testCases"][number]["verify"]
): AuthoredPublicationArtifacts {
  return {
    inputSchema: isHashInput,
    inputGenerators,
    validateInput: validateHashInput,
    testCases: [
      { name: "satisfies the authored hashing outcome", input, options: testOptions, verify },
    ],
    codeLineMapping,
    legend,
  };
}

const keys = [1, 9, 17];
const inserted = [1, 9, 17, 25];
const rehashKeys = [0, 8, 16, 1, 9, 17];

export const hashTablePublicationArtifacts: Record<
  keyof typeof hashTableCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "division-hash-method": artifacts(
    hashTableCodeLineMappings["division-hash-method"],
    keys,
    options({ value: 23 }),
    verifyHashStep
  ),
  "hash-insert": artifacts(
    hashTableCodeLineMappings["hash-insert"],
    keys,
    options({ value: 25 }),
    verifyKeys(inserted, ["collision", "insert"])
  ),
  "linear-probing": artifacts(
    hashTableCodeLineMappings["linear-probing"],
    keys,
    options({ value: 25 }),
    verifyKeys(inserted, ["collision", "insert"])
  ),
  "probing-insert": artifacts(
    hashTableCodeLineMappings["probing-insert"],
    keys,
    options({ value: 25 }),
    verifyKeys(inserted, ["collision", "insert"])
  ),
  "hash-search": artifacts(
    hashTableCodeLineMappings["hash-search"],
    keys,
    options({ target: 9 }),
    verifyKeys(keys, ["probe", "found"])
  ),
  "probing-search": artifacts(
    hashTableCodeLineMappings["probing-search"],
    keys,
    options({ target: 9 }),
    verifyKeys(keys, ["probe", "found"])
  ),
  "hash-delete": artifacts(
    hashTableCodeLineMappings["hash-delete"],
    keys,
    options({ target: 9 }),
    verifyKeys([1, 17], ["probe", "delete"])
  ),
  "probing-delete": artifacts(
    hashTableCodeLineMappings["probing-delete"],
    keys,
    options({ target: 9 }),
    verifyKeys([1, 17], ["probe", "delete"])
  ),
  rehashing: artifacts(
    hashTableCodeLineMappings.rehashing,
    rehashKeys,
    options(),
    verifyKeys(rehashKeys, ["build", "insert"])
  ),
  "chaining-insert": artifacts(
    hashTableCodeLineMappings["chaining-insert"],
    keys,
    options({ value: 25 }),
    verifyKeys(inserted, ["compare", "insert"])
  ),
  "chaining-search": artifacts(
    hashTableCodeLineMappings["chaining-search"],
    keys,
    options({ target: 9 }),
    verifyKeys(keys, ["compare", "found"])
  ),
  "chaining-delete": artifacts(
    hashTableCodeLineMappings["chaining-delete"],
    keys,
    options({ target: 9 }),
    verifyKeys([1, 17], ["compare", "delete"])
  ),
};

export const hashSetPublicationArtifacts: Record<
  keyof typeof hashSetCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "hash-set-insert": artifacts(
    hashSetCodeLineMappings["hash-set-insert"],
    keys,
    options({ value: 25 }),
    verifyKeys(inserted, ["collision", "insert"])
  ),
  "hash-set-search": artifacts(
    hashSetCodeLineMappings["hash-set-search"],
    keys,
    options({ target: 9 }),
    verifyKeys(keys, ["probe", "found"])
  ),
  "hash-set-delete": artifacts(
    hashSetCodeLineMappings["hash-set-delete"],
    keys,
    options({ target: 9 }),
    verifyKeys([1, 17], ["probe", "delete"])
  ),
  "set-union": artifacts(
    hashSetCodeLineMappings["set-union"],
    [1, 9, 17, 2, 25],
    options({ value: 33 }),
    verifyKeys([1, 2, 9, 17, 25, 33], ["insert"])
  ),
  "set-intersection": artifacts(
    hashSetCodeLineMappings["set-intersection"],
    [1, 9, 17, 2, 25],
    options(),
    verifyKeys([1, 2, 9, 17], ["insert"])
  ),
};
