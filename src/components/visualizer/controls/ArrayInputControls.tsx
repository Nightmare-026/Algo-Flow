"use client";

import { useMemo, useState } from "react";
import { AlertCircle, FileEdit, Search, Shuffle, SortAsc, SortDesc, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
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

  return (
    <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-muted">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="w-24 accent-primary"
            aria-label="Generated data size"
          />
          <span className="w-5 text-text-primary">{size}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={generateRandom}>
            <Shuffle className="h-4 w-4 text-primary" />
            Random
          </Button>
          <Button variant="outline" size="sm" onClick={generateSorted}>
            <SortAsc className="h-4 w-4 text-primary" />
            Sorted
          </Button>
          <Button variant="outline" size="sm" onClick={generateReverseSorted}>
            <SortDesc className="h-4 w-4 text-primary" />
            Reverse
          </Button>
        </div>

        <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-center gap-2">
          <FileEdit className="h-4 w-4 text-text-muted" />
          <Input
            value={customInput}
            onChange={(event) => setCustomInput(event.target.value)}
            placeholder="e.g. 5, 2, 9, 1…"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "array-input-error" : undefined}
            className="h-8 w-44"
            aria-label="Custom numeric input"
          />
          <Button type="submit" size="sm">
            Build
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
        {needsValue(slug) && (
          <label className="flex items-center gap-2 text-text-muted">
            <Target className="h-4 w-4" />
            Value
            <Input
              type="number"
              value={options.value}
              onChange={(event) => updateOption("value", Number(event.target.value))}
              className="h-8 w-20"
            />
          </label>
        )}
        {needsTarget(slug) && (
          <label className="flex items-center gap-2 text-text-muted">
            <Search className="h-4 w-4" />
            Target
            <Input
              type="number"
              value={options.target}
              onChange={(event) => updateOption("target", Number(event.target.value))}
              className="h-8 w-20"
            />
          </label>
        )}
        {needsIndex(slug) && (
          <label className="flex items-center gap-2 text-text-muted">
            Index
            <Input
              type="number"
              value={options.index}
              aria-invalid={Boolean(fieldError)}
              aria-describedby={fieldError ? "array-input-error" : undefined}
              onChange={(event) => updateOption("index", Number(event.target.value))}
              className="h-8 w-20"
            />
          </label>
        )}
        {needsCapacity(slug) && (
          <label className="flex items-center gap-2 text-text-muted">
            Capacity
            <Input
              type="number"
              value={options.capacity}
              aria-invalid={Boolean(fieldError)}
              aria-describedby={fieldError ? "array-input-error" : undefined}
              onChange={(event) => updateOption("capacity", Number(event.target.value))}
              className="h-8 w-20"
            />
          </label>
        )}
      </div>

      {errorMessage && (
        <div
          id="array-input-error"
          role="alert"
          aria-live="polite"
          className="flex items-center gap-2 rounded-lg border border-error/25 bg-error-muted px-3 py-2 text-xs text-error"
        >
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </div>
      )}
    </div>
  );
}
