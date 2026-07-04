"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/animation/spring-config";

const categories = [
  {
    name: "Array",
    slug: "array",
    count: 28,
    icon: "📊",
    color: "#22D3EE",
    description: "Sorting, searching, insertion, deletion, merging, and rearrangement",
  },
  {
    name: "Linked List",
    slug: "linked-list",
    count: 20,
    icon: "🔗",
    color: "#34D399",
    description: "Singly, doubly, circular — traversal, reversal, cycle detection",
  },
  {
    name: "Stack",
    slug: "stack",
    count: 12,
    icon: "📚",
    color: "#A78BFA",
    description: "Push, pop, peek, parentheses matching, infix/postfix conversion",
  },
  {
    name: "Queue",
    slug: "queue",
    count: 15,
    icon: "🚶",
    color: "#F59E0B",
    description: "Simple, circular, priority, deque — enqueue, dequeue operations",
  },
  {
    name: "Tree",
    slug: "tree",
    count: 35,
    icon: "🌳",
    color: "#10B981",
    description: "BST, AVL, Heap, Trie, Segment Tree — traversals and balancing",
  },
  {
    name: "Graph",
    slug: "graph",
    count: 25,
    icon: "🕸️",
    color: "#67E8F9",
    description: "BFS, DFS, Dijkstra, Bellman-Ford, MST, topological sort",
  },
  {
    name: "Hash Table",
    slug: "hash-table",
    count: 15,
    icon: "🗄️",
    color: "#FB7185",
    description: "Hashing, collision resolution, chaining, probing, rehashing",
  },
  {
    name: "Hash Set",
    slug: "hash-set",
    count: 7,
    icon: "🎯",
    color: "#FBBF24",
    description: "Add, remove, contains, union, intersection, difference",
  },
  {
    name: "Matrix",
    slug: "matrix",
    count: 15,
    icon: "🔢",
    color: "#818CF8",
    description: "Spiral traversal, rotation, transpose, arithmetic operations",
  },
  {
    name: "String",
    slug: "string",
    count: 18,
    icon: "📝",
    color: "#F472B6",
    description: "Pattern matching (KMP, Rabin-Karp), palindrome, anagram checks",
  },
];

export function VisualizerCategories() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8" id="categories">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-4"
          >
            10 Data Structures
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
          >
            Explore Every Data Structure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto"
          >
            From arrays to graphs, master every structure with interactive visualizations
            and step-by-step animations.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={staggerItem}>
              <Link
                href={`/visualizers/${cat.slug}`}
                className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]/60 backdrop-blur-sm p-5 transition-all duration-300 hover:border-[var(--border-active)] hover:-translate-y-1 hover:shadow-lg"
                style={{
                  ["--card-glow" as string]: `${cat.color}20`,
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors truncate">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-medium" style={{ color: cat.color }}>
                      {cat.count} algorithms
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                  {cat.description}
                </p>

                {/* Hover arrow */}
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">
                  <span>Explore</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
