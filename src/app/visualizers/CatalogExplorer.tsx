"use client";

import { Suspense, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  X,
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

const getCategoryBadgeStyle = (category: string) => {
  switch (category) {
    case "linear":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "non-linear":
      return "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    case "hash-based":
      return "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    default:
      return "border-border bg-surface text-text-secondary";
  }
};

type CatalogExplorerProps = {
  dataStructures: DataStructure[];
  publishedAlgorithms: Algorithm[];
};

function SearchParamsSync({ onSync }: { onSync: (category: string, query: string) => void }) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? "all";
  const urlQuery = searchParams.get("q") ?? "";

  useEffect(() => {
    onSync(urlCategory, urlQuery);
  }, [urlCategory, urlQuery, onSync]);

  return null;
}

export function CatalogExplorer({ dataStructures, publishedAlgorithms }: CatalogExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const reduceMotion = useReducedMotion();

  const handleUrlSync = useCallback((cat: string, q: string) => {
    setActiveCategory(cat);
    setSearchQuery(q);
  }, []);

  const syncUrl = useCallback(
    (q: string, category: string) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (category && category !== "all") params.set("category", category);
      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    },
    [pathname, router]
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    syncUrl(value, activeCategory);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    syncUrl(searchQuery, cat);
  };

  const algorithmsByStructure = useMemo(() => {
    const map = new Map<string, Algorithm[]>();
    for (const algorithm of publishedAlgorithms) {
      const list = map.get(algorithm.dataStructureId) ?? [];
      list.push(algorithm);
      map.set(algorithm.dataStructureId, list);
    }
    return map;
  }, [publishedAlgorithms]);

  const categoryCounts = useMemo(() => {
    const published = dataStructures.filter((s) => s.isPublished);
    return {
      all: published.length,
      linear: published.filter((s) => s.category === "linear").length,
      "non-linear": published.filter((s) => s.category === "non-linear").length,
      "hash-based": published.filter((s) => s.category === "hash-based").length,
    };
  }, [dataStructures]);

  const categories = useMemo(
    () => [
      { id: "all", label: `All (${categoryCounts.all})` },
      { id: "linear", label: `Linear (${categoryCounts.linear})` },
      { id: "non-linear", label: `Trees & Graphs (${categoryCounts["non-linear"]})` },
      { id: "hash-based", label: `Hash-Based (${categoryCounts["hash-based"]})` },
    ],
    [categoryCounts]
  );

  const filteredStructuresWithMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return dataStructures
      .filter((structure) => structure.isPublished)
      .map((structure) => {
        const algos = algorithmsByStructure.get(structure.id) ?? [];
        const matchesStructureText =
          !query ||
          structure.name.toLowerCase().includes(query) ||
          structure.description.toLowerCase().includes(query);

        const matchedAlgorithms = query
          ? algos.filter(
              (algo) =>
                algo.name.toLowerCase().includes(query) ||
                algo.slug.toLowerCase().includes(query) ||
                algo.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
                algo.shortDescription?.toLowerCase().includes(query)
            )
          : [];

        const isMatch = matchesStructureText || matchedAlgorithms.length > 0;
        const matchesCategory = activeCategory === "all" || structure.category === activeCategory;

        return {
          structure,
          algos,
          matchedAlgorithms,
          isVisible: isMatch && matchesCategory,
        };
      })
      .filter((item) => item.isVisible)
      .sort((left, right) => left.structure.displayOrder - right.structure.displayOrder);
  }, [dataStructures, activeCategory, searchQuery, algorithmsByStructure]);

  return (
    <div className="mt-10">
      <Suspense fallback={null}>
        <SearchParamsSync onSync={handleUrlSync} />
      </Suspense>
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-lg p-4 lg:flex-row lg:items-center lg:justify-between border border-border bg-surface shadow-card">
        {/* Search Input with Clear Button */}
        <div className="relative w-full lg:max-w-md">
          <label htmlFor="structure-search" className="sr-only">
            Search data structures and algorithms
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            id="structure-search"
            type="text"
            role="searchbox"
            placeholder="Search structures or algorithms (e.g. Array, Dijkstra, Tree)..."
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") handleSearchChange("");
            }}
            className="h-11 w-full rounded-sm border border-border bg-surface-secondary py-2.5 pl-11 pr-10 text-base sm:text-sm text-text-primary shadow-xs placeholder:text-text-secondary/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-sm text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted shadow-xs"
              aria-hidden="true"
            >
              ESC
            </span>
          )}
        </div>

        {/* Category Pills (Single-line horizontal scroll on mobile, flex row on desktop) */}
        <div
          className="flex w-full lg:w-auto items-center gap-2 overflow-x-auto momentum-scroll touch-manipulation pb-1.5 lg:pb-0 scrollbar-none"
          role="tablist"
          aria-label="Filter by structure category"
        >
          {categories.map((category) => {
            const selected = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-4 text-xs font-bold transition-all duration-200 cursor-pointer select-none touch-manipulation",
                  selected
                    ? "border border-primary bg-primary text-white shadow-xs"
                    : "border border-border bg-surface text-text-secondary shadow-xs hover:text-text-primary hover:border-border-hover hover:bg-surface-hover"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Counter & State */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-text-secondary" aria-live="polite">
            Showing{" "}
            <span className="font-bold text-text-primary">
              {filteredStructuresWithMatches.length}
            </span>{" "}
            of {dataStructures.filter((s) => s.isPublished).length} structures
            {searchQuery.trim() && (
              <span className="text-text-muted font-normal">
                {" "}
                matching &ldquo;{searchQuery.trim()}&rdquo;
              </span>
            )}
          </p>
        </div>
        <span className="text-xs font-medium text-text-muted">
          <span className="font-bold text-primary font-mono">{publishedAlgorithms.length}</span>{" "}
          interactive visualizers
        </span>
      </div>

      {/* Structure Cards Grid */}
      {filteredStructuresWithMatches.length > 0 ? (
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredStructuresWithMatches.map(({ structure, algos, matchedAlgorithms }) => {
            const Icon =
              structure.icon && iconMap[structure.icon] ? iconMap[structure.icon] : SquareSquare;
            const count = algos.length;
            const previewAlgos = algos.slice(0, 3);
            const remainingCount = Math.max(0, count - previewAlgos.length);

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
                  className="group flex h-full flex-col justify-between rounded-lg border border-border bg-surface p-4 sm:p-6 shadow-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200"
                >
                  <div>
                    {/* Top: Icon and Category Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface-secondary text-primary shadow-xs group-hover:scale-105 transition-transform duration-200">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                          getCategoryBadgeStyle(structure.category)
                        )}
                      >
                        {structure.category}
                      </span>
                    </div>

                    {/* Title & Description with guaranteed min-height */}
                    <h2 className="mt-5 text-xl font-bold font-display text-text-primary group-hover:text-primary transition-colors">
                      {structure.name}
                    </h2>
                    <p className="mt-2.5 min-h-11 text-sm leading-relaxed text-text-secondary line-clamp-2">
                      {structure.description}
                    </p>

                    {/* Contextual Algorithm Search Match or Algorithm Preview Tags */}
                    {matchedAlgorithms.length > 0 && searchQuery.trim() ? (
                      <div className="mt-4 rounded-md border border-primary/25 bg-primary/10 p-2.5 text-xs text-primary">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Search className="h-3.5 w-3.5 shrink-0" />
                          <span>Matched in this structure:</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {matchedAlgorithms.slice(0, 3).map((algo) => (
                            <span
                              key={algo.id}
                              className="rounded-sm bg-surface px-2 py-0.5 text-[11px] font-medium text-text-primary border border-primary/20"
                            >
                              {algo.name}
                            </span>
                          ))}
                          {matchedAlgorithms.length > 3 && (
                            <span className="text-[11px] text-primary/80 self-center">
                              +{matchedAlgorithms.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {previewAlgos.map((algo) => (
                          <span
                            key={algo.id}
                            className="inline-flex items-center rounded-sm border border-border/70 bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-secondary transition-colors group-hover:border-primary/25 group-hover:text-text-primary"
                          >
                            {algo.name}
                          </span>
                        ))}
                        {remainingCount > 0 && (
                          <span className="inline-flex items-center rounded-sm border border-dashed border-border px-1.5 py-0.5 text-[10px] font-mono font-semibold text-text-muted">
                            +{remainingCount} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer with Count and Arrow */}
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs font-mono font-bold text-primary">
                      {count} {count === 1 ? "Visualizer" : "Visualizers"}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface text-text-muted group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                      <ChevronRight
                        className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
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
        <div className="mt-8 rounded-lg p-8 sm:p-10 text-center border border-border bg-surface shadow-card max-w-xl mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-surface-secondary text-text-muted shadow-xs">
            <Search className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-bold font-display text-text-primary">
            No matching structures or algorithms
          </h2>
          <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto">
            We couldn&apos;t find anything matching &ldquo;{searchQuery}&rdquo;. Try another term or
            reset your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              syncUrl("", "all");
            }}
            className="mt-5 inline-flex items-center justify-center min-h-11 rounded-sm bg-primary px-5 text-xs font-bold text-white hover:bg-primary-hover shadow-card cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
