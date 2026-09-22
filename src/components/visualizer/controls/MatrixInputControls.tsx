"use client";

import { useId, useState } from "react";
import { AlertCircle, Shuffle, SortAsc, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseInputNumber,
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
const isDualMatrixSlug = (slug: string) =>
  slug === "matrix-addition" || slug === "matrix-subtraction" || slug === "matrix-multiplication";

export function MatrixInputControls({
  onGenerate,
  defaultRows = 4,
  defaultCols = 4,
  slug = "matrix",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: MatrixInputControlsProps) {
  const isDual = isDualMatrixSlug(slug);
  const isMultiplication = slug === "matrix-multiplication";
  const squareOnly = slug === "rotate-matrix-90";

  const [rows, setRows] = useState(defaultRows);
  const [cols, setCols] = useState(squareOnly ? defaultRows : defaultCols);
  const [customInputA, setCustomInputA] = useState("");
  const [customInputB, setCustomInputB] = useState("");
  const [customInputSingle, setCustomInputSingle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fieldId = useId();

  const expectedLengthA = rows * cols;
  const expectedLengthB = isMultiplication ? cols * cols : rows * cols;

  const commitDimensions = (nextRows: number, nextCols: number, nextMatrixB?: number[]) => {
    onOptionsChange?.({
      ...options,
      rows: nextRows,
      cols: nextCols,
      ...(nextMatrixB ? { matrixB: nextMatrixB } : {}),
    });
  };

  const setSquareSize = (size: number) => {
    setRows(size);
    setCols(size);
    commitDimensions(size, size);
  };

  const generateRandom = () => {
    setError(null);
    const newArrA = Array.from(
      { length: expectedLengthA },
      () => Math.floor(Math.random() * 99) + 1
    );

    if (isDual) {
      const newArrB = Array.from(
        { length: expectedLengthB },
        () => Math.floor(Math.random() * 99) + 1
      );
      commitDimensions(rows, cols, newArrB);
      onGenerate(newArrA);
    } else {
      commitDimensions(rows, cols);
      onGenerate(newArrA);
    }
  };

  const generateSorted = () => {
    setError(null);
    const newArrA = Array.from({ length: expectedLengthA }, (_, index) => index + 1);

    if (isDual) {
      const newArrB = Array.from({ length: expectedLengthB }, (_, index) => index + 5);
      commitDimensions(rows, cols, newArrB);
      onGenerate(newArrA);
    } else {
      commitDimensions(rows, cols);
      onGenerate(newArrA);
    }
  };

  const handleDualCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!customInputA.trim() && !customInputB.trim()) {
      setError("Enter comma-separated values for Matrix A and/or Matrix B.");
      return;
    }

    let parsedValuesA: number[] | null = null;
    let parsedValuesB: number[] | null = null;

    if (customInputA.trim()) {
      const resultA = parseNumberList(customInputA, 100);
      if (resultA.error) {
        setError(`Matrix A error: ${resultA.error}`);
        return;
      }
      if (resultA.values.length !== expectedLengthA) {
        setError(
          `Matrix A requires exactly ${expectedLengthA} values for ${rows} Ã— ${cols}. Got ${resultA.values.length}.`
        );
        return;
      }
      parsedValuesA = resultA.values;
    }

    if (customInputB.trim()) {
      const resultB = parseNumberList(customInputB, 100);
      if (resultB.error) {
        setError(`Matrix B error: ${resultB.error}`);
        return;
      }
      if (resultB.values.length !== expectedLengthB) {
        setError(
          `Matrix B requires exactly ${expectedLengthB} values. Got ${resultB.values.length}.`
        );
        return;
      }
      parsedValuesB = resultB.values;
    }

    setError(null);
    if (parsedValuesB) {
      commitDimensions(rows, cols, parsedValuesB);
    } else {
      commitDimensions(rows, cols);
    }

    if (parsedValuesA) {
      onGenerate(parsedValuesA);
    }
  };

  const handleSingleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = parseNumberList(customInputSingle, 100);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.values.length !== expectedLengthA) {
      setError(
        `Enter exactly ${expectedLengthA} values for the selected ${rows} Ã— ${cols} matrix.`
      );
      return;
    }

    setError(null);
    commitDimensions(rows, cols);
    onGenerate(result.values);
  };

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Dimensions & Presets Pod */}
          <div className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
            {squareOnly ? (
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="font-mono text-[10px] font-semibold text-text-muted">Size:</span>
                <input
                  id={`${fieldId}-size`}
                  type="range"
                  min="1"
                  max="6"
                  value={rows}
                  onChange={(event) => setSquareSize(Number(event.target.value))}
                  className="h-1.5 w-14 cursor-pointer accent-primary"
                />
                <span className="min-w-6 text-center font-mono text-[10px] font-bold text-primary">
                  {rows}Ã—{cols}
                </span>
              </label>
            ) : (
              <div className="flex items-center gap-1.5">
                <label className="flex items-center gap-1 cursor-pointer">
                  <span className="font-mono text-[10px] font-semibold text-text-muted">R:</span>
                  <input
                    id={`${fieldId}-rows`}
                    type="range"
                    min="1"
                    max={isDual ? "4" : "10"}
                    value={rows}
                    onChange={(event) => {
                      const nextRows = Number(event.target.value);
                      setRows(nextRows);
                      commitDimensions(nextRows, cols);
                    }}
                    className="h-1.5 w-12 cursor-pointer accent-primary"
                  />
                  <span className="min-w-3 text-center font-mono text-[10px] font-bold text-primary">
                    {rows}
                  </span>
                </label>
                <span className="h-3.5 w-px bg-border mx-0.5" />
                <label className="flex items-center gap-1 cursor-pointer">
                  <span className="font-mono text-[10px] font-semibold text-text-muted">C:</span>
                  <input
                    id={`${fieldId}-cols`}
                    type="range"
                    min="1"
                    max={isDual ? "4" : "10"}
                    value={cols}
                    onChange={(event) => {
                      const nextCols = Number(event.target.value);
                      setCols(nextCols);
                      commitDimensions(rows, nextCols);
                    }}
                    className="h-1.5 w-12 cursor-pointer accent-primary"
                  />
                  <span className="min-w-3 text-center font-mono text-[10px] font-bold text-primary">
                    {cols}
                  </span>
                </label>
              </div>
            )}
            <span className="h-3.5 w-px bg-border mx-0.5" />
            <Button
              type="button"
              size="sm"
              className="h-6 min-h-0 rounded-md px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95 cursor-pointer"
              onClick={generateRandom}
            >
              <Shuffle className="h-3 w-3 text-primary mr-1" aria-hidden="true" />
              Random
            </Button>
            <span className="h-3.5 w-px bg-border mx-0.5" />
            <Button
              type="button"
              size="sm"
              className="h-6 min-h-0 rounded-md px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95 cursor-pointer"
              onClick={generateSorted}
            >
              <SortAsc className="h-3 w-3 text-primary mr-1" aria-hidden="true" />
              Sorted
            </Button>
          </div>

          {/* Custom Values Form Pod */}
          {isDual ? (
            <form
              onSubmit={handleDualCustomSubmit}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-(--shadow-raised-sm)"
            >
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                A({expectedLengthA}):
              </span>
              <input
                id={`${fieldId}-custom-a`}
                type="text"
                placeholder="e.g. 1, 2..."
                className="h-6 w-24 sm:w-28 border-none bg-transparent px-1.5 py-0 font-mono text-[10px] text-text-primary shadow-none focus-visible:outline-none placeholder:text-text-muted"
                value={customInputA}
                onChange={(event) => setCustomInputA(event.target.value)}
                aria-invalid={Boolean(error)}
              />
              <span className="h-3.5 w-px bg-border mx-0.5" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                B({expectedLengthB}):
              </span>
              <input
                id={`${fieldId}-custom-b`}
                type="text"
                placeholder="e.g. 3, 4..."
                className="h-6 w-24 sm:w-28 border-none bg-transparent px-1.5 py-0 font-mono text-[10px] text-text-primary shadow-none focus-visible:outline-none placeholder:text-text-muted"
                value={customInputB}
                onChange={(event) => setCustomInputB(event.target.value)}
                aria-invalid={Boolean(error)}
              />
              <Button
                type="submit"
                size="sm"
                className="h-6 min-h-0 rounded-md bg-primary px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0 cursor-pointer"
              >
                Set
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleSingleCustomSubmit}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-(--shadow-raised-sm)"
            >
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                Vals({expectedLengthA}):
              </span>
              <input
                id={`${fieldId}-custom`}
                type="text"
                placeholder={`${expectedLengthA} comma-separated`}
                className="h-6 w-32 sm:w-44 border-none bg-transparent px-1.5 py-0 font-mono text-[10px] text-text-primary shadow-none focus-visible:outline-none placeholder:text-text-muted"
                value={customInputSingle}
                onChange={(event) => setCustomInputSingle(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${fieldId}-error` : undefined}
              />
              <Button
                type="submit"
                size="sm"
                className="h-6 min-h-0 rounded-md bg-primary px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0 cursor-pointer"
              >
                Set
              </Button>
            </form>
          )}

          {/* Target Pod */}
          {needsTarget(slug) && (
            <div className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-(--shadow-raised-sm)">
              <Target className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                Target:
              </span>
              <input
                id={`${fieldId}-target`}
                type="number"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-(--shadow-inset) focus-visible:border-primary focus-visible:outline-none"
                value={options.target}
                onChange={(event) =>
                  onOptionsChange?.({
                    ...options,
                    target: parseInputNumber(event.target.value, options.target),
                  })
                }
                aria-label="Target value"
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div
          id={`${fieldId}-error`}
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
