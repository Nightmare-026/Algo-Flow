export interface HashEntry {
  id: string; // Unique ID for Framer Motion layout animations
  key: number; // Primary key for hashing (currently restricted to number based on Array input)
  value?: unknown; // Future-proofing for Hash Map support
  isDeleted?: boolean; // For lazy deletion (tombstones) in Open Addressing
}

export type CollisionResolutionType = "chaining" | "linear-probing";

export interface HashTableVisualState {
  tableSize: number;
  collisionResolution: CollisionResolutionType;

  // Buckets can hold either:
  // - A single HashEntry (or null) for Open Addressing (e.g., Linear Probing)
  // - An array of HashEntry for Separate Chaining
  buckets: (HashEntry | null)[] | HashEntry[][];

  // Track metrics
  elementCount: number;
  loadFactor: number;
  rehash?: {
    oldTableSize: number;
    oldBuckets: (HashEntry | null)[];
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

  return {
    tableSize: size,
    collisionResolution: resolution,
    buckets: buckets as (HashEntry | null)[] | HashEntry[][],
    elementCount: 0,
    loadFactor: 0,
  };
}
