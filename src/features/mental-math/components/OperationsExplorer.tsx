"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Minus,
  X,
  Divide,
  Superscript,
  Box,
  Radical,
  Percent,
  Shuffle,
  ArrowRight,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MathOperation } from "../core/types";
import { cn } from "@/lib/utils";

interface OperationInfo {
  id: MathOperation;
  name: string;
  symbol: string;
  category: "basic" | "powers" | "percentages" | "mixed";
  categoryLabel: string;
  description: string;
  formulaSample: string;
  complexityTiers: string;
  icon: React.ElementType;
}

const ALL_OPERATIONS: OperationInfo[] = [
  {
    id: "addition",
    name: "Addition",
    symbol: "+",
    category: "basic",
    categoryLabel: "Basic Arithmetic",
    description:
      "Rapid mental summing, multi-digit column carrying, and left-to-right partial sum decomposition.",
    formulaSample: "48 + 76 = 124",
    complexityTiers: "1–4 Digits",
    icon: Plus,
  },
  {
    id: "subtraction",
    name: "Subtraction",
    symbol: "−",
    category: "basic",
    categoryLabel: "Basic Arithmetic",
    description:
      "Instant difference computation, 10s/100s complements, and zero-borrow subtraction.",
    formulaSample: "94 − 38 = 56",
    complexityTiers: "1–4 Digits",
    icon: Minus,
  },
  {
    id: "multiplication",
    name: "Multiplication",
    symbol: "×",
    category: "basic",
    categoryLabel: "Basic Arithmetic",
    description:
      "Times tables, grid cross-products, doubling & halving, and near-base algebraic distribution.",
    formulaSample: "24 × 7 = 168",
    complexityTiers: "1–4 Digits",
    icon: X,
  },
  {
    id: "division",
    name: "Division",
    symbol: "÷",
    category: "basic",
    categoryLabel: "Basic Arithmetic",
    description:
      "Clean integer quotients, rapid factor reduction, and chunking division without scratchpads.",
    formulaSample: "168 ÷ 4 = 42",
    complexityTiers: "1–4 Digits",
    icon: Divide,
  },
  {
    id: "squares",
    name: "Squares (x²)",
    symbol: "x²",
    category: "powers",
    categoryLabel: "Powers & Radicals",
    description:
      "Squaring numbers from 11² to 99² using (a+b)² algebraic identities and base-50 anchors.",
    formulaSample: "15² = 225",
    complexityTiers: "1–3 Digits",
    icon: Superscript,
  },
  {
    id: "cubes",
    name: "Cubes (x³)",
    symbol: "x³",
    category: "powers",
    categoryLabel: "Powers & Radicals",
    description:
      "Rapid cubic exponentiation (1³ to 25³) leveraging binomial expansion (a+b)³ and terminal digit patterns.",
    formulaSample: "12³ = 1,728",
    complexityTiers: "1–2 Digits",
    icon: Box,
  },
  {
    id: "roots",
    name: "Square Roots (√x)",
    symbol: "√x",
    category: "powers",
    categoryLabel: "Powers & Radicals",
    description:
      "Radical root extraction for perfect squares by analyzing terminal digits and bounding intervals.",
    formulaSample: "√144 = 12",
    complexityTiers: "1–4 Digits",
    icon: Radical,
  },
  {
    id: "percentages",
    name: "Percentages (%)",
    symbol: "%",
    category: "percentages",
    categoryLabel: "Percentages",
    description:
      "Calculate 5%, 10%, 15%, 25%, 50%, and compound percentage combinations on the fly.",
    formulaSample: "15% of 80 = 12",
    complexityTiers: "Benchmark Splits",
    icon: Percent,
  },
  {
    id: "mixed",
    name: "Mixed Operations",
    symbol: "±×÷",
    category: "mixed",
    categoryLabel: "Comprehensive",
    description:
      "Dynamic interleaving of all arithmetic operations (+, −, ×, ÷) to develop versatile cognitive reflexes.",
    formulaSample: "Dynamic Random Ops",
    complexityTiers: "All Ranges",
    icon: Shuffle,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Operations" },
  { id: "basic", label: "Basic Arithmetic" },
  { id: "powers", label: "Powers & Radicals" },
  { id: "percentages", label: "Percentages" },
  { id: "mixed", label: "Mixed" },
] as const;

export function OperationsExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const reduceMotion = useReducedMotion();

  const filteredOperations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return ALL_OPERATIONS.filter((op) => {
      const matchesQuery =
        !query ||
        op.name.toLowerCase().includes(query) ||
        op.description.toLowerCase().includes(query) ||
        op.symbol.toLowerCase().includes(query) ||
        op.formulaSample.toLowerCase().includes(query);
      const matchesCategory = activeCategory === "all" || op.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Bar with Balanced Alignment */}
      <div className="flex flex-col gap-3.5 rounded-[8px] p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between border border-border shadow-card bg-surface">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md shrink-0">
          <label htmlFor="operation-search" className="sr-only">
            Search mental math operations
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            id="operation-search"
            type="search"
            placeholder="Search operations (e.g., Multiplication, Cubes, Squares)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchQuery("");
            }}
            className="h-11 w-full rounded-[4px] border border-border bg-surface-secondary py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium text-text-primary shadow-xs placeholder:text-text-muted/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-[4px] text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded-[4px] border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted shadow-xs"
              aria-hidden="true"
            >
              ESC
            </span>
          )}
        </div>

        {/* Category Pills with Dynamic Counts */}
        <div
          className="flex w-full lg:w-auto items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none"
          role="tablist"
          aria-label="Filter by operation category"
        >
          {CATEGORIES.map((cat) => {
            const selected = activeCategory === cat.id;
            const count =
              cat.id === "all"
                ? ALL_OPERATIONS.length
                : ALL_OPERATIONS.filter((o) => o.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-3.5 text-xs font-bold font-display transition-all duration-200 cursor-pointer select-none flex items-center justify-center gap-1.5 whitespace-nowrap",
                  selected
                    ? "bg-primary text-white shadow-xs"
                    : "border border-border bg-surface text-text-secondary shadow-xs hover:text-text-primary hover:bg-surface-hover active:scale-95"
                )}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none",
                    selected
                      ? "bg-white/20 text-white"
                      : "bg-surface-secondary text-text-muted border border-border/60"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meta Counter */}
      <div className="flex items-center justify-between px-1">
        <p
          className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted"
          aria-live="polite"
        >
          Showing {filteredOperations.length} of {ALL_OPERATIONS.length} operations
        </p>
        <span className="text-xs font-mono font-semibold text-primary">1–4 Digit Configurable</span>
      </div>

      {/* Operation Cards Grid - Perfectly balanced 3x3 layout on desktop */}
      {filteredOperations.length > 0 ? (
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredOperations.map((op) => {
            const Icon = op.icon;
            return (
              <motion.div
                key={op.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  href={`/mental-math/practice?operation=${op.id}&autostart=true`}
                  className="group flex h-full flex-col justify-between rounded-[8px] border border-border bg-surface p-6 shadow-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 relative overflow-hidden cursor-pointer"
                  aria-label={`Launch ${op.name} calculation drill`}
                >
                  <div>
                    {/* Card Top: Icon, Category Badge & Complexity Tier */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-[6px] border border-border bg-surface-secondary text-primary shadow-xs transition-transform duration-200 group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/10">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full border border-border bg-surface-secondary px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted shadow-xs">
                          {op.categoryLabel}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-primary/80">
                          {op.complexityTiers}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="mt-4 text-xl font-bold font-display text-text-primary group-hover:text-primary transition-colors tracking-tight flex items-center justify-between gap-2">
                      <span>{op.name}</span>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary line-clamp-2">
                      {op.description}
                    </p>

                    {/* Example Formula Badge */}
                    <div className="mt-4 inline-flex items-center gap-2 rounded-[4px] border border-border/80 bg-surface-secondary px-3 py-1.5 shadow-xs max-w-full">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-bold shrink-0">
                        e.g.
                      </span>
                      <code className="font-mono text-xs font-bold text-primary truncate">
                        {op.formulaSample}
                      </code>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-6 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs font-bold font-display text-text-muted group-hover:text-text-primary transition-colors">
                    <span className="text-[11px] text-text-muted group-hover:text-text-secondary">
                      Start Practice Drill
                    </span>
                    <span className="text-xs font-bold font-display text-primary group-hover:underline flex items-center gap-1.5">
                      <span>Launch</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="rounded-[8px] p-12 text-center border border-border bg-surface shadow-card">
          <Search className="mx-auto h-10 w-10 text-text-muted" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-bold font-display text-text-primary">
            No matching operations
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            Adjust your search query or reset category filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-5 min-h-11 rounded-[4px] bg-primary px-5 text-xs font-bold text-white hover:bg-primary-hover shadow-card cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
