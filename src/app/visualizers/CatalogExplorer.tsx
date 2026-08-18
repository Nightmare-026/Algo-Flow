"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlignRight,
  ArrowLeftRight,
  ChevronRight,
  CircleDashed,
  Grid3X3,
  Hash,
  Layers,
  Link as LinkIcon,
  Network,
  RotateCw,
  Search,
  Share2,
  SquareSquare,
  Type,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { DataStructure, Algorithm } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  SquareSquare,
  Link: LinkIcon,
  ArrowLeftRight,
  RotateCw,
  Layers,
  AlignRight,
  Network,
  Share2,
  Hash,
  CircleDashed,
  Grid3X3,
  Type,
};

const categories = [
  { id: "all", label: "All Structures" },
  { id: "linear", label: "Linear Structures" },
  { id: "non-linear", label: "Non-Linear (Trees & Graphs)" },
  { id: "hash-based", label: "Hash-Based" },
] as const;

type CatalogExplorerProps = {
  dataStructures: DataStructure[];
  publishedAlgorithms: Algorithm[];
};

export function CatalogExplorer({ dataStructures, publishedAlgorithms }: CatalogExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const reduceMotion = useReducedMotion();

  const countsByStructure = useMemo(() => {
    const counts = new Map<string, number>();
    for (const algorithm of publishedAlgorithms) {
      counts.set(algorithm.dataStructureId, (counts.get(algorithm.dataStructureId) ?? 0) + 1);
    }
    return counts;
  }, [publishedAlgorithms]);

  const filteredStructures = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return dataStructures
      .filter((structure) => structure.isPublished)
      .filter((structure) => {
        const matchesQuery =
          !query ||
          structure.name.toLowerCase().includes(query) ||
          structure.description.toLowerCase().includes(query);
        const matchesCategory = activeCategory === "all" || structure.category === activeCategory;
        return matchesQuery && matchesCategory;
      })
      .sort((left, right) => left.displayOrder - right.displayOrder);
  }, [dataStructures, activeCategory, searchQuery]);

  return (
    <div className="mt-10">
      {/* Search & Filter Bar */}
      <div className="neu-raised flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between border border-border">
        <div className="relative w-full lg:max-w-md">
          <label htmlFor="structure-search" className="sr-only">
            Search data structures
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            id="structure-search"
            type="search"
            placeholder="Search data structures (e.g., Array, Tree, Graph)..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-bg-surface-inset py-2.5 pl-11 pr-4 text-sm text-text-primary shadow-[var(--shadow-inset)] placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Filter by structure category">
          {categories.map((category) => {
            const selected = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "min-h-10 rounded-xl px-4 text-xs font-bold transition-all duration-200 cursor-pointer select-none",
                  selected
                    ? "border border-primary/30 bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                    : "border border-border bg-surface text-text-secondary shadow-[var(--shadow-raised-sm)] hover:text-text-primary hover:border-border-hover hover:bg-surface-hover"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Counter & State */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted" aria-live="polite">
          Showing {filteredStructures.length} of {dataStructures.filter(s => s.isPublished).length} structures
        </p>
        <span className="text-xs font-medium text-text-secondary">
          {publishedAlgorithms.length} Total Algorithms
        </span>
      </div>

      {/* Structure Cards Grid */}
      {filteredStructures.length > 0 ? (
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredStructures.map((structure) => {
            const Icon =
              structure.icon && iconMap[structure.icon] ? iconMap[structure.icon] : SquareSquare;
            const count = countsByStructure.get(structure.id) ?? 0;
            return (
              <motion.div
                key={structure.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35 }}
              >
                <Link
                  href={`/visualizers/${structure.slug}`}
                  className="neu-raised group flex h-full flex-col justify-between rounded-2xl border border-border p-6 shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:-translate-y-1 hover:shadow-[var(--shadow-raised)] transition-all duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-inset text-primary shadow-[var(--shadow-inset)] group-hover:scale-105 transition-transform duration-200">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        {structure.category}
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-bold font-display text-text-primary group-hover:text-primary transition-colors">
                      {structure.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2">
                      {structure.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs font-mono font-bold text-primary">
                      {count} {count === 1 ? "Visualizer" : "Visualizers"}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted group-hover:border-primary/30 group-hover:text-primary transition-colors">
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="neu-inset mt-6 rounded-2xl p-12 text-center border border-border">
          <Search className="mx-auto h-10 w-10 text-text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-bold font-display text-text-primary">No matching structures</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Adjust your search query or reset the category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-6 min-h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white hover:bg-primary-hover shadow-[var(--shadow-raised-sm)]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
