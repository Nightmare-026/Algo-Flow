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
          `Matrix A requires exactly ${expectedLengthA} values for ${rows} × ${cols}. Got ${resultA.values.length}.`
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
        `Enter exactly ${expectedLengthA} values for the selected ${rows} × ${cols} matrix.`
      );
      return;
    }

    setError(null);
    commitDimensions(rows, cols);
    onGenerate(result.values);
  };

  return (
    <div className="flex flex-col gap-2.5 text-sm lg:flex-row lg:items-center lg:gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {squareOnly ? (
          <label className="flex flex-col gap-1" htmlFor={`${fieldId}-size`}>
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Size: {rows} × {cols}
            </span>
            <input
              id={`${fieldId}-size`}
              type="range"
              min="1"
              max="6"
              value={rows}
              onChange={(event) => setSquareSize(Number(event.target.value))}
              className="h-7 w-28 accent-primary"
            />
          </label>
        ) : (
          <div className="flex items-center gap-2">
            <label className="flex flex-col gap-0.5" htmlFor={`${fieldId}-rows`}>
              <span className="text-xs font-medium text-text-muted">Rows: {rows}</span>
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
                className="h-7 w-24 accent-primary"
              />
            </label>
            <label className="flex flex-col gap-0.5" htmlFor={`${fieldId}-cols`}>
              <span className="text-xs font-medium text-text-muted">Cols: {cols}</span>
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
                className="h-7 w-24 accent-primary"
              />
            </label>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={generateRandom}
          >
            <Shuffle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Random
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={generateSorted}
          >
            <SortAsc className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Sorted
          </Button>
        </div>

        {isDual ? (
          <form onSubmit={handleDualCustomSubmit} className="flex flex-wrap items-center gap-1.5">
            <label className="flex flex-col gap-0.5" htmlFor={`${fieldId}-custom-a`}>
              <span className="text-xs font-medium text-text-muted">
                Matrix A ({expectedLengthA})
              </span>
              <Input
                id={`${fieldId}-custom-a`}
                type="text"
                placeholder={`${expectedLengthA} values`}
                className="h-7 w-36 bg-bg-surface text-xs"
                value={customInputA}
                onChange={(event) => setCustomInputA(event.target.value)}
                aria-invalid={Boolean(error)}
              />
            </label>

            <label className="flex flex-col gap-0.5" htmlFor={`${fieldId}-custom-b`}>
              <span className="text-xs font-medium text-text-muted">
                Matrix B ({expectedLengthB})
              </span>
              <Input
                id={`${fieldId}-custom-b`}
                type="text"
                placeholder={`${expectedLengthB} values`}
                className="h-7 w-36 bg-bg-surface text-xs"
                value={customInputB}
                onChange={(event) => setCustomInputB(event.target.value)}
                aria-invalid={Boolean(error)}
              />
            </label>

            <Button type="submit" variant="secondary" size="sm" className="h-7 px-2.5 text-xs">
              <FileEdit className="h-3.5 w-3.5" aria-hidden="true" />
              Set
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSingleCustomSubmit} className="flex items-center gap-1.5">
            <label className="flex flex-col gap-0.5" htmlFor={`${fieldId}-custom`}>
              <span className="text-xs font-medium text-text-muted">
                Values ({expectedLengthA})
              </span>
              <Input
                id={`${fieldId}-custom`}
                type="text"
                placeholder={`${expectedLengthA} comma-separated values`}
                className="h-7 w-52 bg-bg-surface text-xs"
                value={customInputSingle}
                onChange={(event) => setCustomInputSingle(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${fieldId}-error` : undefined}
              />
            </label>
            <Button type="submit" variant="secondary" size="sm" className="h-7 px-2.5 text-xs">
              <FileEdit className="h-3.5 w-3.5" aria-hidden="true" />
              Set
            </Button>
          </form>
        )}
      </div>

      {needsTarget(slug) ? (
        <label
          className="flex items-center gap-1.5 rounded-md border border-border bg-bg-surface/50 px-2.5 py-1"
          htmlFor={`${fieldId}-target`}
        >
          <Target className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span className="font-medium text-text-muted text-xs">Target</span>
          <Input
            id={`${fieldId}-target`}
            type="number"
            className="h-7 w-18 border-border bg-bg-base px-2 py-0 text-xs"
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
          className="flex items-center gap-1.5 text-xs font-medium text-error lg:ml-auto"
        >
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </div>
      ) : null}
    </div>
  );
}
