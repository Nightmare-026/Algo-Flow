# Part 03: Hashing — Module 02: Collision Resolution Techniques

> **Topics Covered:**  
> 38. Separate Chaining (Open Hashing) & Bucket Chains &bull; 39. Open Addressing (Closed Hashing) & The Deletion Dilemma (`TOMBSTONE` Sentinel Protocol) &bull; 40. Linear Probing & Primary Clustering &bull; Quadratic Probing & Secondary Clustering &bull; Double Hashing & Coprimality Constraints &bull; Production Implementations

---

Because the universe of possible search keys vastly exceeds the physical capacity of any hash table, collisions are mathematically unavoidable. An effective hash table is therefore defined by the resilience and efficiency of its collision resolution mechanism. This chapter explores the two dominant architectural paradigms: **Separate Chaining** (storing colliding elements in external node structures) and **Open Addressing** (probing for open slots directly within the primary array). We analyze probe sequence mechanics, the `TOMBSTONE` deletion state machine, primary and secondary clustering phenomena, and coprimality constraints in double hashing.

### Learning Objectives
- Contrast the physical memory layouts, cache performance, and load factor tolerances of Separate Chaining versus Open Addressing.
- Formulate the Open Addressing deletion dilemma and implement the `TOMBSTONE` sentinel protocol to preserve probe continuity.
- Diagnose the physical causes of Primary Clustering in Linear Probing and Secondary Clustering in Quadratic Probing.
- Implement Double Hashing and prove why the step function $h_2(k)$ must be coprime to table capacity $m$ to guarantee a complete permutation of slots.
- Construct a robust C++20 Open Addressing hash table implementing Robin Hood / Tombstone probing.

---

## Topic 38: Separate Chaining (Open Hashing)

### 1. Conceptual Architecture & Bucket Chains

In **Separate Chaining**, the hash table is an array of pointers (or bucket heads). Each slot $j$ points to an external linked list (or self-balancing binary search tree) containing all key-value entries that hashed to $j$ ($h(k) = j$).

```
+-----------------------------------------------------------------------------------+
|                         SEPARATE CHAINING BUCKET LAYOUT                           |
|                                                                                   |
|  Slot 0 ----> NULL                                                                |
|  Slot 1 ----> [ "Apple", $2 | * ] ----> [ "Peach", $4 | NULL ] (Collision chain)  |
|  Slot 2 ----> NULL                                                                |
|  Slot 3 ----> [ "Banana", $1 | * ] ---> [ "Grape", $5 | * ] ---> [ "Berry", $6 ]  |
|  Slot 4 ----> [ "Mango", $3 | NULL ]                                              |
+-----------------------------------------------------------------------------------+
```

> **Interactive Simulations**:  
> Observe bucket node insertions live in the [Interactive Separate Chaining Visualizer](/visualizer/chaining-insert).

---

## Topic 39: Open Addressing & The Deletion Dilemma

### 1. Physical Memory Topology & Probing Comparison

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Collision Paradigms: Separate Chaining vs. Linear Clustering vs. TOMBSTONE State Machine
  </div>
  <svg viewBox="0 0 850 380" class="w-full h-auto text-xs" style="max-height: 380px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="colArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="340" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Left: Linear Probing Primary Clustering -->
    <g transform="translate(45, 45)">
      <text x="175" y="20" font-weight="700" fill="#ef4444" text-anchor="middle" font-size="13">Linear Probing: Primary Clustering</text>
      <!-- Slots 0..6 -->
      <g transform="translate(10, 45)">
        <rect x="0" y="0" width="45" height="50" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="22" y="30" text-anchor="middle" font-family="monospace">_</text>
        <text x="22" y="65" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">0</text>
        <rect x="48" y="0" width="45" height="50" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="70" y="30" text-anchor="middle" font-family="monospace">_</text>
        <text x="70" y="65" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">1</text>
        <rect x="96" y="0" width="45" height="50" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="118" y="30" text-anchor="middle" font-family="monospace">_</text>
        <text x="118" y="65" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">2</text>
        <!-- Massive Cluster Slots 3..6 -->
        <rect x="144" y="-3" width="190" height="56" rx="6" fill="#ef4444" fill-opacity="0.12" stroke="#ef4444" stroke-width="2"/>
        <rect x="144" y="0" width="45" height="50" rx="4" fill="#ef4444" fill-opacity="0.25"/>
        <text x="166" y="30" text-anchor="middle" font-family="monospace" font-weight="700">10</text>
        <text x="166" y="65" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="700">3</text>
        <rect x="192" y="0" width="45" height="50" rx="4" fill="#ef4444" fill-opacity="0.25"/>
        <text x="214" y="30" text-anchor="middle" font-family="monospace" font-weight="700">17</text>
        <text x="214" y="65" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="700">4</text>
        <rect x="240" y="0" width="45" height="50" rx="4" fill="#ef4444" fill-opacity="0.25"/>
        <text x="262" y="30" text-anchor="middle" font-family="monospace" font-weight="700">24</text>
        <text x="262" y="65" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="700">5</text>
        <rect x="288" y="0" width="45" height="50" rx="4" fill="#ef4444" fill-opacity="0.25"/>
        <text x="310" y="30" text-anchor="middle" font-family="monospace" font-weight="700">31</text>
        <text x="310" y="65" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="700">6</text>
      </g>
      <rect x="15" y="140" width="320" height="90" rx="8" fill="#ef4444" fill-opacity="0.08" stroke="#ef4444" stroke-width="1"/>
      <text x="25" y="165" font-weight="700" fill="#ef4444" font-size="11">Contiguous Cluster Coagulation:</text>
      <text x="25" y="185" fill="currentColor" fill-opacity="0.8" font-size="10">All keys hashed to slot 3, creating an unbroken</text>
      <text x="25" y="202" fill="currentColor" fill-opacity="0.8" font-size="10">4-slot cluster that absorbs all future arrivals.</text>
      <text x="25" y="220" font-weight="600" fill="#ef4444" font-size="10">Average probe count explodes to O(n)!</text>
    </g>
    <!-- Divider -->
    <line x1="420" y1="40" x2="420" y2="340" stroke="currentColor" stroke-opacity="0.15" stroke-width="1.5"/>
    <!-- Right: TOMBSTONE State Machine -->
    <g transform="translate(450, 45)">
      <text x="180" y="20" font-weight="700" fill="#3b82f6" text-anchor="middle" font-size="13">Open Addressing TOMBSTONE State Machine</text>
      <!-- State 1: EMPTY -->
      <g transform="translate(20, 60)">
        <circle cx="45" cy="45" r="35" fill="none" stroke="#10b981" stroke-width="2"/>
        <text x="45" y="49" text-anchor="middle" font-weight="700" fill="#10b981">EMPTY</text>
        <text x="45" y="95" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.6">Halts search</text>
      </g>
      <!-- Transition Empty -> Occupied -->
      <path d="M 105 105 L 175 105" stroke="#3b82f6" stroke-width="2" marker-end="url(#colArrow)"/>
      <text x="140" y="95" text-anchor="middle" font-size="9" fill="#3b82f6" font-weight="600">Insert(k,v)</text>
      <!-- State 2: OCCUPIED -->
      <g transform="translate(180, 60)">
        <circle cx="45" cy="45" r="35" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="2"/>
        <text x="45" y="42" text-anchor="middle" font-weight="700" fill="#3b82f6">OCCUPIED</text>
        <text x="45" y="58" text-anchor="middle" font-family="monospace" font-size="10">(Key, Val)</text>
      </g>
      <!-- Transition Occupied -> Tombstone -->
      <path d="M 225 145 L 225 210" stroke="#f59e0b" stroke-width="2" marker-end="url(#colArrow)"/>
      <text x="265" y="180" text-anchor="middle" font-size="9" fill="#f59e0b" font-weight="600">Delete(k)</text>
      <!-- State 3: TOMBSTONE -->
      <g transform="translate(180, 215)">
        <circle cx="45" cy="45" r="35" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2"/>
        <text x="45" y="42" text-anchor="middle" font-weight="700" fill="#f59e0b">TOMBSTONE</text>
        <text x="45" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.7">Pass through</text>
      </g>
      <!-- Transition Tombstone -> Occupied on Re-insert -->
      <path d="M 205 215 L 205 150" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#colArrow)"/>
      <text x="165" y="180" text-anchor="middle" font-size="9" fill="#10b981" font-weight="600">Re-claim</text>
    </g>
  </svg>
</div>

---

### 2. Probing Mathematical Formulations

#### A. Linear Probing:
$$h(k, i) = (h(k) + i) \pmod m$$
- **Primary Clustering**: Clusters grow and merge into large blocks, increasing expected probe length.

#### B. Quadratic Probing:
$$h(k, i) = (h(k) + c_1 i + c_2 i^2) \pmod m$$
- Jumps across primary clusters, but identical initial hashes follow identical probe paths (**Secondary Clustering**).

#### C. Double Hashing:
$$h(k, i) = (h_1(k) + i \cdot h_2(k)) \pmod m$$
- To ensure full table traversal, $h_2(k)$ must be coprime to $m$ ($\gcd(h_2(k), m) = 1$) and $h_2(k) \ne 0$. For prime $m$:
  $$h_1(k) = k \pmod m, \quad h_2(k) = 1 + (k \pmod{m - 1})$$

---

### 3. Production Multi-Language Implementation

#### C++20 Open Addressing Hash Table with TOMBSTONE Protocol
```cpp
#include <vector>
#include <string>
#include <stdexcept>
#include <optional>

template <typename K, typename V>
class OpenAddressingMap {
private:
    enum class State { EMPTY, OCCUPIED, TOMBSTONE };

    struct Entry {
        K key;
        V value;
        State state = State::EMPTY;
    };

    std::vector<Entry> table_;
    size_t capacity_;
    size_t size_;
    size_t tombstones_;

    size_t hash1(const K& key) const {
        return std::hash<K>{}(key) % capacity_;
    }

    size_t hash2(const K& key) const {
        // Must be non-zero and coprime to prime capacity
        size_t h = std::hash<K>{}(key) % (capacity_ - 1);
        return 1 + h;
    }

public:
    explicit OpenAddressingMap(size_t cap = 11)
        : capacity_(cap), size_(0), tombstones_(0), table_(cap) {}

    bool insert(const K& key, const V& value) {
        if ((size_ + tombstones_) * 10 >= capacity_ * 7) {
            rehash(capacity_ * 2 + 1); // Expand prime
        }

        size_t h1 = hash1(key);
        size_t h2 = hash2(key);
        size_t first_tombstone = capacity_;

        for (size_t i = 0; i < capacity_; ++i) {
            size_t idx = (h1 + i * h2) % capacity_;
            if (table_[idx].state == State::EMPTY) {
                size_t dest = (first_tombstone != capacity_) ? first_tombstone : idx;
                table_[dest].key = key;
                table_[dest].value = value;
                table_[dest].state = State::OCCUPIED;
                if (first_tombstone != capacity_) --tombstones_;
                ++size_;
                return true;
            }
            if (table_[idx].state == State::TOMBSTONE && first_tombstone == capacity_) {
                first_tombstone = idx;
            }
            if (table_[idx].state == State::OCCUPIED && table_[idx].key == key) {
                table_[idx].value = value;
                return false; // Updated existing key
            }
        }
        return false;
    }

    std::optional<V> find(const K& key) const {
        size_t h1 = hash1(key);
        size_t h2 = hash2(key);
        for (size_t i = 0; i < capacity_; ++i) {
            size_t idx = (h1 + i * h2) % capacity_;
            if (table_[idx].state == State::EMPTY) {
                return std::nullopt; // Search terminates
            }
            if (table_[idx].state == State::OCCUPIED && table_[idx].key == key) {
                return table_[idx].value;
            }
            // If TOMBSTONE, continue probing!
        }
        return std::nullopt;
    }

    bool erase(const K& key) {
        size_t h1 = hash1(key);
        size_t h2 = hash2(key);
        for (size_t i = 0; i < capacity_; ++i) {
            size_t idx = (h1 + i * h2) % capacity_;
            if (table_[idx].state == State::EMPTY) {
                return false;
            }
            if (table_[idx].state == State::OCCUPIED && table_[idx].key == key) {
                table_[idx].state = State::TOMBSTONE;
                --size_;
                ++tombstones_;
                return true;
            }
        }
        return false;
    }

private:
    void rehash(size_t new_cap) {
        std::vector<Entry> old_table = std::move(table_);
        capacity_ = new_cap;
        table_.assign(capacity_, Entry{});
        size_ = 0;
        tombstones_ = 0;
        for (auto& entry : old_table) {
            if (entry.state == State::OCCUPIED) {
                insert(entry.key, entry.value);
            }
        }
    }
};
```

---

### 4. Key Takeaways

1. **Chaining vs. Open Addressing**: Chaining uses external linked lists with pointer overhead; Open Addressing stores all keys directly in the array and requires $\alpha < 1.0$.
2. **TOMBSTONE Necessity**: Open Addressing must mark deleted slots with `TOMBSTONE` to prevent search chains from severing prematurely.
3. **Primary Clustering**: Linear probing produces contiguous clumps of occupied slots, degrading average search time.
4. **Double Hashing Superiority**: Using a key-dependent step size $h_2(k)$ coprime to prime $m$ yields independent probe permutations, eliminating clustering.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 11: *Hash Tables*. MIT Press.
2. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.4: *Hashing*. Addison-Wesley.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 3.4: *Hash Tables*. Addison-Wesley.
