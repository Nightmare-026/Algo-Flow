import { CodeExample, CodeLanguage } from "@/types";

type RequiredTranslation = Exclude<CodeLanguage, "javascript" | "typescript">;
type TranslationSet = Record<RequiredTranslation, { code: string; explanation: string }>;

const translations: Record<string, TranslationSet> = {
  "hash-set-insert": {
    python: {
      code: `def hash_set_insert(table, key):
    if not table:
        return False
    index = key % len(table)
    start = index

    while table[index] not in (None, "DELETED"):
        if table[index] == key:
            return False
        index = (index + 1) % len(table)
        if index == start:
            return False

    table[index] = key
    return True`,
      explanation:
        "Uses modulo hashing and bounded linear probing, rejects duplicates, and reuses tombstones.",
    },
    cpp: {
      code: `#include <climits>
#include <vector>

bool hashSetInsert(std::vector<int>& table, int key) {
    if (table.empty()) return false;
    constexpr int EMPTY = INT_MIN;
    constexpr int DELETED = INT_MIN + 1;
    const int rawIndex = key % static_cast<int>(table.size());
    std::size_t index = static_cast<std::size_t>(
        rawIndex < 0 ? rawIndex + static_cast<int>(table.size()) : rawIndex
    );
    const std::size_t start = index;

    while (table[index] != EMPTY && table[index] != DELETED) {
        if (table[index] == key) return false;
        index = (index + 1) % table.size();
        if (index == start) return false;
    }

    table[index] = key;
    return true;
}`,
      explanation:
        "Uses explicit empty and tombstone sentinels with a full-cycle guard; keys must exclude the sentinel values.",
    },
    java: {
      code: `boolean hashSetInsert(int[] table, int key) {
    if (table.length == 0) return false;
    final int EMPTY = Integer.MIN_VALUE;
    final int DELETED = Integer.MIN_VALUE + 1;
    int index = Math.floorMod(key, table.length);
    int start = index;

    while (table[index] != EMPTY && table[index] != DELETED) {
        if (table[index] == key) return false;
        index = (index + 1) % table.length;
        if (index == start) return false;
    }

    table[index] = key;
    return true;
}`,
      explanation:
        "Uses floorMod for negative keys, bounded probing, and explicit sentinels outside the supported key domain.",
    },
  },
  "hash-set-search": {
    python: {
      code: `def hash_set_contains(table, key):
    if not table:
        return False
    index = key % len(table)
    start = index

    while table[index] is not None:
        if table[index] == key:
            return True
        index = (index + 1) % len(table)
        if index == start:
            break

    return False`,
      explanation:
        "Searches the complete probe chain and stops at an unused bucket or after one full cycle.",
    },
    cpp: {
      code: `#include <climits>
#include <vector>

bool hashSetContains(const std::vector<int>& table, int key) {
    if (table.empty()) return false;
    constexpr int EMPTY = INT_MIN;
    const int rawIndex = key % static_cast<int>(table.size());
    std::size_t index = static_cast<std::size_t>(
        rawIndex < 0 ? rawIndex + static_cast<int>(table.size()) : rawIndex
    );
    const std::size_t start = index;

    while (table[index] != EMPTY) {
        if (table[index] == key) return true;
        index = (index + 1) % table.size();
        if (index == start) break;
    }

    return false;
}`,
      explanation:
        "Follows the probe chain without treating tombstones as empty and terminates after at most one table scan.",
    },
    java: {
      code: `boolean hashSetContains(int[] table, int key) {
    if (table.length == 0) return false;
    final int EMPTY = Integer.MIN_VALUE;
    int index = Math.floorMod(key, table.length);
    int start = index;

    while (table[index] != EMPTY) {
        if (table[index] == key) return true;
        index = (index + 1) % table.length;
        if (index == start) break;
    }

    return false;
}`,
      explanation:
        "Uses the same probe sequence as insertion and preserves lookup across tombstones.",
    },
  },
  "hash-set-delete": {
    python: {
      code: `def hash_set_delete(table, key):
    if not table:
        return False
    index = key % len(table)
    start = index

    while table[index] is not None:
        if table[index] == key:
            table[index] = "DELETED"
            return True
        index = (index + 1) % len(table)
        if index == start:
            break

    return False`,
      explanation:
        "Marks the located key with a tombstone so later lookups can continue through the probe chain.",
    },
    cpp: {
      code: `#include <climits>
#include <vector>

bool hashSetDelete(std::vector<int>& table, int key) {
    if (table.empty()) return false;
    constexpr int EMPTY = INT_MIN;
    constexpr int DELETED = INT_MIN + 1;
    const int rawIndex = key % static_cast<int>(table.size());
    std::size_t index = static_cast<std::size_t>(
        rawIndex < 0 ? rawIndex + static_cast<int>(table.size()) : rawIndex
    );
    const std::size_t start = index;

    while (table[index] != EMPTY) {
        if (table[index] == key) {
            table[index] = DELETED;
            return true;
        }
        index = (index + 1) % table.size();
        if (index == start) break;
    }

    return false;
}`,
      explanation: "Uses lazy deletion to retain collision-chain reachability after removal.",
    },
    java: {
      code: `boolean hashSetDelete(int[] table, int key) {
    if (table.length == 0) return false;
    final int EMPTY = Integer.MIN_VALUE;
    final int DELETED = Integer.MIN_VALUE + 1;
    int index = Math.floorMod(key, table.length);
    int start = index;

    while (table[index] != EMPTY) {
        if (table[index] == key) {
            table[index] = DELETED;
            return true;
        }
        index = (index + 1) % table.length;
        if (index == start) break;
    }

    return false;
}`,
      explanation:
        "Replaces a found key with a tombstone and bounds the search to one full probe cycle.",
    },
  },
  "set-union": {
    python: {
      code: `def set_union(set_a, set_b):
    return set_a | set_b`,
      explanation: "Returns every distinct value present in either set.",
    },
    cpp: {
      code: `#include <unordered_set>

std::unordered_set<int> setUnion(
    std::unordered_set<int> setA,
    const std::unordered_set<int>& setB
) {
    setA.insert(setB.begin(), setB.end());
    return setA;
}`,
      explanation: "Copies the first set and inserts every value from the second set.",
    },
    java: {
      code: `Set<Integer> setUnion(Set<Integer> setA, Set<Integer> setB) {
    Set<Integer> result = new HashSet<>(setA);
    result.addAll(setB);
    return result;
}`,
      explanation: "Copies the first set and uses addAll to include unique values from the second.",
    },
  },
  "set-intersection": {
    python: {
      code: `def set_intersection(set_a, set_b):
    return set_a & set_b`,
      explanation: "Returns only values shared by both sets.",
    },
    cpp: {
      code: `#include <unordered_set>

std::unordered_set<int> setIntersection(
    const std::unordered_set<int>& setA,
    const std::unordered_set<int>& setB
) {
    std::unordered_set<int> result;
    for (int value : setB) {
        if (setA.find(value) != setA.end()) result.insert(value);
    }
    return result;
}`,
      explanation: "Tests each value from one set against the other and inserts only matches.",
    },
    java: {
      code: `Set<Integer> setIntersection(Set<Integer> setA, Set<Integer> setB) {
    Set<Integer> result = new HashSet<>(setA);
    result.retainAll(setB);
    return result;
}`,
      explanation: "Copies one set and retains only values also present in the other.",
    },
  },
};

function getJavaScriptExamples(slug: string, algorithmId: string): CodeExample[] {
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

export function getHashSetCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  const javascriptExamples = getJavaScriptExamples(slug, algorithmId);
  const translated = translations[slug];

  if (!translated) {
    return javascriptExamples;
  }

  const translatedExamples = (
    Object.entries(translated) as Array<[RequiredTranslation, TranslationSet[RequiredTranslation]]>
  ).map(([language, example]) => ({
    id: `${algorithmId}-${language}`,
    algorithmId,
    language,
    code: example.code,
    explanation: example.explanation,
    isPrimary: false,
  }));

  return [...javascriptExamples, ...translatedExamples];
}
