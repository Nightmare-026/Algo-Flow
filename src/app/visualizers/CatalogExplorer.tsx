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
  { id: "all", label: "All structures" },
  { id: "linear", label: "Linear" },
  { id: "non-linear", label: "Non-linear" },
  { id: "hash-based", label: "Hash-based" },
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
    <>
      <div className="neu-raised mt-10 flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <label htmlFor="structure-search" className="sr-only">
            Search data structures
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="structure-search"
            type="search"
            placeholder="Search structures"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground shadow-[var(--shadow-inset)] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Filter by structure type">
          {categories.map((category) => {
            const selected = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "min-h-11 rounded-xl border px-4 text-sm font-semibold transition-colors",
                  selected
                    ? "border-primary/20 bg-primary-muted text-primary-active shadow-[var(--shadow-inset)]"
                    : "border-white/70 bg-surface-light text-text-secondary shadow-[var(--shadow-raised-sm)] hover:text-primary-active"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-8 text-sm font-semibold text-text-secondary" aria-live="polite">
        {filteredStructures.length} {filteredStructures.length === 1 ? "structure" : "structures"}
      </p>

      {filteredStructures.length > 0 ? (
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
          className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
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
                transition={{ duration: 0.36 }}
              >
                <Link
                  href={`/visualizers/${structure.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/75 bg-surface/90 p-6 shadow-[var(--shadow-raised-sm)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:ring-1 hover:ring-primary/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary-active shadow-[var(--shadow-inset)] transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold capitalize text-text-secondary transition-colors group-hover:border-primary/30">
                      {structure.difficulty}
                    </span>
                  </div>
                  <h2 className="mt-6 text-xl font-extrabold transition-colors group-hover:text-primary-active">
                    {structure.name}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">
                    {structure.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {count} {count === 1 ? "algorithm" : "algorithms"}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-primary-active shadow-[var(--shadow-inset)] transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      <ChevronRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="neu-inset mt-6 rounded-2xl px-5 py-16 text-center">
          <Search className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-extrabold">No matching structures</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Change the search term or choose a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-6 min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
