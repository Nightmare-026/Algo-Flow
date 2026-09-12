import type { LearningModule, LearningChapter } from "./types";

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: "part-00-front-matter",
    partNumber: 0,
    slug: "front-matter",
    title: "Front Matter & DSA Roadmap",
    folderName: "Part-00-Front-Matter",
    shortDescription:
      "Master the curriculum orientation, complete study roadmaps, mathematical notation, and asymptotic Big-O quick reference.",
    iconName: "Compass",
    colorTone: "emerald",
    chapters: [
      {
        id: "cover-and-purpose",
        title: "Curriculum Philosophy & Learning Framework",
        slug: "cover-and-purpose",
        fileName: "01_cover_and_purpose.md",
        folderName: "Part-00-Front-Matter",
        order: 1,
        description:
          "Foundational principles of the curriculum: active recall, visual intuition, and mathematical rigor.",
        topicsCovered: [
          "Curriculum Philosophy",
          "Study Protocol",
          "Bloom's Taxonomy for Algorithms",
        ],
      },
      {
        id: "dsa-roadmap",
        title: "Comprehensive DSA Learning Roadmap",
        slug: "dsa-roadmap",
        fileName: "02_dsa_roadmap.md",
        folderName: "Part-00-Front-Matter",
        order: 2,
        description:
          "End-to-end phased study roadmap from elementary complexity analysis to advanced tree decompositions.",
        topicsCovered: [
          "Phase 1-4 Milestones",
          "Prerequisite Graph",
          "Topic Dependency Architecture",
        ],
      },
      {
        id: "notation-and-symbols",
        title: "Mathematical Notation & Symbols Reference",
        slug: "notation-and-symbols",
        fileName: "03_notation_and_symbols.md",
        folderName: "Part-00-Front-Matter",
        order: 3,
        description:
          "Complete glossary of set theory, asymptotic bounds, discrete math symbols, and recurrence notation.",
        topicsCovered: ["Set Notation", "Summations & Logarithms", "Graph Formalisms"],
      },
      {
        id: "complexity-quick-ref",
        title: "Complexity & Big-O Quick Reference",
        slug: "complexity-quick-ref",
        fileName: "04_complexity_quick_ref.md",
        folderName: "Part-00-Front-Matter",
        order: 4,
        description:
          "Compact reference tables for time and space complexities of all major data structures and algorithms.",
        topicsCovered: [
          "Array vs Linked List vs Hash Table",
          "Tree & Graph Operations",
          "Sorting Bounds",
        ],
      },
    ],
  },
  {
    id: "part-01-foundations",
    partNumber: 1,
    slug: "foundations",
    title: "Algorithmic Foundations",
    folderName: "Part-01-Foundations",
    shortDescription:
      "Understand what data structures actually are, problem-solving methodologies, formal asymptotic analysis, and recursion call stack physics.",
    iconName: "Cpu",
    colorTone: "sky",
    chapters: [
      {
        id: "data-and-algorithms",
        title: "Data, Data Structures & Algorithms",
        slug: "data-and-algorithms",
        fileName: "01_data_and_algorithms.md",
        folderName: "Part-01-Foundations",
        order: 1,
        description:
          "Distinguish raw data from semantic information, primitive vs composite memory representations, and ADTs vs concrete structures.",
        topicsCovered: [
          "What is Data?",
          "Abstract Data Types",
          "Characteristics of Good Algorithms",
        ],
      },
      {
        id: "problem-solving-methodology",
        title: "Problem Solving Methodology",
        slug: "problem-solving-methodology",
        fileName: "02_problem_solving_methodology.md",
        folderName: "Part-01-Foundations",
        order: 2,
        description:
          "Polya's 4-step framework, constraint analysis, input scale implications, edge-case checklists, and systematic optimization.",
        topicsCovered: [
          "Understand & Deconstruct",
          "State Space Reduction",
          "Verification & Edge Cases",
        ],
      },
      {
        id: "asymptotic-analysis",
        title: "Asymptotic Analysis & Growth Rates",
        slug: "asymptotic-analysis",
        fileName: "03_asymptotic_analysis.md",
        folderName: "Part-01-Foundations",
        order: 3,
        description:
          "Formal limits for Big-O, Big-Omega, Big-Theta, Little-o/omega, amortized analysis (accounting & potential methods), and space complexity.",
        topicsCovered: [
          "Formal Limit Definitions",
          "Amortized Analysis",
          "Auxiliary Space vs Input Space",
        ],
      },
      {
        id: "recursion-and-recurrences",
        title: "Recursion, Recurrence Relations & the Call Stack",
        slug: "recursion-and-recurrences",
        fileName: "04_recursion_and_recurrences.md",
        folderName: "Part-01-Foundations",
        order: 4,
        description:
          "Stack frame anatomy, base case invariants, recursion trees, Master Theorem (all 3 cases), and Akra-Bazzi intuition.",
        topicsCovered: [
          "Call Stack Activation Records",
          "Master Theorem",
          "Tail Call Optimization",
        ],
      },
    ],
  },
  {
    id: "part-02-linear-data-structures",
    partNumber: 2,
    slug: "linear-data-structures",
    title: "Linear Data Structures",
    folderName: "Part-02-Linear-Data-Structures",
    shortDescription:
      "Deep-dive into contiguous and node-based sequences: arrays, dynamic arrays, strings, matrices, linked lists, stacks, queues, and priority queues.",
    iconName: "Layers",
    colorTone: "emerald",
    chapters: [
      {
        id: "arrays-and-dynamic-arrays",
        title: "Arrays & Dynamic Arrays",
        slug: "arrays-and-dynamic-arrays",
        fileName: "01_arrays_and_dynamic_arrays.md",
        folderName: "Part-02-Linear-Data-Structures",
        order: 1,
        description:
          "Contiguous memory addressing proofs, cache lines, amortized doubling geometric series, and memory fragmentation.",
        topicsCovered: [
          "Memory Offsets Formula",
          "Geometric Resizing Proof",
          "Spatial Locality & L1/L2 Caches",
        ],
        visualizerLinks: [
          { slug: "array-access", title: "Array Access", description: "O(1) memory index access" },
        ],
      },
      {
        id: "strings-and-matrices",
        title: "Strings & Matrices",
        slug: "strings-and-matrices",
        fileName: "02_strings_and_matrices.md",
        folderName: "Part-02-Linear-Data-Structures",
        order: 2,
        description:
          "String immutability, UTF-8 vs UTF-16, row-major vs column-major matrix flattening, cache-friendly traversals, and sparse matrices.",
        topicsCovered: [
          "String Encodings & Slicing",
          "Row-Major Index Flattening",
          "Matrix Transposition",
        ],
      },
      {
        id: "singly-linked-lists",
        title: "Singly Linked Lists",
        slug: "singly-linked-lists",
        fileName: "03_singly_linked_lists.md",
        folderName: "Part-02-Linear-Data-Structures",
        order: 3,
        description:
          "Node pointer architecture, in-place 3-pointer reversal invariants, fast/slow Floyd cycle detection mathematical proofs.",
        topicsCovered: ["In-place Pointer Reversal", "Floyd's Tortoise & Hare", "Sentinel Nodes"],
        visualizerLinks: [
          {
            slug: "sll-traversal",
            title: "Linked List Traversal",
            description: "Step through node pointer links",
          },
        ],
      },
      {
        id: "doubly-and-circular-linked-lists",
        title: "Doubly & Circular Linked Lists",
        slug: "doubly-and-circular-linked-lists",
        fileName: "04_doubly_and_circular_linked_lists.md",
        folderName: "Part-02-Linear-Data-Structures",
        order: 4,
        description:
          "Bidirectional pointer maintenance, sentinel heads/tails, O(1) arbitrary node deletion, circular ring buffers, and Josephus problem.",
        topicsCovered: [
          "Sentinel Boundary Elimination",
          "Circular Ring Pointers",
          "Josephus Simulation",
        ],
      },
      {
        id: "specialized-linked-lists",
        title: "Specialized & Advanced Linked Lists",
        slug: "specialized-linked-lists",
        fileName: "05_specialized_linked_lists.md",
        folderName: "Part-02-Linear-Data-Structures",
        order: 5,
        description:
          "Skip Lists probabilistic multi-level towers, Unrolled Linked Lists for B-tree cache locality, and memory-efficient XOR lists.",
        topicsCovered: [
          "Skip Lists O(log n) Search",
          "Unrolled Linked Lists",
          "Bitwise XOR Node Pointers",
        ],
      },
      {
        id: "stacks",
        title: "Stacks & Applications",
        slug: "stacks",
        fileName: "06_stacks.md",
        folderName: "Part-02-Linear-Data-Structures",
        order: 6,
        description:
          "LIFO formal specification, array vs linked implementations, Dijkstra's Shunting-Yard expression parsing, and balanced brackets.",
        topicsCovered: [
          "LIFO Invariants",
          "Shunting-Yard Infix to Postfix",
          "Function Call Stack Emulation",
        ],
        visualizerLinks: [
          {
            slug: "stack-push-pop",
            title: "Stack Operations",
            description: "Push, Pop, and Peek visualizer",
          },
        ],
      },
      {
        id: "queues-and-circular-queues",
        title: "Queues & Circular Queues",
        slug: "queues-and-circular-queues",
        fileName: "07_queues_and_circular_queues.md",
        folderName: "Part-02-Linear-Data-Structures",
        order: 7,
        description:
          "FIFO mechanics, array false-overflow failure mode, modulo arithmetic ring buffers, lock-free queue primitives.",
        topicsCovered: ["Modulo Pointer Arithmetic", "Circular Ring Buffers", "Queue via Stacks"],
        visualizerLinks: [
          {
            slug: "queue-enqueue-dequeue",
            title: "Queue Operations",
            description: "FIFO enqueue and dequeue",
          },
        ],
      },
      {
        id: "deques-and-priority-queues",
        title: "Deques & Priority Queue ADTs",
        slug: "deques-and-priority-queues",
        fileName: "08_deques_and_priority_queues.md",
        folderName: "Part-02-Linear-Data-Structures",
        order: 8,
        description:
          "Double-ended queues, sliding window maximums, priority queue abstract contracts, and comparing array vs heap vs BST implementations.",
        topicsCovered: [
          "Double-Ended Invariants",
          "Sliding Window Monotonic Deque",
          "Priority Queue Trade-offs",
        ],
      },
    ],
  },
  {
    id: "part-03-hashing",
    partNumber: 3,
    slug: "hashing",
    title: "Hashing & Constant-Time Lookups",
    folderName: "Part-03-Hashing",
    shortDescription:
      "Explore hash functions, load factor dynamics, separate chaining, open addressing probes, Robin Hood, and probabilistic Bloom filters.",
    iconName: "Hash",
    colorTone: "purple",
    chapters: [
      {
        id: "hashing-foundations",
        title: "Foundations, Hash Functions & Load Factor",
        slug: "hashing-foundations",
        fileName: "01_hashing_foundations.md",
        folderName: "Part-03-Hashing",
        order: 1,
        description:
          "Universal hashing, avalanche effect, MurmurHash/xxHash principles, modulo prime bucket sizing, and load factor threshold theorem.",
        topicsCovered: [
          "Avalanche Effect",
          "Prime Sizing & Uniform Distribution",
          "Load Factor Alpha",
        ],
      },
      {
        id: "collision-resolution",
        title: "Collision Resolution Techniques",
        slug: "collision-resolution",
        fileName: "02_collision_resolution.md",
        folderName: "Part-03-Hashing",
        order: 2,
        description:
          "Separate Chaining vs Open Addressing: Linear Probing (primary clustering), Quadratic Probing, and Double Hashing.",
        topicsCovered: [
          "Separate Chaining",
          "Primary & Secondary Clustering",
          "Double Hashing Step Size",
        ],
        visualizerLinks: [
          {
            slug: "hash-table-chaining",
            title: "Separate Chaining",
            description: "Hash collision resolution",
          },
          {
            slug: "hash-table-linear-probing",
            title: "Linear Probing",
            description: "Open addressing probes",
          },
        ],
      },
      {
        id: "hash-table-hash-map-hash-set",
        title: "Hash Table, Hash Map & Hash Set Architectures",
        slug: "hash-table-hash-map-hash-set",
        fileName: "03_hash_table_hash_map_hash_set.md",
        folderName: "Part-03-Hashing",
        order: 3,
        description:
          "Production implementations: Java 8+ HashMap treeification (Red-Black trees at threshold 8), Python 3.6+ compact dense arrays, and Set operations.",
        topicsCovered: [
          "Java HashMap Treeification",
          "Python Compact Hash Table",
          "Set Union & Intersection",
        ],
      },
      {
        id: "advanced-hashing-and-probabilistic",
        title: "Advanced & Probabilistic Hashing",
        slug: "advanced-hashing-and-probabilistic",
        fileName: "04_advanced_hashing_and_probabilistic.md",
        folderName: "Part-03-Hashing",
        order: 4,
        description:
          "Cuckoo Hashing with guaranteed O(1) worst-case lookups, Robin Hood probing PSL variance minimization, and Bloom Filters false-positive math.",
        topicsCovered: [
          "Cuckoo Eviction Cycles",
          "Robin Hood PSL Balance",
          "Bloom Filter Math Proof",
        ],
      },
    ],
  },
  {
    id: "part-04-searching",
    partNumber: 4,
    slug: "searching",
    title: "Searching Paradigms",
    folderName: "Part-04-Searching",
    shortDescription:
      "Master linear search, binary search invariants, lower/upper bounds, rotated arrays, and binary search on monotonic answer spaces.",
    iconName: "Search",
    colorTone: "teal",
    chapters: [
      {
        id: "linear-and-binary-search",
        title: "Linear & Binary Search",
        slug: "linear-and-binary-search",
        fileName: "01_linear_and_binary_search.md",
        folderName: "Part-04-Searching",
        order: 1,
        description:
          "Unordered scanning vs divide-and-conquer, 3 invariant formulations, avoiding integer overflow via mid = low + (high - low) / 2.",
        topicsCovered: [
          "Binary Search Loop Invariant",
          "Integer Overflow Mitigation",
          "Search Space Halving",
        ],
        visualizerLinks: [
          {
            slug: "binary-search",
            title: "Binary Search Visualizer",
            description: "Step through logarithmic search",
          },
        ],
      },
      {
        id: "bounds-and-occurrences",
        title: "Lower Bound, Upper Bound & Element Occurrences",
        slug: "bounds-and-occurrences",
        fileName: "02_bounds_and_occurrences.md",
        folderName: "Part-04-Searching",
        order: 2,
        description:
          "C++ std::lower_bound and upper_bound behavior, first and last occurrence extraction, and range frequency calculations.",
        topicsCovered: [
          "Strict vs Non-Strict Predicates",
          "First Occurrence Index",
          "Target Count in O(log n)",
        ],
      },
      {
        id: "search-space-and-rotated",
        title: "Rotated Arrays & Binary Search on Answer Space",
        slug: "search-space-and-rotated",
        fileName: "03_search_space_and_rotated.md",
        folderName: "Part-04-Searching",
        order: 3,
        description:
          "Inflection point pivot discovery in rotated sorted arrays, handling duplicates, and optimizing on monotonic feasibility predicates.",
        topicsCovered: [
          "Rotated Array Pivot Detection",
          "Binary Search on Answer Space",
          "Monotonic Feasibility F(x)",
        ],
      },
    ],
  },
  {
    id: "part-05-sorting",
    partNumber: 5,
    slug: "sorting",
    title: "Sorting Algorithms & Theory",
    folderName: "Part-05-Sorting",
    shortDescription:
      "From elementary O(n²) sorts to divide-and-conquer, non-comparison linear sorts, and mathematical proofs of the Omega(n log n) lower bound.",
    iconName: "ArrowUpDown",
    colorTone: "amber",
    chapters: [
      {
        id: "elementary-sorts",
        title: "Elementary O(n²) Sorting Algorithms",
        slug: "elementary-sorts",
        fileName: "01_elementary_sorts.md",
        folderName: "Part-05-Sorting",
        order: 1,
        description:
          "Bubble Sort with early exit flag, Selection Sort minimal write guarantees, and Insertion Sort online adaptive behavior.",
        topicsCovered: [
          "Bubble Sort Invariants",
          "Selection Sort Unstable Swaps",
          "Insertion Sort Adaptive Shifts",
        ],
        visualizerLinks: [
          {
            slug: "bubble-sort",
            title: "Bubble Sort",
            description: "Visual pairwise adjacent swaps",
          },
          {
            slug: "selection-sort",
            title: "Selection Sort",
            description: "Visual minimum scan and placement",
          },
          {
            slug: "insertion-sort",
            title: "Insertion Sort",
            description: "Visual card-in-hand shifts",
          },
        ],
      },
      {
        id: "divide-and-conquer-sorts",
        title: "Divide & Conquer and Heap Sorts",
        slug: "divide-and-conquer-sorts",
        fileName: "02_divide_and_conquer_sorts.md",
        folderName: "Part-05-Sorting",
        order: 2,
        description:
          "Merge Sort stable O(n log n) tree, Quick Sort Lomuto vs Hoare partitioning and median-of-three, and in-place Heap Sort.",
        topicsCovered: [
          "Merge Sort Subarray Merging",
          "Hoare vs Lomuto Partitioning",
          "Heap Sort Sift-Down",
        ],
        visualizerLinks: [
          {
            slug: "merge-sort",
            title: "Merge Sort",
            description: "Visual recursive splitting and merging",
          },
          { slug: "quick-sort", title: "Quick Sort", description: "Visual pivot partitioning" },
        ],
      },
      {
        id: "linear-time-sorts",
        title: "Non-Comparison Linear Time Sorts",
        slug: "linear-time-sorts",
        fileName: "03_linear_time_sorts.md",
        folderName: "Part-05-Sorting",
        order: 3,
        description:
          "Breaking the comparison barrier: Counting Sort prefix-sum stability, Radix Sort digit-by-digit passes, and Bucket Sort uniform hashing.",
        topicsCovered: [
          "Counting Sort Cumulative Array",
          "Radix LSD vs MSD Passes",
          "Bucket Sort Distribution",
        ],
      },
      {
        id: "sorting-theory-comparison",
        title: "Sorting Theory, Stability & The Omega(n log n) Lower Bound",
        slug: "sorting-theory-comparison",
        fileName: "04_sorting_theory_comparison.md",
        folderName: "Part-05-Sorting",
        order: 4,
        description:
          "Decision tree lower-bound proof (log(n!) = Omega(n log n)), stability analysis across compound records, and hybrid TimSort architecture.",
        topicsCovered: ["Decision Tree Lower Bound", "Stability Proof", "TimSort Galloping Mode"],
      },
    ],
  },
  {
    id: "part-06-trees",
    partNumber: 6,
    slug: "trees",
    title: "Trees & Hierarchical Structures",
    folderName: "Part-06-Trees",
    shortDescription:
      "Comprehensive hierarchical data structures: binary trees, traversals, BST, AVL self-balancing, Red-Black trees, Splay, Heaps, B-Trees, and Tries.",
    iconName: "Network",
    colorTone: "emerald",
    chapters: [
      {
        id: "tree-fundamentals",
        title: "Tree Fundamentals & Binary Tree Varieties",
        slug: "tree-fundamentals",
        fileName: "01_tree_fundamentals.md",
        folderName: "Part-06-Trees",
        order: 1,
        description:
          "Hierarchical terminology, mathematical relationship between edges and nodes (E = V - 1), full vs complete vs perfect binary trees.",
        topicsCovered: [
          "Nodes & Edges Theorem",
          "Complete vs Full vs Perfect",
          "Tree Height & Depth",
        ],
      },
      {
        id: "tree-traversals",
        title: "Tree Traversals (DFS, BFS & Morris Traversals)",
        slug: "tree-traversals",
        fileName: "02_tree_traversals.md",
        folderName: "Part-06-Trees",
        order: 2,
        description:
          "Preorder, Inorder, Postorder recursive and iterative patterns, Level-order BFS, and Morris Inorder O(1) space threading.",
        topicsCovered: [
          "Recursive vs Iterative DFS",
          "BFS Level-Order Queues",
          "Morris Threaded Traversal O(1) Space",
        ],
        visualizerLinks: [
          {
            slug: "binary-tree-traversals",
            title: "Tree Traversals",
            description: "Visual BFS and DFS orderings",
          },
        ],
      },
      {
        id: "binary-search-trees",
        title: "Binary Search Trees (BST)",
        slug: "binary-search-trees",
        fileName: "03_binary_search_trees.md",
        folderName: "Part-06-Trees",
        order: 3,
        description:
          "BST ordering invariant, search and insertion mechanics, and the 3-case deletion algorithm (no child, 1 child, 2 children).",
        topicsCovered: [
          "BST Ordering Invariant",
          "Inorder Predecessor / Successor",
          "3-Case Deletion Surgery",
        ],
        visualizerLinks: [
          {
            slug: "bst-search-insert",
            title: "BST Search & Insert",
            description: "Visual path traversal",
          },
        ],
      },
      {
        id: "avl-trees",
        title: "AVL Trees & Self-Balancing Rotations",
        slug: "avl-trees",
        fileName: "04_avl_trees.md",
        folderName: "Part-06-Trees",
        order: 4,
        description:
          "Height-balance factor BF in {-1, 0, 1}, and the 4 fundamental rotation algorithms: Left-Left, Right-Right, Left-Right, and Right-Left.",
        topicsCovered: [
          "Balance Factor Definition",
          "Single Rotations (LL, RR)",
          "Double Rotations (LR, RL)",
        ],
        visualizerLinks: [
          {
            slug: "avl-rotations",
            title: "AVL Rotations",
            description: "Visual self-balancing rebalance steps",
          },
        ],
      },
      {
        id: "red-black-trees",
        title: "Red-Black Trees (RBT)",
        slug: "red-black-trees",
        fileName: "05_red_black_trees.md",
        folderName: "Part-06-Trees",
        order: 5,
        description:
          "The 5 fundamental RBT invariants, black-height mathematical proof, 3-case insertion recoloring/rotations, and 4-case deletion handling.",
        topicsCovered: [
          "5 Red-Black Invariants",
          "Black-Height Invariant Proof",
          "Uncle Node Color Cases",
        ],
      },
      {
        id: "splay-trees-and-treaps",
        title: "Splay Trees & Treaps (Randomized BST)",
        slug: "splay-trees-and-treaps",
        fileName: "06_splay_trees_and_treaps.md",
        folderName: "Part-06-Trees",
        order: 6,
        description:
          "Splay tree self-adjusting zig/zig-zig/zig-zag rotations, amortized O(log n) potential method, and Treap dual heap-priority invariants.",
        topicsCovered: [
          "Splay Rotations to Root",
          "Amortized O(log n) Guarantee",
          "Treap Priority Heap Property",
        ],
      },
      {
        id: "heaps-and-priority-queues",
        title: "Heaps & Priority Queues",
        slug: "heaps-and-priority-queues",
        fileName: "07_heaps_and_priority_queues.md",
        folderName: "Part-06-Trees",
        order: 7,
        description:
          "Array representation of complete binary trees, sift-up/down, mathematical proof of O(n) bottom-up Build-Heap, and D-ary heaps.",
        topicsCovered: [
          "Array Parent-Child Index Math",
          "O(n) Build-Heap Geometric Proof",
          "Sift-Up vs Sift-Down",
        ],
      },
      {
        id: "multiway-trees-b-trees",
        title: "Multiway Trees, B-Trees & B+ Trees",
        slug: "multiway-trees-b-trees",
        fileName: "08_multiway_trees_b_trees.md",
        folderName: "Part-06-Trees",
        order: 8,
        description:
          "Storage page disk access latency, B-Tree (M-way) balancing invariants, proactive node splitting, and B+ Tree leaf linked-list sequential scans.",
        topicsCovered: [
          "Disk Block I/O Bottlenecks",
          "B-Tree Node Splitting",
          "B+ Tree Sequential Leaves",
        ],
      },
      {
        id: "tries-and-string-trees",
        title: "Tries, Radix Trees & Bitwise 0-1 Structures",
        slug: "tries-and-string-trees",
        fileName: "09_tries_and_string_trees.md",
        folderName: "Part-06-Trees",
        order: 9,
        description:
          "Standard prefix Trie node maps, prefix query matching, Radix / Patricia compressed edges, and Bitwise 0-1 Trie for maximum XOR queries.",
        topicsCovered: [
          "Prefix Tree Node Arrays",
          "Radix Tree Path Compression",
          "0-1 Bitwise XOR Trie",
        ],
      },
      {
        id: "spatial-and-specialized-trees",
        title: "Spatial & Specialized Trees (Kd-Trees, Quadtrees, Cartesian)",
        slug: "spatial-and-specialized-trees",
        fileName: "10_spatial_and_specialized_trees.md",
        folderName: "Part-06-Trees",
        order: 10,
        description:
          "Multi-dimensional spatial partitioning: Kd-Trees with k-NN bounding box pruning, Quadtrees, Cartesian trees, and Threaded Binary Trees.",
        topicsCovered: [
          "Kd-Tree Alternating Hyperplanes",
          "Quadtree Spatial Grid",
          "Cartesian Tree Range Minimum",
        ],
      },
    ],
  },
  {
    id: "part-07-graphs",
    partNumber: 7,
    slug: "graphs",
    title: "Graph Theory & Network Algorithms",
    folderName: "Part-07-Graphs",
    shortDescription:
      "Master graph topologies, adjacency architectures, BFS/DFS, DAG topological sorting, Dijkstra, Bellman-Ford, Prim, Kruskal, and DSU.",
    iconName: "Share2",
    colorTone: "indigo",
    chapters: [
      {
        id: "graph-types-and-taxonomy",
        title: "Graph Types & Master Taxonomy",
        slug: "graph-types-and-taxonomy",
        fileName: "01_graph_types_and_taxonomy.md",
        folderName: "Part-07-Graphs",
        order: 1,
        description:
          "Formal graph definitions (V, E), directed vs undirected, weighted, cyclic/acyclic, bipartite verification, and Handshaking Lemma.",
        topicsCovered: [
          "Handshaking Lemma Sum of Degrees",
          "Bipartite Graph Chromatics",
          "DAG Topologies",
        ],
      },
      {
        id: "graph-storage-architectures",
        title: "Graph Storage Architectures & Data Structures",
        slug: "graph-storage-architectures",
        fileName: "02_graph_storage_architectures.md",
        folderName: "Part-07-Graphs",
        order: 2,
        description:
          "Adjacency Matrix vs Adjacency List vs Edge List trade-offs, Compressed Sparse Row (CSR) for HPC, and incidence representations.",
        topicsCovered: [
          "Space vs Lookup Trade-offs",
          "Compressed Sparse Row (CSR)",
          "Edge List for Greedy MST",
        ],
      },
      {
        id: "traversals-and-cycles",
        title: "Graph Traversals, Cycles & Connectivity",
        slug: "traversals-and-cycles",
        fileName: "03_traversals_and_cycles.md",
        folderName: "Part-07-Graphs",
        order: 3,
        description:
          "Breadth-First Search (queue, shortest unweighted path), Depth-First Search (call stack, tree/back/forward edges), and cycle detection.",
        topicsCovered: [
          "BFS Queue Shortest Path",
          "DFS Edge Classification",
          "Cycle Detection (3 Colors)",
        ],
        visualizerLinks: [
          {
            slug: "graph-bfs",
            title: "Graph BFS",
            description: "Visual breadth-first wave exploration",
          },
          {
            slug: "graph-dfs",
            title: "Graph DFS",
            description: "Visual depth-first backtracking exploration",
          },
        ],
      },
      {
        id: "topological-sort-and-dags",
        title: "Topological Sorting & Directed Acyclic Graphs",
        slug: "topological-sort-and-dags",
        fileName: "04_topological_sort_and_dags.md",
        folderName: "Part-07-Graphs",
        order: 4,
        description:
          "Linear dependency orderings: Kahn's in-degree BFS algorithm, DFS reverse post-order, and detecting cyclic dependency deadlocks.",
        topicsCovered: [
          "Kahn's BFS In-Degree Zero",
          "DFS Reverse Post-Order",
          "Cycle Detection in Build Graphs",
        ],
        visualizerLinks: [
          {
            slug: "topological-sort",
            title: "Topological Sort",
            description: "Visual DAG linear ordering",
          },
        ],
      },
      {
        id: "shortest-paths",
        title: "Shortest Path Algorithms",
        slug: "shortest-paths",
        fileName: "05_shortest_paths.md",
        folderName: "Part-07-Graphs",
        order: 5,
        description:
          "Single-source and all-pairs: Dijkstra's greedy min-heap, Bellman-Ford negative edge relaxation and negative cycle detection, and Floyd-Warshall.",
        topicsCovered: [
          "Dijkstra's Min-Heap Relaxation",
          "Bellman-Ford V-1 Passes",
          "Floyd-Warshall Dynamic Programming",
        ],
        visualizerLinks: [
          {
            slug: "dijkstra",
            title: "Dijkstra's Algorithm",
            description: "Visual priority queue shortest paths",
          },
          {
            slug: "bellman-ford",
            title: "Bellman-Ford",
            description: "Visual edge relaxation passes",
          },
        ],
      },
      {
        id: "spanning-trees-and-dsu",
        title: "Minimum Spanning Trees & Disjoint Set Union",
        slug: "spanning-trees-and-dsu",
        fileName: "06_spanning_trees_and_dsu.md",
        folderName: "Part-07-Graphs",
        order: 6,
        description:
          "Cut property theorem, Prim's greedy vertex expansion, Kruskal's edge sorting, and Disjoint Set Union (DSU) with path compression and rank.",
        topicsCovered: [
          "Cut Property Proof",
          "Prim's vs Kruskal's",
          "DSU Inverse Ackermann O(alpha(n))",
        ],
        visualizerLinks: [
          {
            slug: "kruskal",
            title: "Kruskal's MST",
            description: "Visual edge sort and DSU union",
          },
          { slug: "prim", title: "Prim's MST", description: "Visual growing cut vertex expansion" },
        ],
      },
    ],
  },
  {
    id: "part-08-algorithm-design-techniques",
    partNumber: 8,
    slug: "algorithm-design-techniques",
    title: "Algorithm Design Paradigms",
    folderName: "Part-08-Algorithm-Design-Techniques",
    shortDescription:
      "Understand core algorithmic meta-heuristics: Brute Force, Divide & Conquer, Greedy choice theorems, Backtracking pruning, and Dynamic Programming.",
    iconName: "BrainCircuit",
    colorTone: "purple",
    chapters: [
      {
        id: "brute-force-and-divide-conquer",
        title: "Brute Force & Divide and Conquer",
        slug: "brute-force-and-divide-conquer",
        fileName: "01_brute_force_and_divide_conquer.md",
        folderName: "Part-08-Algorithm-Design-Techniques",
        order: 1,
        description:
          "Exhaustive search spaces, power sets, permutations, dividing into non-overlapping subproblems, and recombining solutions.",
        topicsCovered: [
          "Exhaustive Search Spaces",
          "Optimal Subproblems",
          "Divide & Conquer Recurrences",
        ],
      },
      {
        id: "greedy-algorithms",
        title: "The Greedy Paradigm & Greedy vs DP",
        slug: "greedy-algorithms",
        fileName: "02_greedy_algorithms.md",
        folderName: "Part-08-Algorithm-Design-Techniques",
        order: 2,
        description:
          "Greedy-choice property, optimal substructure, exchange arguments and matroid theory, and identifying when greedy fails where DP succeeds.",
        topicsCovered: [
          "Greedy Choice Property",
          "Exchange Argument Proof",
          "Activity Selection & Fractional Knapsack",
        ],
      },
      {
        id: "backtracking",
        title: "Backtracking & State Space Trees",
        slug: "backtracking",
        fileName: "03_backtracking.md",
        folderName: "Part-08-Algorithm-Design-Techniques",
        order: 3,
        description:
          "Systematic state space tree exploration, explicit choice-make-unmake invariants, branch pruning bounding functions, and N-Queens/Sudoku.",
        topicsCovered: [
          "State Space Tree Pruning",
          "Choice-Explore-Unmake Pattern",
          "Constraint Satisfaction (CSP)",
        ],
      },
      {
        id: "dynamic-programming",
        title: "Dynamic Programming (DP)",
        slug: "dynamic-programming",
        fileName: "04_dynamic_programming.md",
        folderName: "Part-08-Algorithm-Design-Techniques",
        order: 4,
        description:
          "Overlapping subproblems + optimal substructure, Top-Down Memoization vs Bottom-Up Tabulation, state representation, transitions, and space reduction.",
        topicsCovered: [
          "State Dimension Formulation",
          "Transition Equations",
          "Rolling Array Space Optimization",
        ],
      },
    ],
  },
  {
    id: "part-09-problem-solving-patterns",
    partNumber: 9,
    slug: "problem-solving-patterns",
    title: "Interview & Competitive Patterns",
    folderName: "Part-09-Problem-Solving-Patterns",
    shortDescription:
      "Core tactical patterns that solve hundreds of interview problems: two pointers, sliding window, prefix sums, monotonic stacks, and interval merging.",
    iconName: "Target",
    colorTone: "rose",
    chapters: [
      {
        id: "array-and-pointer-patterns",
        title: "Array & Pointer Patterns",
        slug: "array-and-pointer-patterns",
        fileName: "01_array_and_pointer_patterns.md",
        folderName: "Part-09-Problem-Solving-Patterns",
        order: 1,
        description:
          "Prefix sums, 2D prefix sums, Difference Arrays for range updates in O(1), Opposite-Direction Two Pointers, and Dynamic Sliding Windows.",
        topicsCovered: [
          "Prefix Sums & 2D Ranges",
          "Difference Arrays for Range Updates",
          "Dynamic Sliding Window Template",
        ],
      },
      {
        id: "monotonic-data-structures",
        title: "Monotonic Data Structures",
        slug: "monotonic-data-structures",
        fileName: "02_monotonic_data_structures.md",
        folderName: "Part-09-Problem-Solving-Patterns",
        order: 2,
        description:
          "Monotonic Stack for Next Greater / Previous Smaller Element in linear time, Largest Rectangle in Histogram, and Monotonic Queue for sliding windows.",
        topicsCovered: [
          "Next Greater Element Pattern",
          "Largest Rectangle in Histogram",
          "Monotonic Deque Window Min/Max",
        ],
      },
      {
        id: "core-interview-patterns",
        title: "Core Interview & Competitive Patterns",
        slug: "core-interview-patterns",
        fileName: "03_core_interview_patterns.md",
        folderName: "Part-09-Problem-Solving-Patterns",
        order: 3,
        description:
          "Interval merging and insertion, Top-K elements with min-heaps, fast & slow pointers for linked lists, and bitwise manipulation tricks.",
        topicsCovered: [
          "Interval Scheduling & Merging",
          "Top-K Elements via Heap",
          "Bitwise Bitmasking & Kernighan's",
        ],
      },
    ],
  },
  {
    id: "part-10-advanced-dsa",
    partNumber: 10,
    slug: "advanced-dsa",
    title: "Advanced Data Structures & Algorithms",
    folderName: "Part-10-Advanced-DSA",
    shortDescription:
      "High-performance specialized structures: Segment Trees with Lazy Propagation, Fenwick (BIT), Sparse Tables, Tarjan's SCC, KMP, and Tree Decompositions.",
    iconName: "Zap",
    colorTone: "amber",
    chapters: [
      {
        id: "range-query-structures",
        title: "Range Query Data Structures",
        slug: "range-query-structures",
        fileName: "01_range_query_structures.md",
        folderName: "Part-10-Advanced-DSA",
        order: 1,
        description:
          "Segment Trees (point update, range query), Lazy Propagation for range updates, Binary Indexed Trees (Fenwick), and Sparse Tables for static RMQ.",
        topicsCovered: [
          "Segment Tree Array Representation",
          "Lazy Tag Propagation",
          "Fenwick BIT Lowest Set Bit Math",
        ],
      },
      {
        id: "advanced-topics",
        title: "Advanced Graphs, Strings & Dynamic Programming",
        slug: "advanced-topics",
        fileName: "02_advanced_topics.md",
        folderName: "Part-10-Advanced-DSA",
        order: 2,
        description:
          "Tarjan's and Kosaraju's Strongly Connected Components (SCC), Bridges & Articulation Points, KMP string prefix function, and Bitmask DP.",
        topicsCovered: [
          "Tarjan's Low-Link Discovery",
          "Bridges & Articulation Points",
          "KMP Prefix Function (LPS)",
        ],
      },
      {
        id: "tree-decompositions",
        title: "Tree Decompositions & Dynamic Trees",
        slug: "tree-decompositions",
        fileName: "03_tree_decompositions.md",
        folderName: "Part-10-Advanced-DSA",
        order: 3,
        description:
          "Heavy-Light Decomposition (HLD) mapping tree paths to Segment Tree intervals in O(log² n), Centroid Decomposition, and Link-Cut Trees.",
        topicsCovered: [
          "Heavy-Light Decomposition (HLD)",
          "Centroid Divide-and-Conquer",
          "Link-Cut Splay Trees",
        ],
      },
    ],
  },
  {
    id: "part-11-problem-bank-and-revision",
    partNumber: 11,
    slug: "problem-bank-and-revision",
    title: "525+ Problem Bank & Master Revision",
    folderName: "Part-11-Problem-Bank-and-Revision",
    shortDescription:
      "Comprehensive problem bank organized across 7 thematic volumes, common pitfalls, anti-patterns, and master revision cheat sheets.",
    iconName: "BookOpen",
    colorTone: "emerald",
    chapters: [
      {
        id: "arrays-strings-pointers-100",
        title: "Arrays, Strings, Matrices & Pointer Patterns (100 Problems)",
        slug: "arrays-strings-pointers-100",
        fileName: "01_arrays_strings_pointers_100.md",
        folderName: "Part-11-Problem-Bank-and-Revision",
        order: 1,
        description:
          "Curated 100 benchmark problems spanning prefix sums, sliding window, two pointers, matrices, and string parsing.",
        topicsCovered: [
          "100 Solved Problems",
          "Optimal Complexity Analysis",
          "Edge Cases & Gotchas",
        ],
      },
      {
        id: "linked-lists-stacks-queues-60",
        title: "Linked Lists, Stacks, Queues & Monotonic Structures (60 Problems)",
        slug: "linked-lists-stacks-queues-60",
        fileName: "02_linked_lists_stacks_queues_60.md",
        folderName: "Part-11-Problem-Bank-and-Revision",
        order: 2,
        description:
          "60 benchmark problems covering in-place reversals, LRU cache design, monotonic stacks, and ring buffers.",
        topicsCovered: [
          "60 Solved Problems",
          "LRU & LFU Cache Implementations",
          "Monotonic Stack Patterns",
        ],
      },
      {
        id: "hashing-and-search-80",
        title: "Hashing & Binary Search (80 Problems)",
        slug: "hashing-and-search-80",
        fileName: "03_hashing_and_search_80.md",
        folderName: "Part-11-Problem-Bank-and-Revision",
        order: 3,
        description:
          "80 problems mastering hash tables, frequency counters, prefix hash lookups, and binary search on monotonic answer spaces.",
        topicsCovered: [
          "80 Solved Problems",
          "Binary Search on Answer Range",
          "Hash Map Sliding Window",
        ],
      },
      {
        id: "trees-bst-tries-heaps-100",
        title: "Trees, BSTs, Heaps & Tries (100 Problems)",
        slug: "trees-bst-tries-heaps-100",
        fileName: "04_trees_bst_tries_heaps_100.md",
        folderName: "Part-11-Problem-Bank-and-Revision",
        order: 4,
        description:
          "100 problems covering tree traversals, LCA, subtree sums, BST balancing, priority queues, and trie prefix matches.",
        topicsCovered: [
          "100 Solved Problems",
          "Lowest Common Ancestor (LCA)",
          "Median from Data Stream",
        ],
      },
      {
        id: "graphs-and-networks-70",
        title: "Graphs, Traversal, Shortest Paths & MSTs (70 Problems)",
        slug: "graphs-and-networks-70",
        fileName: "05_graphs_and_networks_70.md",
        folderName: "Part-11-Problem-Bank-and-Revision",
        order: 5,
        description:
          "70 problems covering connected components, topological ordering, Dijkstra, Bellman-Ford, Kruskal, and bipartite matching.",
        topicsCovered: [
          "70 Solved Problems",
          "Network Routing & Shortest Paths",
          "Bipartite & Coloring",
        ],
      },
      {
        id: "dynamic-programming-60",
        title: "Dynamic Programming Master Class (60 Problems)",
        slug: "dynamic-programming-60",
        fileName: "06_dynamic_programming_60.md",
        folderName: "Part-11-Problem-Bank-and-Revision",
        order: 6,
        description:
          "60 classical DP problems: 0/1 Knapsack, Unbounded Knapsack, LCS, LIS, Matrix Chain Multiplication, and Digit DP.",
        topicsCovered: [
          "60 Solved Problems",
          "0/1 Knapsack Variants",
          "Longest Common Subsequence",
        ],
      },
      {
        id: "greedy-backtracking-math-advanced-55",
        title: "Greedy, Backtracking, Bit Hacks, Math & Advanced (55 Problems)",
        slug: "greedy-backtracking-math-advanced-55",
        fileName: "07_greedy_backtracking_math_advanced_55.md",
        folderName: "Part-11-Problem-Bank-and-Revision",
        order: 7,
        description:
          "55 problems covering interval scheduling, N-Queens, bitmask combinatorics, prime factorizations, and Segment Trees.",
        topicsCovered: ["55 Solved Problems", "Interval Scheduling", "Bitwise Subset Combinations"],
      },
      {
        id: "pitfalls-and-confusions",
        title: "Hall of Common Pitfalls & Frequently Confused Concepts",
        slug: "pitfalls-and-confusions",
        fileName: "08_pitfalls_and_confusions.md",
        folderName: "Part-11-Problem-Bank-and-Revision",
        order: 8,
        description:
          "Analysis of common mental traps: array pass-by-reference side effects, off-by-one bounds, Dijkstra with negative weights, and recursion limits.",
        topicsCovered: [
          "Off-By-One Index Errors",
          "Dijkstra Negative Edge Trap",
          "Recursive Call Stack Exhaustion",
        ],
      },
      {
        id: "master-revision-sheets",
        title: "Master Revision Sheets & Formula Reference",
        slug: "master-revision-sheets",
        fileName: "09_master_revision_sheets.md",
        folderName: "Part-11-Problem-Bank-and-Revision",
        order: 9,
        description:
          "The ultimate interview cheat sheet: complexity summary matrix, master formula list, and 48-hour interview prep review checklist.",
        topicsCovered: [
          "All Complexity Matrices",
          "Key Invariant Formulas",
          "Last-Minute Interview Checklist",
        ],
      },
    ],
  },
];

export function getAllModules(): LearningModule[] {
  return LEARNING_MODULES;
}

export function getModuleBySlug(slug: string): LearningModule | undefined {
  return LEARNING_MODULES.find((m) => m.slug === slug);
}

export function getChapterBySlugs(
  moduleSlug: string,
  chapterSlug: string
): { module: LearningModule; chapter: LearningChapter } | undefined {
  const mod = getModuleBySlug(moduleSlug);
  if (!mod) return undefined;
  const chapter = mod.chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) return undefined;
  return { module: mod, chapter };
}

export function getChapterNavigation(
  moduleSlug: string,
  chapterSlug: string
): {
  previous: { moduleSlug: string; chapterSlug: string; title: string } | null;
  next: { moduleSlug: string; chapterSlug: string; title: string } | null;
} {
  const allChaptersFlattened: { moduleSlug: string; chapterSlug: string; title: string }[] = [];
  for (const mod of LEARNING_MODULES) {
    for (const ch of mod.chapters) {
      allChaptersFlattened.push({
        moduleSlug: mod.slug,
        chapterSlug: ch.slug,
        title: ch.title,
      });
    }
  }

  const currentIndex = allChaptersFlattened.findIndex(
    (item) => item.moduleSlug === moduleSlug && item.chapterSlug === chapterSlug
  );

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? allChaptersFlattened[currentIndex - 1] : null,
    next:
      currentIndex < allChaptersFlattened.length - 1
        ? allChaptersFlattened[currentIndex + 1]
        : null,
  };
}

export function getCurriculumStats() {
  const totalModules = LEARNING_MODULES.length;
  const totalChapters = LEARNING_MODULES.reduce((acc, m) => acc + m.chapters.length, 0);
  return {
    totalModules,
    totalChapters,
    totalProblems: 525,
  };
}
