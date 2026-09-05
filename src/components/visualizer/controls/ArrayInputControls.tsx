"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  FileEdit,
  Hash,
  Layers,
  Search,
  Shuffle,
  SortAsc,
  SortDesc,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseNumberList,
  validateCapacity,
  validateIndex,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface ArrayInputControlsProps {
  onGenerate: (arr: number[]) => void;
  defaultSize?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

const needsValue = (slug: string) =>
  slug.includes("insert") || slug.includes("push") || slug.includes("enqueue");
const needsTarget = (slug: string) =>
  slug.includes("search") || slug.includes("delete") || slug.includes("contains");
const needsIndex = (slug: string) =>
  slug.includes("access") || slug.includes("index") || slug.includes("position");
const needsCapacity = (slug: string) => slug.includes("stack") || slug.includes("queue");

export function ArrayInputControls({
  onGenerate,
  defaultSize = 8,
  slug = "array",
  dataLength = defaultSize,
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: ArrayInputControlsProps) {
  const [size, setSize] = useState(defaultSize);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value });
  };

  const fieldError = useMemo(() => {
    if (needsIndex(slug)) {
      const allowEnd = slug.includes("insert");
      return validateIndex(options.index, dataLength, allowEnd);
    }
    if (needsCapacity(slug)) return validateCapacity(options.capacity, dataLength);
    return null;
  }, [dataLength, options.capacity, options.index, slug]);

  const generateRandom = () => {
    setError(null);
    onGenerate(Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1));
  };

  const generateSorted = () => {
    setError(null);
    onGenerate(
      Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1).sort((a, b) => a - b)
    );
  };

  const generateReverseSorted = () => {
    setError(null);
    onGenerate(
      Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1).sort((a, b) => b - a)
    );
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = parseNumberList(customInput);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    onGenerate(result.values);
  };

  const errorMessage = error || fieldError;
  const hasContextParams =
    needsValue(slug) || needsTarget(slug) || needsIndex(slug) || needsCapacity(slug);

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left Section: Generators & Custom Input */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Pod 1: Data Size & Presets */}
          <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]">
            <div className="flex items-center gap-1.5 pr-1">
              <span className="font-mono text-[10px] font-semibold text-text-muted">Size</span>
              <input
                type="range"
                min="1"
                max="20"
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="h-1.5 w-14 sm:w-16 cursor-pointer accent-primary"
                aria-label="Generated array size"
              />
              <span className="min-w-3 text-center font-mono text-[10px] font-bold text-primary">
                {size}
              </span>
            </div>

            <div className="h-3.5 w-px bg-border mx-0.5" aria-hidden="true" />

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={generateRandom}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
                title="Generate random array"
              >
                <Shuffle className="h-3 w-3 text-primary mr-0.5" />
                <span className="hidden sm:inline">Random</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateSorted}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
                title="Generate sorted array"
              >
                <SortAsc className="h-3 w-3 text-primary mr-0.5" />
                <span className="hidden sm:inline">Sorted</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateReverseSorted}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
                title="Generate reverse sorted array"
              >
                <SortDesc className="h-3 w-3 text-primary mr-0.5" />
                <span className="hidden sm:inline">Reverse</span>
              </Button>
            </div>
          </div>

          {/* Pod 2: Custom Number List Form */}
          <form
            onSubmit={handleCustomSubmit}
            className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]"
          >
            <FileEdit className="h-3.5 w-3.5 text-text-muted shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              placeholder="5, 2, 9, 1, 8"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "array-input-error" : undefined}
              className="h-7 sm:h-6 w-28 sm:w-32 border-none bg-transparent px-1.5 py-0 font-mono text-[10px] text-text-primary shadow-none focus-visible:outline-none placeholder:text-text-muted"
              aria-label="Custom comma-separated numbers"
            />
            <Button
              type="submit"
              size="sm"
              className="h-7 sm:h-6 min-h-0 rounded-lg bg-primary px-3 sm:px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0"
            >
              Build
            </Button>
          </form>
        </div>

        {/* Right Section: Context Parameters Pod (if applicable) */}
        {hasContextParams && (
          <div className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)] lg:ml-auto">
            {needsTarget(slug) && (
              <label className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-text-secondary">
                <Search className="h-3 w-3 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Target:</span>
                <input
                  type="number"
                  value={options.target}
                  onChange={(event) => updateOption("target", Number(event.target.value))}
                  className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                  aria-label="Target search value"
                />
              </label>
            )}

            {needsValue(slug) && (
              <label className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-text-secondary">
                <Target className="h-3 w-3 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Value:</span>
                <input
                  type="number"
                  value={options.value}
                  onChange={(event) => updateOption("value", Number(event.target.value))}
                  className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                  aria-label="Value"
                />
              </label>
            )}

            {needsIndex(slug) && (
              <label className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-text-secondary">
                <Hash className="h-3 w-3 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Index:</span>
                <span className="sm:hidden">Idx:</span>
                <input
                  type="number"
                  value={options.index}
                  placeholder="0"
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? "array-input-error" : undefined}
                  onChange={(event) => updateOption("index", Number(event.target.value))}
                  className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                  aria-label="Index"
                />
              </label>
            )}

            {needsCapacity(slug) && (
              <label className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-text-secondary">
                <Layers className="h-3 w-3 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Capacity:</span>
                <input
                  type="number"
                  value={options.capacity}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? "array-input-error" : undefined}
                  onChange={(event) => updateOption("capacity", Number(event.target.value))}
                  className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                  aria-label="Capacity"
                />
              </label>
            )}
          </div>
        )}
      </div>

      {/* Non-Disruptive Error Alert Pill */}
      {errorMessage && (
        <div
          id="array-input-error"
          role="alert"
          aria-live="polite"
          className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-muted px-2.5 py-1 text-[10px] font-semibold text-error animate-in fade-in slide-in-from-top-1"
        >
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
