# Part 03: Hashing — Module 03: Hash Table, Hash Map & Hash Set Architectures

> **Topics Covered:**  
> 41. Hash Table Architecture & Dynamic Rehashing &bull; 42. Hash Map (Key-Value Associative Dictionaries, Invariants & Entry Sets) &bull; Production Collision Optimizations (Java 8+ Bucket Treeification & Python Compact Hash Tables) &bull; 43. Hash Set (Deduplication Engine, Backing Mechanics & Mathematical Set Operations) &bull; 44. Master Comparison: Hash Table vs Hash Map vs Hash Set vs Tree Structures

---

Associative data structures represent the backbone of practical software engineering, powering database primary keys, symbol tables, routing caches, and in-memory key-value stores. While Hash Tables, Hash Maps, and Hash Sets are often used interchangeably in colloquial discussion, they embody distinct mathematical contracts, memory representations, and concurrency profiles. This chapter examines the core mechanics of associative arrays, dynamic rehashing invariants, modern runtime defenses against Hash-DoS attacks (such as Java 8+ bucket treeification and Python 3.6+ compact sparse/dense layouts), mathematical set algebra algorithms, and trade-offs against tree-based structures.

### Learning Objectives
- Differentiate Hash Tables, Hash Maps, and Hash Sets by their formal mathematical invariants, interface contracts, and physical memory configurations.
- Implement dynamic table rehashing and prove why existing elements must be recomputed via $h(k) \pmod{m_{\text{new}}}$ rather than copied verbatim.
- Analyze production engine optimizations that foil Hash DoS attacks, including Java 8+ Red-Black tree bucket treeification and Python 3.6+ compact indices.
- Construct a Hash Set as an abstraction over an internal Hash Map with sentinel constants and determine optimal time complexities for set operations ($\cap, \cup, \setminus$).
- Evaluate the asymptotic and practical performance trade-offs between hash-based associative containers and self-balancing binary search trees.

---

## Topic 41: Hash Table Architecture & Dynamic Rehashing

### 1. Conceptual Architecture & Associative Taxonomy

| Associative Archetype | Mathematical Contract | Key Invariant | Value Payload | Primary Systems Role |
| :--- | :--- | :--- | :--- | :--- |
| **Hash Table** | Low-level bucket-indexed array | Keys must support hashing & equality | Directly stores key-value pairs in buckets | Foundational runtime building block |
| **Hash Map** | Functional mapping $f: K \to V$ | Keys are strictly unique ($K \to V$) | Stores arbitrary client value $V$ per key | General-purpose dictionary / cache |
| **Hash Set** | Mathematical finite set $S \subset \mathcal{U}$ | Elements are strictly unique ($E$) | Zero payload (value replaced by 0-byte sentinel) | High-speed deduplication & membership query |

---

### 2. Runtime Engineering: Java 8+ Treeification & Python Compact Maps

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Production Runtime Optimizations: Java 8+ Bucket Treeification &amp; Python 3.6+ Compact Layout
  </div>
  <svg viewBox="0 0 850 360" class="w-full h-auto text-xs" style="max-height: 360px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="mapArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="320" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Left: Java 8+ Treeification -->
    <g transform="translate(45, 45)">
      <text x="175" y="20" font-weight="700" fill="#3b82f6" text-anchor="middle" font-size="13">Java 8+ HashMap: Bucket Treeification</text>
      <!-- Singly Linked List (Before) -->
      <g transform="translate(15, 45)">
        <rect x="0" y="0" width="75" height="30" rx="4" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6"/>
        <text x="37" y="19" text-anchor="middle" font-size="10">Node 1</text>
        <path d="M 75 15 L 105 15" stroke="currentColor" stroke-width="1.5" marker-end="url(#mapArrow)"/>
        <rect x="105" y="0" width="75" height="30" rx="4" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6"/>
        <text x="142" y="19" text-anchor="middle" font-size="10">Node 2</text>
        <path d="M 180 15 L 210 15" stroke="currentColor" stroke-width="1.5" marker-end="url(#mapArrow)"/>
        <text x="235" y="19" font-family="monospace">&hellip; (8 nodes)</text>
      </g>
      <!-- Transition Arrow Downward -->
      <path d="M 175 90 L 175 140" stroke="#f59e0b" stroke-width="2" marker-end="url(#mapArrow)"/>
      <text x="185" y="120" font-size="10" fill="#f59e0b" font-weight="700">Threshold: Chain &ge; 8 &amp;&amp; Cap &ge; 64</text>
      <!-- Red-Black Tree (After) -->
      <g transform="translate(75, 150)">
        <rect x="0" y="0" width="200" height="90" rx="8" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
        <text x="100" y="25" text-anchor="middle" font-weight="700" fill="#10b981">Balanced Red-Black Tree</text>
        <text x="100" y="48" text-anchor="middle" font-size="11">Worst-case search:</text>
        <text x="100" y="70" text-anchor="middle" font-weight="700" font-size="13" fill="#10b981">O(n) &rarr; O(log n) Guaranteed!</text>
      </g>
    </g>
    <!-- Divider -->
    <line x1="420" y1="40" x2="420" y2="340" stroke="currentColor" stroke-opacity="0.15" stroke-width="1.5"/>
    <!-- Right: Python 3.6+ Compact Hash Map -->
    <g transform="translate(450, 45)">
      <text x="180" y="20" font-weight="700" fill="#10b981" text-anchor="middle" font-size="13">Python 3.6+ Compact Hash Layout</text>
      <!-- Sparse Indices -->
      <g transform="translate(10, 45)">
        <text x="0" y="15" font-weight="700" font-size="11" fill="currentColor">1. Sparse Indices Array (1-byte int8 offsets):</text>
        <g transform="translate(0, 25)">
          <rect x="0" y="0" width="35" height="35" rx="3" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444"/>
          <text x="17" y="22" text-anchor="middle" font-family="monospace">-1</text>
          <rect x="40" y="0" width="35" height="35" rx="3" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="1.5"/>
          <text x="57" y="22" text-anchor="middle" font-family="monospace" font-weight="700">0</text>
          <rect x="80" y="0" width="35" height="35" rx="3" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444"/>
          <text x="97" y="22" text-anchor="middle" font-family="monospace">-1</text>
          <rect x="120" y="0" width="35" height="35" rx="3" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="1.5"/>
          <text x="137" y="22" text-anchor="middle" font-family="monospace" font-weight="700">1</text>
          <rect x="160" y="0" width="35" height="35" rx="3" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444"/>
          <text x="177" y="22" text-anchor="middle" font-family="monospace">-1</text>
        </g>
      </g>
      <!-- Dense Entries -->
      <g transform="translate(10, 140)">
        <text x="0" y="15" font-weight="700" font-size="11" fill="currentColor">2. Dense Entries Array (Tightly packed structs):</text>
        <g transform="translate(0, 25)">
          <rect x="0" y="0" width="320" height="36" rx="4" fill="#10b981" fill-opacity="0.15" stroke="#10b981"/>
          <text x="10" y="22" font-family="monospace">idx 0: [hash1, "KeyA", ValueA]</text>
          <rect x="0" y="42" width="320" height="36" rx="4" fill="#10b981" fill-opacity="0.15" stroke="#10b981"/>
          <text x="10" y="64" font-family="monospace">idx 1: [hash2, "KeyB", ValueB]</text>
        </g>
      </g>
      <rect x="10" y="255" width="320" height="40" rx="6" fill="#10b981" fill-opacity="0.08" stroke="#10b981"/>
      <text x="170" y="278" text-anchor="middle" font-size="10" font-weight="600" fill="#10b981">Saves 35% RAM &amp; guarantees insertion-order iteration!</text>
    </g>
  </svg>
</div>

---

### 3. Production Multi-Language Implementations

#### C++20 Templated Hash Map with Separate Chaining & RAII
```cpp
#include <vector>
#include <list>
#include <utility>
#include <stdexcept>
#include <optional>

template <typename K, typename V>
class ChainedHashMap {
private:
    struct Entry {
        K key;
        V value;
    };

    std::vector<std::list<Entry>> buckets_;
    size_t capacity_;
    size_t size_;
    float max_load_factor_;

    size_t bucket_index(const K& key) const {
        return std::hash<K>{}(key) % capacity_;
    }

    void rehash(size_t new_cap) {
        std::vector<std::list<Entry>> new_buckets(new_cap);
        for (const auto& bucket : buckets_) {
            for (const auto& entry : bucket) {
                size_t idx = std::hash<K>{}(entry.key) % new_cap;
                new_buckets[idx].push_back(entry);
            }
        }
        buckets_ = std::move(new_buckets);
        capacity_ = new_cap;
    }

public:
    explicit ChainedHashMap(size_t initial_cap = 11, float mlf = 0.75f)
        : capacity_(initial_cap), size_(0), max_load_factor_(mlf), buckets_(initial_cap) {}

    void insert(const K& key, const V& value) {
        if (static_cast<float>(size_ + 1) / capacity_ > max_load_factor_) {
            rehash(capacity_ * 2 + 1);
        }
        size_t idx = bucket_index(key);
        for (auto& entry : buckets_[idx]) {
            if (entry.key == key) {
                entry.value = value;
                return;
            }
        }
        buckets_[idx].push_back({key, value});
        ++size_;
    }

    std::optional<V> get(const K& key) const {
        size_t idx = bucket_index(key);
        for (const auto& entry : buckets_[idx]) {
            if (entry.key == key) return entry.value;
        }
        return std::nullopt;
    }

    bool remove(const K& key) {
        size_t idx = bucket_index(key);
        auto& bucket = buckets_[idx];
        for (auto it = bucket.begin(); it != bucket.end(); ++it) {
            if (it->key == key) {
                bucket.erase(it);
                --size_;
                return true;
            }
        }
        return false;
    }

    [[nodiscard]] size_t size() const noexcept { return size_; }
    [[nodiscard]] bool empty() const noexcept { return size_ == 0; }
};
```

---

### 4. Key Takeaways

1. **Rehashing Mechanics**: Dynamic rehashing requires recomputing new index slots for all existing elements via $h(k) \pmod{m_{\text{new}}}$; simple memory copying is invalid.
2. **Treeification**: Java 8+ converts long bucket chains ($\ge 8$) to Red-Black trees, strictly foiling algorithmic Hash-DoS attacks.
3. **Compact Hash Tables**: Decoupling sparse indices from dense entries (Python 3.6+) eliminates empty gap memory waste and preserves insertion order.
4. **Set Optimization**: Hash Sets reuse Hash Map key machinery with dummy sentinels; set intersection achieves optimal $O(\min(n, m))$ time by driving lookups from the smaller set.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 11: *Hash Tables*, Chapter 13: *Red-Black Trees*. MIT Press.
2. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.4: *Hashing*. Addison-Wesley.
3. **Hettinger, R.** (2012). *Modern Dictionaries by More Compact Means*. Python Developers Conference (PyCon).
