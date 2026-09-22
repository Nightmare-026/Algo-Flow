"use client";

import { useState } from "react";
import { AlertCircle, FileEdit, Search, Shuffle, Target, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  defaultVisualizerInputOptions,
  parseInputNumber,
  parseNumberList,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface HashTableInputControlsProps {
  onGenerate: (arr: number[]) => void;
  defaultSize?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

const needsValue = (slug: string) =>
  slug.includes("insert") || slug.includes("division-hash-method");
const needsTarget = (slug: string) => slug.includes("search") || slug.includes("delete");
const isOpenAddressing = (slug: string) =>
  slug.includes("probing") || slug.includes("linear-probing");

export function HashTableInputControls({
  onGenerate,
  defaultSize = 7,
  slug = "hash-table",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: HashTableInputControlsProps) {
  const [size, setSize] = useState(defaultSize);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value });
  };

  const generateRandom = () => {
    setError(null);
    onGenerate(Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1));
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
        {/* Left Section: Generators & Custom Input */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Pod 1: Elements Size & Random Preset */}
          <div className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
            <div className="flex items-center gap-1.5 pr-1">
              <span className="font-mono text-[10px] font-semibold text-text-muted">Keys</span>
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

          {/* Pod 2: Custom Input Form */}
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

          {/* Pod 3: Probing Strategy Selector for Open Addressing */}
          {isOpenAddressing(slug) && (
            <div className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-1.5 shadow-(--shadow-raised-sm)">
              <span className="font-mono text-[10px] font-semibold text-text-muted px-1">
                Probe:
              </span>
              <button
                type="button"
                onClick={() => onOptionsChange?.({ ...options, probingStrategy: "linear" })}
                className={cn(
                  "h-6 rounded px-2 font-mono text-[10px] font-bold transition-colors",
                  !options.probingStrategy || options.probingStrategy === "linear"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
                title="Linear Probing: h(k, i) = (h(k) + i) mod m"
              >
                Linear (+i)
              </button>
              <button
                type="button"
                onClick={() => onOptionsChange?.({ ...options, probingStrategy: "quadratic" })}
                className={cn(
                  "h-6 rounded px-2 font-mono text-[10px] font-bold transition-colors",
                  options.probingStrategy === "quadratic"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
                title="Quadratic Probing: h(k, i) = (h(k) + iÂ²) mod m"
              >
                Quadratic (+iÂ²)
              </button>
              <button
                type="button"
                onClick={() => onOptionsChange?.({ ...options, probingStrategy: "double-hashing" })}
                className={cn(
                  "h-6 rounded px-2 font-mono text-[10px] font-bold transition-colors",
                  options.probingStrategy === "double-hashing"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
                title="Double Hashing: h(k, i) = (hâ‚(k) + i Â· hâ‚‚(k)) mod m"
              >
                Double (+iÂ·hâ‚‚)
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Context Parameters Pod */}
        <div className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-(--shadow-raised-sm) lg:ml-auto">
          <label className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-text-secondary">
            <Database className="h-3 w-3 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">Capacity (m):</span>
            <input
              type="number"
              value={options.capacity}
              onChange={(event) =>
                updateOption(
                  "capacity",
                  Math.max(1, parseInputNumber(event.target.value, options.capacity))
                )
              }
              className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
              min={1}
              max={31}
              aria-label="Table capacity size"
            />
          </label>

          {needsValue(slug) && (
            <label className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-text-secondary">
              <Target className="h-3 w-3 text-primary" aria-hidden="true" />
              <span className="hidden sm:inline">
                {slug.includes("division") ? "Key (k):" : "Key:"}
              </span>
              <input
                type="number"
                value={options.value}
                onChange={(event) =>
                  updateOption("value", parseInputNumber(event.target.value, options.value))
                }
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
                aria-label="Key to hash or insert"
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
