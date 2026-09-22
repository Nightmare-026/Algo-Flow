"use client";

import { useState } from "react";
import { AlertCircle, FileEdit, HardDriveDownload, Info, Shuffle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseInputNumber,
  parseNumberList,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface CircularLinkedListInputControlsProps {
  onGenerate?: (arr: number[]) => void;
  defaultSize?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

export function CircularLinkedListInputControls({
  onGenerate,
  defaultSize = 5,
  slug = "cll-traversal",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: CircularLinkedListInputControlsProps) {
  const [size, setSize] = useState(defaultSize || 5);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value });
  };

  const generateRandom = () => {
    setError(null);
    const count = Math.max(2, Math.min(size, 8));
    const randomArr = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    onGenerate?.(randomArr);
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = parseNumberList(customInput, 8);
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

  // Target only for search/delete-by-value if any
  const showTarget = slug.includes("search") || slug === "cll-delete-value";
  const showValue = slug.includes("insert");
  const errorId = "cll-control-error";

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Pod 1: Data Size & Randomizer */}
          {onGenerate && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
              <div className="flex items-center gap-1.5 pr-1">
                <span className="font-mono text-[10px] font-semibold text-text-muted">Size</span>
                <input
                  type="range"
                  min="2"
                  max="8"
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

              <Button
                variant="ghost"
                size="sm"
                onClick={generateRandom}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
                title="Generate random circular list"
              >
                <Shuffle className="h-3 w-3 text-primary mr-0.5" />
                <span className="hidden sm:inline">Random</span>
              </Button>
            </div>
          )}

          {/* Pod 2: Custom List Input */}
          {onGenerate && (
            <form
              onSubmit={handleCustomSubmit}
              className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-2 shadow-(--shadow-raised-sm)"
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
                className="h-6 w-24 sm:w-32 rounded-md border border-border bg-bg-surface-inset px-2 font-mono text-[10px] text-text-primary shadow-(--shadow-inset) placeholder:text-text-muted/60 focus-visible:border-primary focus-visible:outline-none"
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
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
              <Target className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                Target:
              </span>
              <input
                id="cll-target"
                name="target"
                type="number"
                inputMode="numeric"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
                value={options.target}
                onChange={(event) =>
                  updateOption("target", parseInputNumber(event.target.value, options.target))
                }
                aria-label="Target value"
              />
            </div>
          )}

          {showValue && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
              <HardDriveDownload className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">Val:</span>
              <input
                id="cll-value"
                name="value"
                type="number"
                step={1}
                inputMode="numeric"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
                value={options.value}
                onChange={(event) =>
                  updateOption("value", parseInputNumber(event.target.value, options.value))
                }
                aria-label="Value"
              />
            </div>
          )}

          {/* Pod 4: Informative Status Pills for zero-arg operations */}
          {slug === "cll-delete-head" && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border/80 bg-surface/80 px-2.5 shadow-(--shadow-raised-sm) text-[10px] text-text-muted">
              <Info className="h-3 w-3 text-primary shrink-0" />
              <span>
                Operation: <strong className="text-text-primary">Delete Head</strong> updates tail
                to point to new head
              </span>
            </div>
          )}

          {slug === "cll-traversal" && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border/80 bg-surface/80 px-2.5 shadow-(--shadow-raised-sm) text-[10px] text-text-muted">
              <Info className="h-3 w-3 text-primary shrink-0" />
              <span>
                Operation: <strong className="text-text-primary">Circular Traversal</strong> loops
                until reaching head again
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-muted px-2.5 py-1 text-[10px] font-semibold text-error animate-in fade-in slide-in-from-top-1"
        >
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
