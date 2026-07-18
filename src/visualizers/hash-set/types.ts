export interface HashSetEntry {
  id: string; // Unique ID for Framer Motion layout animations
  key: number; // Primary key for hashing
  isDeleted?: boolean; // For lazy deletion (tombstones) in Open Addressing
}

export type CollisionResolutionType = "chaining" | "linear-probing";

export interface HashSetVisualState {
  setSize: number;
  collisionResolution: CollisionResolutionType;

  // Buckets can hold either:
  // - A single HashSetEntry (or null) for Open Addressing (e.g., Linear Probing)
  // - An array of HashSetEntry for Separate Chaining
  buckets: (HashSetEntry | null)[] | HashSetEntry[][];

  // Track metrics
  elementCount: number;
  loadFactor: number;
}

export function createInitialHashSetState(
  size: number,
  resolution: CollisionResolutionType
): HashSetVisualState {
  const buckets =
    resolution === "chaining"
      ? Array.from({ length: size }, () => [])
      : Array.from({ length: size }, () => null);

  return {
    setSize: size,
    collisionResolution: resolution,
    buckets: buckets as (HashSetEntry | null)[] | HashSetEntry[][],
    elementCount: 0,
    loadFactor: 0,
  };
}
