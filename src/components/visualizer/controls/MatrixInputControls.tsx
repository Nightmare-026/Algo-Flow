"use client";

import { useState } from "react";
import { AlertCircle, FileEdit, Shuffle, SortAsc, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseNumberList,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface MatrixInputControlsProps {
  onGenerate: (arr: number[]) => void;
  defaultRows?: number;
  defaultCols?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

const needsTarget = (slug: string) => slug.includes("search");

export function MatrixInputControls({
  onGenerate,
  defaultRows = 4,
  defaultCols = 4,
  slug = "matrix",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: MatrixInputControlsProps) {
  const [rows, setRows] = useState(defaultRows);
  const [cols, setCols] = useState(defaultCols);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value });
  };

  const generateRandom = () => {
    setError(null);
    updateOption("rows", rows);
    updateOption("cols", cols);
    onGenerate(Array.from({ length: rows * cols }, () => Math.floor(Math.random() * 99) + 1));
  };

  const generateSorted = () => {
    setError(null);
    updateOption("rows", rows);
    updateOption("cols", cols);
    onGenerate(
      Array.from({ length: rows * cols }, () => Math.floor(Math.random() * 99) + 1).sort(
        (a, b) => a - b
      )
    );
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = parseNumberList(customInput, 100);
    if (result.error) {
      setError(result.error);
      return;
    }

    // Automatically infer grid if exactly matching current rows*cols, or force square-ish
    const len = result.values.length;
    let r = rows;
    let c = cols;
    if (len !== r * c) {
      c = Math.ceil(Math.sqrt(len));
      r = Math.ceil(len / c);
      setRows(r);
      setCols(c);
    }

    setError(null);
    updateOption("rows", r);
    updateOption("cols", c);
    onGenerate(result.values);
  };

  return (
    <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-muted w-12">Rows:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={rows}
              onChange={(event) => setRows(Number(event.target.value))}
              className="w-24 accent-primary"
              aria-label="Generated matrix rows"
            />
            <span className="w-5 text-text-primary">{rows}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-text-muted w-12">Cols:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={cols}
              onChange={(event) => setCols(Number(event.target.value))}
              className="w-24 accent-primary"
              aria-label="Generated matrix columns"
            />
            <span className="w-5 text-text-primary">{cols}</span>
          </div>
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
        </div>

        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="e.g. 10, 25, 5, 8"
            className="w-48 h-8 text-sm bg-bg-surface border-border focus-visible:ring-primary"
            value={customInput}
            onChange={(event) => setCustomInput(event.target.value)}
          />
          <Button type="submit" variant="secondary" size="sm">
            <FileEdit className="h-4 w-4" />
            Set
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {needsTarget(slug) && (
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1 bg-bg-surface/50">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-text-muted font-medium">Target:</span>
            <Input
              type="number"
              className="w-20 h-7 border-border bg-bg-base px-2 py-0"
              value={options.target}
              onChange={(e) => updateOption("target", Number(e.target.value))}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-error text-sm font-medium animate-in fade-in slide-in-from-top-1 ml-auto">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
