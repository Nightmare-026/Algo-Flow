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
  Radical,
  Percent,
  Shuffle,
  ChevronRight,
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
  accentClass: string;
  icon: React.ElementType;
  gradientBadge: string;
}

const ALL_OPERATIONS: OperationInfo[] = [
  {
    id: "addition",
    name: "Addition",
    symbol: "+",
    category: "basic",
    categoryLabel: "Basic Arithmetic",
    description:
      "Rapid mental summing, multi-digit column carrying, and left-to-right partial sum addition.",
    formulaSample: "48 + 76 = 124",
    complexityTiers: "1 to 4 Digits",
    accentClass: "text-emerald-500",
    icon: Plus,
    gradientBadge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
  },
  {
    id: "subtraction",
    name: "Subtraction",
    symbol: "−",
    category: "basic",
    categoryLabel: "Basic Arithmetic",
    description:
      "Instant difference calculation, 10s/100s complements, and zero-borrow left-to-right subtraction.",
    formulaSample: "94 − 38 = 56",
    complexityTiers: "1 to 4 Digits",
    accentClass: "text-cyan-500",
    icon: Minus,
    gradientBadge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500",
  },
  {
    id: "multiplication",
    name: "Multiplication",
    symbol: "×",
    category: "basic",
    categoryLabel: "Basic Arithmetic",
    description:
      "Times tables, grid cross-products, doubling & halving, and near-base algebraic distributions.",
    formulaSample: "24 × 7 = 168",
    complexityTiers: "1 to 4 Digits",
    accentClass: "text-amber-500",
    icon: X,
    gradientBadge: "bg-amber-500/10 border-amber-500/20 text-amber-500",
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
    complexityTiers: "1 to 4 Digits",
    accentClass: "text-purple-500",
    icon: Divide,
    gradientBadge: "bg-purple-500/10 border-purple-500/20 text-purple-500",
  },
  {
    id: "squares",
    name: "Squares (x²)",
    symbol: "x²",
    category: "powers",
    categoryLabel: "Powers & Radicals",
    description:
      "Squaring multi-digit numbers from 11² to 99² using (a+b)² = a² + 2ab + b² and base-50 shortcuts.",
    formulaSample: "15² = 225",
    complexityTiers: "1 to 4 Digits",
    accentClass: "text-rose-500",
    icon: Superscript,
    gradientBadge: "bg-rose-500/10 border-rose-500/20 text-rose-500",
  },
  {
    id: "roots",
    name: "Square Roots (√x)",
    symbol: "√x",
    category: "powers",
    categoryLabel: "Powers & Radicals",
    description:
      "Instant radical root extraction for perfect squares by analyzing last digits and bounding ranges.",
    formulaSample: "√144 = 12",
    complexityTiers: "1 to 4 Digits",
    accentClass: "text-indigo-500",
    icon: Radical,
    gradientBadge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-500",
  },
  {
    id: "percentages",
    name: "Percentages (%)",
    symbol: "%",
    category: "percentages",
    categoryLabel: "Percentages & Rates",
    description:
      "Calculate 5%, 10%, 15%, 25%, 50%, and 75% benchmark splits and compound percentage combinations.",
    formulaSample: "15% of 80 = 12",
    complexityTiers: "1 to 4 Digits",
    accentClass: "text-blue-500",
    icon: Percent,
    gradientBadge: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  },
  {
    id: "mixed",
    name: "Mixed Operations",
    symbol: "±×÷",
    category: "mixed",
    categoryLabel: "Comprehensive",
    description:
      "Dynamic interleaving of all operations (+, −, ×, ÷) to develop robust mental cognitive flexibility.",
    formulaSample: "Dynamic Random Ops",
    complexityTiers: "All Ranges",
    accentClass: "text-primary",
    icon: Shuffle,
    gradientBadge: "bg-primary-muted/20 border-primary/20 text-primary",
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
        op.symbol.toLowerCase().includes(query);
      const matchesCategory = activeCategory === "all" || op.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Bar (Matching /visualizers Catalog Explorer) */}
      <div className="neu-raised flex flex-col gap-4 rounded-3xl p-4 lg:flex-row lg:items-center lg:justify-between border border-border shadow-[var(--shadow-raised-sm)]">
        <div className="relative w-full lg:max-w-md">
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
            placeholder="Search operations (e.g., Multiplication, Squares, Percentages)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border bg-surface-inset py-2.5 pl-10 pr-4 text-xs font-mono font-medium text-text-primary shadow-[var(--shadow-inset)] placeholder:text-text-muted/60 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-1.5" aria-label="Filter by operation category">
          {CATEGORIES.map((cat) => {
            const selected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "min-h-9 rounded-xl px-3.5 text-xs font-bold font-display transition-all duration-200 cursor-pointer select-none",
                  selected
                    ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                    : "border border-border bg-surface text-text-secondary shadow-[var(--shadow-raised-sm)] hover:text-text-primary hover:bg-surface-hover"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Counter & Subtitle */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted" aria-live="polite">
          Showing {filteredOperations.length} of {ALL_OPERATIONS.length} operations
        </p>
        <span className="text-xs font-mono font-semibold text-primary">
          1–4 Digit Configurable
        </span>
      </div>

      {/* Operation Cards Grid (Matching /visualizers Card Design) */}
      {filteredOperations.length > 0 ? (
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
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
                transition={{ duration: 0.3 }}
              >
                <div
                  className="neu-raised group flex h-full flex-col justify-between rounded-3xl border border-border p-6 shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:-translate-y-1 hover:shadow-[var(--shadow-raised)] transition-all duration-200 relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-200 group-hover:scale-105",
                          op.gradientBadge
                        )}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted shadow-inner">
                        {op.categoryLabel}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold font-display text-text-primary group-hover:text-primary transition-colors tracking-tight">
                      {op.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-text-secondary line-clamp-2">
                      {op.description}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-border/80 pt-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-primary truncate">
                        {op.formulaSample}
                      </span>
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-surface-inset border border-border text-[10px] font-mono font-bold text-text-muted">
                        {op.complexityTiers}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/mental-math/practice?operation=${op.id}&autostart=true`}
                        className="flex-1 py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold font-display text-center shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-1"
                        aria-label={`Quick start ${op.name} drill`}
                      >
                        <span>Quick Drill</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/mental-math/practice?operation=${op.id}`}
                        className="py-2 px-3 rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary text-xs font-bold font-display text-center shadow-sm hover:bg-surface-hover active:scale-95 transition-all"
                        aria-label={`Customize ${op.name} drill settings`}
                      >
                        <span>Setup</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="neu-inset rounded-3xl p-12 text-center border border-border">
          <Search className="mx-auto h-10 w-10 text-text-muted" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-bold font-display text-text-primary">
            No matching operations
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            Adjust your search term or reset category filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-5 min-h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white hover:bg-primary-hover shadow-[var(--shadow-raised-sm)] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
