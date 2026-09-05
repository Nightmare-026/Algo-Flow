"use client";

import { useState } from "react";
import {
  AlertCircle,
  CircleOff,
  FileEdit,
  HardDriveDownload,
  Layers,
  Shuffle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseNumberList,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface StackInputControlsProps {
  onGenerate?: (arr: number[]) => void;
  defaultSize?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

export function StackInputControls({
  onGenerate,
  defaultSize = 5,
  slug = "stack-push",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: StackInputControlsProps) {
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isPush = slug === "stack-push";
  const capacity = options.capacity || 8;

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value });
  };

  const generateRandom = () => {
    setError(null);
    const count = Math.min(Math.max(defaultSize, 3), Math.min(capacity, 6));
    const randomArr = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    onGenerate?.(randomArr);
  };

  const generateEmpty = () => {
    setError(null);
    onGenerate?.([]);
  };

  const generateFull = () => {
    setError(null);
    const fullArr = Array.from({ length: capacity }, (_, i) => (i + 1) * 10);
    onGenerate?.(fullArr);
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!customInput.trim()) {
      generateEmpty();
      return;
    }
    const result = parseNumberList(customInput, capacity);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    onGenerate?.(result.values);
  };

  const getOperationHint = () => {
    switch (slug) {
      case "stack-push":
        return "LIFO • Inserts at top • O(1)";
      case "stack-pop":
        return "LIFO • Removes from top • O(1)";
      case "stack-peek":
        return "Reads top element without removal • O(1)";
      case "stack-is-empty":
        return "Checks if top == -1 (size == 0) • O(1)";
      case "stack-is-full":
        return "Checks if size == capacity • O(1)";
      case "stack-size":
        return "Returns top + 1 • O(1)";
      case "array-stack":
        return "Array implementation with top index pointer • O(1)";
      default:
        return "Stack LIFO Data Structure • O(1)";
    }
  };

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Preset Buttons */}
          {onGenerate && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-1.5 shadow-[var(--shadow-raised-sm)]">
              <Button
                variant="ghost"
                size="sm"
                onClick={generateRandom}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
                title="Generate random initial stack"
              >
                <Shuffle className="h-3 w-3 text-primary mr-1" />
                <span>Random</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={generateEmpty}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-warning hover:bg-surface-hover active:scale-95"
                title="Test Underflow / Empty condition"
              >
                <CircleOff className="h-3 w-3 text-warning mr-1" />
                <span>Empty</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={generateFull}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
                title="Test Overflow / Full condition"
              >
                <Layers className="h-3 w-3 text-primary mr-1" />
                <span>Full</span>
              </Button>
            </div>
          )}

          {/* Custom Initial Stack Input */}
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
                className="h-6 w-24 sm:w-28 rounded-md border border-border bg-bg-surface-inset px-2 font-mono text-[10px] text-text-primary shadow-[var(--shadow-inset)] placeholder:text-text-muted/60 focus-visible:border-primary focus-visible:outline-none"
                aria-label="Initial stack elements"
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

          {/* Capacity Pod */}
          <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]">
            <Layers className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold text-text-secondary">
              Capacity:
            </span>
            <input
              type="number"
              className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
              value={capacity}
              min={1}
              max={15}
              onChange={(e) => updateOption("capacity", Number(e.target.value))}
              aria-label="Stack capacity"
            />
          </div>

          {/* Value to Push (ONLY shown on stack-push) */}
          {isPush && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)] animate-in fade-in">
              <HardDriveDownload className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                Push Value:
              </span>
              <input
                type="number"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                value={options.value ?? 50}
                onChange={(e) => updateOption("value", Number(e.target.value))}
                aria-label="Value to push"
              />
            </div>
          )}
        </div>

        {/* LIFO Rule Info Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-[10px] font-medium text-text-muted">
          <Info className="h-3 w-3 text-primary shrink-0" />
          <span>{getOperationHint()}</span>
        </div>
      </div>

      {error && (
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-muted px-2.5 py-1 text-[10px] font-semibold text-error animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
