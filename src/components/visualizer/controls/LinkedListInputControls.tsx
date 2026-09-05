"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  FileEdit,
  HardDriveDownload,
  Info,
  Shuffle,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseNumberList,
  validateIndex,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface LinkedListInputControlsProps {
  onGenerate?: (arr: number[]) => void;
  defaultSize?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

export function LinkedListInputControls({
  onGenerate,
  defaultSize = 6,
  slug = "sll-traversal",
  dataLength = defaultSize,
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: LinkedListInputControlsProps) {
  const [size, setSize] = useState(defaultSize || 6);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value });
  };

  const positionError = useMemo(() => {
    if (slug === "sll-insert-position") {
      const err = validateIndex(options.index, dataLength, true);
      return err ? err.replace("Index", "Position") : null;
    }
    return null;
  }, [dataLength, options.index, slug]);

  const generateRandom = () => {
    setError(null);
    const count = Math.max(2, Math.min(size, 10));
    const randomArr = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    onGenerate?.(randomArr);
  };

  const loadDuplicatesPreset = () => {
    setError(null);
    onGenerate?.([10, 10, 25, 30, 30, 45]);
  };

  const loadCyclePreset = () => {
    setError(null);
    onGenerate?.([12, 24, 36, 48, 60, 72]);
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = parseNumberList(customInput, 10);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.values.length < 1) {
      setError("Provide at least 1 number.");
      return;
    }
    setError(null);
    onGenerate?.(result.values);
  };

  // Only Search and Delete by Value need a Target input
  const showTarget = slug === "sll-search" || slug === "sll-delete";
  // Only insert operations need a Value input
  const showValue =
    slug === "sll-insert-head" || slug === "sll-insert-tail" || slug === "sll-insert-position";
  const showPosition = slug === "sll-insert-position";

  const displayError = error || positionError;
  const errorId = "linked-list-control-error";

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left Section: Generators & Custom Input */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Pod 1: List Size & Randomizer */}
          {onGenerate && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]">
              <div className="flex items-center gap-1.5 pr-1">
                <span className="font-mono text-[10px] font-semibold text-text-muted">Size</span>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={size}
                  onChange={(event) => setSize(Number(event.target.value))}
                  className="h-1.5 w-12 sm:w-16 cursor-pointer accent-primary"
                  aria-label="Generated list size"
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
                  title="Generate random list"
                >
                  <Shuffle className="h-3 w-3 text-primary mr-0.5" />
                  <span className="hidden sm:inline">Random</span>
                </Button>

                {slug === "sll-remove-duplicates" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadDuplicatesPreset}
                    className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-warning hover:bg-warning-muted/40 active:scale-95"
                    title="Load sample list with duplicate values"
                  >
                    <Sparkles className="h-3 w-3 mr-0.5" />
                    <span>Preset: Duplicates</span>
                  </Button>
                )}

                {slug === "sll-detect-cycle" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadCyclePreset}
                    className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-primary hover:bg-primary-muted active:scale-95"
                    title="Load list configured for cycle detection"
                  >
                    <Sparkles className="h-3 w-3 mr-0.5" />
                    <span>Preset: 6-Node Chain</span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Pod 2: Custom List Input */}
          {onGenerate && (
            <form
              onSubmit={handleCustomSubmit}
              className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]"
            >
              <FileEdit className="h-3 w-3 text-text-muted shrink-0" aria-hidden="true" />
              <input
                type="text"
                placeholder="e.g. 10, 20, 30"
                value={customInput}
                onChange={(event) => {
                  setCustomInput(event.target.value);
                  if (error) setError(null);
                }}
                className="h-6 w-24 sm:w-32 rounded-md border border-border bg-bg-surface-inset px-2 font-mono text-[10px] text-text-primary shadow-[var(--shadow-inset)] placeholder:text-text-muted/60 focus-visible:border-primary focus-visible:outline-none"
                aria-label="Custom comma-separated list"
              />
              <Button
                type="submit"
                size="sm"
                className="h-6 min-h-0 rounded-md bg-surface-hover px-2 text-[10px] font-semibold text-text-secondary hover:text-primary active:scale-95 shrink-0"
              >
                Load
              </Button>
            </form>
          )}

          {/* Pod 3: Operation Parameters */}
          {showTarget && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]">
              <Target className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                Target:
              </span>
              <input
                id="linked-list-target"
                name="target"
                type="number"
                inputMode="numeric"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                value={options.target}
                onChange={(event) => updateOption("target", Number(event.target.value))}
                aria-label="Target value"
              />
            </div>
          )}

          {showValue && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]">
              {showPosition && (
                <>
                  <span className="font-mono text-[10px] font-semibold text-text-secondary">
                    Pos:
                  </span>
                  <input
                    id="linked-list-position"
                    name="position"
                    type="number"
                    min={0}
                    max={dataLength}
                    step={1}
                    inputMode="numeric"
                    className="h-6 w-12 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                    value={options.index}
                    aria-invalid={Boolean(displayError)}
                    aria-describedby={displayError ? errorId : undefined}
                    onChange={(event) => updateOption("index", Number(event.target.value))}
                    aria-label="Position"
                  />
                  <span className="h-3.5 w-px bg-border mx-0.5" />
                </>
              )}
              <HardDriveDownload className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">Val:</span>
              <input
                id="linked-list-value"
                name="value"
                type="number"
                step={1}
                inputMode="numeric"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                value={options.value}
                onChange={(event) => updateOption("value", Number(event.target.value))}
                aria-label="Value"
              />
            </div>
          )}

          {/* Pod 4: Informative Status Pills for zero-arg operations */}
          {slug === "sll-delete-head" && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border/80 bg-surface/80 px-2.5 shadow-[var(--shadow-raised-sm)] text-[10px] text-text-muted">
              <Info className="h-3 w-3 text-primary shrink-0" />
              <span>
                Operation: <strong className="text-text-primary">Delete Head</strong> unlinks first
                node in O(1)
              </span>
            </div>
          )}

          {slug === "sll-delete-tail" && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border/80 bg-surface/80 px-2.5 shadow-[var(--shadow-raised-sm)] text-[10px] text-text-muted">
              <Info className="h-3 w-3 text-primary shrink-0" />
              <span>
                Operation: <strong className="text-text-primary">Delete Tail</strong> unlinks last
                node in O(n)
              </span>
            </div>
          )}

          {slug === "sll-reverse" && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border/80 bg-surface/80 px-2.5 shadow-[var(--shadow-raised-sm)] text-[10px] text-text-muted">
              <Info className="h-3 w-3 text-primary shrink-0" />
              <span>
                Operation: <strong className="text-text-primary">Reverse</strong> flips links
                in-place in O(n)
              </span>
            </div>
          )}

          {slug === "sll-find-middle" && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border/80 bg-surface/80 px-2.5 shadow-[var(--shadow-raised-sm)] text-[10px] text-text-muted">
              <Info className="h-3 w-3 text-primary shrink-0" />
              <span>
                Operation: <strong className="text-text-primary">Find Middle</strong> uses fast/slow
                pointers in O(n)
              </span>
            </div>
          )}

          {slug === "sll-traversal" && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border/80 bg-surface/80 px-2.5 shadow-[var(--shadow-raised-sm)] text-[10px] text-text-muted">
              <Info className="h-3 w-3 text-primary shrink-0" />
              <span>
                Operation: <strong className="text-text-primary">Sequential Traversal</strong> visits
                each node in O(n)
              </span>
            </div>
          )}
        </div>
      </div>

      {displayError && (
        <div
          id={errorId}
          role="alert"
          className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-muted px-2.5 py-1 text-[10px] font-semibold text-error animate-in fade-in slide-in-from-top-1"
        >
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
