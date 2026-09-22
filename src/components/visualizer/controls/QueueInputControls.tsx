"use client";

import { useState } from "react";
import { AlertCircle, FileEdit, HardDriveDownload, Layers, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseInputNumber,
  parseNumberList,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface QueueInputControlsProps {
  onGenerate?: (arr: number[]) => void;
  defaultSize?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

export function QueueInputControls({
  onGenerate,
  defaultSize = 5,
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: QueueInputControlsProps) {
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value });
  };

  const generateRandom = () => {
    setError(null);
    const count = Math.min(Math.max(defaultSize, 3), 6);
    const randomArr = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    onGenerate?.(randomArr);
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = parseNumberList(customInput, options.capacity || 8);
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

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Random Queue Generator */}
          {onGenerate && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
              <Button
                variant="ghost"
                size="sm"
                onClick={generateRandom}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
                title="Generate random initial queue"
              >
                <Shuffle className="h-3 w-3 text-primary mr-1" />
                <span>Random Queue</span>
              </Button>
            </div>
          )}

          {/* Custom Initial Queue Input */}
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
                className="h-6 w-24 sm:w-28 rounded-md border border-border bg-bg-surface-inset px-2 font-mono text-[10px] text-text-primary shadow-(--shadow-inset) placeholder:text-text-muted/60 focus-visible:border-primary focus-visible:outline-none"
                aria-label="Initial queue elements"
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
          <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
            <Layers className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold text-text-secondary">
              Capacity:
            </span>
            <input
              type="number"
              className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
              value={options.capacity}
              min={1}
              max={15}
              onChange={(e) =>
                updateOption("capacity", parseInputNumber(e.target.value, options.capacity))
              }
              aria-label="Queue capacity"
            />
          </div>

          {/* Value / Enqueue Pod */}
          <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
            <HardDriveDownload className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold text-text-secondary">Value:</span>
            <input
              type="number"
              className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
              value={options.value}
              onChange={(e) =>
                updateOption("value", parseInputNumber(e.target.value, options.value))
              }
              aria-label="Value to enqueue"
            />
          </div>
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
