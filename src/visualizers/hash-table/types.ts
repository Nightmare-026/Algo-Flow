export interface HashEntry {
  id: string; // Unique ID for Framer Motion layout animations
  key: number; // Primary key for hashing
  value?: unknown; // Future-proofing for Hash Map support
  isDeleted?: boolean; // For lazy deletion (tombstones) in Open Addressing
}

export type CollisionResolutionType =
  "chaining" | "linear-probing" | "quadratic-probing" | "double-hashing";

export type ProbingStrategy = "linear" | "quadratic" | "double-hashing";

export interface ProbeStepInfo {
  probeIndex: number;
  bucketIndex: number;
  status: "occupied" | "empty" | "tombstone" | "found";
}

export interface HashTableVisualState {
  tableSize: number;
  collisionResolution: CollisionResolutionType;
  probingStrategy?: ProbingStrategy;
  activeFormula?: string;
  probeHistory?: ProbeStepInfo[];

  // Buckets hold either:
  // - A single HashEntry (or null) for Open Addressing
  // - An array of HashEntry for Separate Chaining
  buckets: (HashEntry | null)[] | HashEntry[][];

  // Metrics
  elementCount: number;
  loadFactor: number;
  rehash?: {
    oldTableSize: number;
    oldBuckets: (HashEntry | null)[];
    oldElementCount?: number;
    oldLoadFactor?: number;
    activeOldIndex?: number | null;
    activeNewIndex?: number | null;
    migratingKey?: number | null;
  };
}

export function createInitialHashTableState(
  size: number,
  resolution: CollisionResolutionType
): HashTableVisualState {
  const buckets =
    resolution === "chaining"
      ? Array.from({ length: size }, () => [])
      : Array.from({ length: size }, () => null);

  const strategy: ProbingStrategy | undefined =
    resolution === "quadratic-probing"
      ? "quadratic"
      : resolution === "double-hashing"
        ? "double-hashing"
        : resolution === "linear-probing"
          ? "linear"
          : undefined;

  return {
    tableSize: size,
    collisionResolution: resolution,
    probingStrategy: strategy,
    buckets: buckets as (HashEntry | null)[] | HashEntry[][],
    elementCount: 0,
    loadFactor: 0,
  };
}
