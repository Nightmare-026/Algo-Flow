import { CodeExample } from "@/types";

export function getHashSetCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  switch (slug) {
    case "hash-set-insert":
      return [
        {
          id: `${algorithmId}-js`,
          algorithmId,
          language: "javascript",
          isPrimary: true,
          code: `class HashSet {
  constructor(size = 7) {
    this.size = size;
    this.buckets = new Array(size).fill(null);
    this.count = 0;
  }

  hash(key) {
    return key % this.size;
  }

  insert(key) {
    if (this.count >= this.size) return false;
    let index = this.hash(key);
    
    // Linear probing for collisions
    while (this.buckets[index] !== null && this.buckets[index] !== "DELETED") {
      if (this.buckets[index] === key) return false; // Duplicate
      index = (index + 1) % this.size;
    }
    
    this.buckets[index] = key;
    this.count++;
    return true;
  }
}`,
          explanation:
            "Hashes the key to find an index, then uses linear probing to resolve collisions. It also rejects duplicate entries.",
        },
      ];
    case "hash-set-search":
      return [
        {
          id: `${algorithmId}-js`,
          algorithmId,
          language: "javascript",
          isPrimary: true,
          code: `search(key) {
  let index = this.hash(key);
  let start = index;
  
  while (this.buckets[index] !== null) {
    if (this.buckets[index] === key) return true;
    index = (index + 1) % this.size;
    if (index === start) break; // Full cycle
  }
  return false;
}`,
          explanation:
            "Probes through the buckets to find the key. Stops if an empty (null) bucket is reached or it has checked all buckets.",
        },
      ];
    case "hash-set-delete":
      return [
        {
          id: `${algorithmId}-js`,
          algorithmId,
          language: "javascript",
          isPrimary: true,
          code: `delete(key) {
  let index = this.hash(key);
  let start = index;
  
  while (this.buckets[index] !== null) {
    if (this.buckets[index] === key) {
      this.buckets[index] = "DELETED"; // Tombstone marker
      this.count--;
      return true;
    }
    index = (index + 1) % this.size;
    if (index === start) break;
  }
  return false;
}`,
          explanation:
            "Uses a lazy deletion technique (tombstone) to remove the element without breaking the probing chain for future searches.",
        },
      ];
    case "set-union":
      return [
        {
          id: `${algorithmId}-js`,
          algorithmId,
          language: "javascript",
          isPrimary: true,
          code: `function setUnion(setA, setB) {
  const result = new Set(setA);
  for (const elem of setB) {
    result.add(elem);
  }
  return result;
}`,
          explanation:
            "Combines elements from both sets. The underlying Hash Set structure automatically deduplicates identical elements.",
        },
      ];
    case "set-intersection":
      return [
        {
          id: `${algorithmId}-js`,
          algorithmId,
          language: "javascript",
          isPrimary: true,
          code: `function setIntersection(setA, setB) {
  const result = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      result.add(elem);
    }
  }
  return result;
}`,
          explanation:
            "Iterates through one set and checks if the other set contains each element. Matches are added to the result.",
        },
      ];
    default:
      return [];
  }
}
