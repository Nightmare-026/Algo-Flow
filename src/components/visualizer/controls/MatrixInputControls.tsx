"use client";

import { useId, useState } from "react";
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
  const squareOnly = slug === "rotate-matrix-90";
  const [rows, setRows] = useState(defaultRows);
  const [cols, setCols] = useState(squareOnly ? defaultRows : defaultCols);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fieldId = useId();

  const commitDimensions = (nextRows: number, nextCols: number) => {
    onOptionsChange?.({ ...options, rows: nextRows, cols: nextCols });
  };

  const setSquareSize = (size: number) => {
    setRows(size);
    setCols(size);
    commitDimensions(size, size);
  };

  const generateRandom = () => {
    setError(null);
    commitDimensions(rows, cols);
    onGenerate(Array.from({ length: rows * cols }, () => Math.floor(Math.random() * 99) + 1));
  };

  const generateSorted = () => {
    setError(null);
    commitDimensions(rows, cols);
    onGenerate(Array.from({ length: rows * cols }, (_, index) => index + 1));
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = parseNumberList(customInput, 100);
    if (result.error) {
      setError(result.error);
      return;
    }
    const expectedLength = rows * cols;
    if (result.values.length !== expectedLength) {
      setError(`Enter exactly ${expectedLength} values for the selected ${rows} × ${cols} matrix.`);
      return;
    }

    setError(null);
    commitDimensions(rows, cols);
    onGenerate(result.values);
  };

  return (
    <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start">
      <div className="flex flex-wrap items-end gap-3">
        {squareOnly ? (
          <label className="flex flex-col gap-1.5" htmlFor={`${fieldId}-size`}>
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Square size: {rows} × {cols}
            </span>
            <input
              id={`${fieldId}-size`}
              type="range"
              min="1"
              max="10"
              value={rows}
              onChange={(event) => setSquareSize(Number(event.target.value))}
              className="h-9 w-36 accent-primary"
            />
          </label>
        ) : (
          <div className="flex items-end gap-3">
            <label className="flex flex-col gap-1.5" htmlFor={`${fieldId}-rows`}>
              <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Rows: {rows}
              </span>
              <input
                id={`${fieldId}-rows`}
                type="range"
                min="1"
                max="10"
                value={rows}
                onChange={(event) => {
                  const nextRows = Number(event.target.value);
                  setRows(nextRows);
                  commitDimensions(nextRows, cols);
                }}
                className="h-9 w-28 accent-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5" htmlFor={`${fieldId}-cols`}>
              <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Columns: {cols}
              </span>
              <input
                id={`${fieldId}-cols`}
                type="range"
                min="1"
                max="10"
                value={cols}
                onChange={(event) => {
                  const nextCols = Number(event.target.value);
                  setCols(nextCols);
                  commitDimensions(rows, nextCols);
                }}
                className="h-9 w-28 accent-primary"
              />
            </label>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button type="button" variant="outline" size="sm" onClick={generateRandom}>
            <Shuffle className="h-4 w-4 text-primary" aria-hidden="true" />
            Random
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={generateSorted}>
            <SortAsc className="h-4 w-4 text-primary" aria-hidden="true" />
            Sorted
          </Button>
        </div>

        <form onSubmit={handleCustomSubmit} className="flex items-end gap-2">
          <label className="flex flex-col gap-1.5" htmlFor={`${fieldId}-custom`}>
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Custom matrix values
            </span>
            <Input
              id={`${fieldId}-custom`}
              type="text"
              placeholder={`Exactly ${rows * cols} comma-separated values`}
              className="h-9 w-64 bg-bg-surface text-sm"
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${fieldId}-error` : undefined}
            />
          </label>
          <Button type="submit" variant="secondary" size="sm">
            <FileEdit className="h-4 w-4" aria-hidden="true" />
            Set
          </Button>
        </form>
      </div>

      {needsTarget(slug) ? (
        <label
          className="flex items-center gap-2 rounded-md border border-border bg-bg-surface/50 px-3 py-1"
          htmlFor={`${fieldId}-target`}
        >
          <Target className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="font-medium text-text-muted">Target</span>
          <Input
            id={`${fieldId}-target`}
            type="number"
            className="h-7 w-20 border-border bg-bg-base px-2 py-0"
            value={options.target}
            onChange={(event) =>
              onOptionsChange?.({ ...options, target: Number(event.target.value) })
            }
          />
        </label>
      ) : null}

      {error ? (
        <div
          id={`${fieldId}-error`}
          role="alert"
          className="ml-auto flex items-center gap-2 text-sm font-medium text-error"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {error}
        </div>
      ) : null}
    </div>
  );
}
