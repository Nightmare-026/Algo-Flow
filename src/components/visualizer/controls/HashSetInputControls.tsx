"use client";

import { useState } from "react";
import { AlertCircle, FileEdit, Search, Shuffle, Target, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseInputNumber,
  parseNumberList,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface HashSetInputControlsProps {
  onGenerate: (arr: number[]) => void;
  defaultSize?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

const needsValue = (slug: string) => slug.includes("insert");
const needsTarget = (slug: string) => slug.includes("search") || slug.includes("delete");

export function HashSetInputControls({
  onGenerate,
  defaultSize = 7,
  slug = "hash-set-insert",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: HashSetInputControlsProps) {
  const [size, setSize] = useState(defaultSize);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, val: number) => {
    onOptionsChange?.({ ...options, [key]: val });
  };

  const generateRandom = () => {
    setError(null);
    const set = new Set<number>();
    while (set.size < size) {
      set.add(Math.floor(Math.random() * 90) + 10);
    }
    onGenerate(Array.from(set));
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

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
            <div className="flex items-center gap-1.5 pr-1">
              <span className="font-mono text-[10px] font-semibold text-text-muted">Elements</span>
              <input
                type="range"
                min="1"
                max="15"
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="h-1.5 w-14 sm:w-16 cursor-pointer accent-primary"
                aria-label="Generated elements count"
              />
              <span className="min-w-3 text-center font-mono text-[10px] font-bold text-primary">
                {size}
              </span>
            </div>

            <div className="h-3.5 w-px bg-border mx-0.5" aria-hidden="true" />

            <Button
              variant="ghost"
              size="sm"
              className="h-6 min-h-0 rounded-md px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              onClick={generateRandom}
              title="Generate random elements"
            >
              <Shuffle className="h-3 w-3 text-primary mr-0.5" />
              <span className="hidden sm:inline">Random</span>
            </Button>
          </div>

          <form
            onSubmit={handleCustomSubmit}
            className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-2 shadow-(--shadow-raised-sm)"
          >
            <FileEdit className="h-3.5 w-3.5 text-text-muted shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              placeholder="5, 2, 9, 1"
              aria-label="Custom numeric input"
              className="h-6 w-28 sm:w-32 border-none bg-transparent px-1.5 py-0 font-mono text-[10px] text-text-primary shadow-none focus-visible:outline-none placeholder:text-text-muted"
            />
            <Button
              type="submit"
              size="sm"
              className="h-6 min-h-0 rounded-md bg-primary px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0"
            >
              Build
            </Button>
          </form>
        </div>

        <div className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-(--shadow-raised-sm) lg:ml-auto">
          <label className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-text-secondary">
            <Database className="h-3 w-3 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">Capacity:</span>
            <input
              type="number"
              value={options.capacity}
              onChange={(event) =>
                updateOption("capacity", parseInputNumber(event.target.value, options.capacity))
              }
              className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
              min={1}
              max={20}
              aria-label="Set capacity size"
            />
          </label>

          {needsValue(slug) && (
            <label className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-text-secondary">
              <Target className="h-3 w-3 text-primary" aria-hidden="true" />
              <span className="hidden sm:inline">Insert:</span>
              <input
                type="number"
                value={options.value}
                onChange={(event) =>
                  updateOption("value", parseInputNumber(event.target.value, options.value))
                }
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
                aria-label="Value to insert"
              />
            </label>
          )}
          {needsTarget(slug) && (
            <label className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-text-secondary">
              <Search className="h-3 w-3 text-primary" aria-hidden="true" />
              <span className="hidden sm:inline">Target:</span>
              <input
                type="number"
                value={options.target}
                onChange={(event) =>
                  updateOption("target", parseInputNumber(event.target.value, options.target))
                }
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
                aria-label="Target search key"
              />
            </label>
          )}
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
