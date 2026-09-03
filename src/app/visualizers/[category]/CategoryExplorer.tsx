"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronRight, Play, Search, Trophy, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { DataStructure, Algorithm, Operation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const difficultyVariant = (difficulty: string) => {
  if (difficulty === "easy") return "success" as const;
  if (difficulty === "medium") return "warning" as const;
  return "danger" as const;
};

interface DropdownOption {
  value: string;
  label: string;
  count?: number;
}

interface CustomDropdownProps {
  id: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
}

function CustomDropdown({
  id,
  label,
  value,
  options,
  onChange,
  className,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex h-11 w-full min-w-36 sm:min-w-40 items-center justify-between gap-2.5 rounded-xl border bg-bg-surface-inset px-3.5 text-xs font-semibold text-text-primary shadow-[var(--shadow-inset)] transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          isOpen
            ? "border-primary/50 ring-2 ring-primary/20"
            : "border-border hover:border-border-hover"
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : label}
          {selectedOption && selectedOption.count !== undefined ? ` (${selectedOption.count})` : ""}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          aria-labelledby={id}
          className="neu-float hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden absolute left-0 top-full z-50 mt-1.5 max-h-72 w-full min-w-full overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-float)] backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none",
                  isSelected
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                <span className="truncate">
                  {option.label}
                  {option.count !== undefined && (
                    <span
                      className={cn(
                        "ml-1 text-[11px]",
                        isSelected ? "text-white/85" : "text-text-muted"
                      )}
                    >
                      ({option.count})
                    </span>
                  )}
                </span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-white ml-1.5" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface CategoryExplorerProps {
  structure: DataStructure;
  structureAlgorithms: Algorithm[];
  structureOperations: Operation[];
  operationCounts: Map<string, number>;
}

export function CategoryExplorer({
  structure,
  structureAlgorithms,
  structureOperations,
  operationCounts,
}: CategoryExplorerProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [activeOperation, setActiveOperation] = useState("all");
  const reduceMotion = useReducedMotion();

  const selectedOperation =
    activeOperation === "all" ||
    structureOperations.some((operation) => operation.id === activeOperation)
      ? activeOperation
      : "all";

  const filteredAlgorithms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return structureAlgorithms.filter((algorithm) => {
      const matchesSearch =
        !query ||
        algorithm.name.toLowerCase().includes(query) ||
        algorithm.shortDescription.toLowerCase().includes(query);
      const matchesDifficulty =
        activeDifficulty === "all" || algorithm.difficulty === activeDifficulty;
      const matchesOperation =
        selectedOperation === "all" || algorithm.operationId === selectedOperation;
      return matchesSearch && matchesDifficulty && matchesOperation;
    });
  }, [activeDifficulty, searchQuery, selectedOperation, structureAlgorithms]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    activeDifficulty !== "all" ||
    selectedOperation !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveDifficulty("all");
    setActiveOperation("all");
  };

  const operationOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: "all", label: "All Operations" },
      ...structureOperations.map((op) => ({
        value: op.id,
        label: op.name,
        count: operationCounts.get(op.id) ?? 0,
      })),
    ];
  }, [structureOperations, operationCounts]);

  const difficultyOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: "all", label: "All Difficulties" },
      { value: "easy", label: "Easy" },
      { value: "medium", label: "Medium" },
      { value: "hard", label: "Hard" },
    ];
  }, []);

  return (
    <div className="mt-10">
      {/* Search & Filter Toolbar */}
      <div className="neu-raised grid gap-4 rounded-2xl p-4 lg:grid-cols-[1fr_auto_auto] border border-border">
        {/* Search */}
        <div className="relative">
          <label htmlFor="algorithm-search" className="sr-only">
            Search {structure.name} algorithms
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            id="algorithm-search"
            type="text"
            placeholder={`Search ${structure.name.toLowerCase()} algorithms (e.g. traversal, search)...`}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSearchQuery("");
              }
            }}
            className="h-11 w-full rounded-xl border border-border bg-bg-surface-inset py-2.5 pl-10 pr-10 text-sm text-text-primary shadow-[var(--shadow-inset)] placeholder:text-text-muted/80 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Custom Operation Filter */}
        <CustomDropdown
          id="operation-filter"
          label="All Operations"
          value={selectedOperation}
          options={operationOptions}
          onChange={setActiveOperation}
        />

        {/* Custom Difficulty Filter */}
        <CustomDropdown
          id="difficulty-filter"
          label="All Difficulties"
          value={activeDifficulty}
          options={difficultyOptions}
          onChange={setActiveDifficulty}
        />
      </div>

      {/* Result Counter & State */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
        <p className="text-xs font-semibold text-text-secondary" aria-live="polite">
          Showing{" "}
          <span className="font-bold text-text-primary">
            {filteredAlgorithms.length}
          </span>{" "}
          of {structureAlgorithms.length} algorithms
          {searchQuery.trim() && (
            <span className="text-text-muted font-normal">
              {" "}
              matching &ldquo;{searchQuery.trim()}&rdquo;
            </span>
          )}
          {selectedOperation !== "all" && (
            <span className="text-text-muted font-normal">
              {" "}
              in &ldquo;
              {structureOperations.find((o) => o.id === selectedOperation)?.name}
              &rdquo;
            </span>
          )}
          {activeDifficulty !== "all" && (
            <span className="text-text-muted font-normal capitalize">
              {" "}
              ({activeDifficulty})
            </span>
          )}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-primary hover:underline self-start sm:self-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Algorithm Cards Grid */}
      {filteredAlgorithms.length > 0 ? (
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
          className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredAlgorithms.map((algorithm) => {
            const operation = structureOperations.find((item) => item.id === algorithm.operationId);
            return (
              <motion.article
                key={algorithm.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <div
                  onClick={(event) => {
                    // Do not trigger card navigation if user clicked on Quiz button or interactive controls
                    const target = event.target as HTMLElement;
                    if (target.closest("a[href*='/quizzes']") || target.closest("button")) {
                      return;
                    }
                    // Do not trigger card navigation if user was highlighting / selecting text
                    const selection = window.getSelection();
                    if (selection && selection.toString().trim().length > 0) {
                      return;
                    }
                    router.push(`/visualizer/${algorithm.slug}`);
                  }}
                  className="neu-raised group relative flex h-full flex-col justify-between rounded-2xl border border-border p-6 shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:-translate-y-1 hover:shadow-[var(--shadow-raised)] transition-all duration-200 cursor-pointer"
                >
                  <div>
                    {/* Card Header: Badges & Quiz Link */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={difficultyVariant(algorithm.difficulty)}>
                          {algorithm.difficulty}
                        </Badge>
                        {operation ? <Badge variant="secondary">{operation.name}</Badge> : null}
                      </div>
                      <Link
                        href={`/quizzes/${algorithm.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-2.5 py-1 text-[11px] font-bold text-text-muted hover:border-primary/40 hover:text-primary transition-colors shadow-xs cursor-pointer"
                        title={`Take quiz on ${algorithm.name}`}
                      >
                        <Trophy className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
                        Quiz
                      </Link>
                    </div>

                    {/* Algorithm Name */}
                    <Link
                      href={`/visualizer/${algorithm.slug}`}
                      className="mt-4 block focus:outline-none"
                    >
                      <h2 className="text-lg font-bold font-display text-text-primary group-hover:text-primary transition-colors">
                        {algorithm.name}
                      </h2>
                    </Link>

                    {/* Short Description with aligned height - text selectable */}
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2 min-h-[2.75rem] cursor-text select-text">
                      {algorithm.shortDescription}
                    </p>
                  </div>

                  {/* Launch Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <Link
                      href={`/visualizer/${algorithm.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      Open Workstation
                    </Link>
                    <Link
                      href={`/visualizer/${algorithm.slug}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted group-hover:border-primary/40 group-hover:bg-primary group-hover:text-white transition-all shadow-xs"
                      aria-label={`Open ${algorithm.name} visualizer`}
                    >
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      ) : (
        <div className="neu-inset mt-6 rounded-2xl p-10 sm:p-12 text-center border border-border max-w-xl mx-auto">
          <Search className="mx-auto h-10 w-10 text-text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-bold font-display text-text-primary">
            No matching algorithms
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            No algorithms match your selected filters. Reset filters to see all available algorithms.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-6 min-h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white hover:bg-primary-hover shadow-[var(--shadow-raised-sm)] transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
