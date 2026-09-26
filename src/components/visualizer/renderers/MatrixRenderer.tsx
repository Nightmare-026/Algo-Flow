"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { MatrixElement, MatrixGridData, MatrixVisualState } from "@/visualizers/matrix/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getVisualElementState,
  getVisualStateClassName,
  VisualElementState,
} from "../visual-state";
import { EmptyVisualizerState } from "@/components/visualizer/EmptyVisualizerState";

interface SingleMatrixGridProps {
  label?: string;
  rows: number;
  cols: number;
  elements: MatrixElement[];
  highlights: VisualStepHighlights;
  isResult?: boolean;
  matrixKey?: string;
  cellSize?: "sm" | "md" | "lg";
}

function resolveMatrixElementState(
  highlights: VisualStepHighlights,
  candidates: (string | undefined)[]
): VisualElementState {
  for (const id of candidates) {
    if (!id) continue;
    const state = getVisualElementState(highlights, id);
    if (state !== "default") {
      return state;
    }
  }
  return "default";
}

function SingleMatrixGrid({
  label,
  rows,
  cols,
  elements,
  highlights,
  isResult = false,
  matrixKey = "matrix",
  cellSize = "md",
}: SingleMatrixGridProps) {
  const isDual = matrixKey === "matrixA" || matrixKey === "matrixB" || matrixKey === "resultMatrix";
  const isSingle = !isDual;

  // Identify active rows & columns to highlight axis headers for spatial orientation
  const activeRows = new Set<number>();
  const activeCols = new Set<number>();

  for (let cellIndex = 0; cellIndex < elements.length; cellIndex++) {
    const element = elements[cellIndex];
    const gridRow = Math.floor(cellIndex / cols);
    const gridCol = cellIndex % cols;
    const idStr = cellIndex.toString();
    const origIdStr = (element.originalRow * cols + element.originalCol).toString();
    const r = gridRow;
    const c = gridCol;

    const candidateIds = [
      element.id,
      `${matrixKey}-${idStr}`,
      `${matrixKey}-${r}-${c}`,
      matrixKey === "matrixA" ? `a-${idStr}` : undefined,
      matrixKey === "matrixA" ? `a-${r}-${c}` : undefined,
      matrixKey === "matrixB" ? `b-${idStr}` : undefined,
      matrixKey === "matrixB" ? `b-${r}-${c}` : undefined,
      isResult ? `res-${idStr}` : undefined,
      isResult ? `res-${r}-${c}` : undefined,
      isSingle ? idStr : undefined,
      isSingle ? `${r}-${c}` : undefined,
      isSingle ? origIdStr : undefined,
      isSingle ? `${element.originalRow}-${element.originalCol}` : undefined,
    ];

    const hasPointer = candidateIds.some((id) => id && highlights.pointer?.includes(id));
    const elState = resolveMatrixElementState(highlights, candidateIds);
    if (
      hasPointer ||
      elState === "current" ||
      elState === "compared" ||
      elState === "found" ||
      elState === "swapped"
    ) {
      activeRows.add(r);
      activeCols.add(c);
    }
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: "0.4rem",
  };

  const cellDimensions =
    cellSize === "sm"
      ? "w-11 h-11 sm:w-12 sm:h-12 text-base sm:text-lg"
      : cellSize === "lg"
        ? "w-14 h-14 sm:w-16 sm:h-16 text-lg sm:text-xl"
        : "w-12 h-12 sm:w-14 sm:h-14 text-base sm:text-lg";

  const headerDimension =
    cellSize === "sm" ? "w-11 sm:w-12" : cellSize === "lg" ? "w-14 sm:w-16" : "w-12 sm:w-14";

  const rowHeaderDimension =
    cellSize === "sm" ? "h-11 sm:h-12" : cellSize === "lg" ? "h-14 sm:h-16" : "h-12 sm:h-14";

  return (
    <div className="flex flex-col items-center">
      {label && (
        <div className="mb-3 flex items-center justify-between w-full px-2">
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              isResult ? "text-primary font-bold" : "text-text-secondary"
            )}
          >
            {label}
          </span>
          <span className="rounded-full border border-border bg-surface/80 px-2 py-0.5 text-[11px] font-mono text-text-muted">
            {rows} × {cols}
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-1.5 p-3 rounded-lg border transition-all duration-200",
          isResult
            ? "border-primary/30 bg-primary/5 shadow-card"
            : "border-border/80 bg-surface/60 backdrop-blur-sm shadow-card"
        )}
      >
        {/* Column Headers */}
        <div className="flex w-full mb-1 ml-6">
          <div style={gridStyle} className="w-full">
            {Array.from({ length: cols }).map((_, c) => {
              const isActive = activeCols.has(c);
              return (
                <div
                  key={`${matrixKey}-col-${c}`}
                  className={cn(
                    "flex justify-center text-[11px] font-mono transition-colors duration-150",
                    headerDimension,
                    isActive
                      ? "text-primary font-bold opacity-100 scale-105"
                      : "text-text-secondary font-medium"
                  )}
                >
                  c{c}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex">
          {/* Row Labels */}
          <div className="flex flex-col gap-1.5 mr-1.5 pt-1">
            {Array.from({ length: rows }).map((_, r) => {
              const isActive = activeRows.has(r);
              return (
                <div
                  key={`${matrixKey}-row-${r}`}
                  className={cn(
                    "flex items-center justify-end text-[11px] font-mono transition-colors duration-150 pr-1.5",
                    rowHeaderDimension,
                    isActive
                      ? "text-primary font-bold opacity-100 scale-105"
                      : "text-text-secondary font-medium"
                  )}
                >
                  r{r}
                </div>
              );
            })}
          </div>

          <div style={gridStyle}>
            <AnimatePresence mode="popLayout">
              {elements.map((element, cellIndex) => {
                const gridRow = Math.floor(cellIndex / cols);
                const gridCol = cellIndex % cols;
                const idStr = cellIndex.toString();
                const origIdStr = (element.originalRow * cols + element.originalCol).toString();
                const r = gridRow;
                const c = gridCol;

                const candidateIds = [
                  element.id,
                  `${matrixKey}-${idStr}`,
                  `${matrixKey}-${r}-${c}`,
                  matrixKey === "matrixA" ? `a-${idStr}` : undefined,
                  matrixKey === "matrixA" ? `a-${r}-${c}` : undefined,
                  matrixKey === "matrixB" ? `b-${idStr}` : undefined,
                  matrixKey === "matrixB" ? `b-${r}-${c}` : undefined,
                  isResult ? `res-${idStr}` : undefined,
                  isResult ? `res-${r}-${c}` : undefined,
                  isSingle ? idStr : undefined,
                  isSingle ? `${r}-${c}` : undefined,
                  isSingle ? origIdStr : undefined,
                  isSingle ? `${element.originalRow}-${element.originalCol}` : undefined,
                ];

                const isPointer = candidateIds.some((id) => id && highlights.pointer?.includes(id));
                const state = resolveMatrixElementState(highlights, candidateIds);

                const isDefault = state === "default";
                const elementClass =
                  isDefault && isResult
                    ? "border-primary/25 bg-surface text-text-primary"
                    : getVisualStateClassName(state);

                const valStr = String(element.value);
                const fontScale =
                  valStr.length >= 5
                    ? "text-[10px] sm:text-xs tracking-tighter"
                    : valStr.length >= 4
                      ? "text-xs sm:text-sm tracking-tight"
                      : valStr.length >= 3
                        ? "text-sm sm:text-base tracking-tight"
                        : "";

                return (
                  <motion.div
                    layout
                    key={element.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{
                      layout: { type: "spring", stiffness: 300, damping: 25 },
                      opacity: { duration: 0.2 },
                    }}
                    className={cn(
                      "visual-element relative flex items-center justify-center rounded-xl border-2 font-bold transition-all duration-200 shadow-sm font-mono tabular-nums select-none",
                      cellDimensions,
                      fontScale,
                      elementClass
                    )}
                  >
                    {element.value}

                    {/* Pointer Overlay */}
                    {isPointer && (
                      <motion.div
                        layoutId={`${matrixKey}-pointer`}
                        className="absolute inset-0 border-4 border-secondary rounded-xl pointer-events-none shadow-[0_0_12px_rgba(14,165,233,0.4)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MatrixRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return <EmptyVisualizerState />;
  }

  const dataState = currentStep.dataState as MatrixVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  const isDualMatrix = Boolean(dataState.matrixA && dataState.matrixB);

  if (isDualMatrix && dataState.matrixA && dataState.matrixB) {
    const resultMatrixData: MatrixGridData = {
      label: dataState.resultLabel || "Result Matrix",
      rows: dataState.rows,
      cols: dataState.cols,
      elements: dataState.elements,
    };

    return (
      <div
        className="flex items-center justify-center w-full h-full p-4 sm:p-6 relative overflow-auto"
        role="region"
        aria-label="Matrix Arithmetic Canvas"
        tabIndex={0}
      >
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-full my-auto">
          {/* Operand Pair: Matrix A [op] Matrix B */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0">
            <SingleMatrixGrid
              label={dataState.matrixA.label || "Matrix A"}
              rows={dataState.matrixA.rows}
              cols={dataState.matrixA.cols}
              elements={dataState.matrixA.elements}
              highlights={highlights}
              matrixKey="matrixA"
              cellSize={dataState.matrixA.cols >= 4 ? "sm" : "md"}
            />

            {/* Operation Symbol Badge */}
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-primary/40 bg-primary/10 text-primary font-bold text-lg sm:text-xl shadow-sm shrink-0 mt-5">
              {dataState.operationSymbol || "+"}
            </div>

            <SingleMatrixGrid
              label={dataState.matrixB.label || "Matrix B"}
              rows={dataState.matrixB.rows}
              cols={dataState.matrixB.cols}
              elements={dataState.matrixB.elements}
              highlights={highlights}
              matrixKey="matrixB"
              cellSize={dataState.matrixB.cols >= 4 ? "sm" : "md"}
            />
          </div>

          {/* Equality & Result: [=] Result Matrix */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0">
            {/* Equals Symbol Badge */}
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface/80 text-text-secondary font-bold text-lg sm:text-xl shadow-sm shrink-0 mt-5">
              =
            </div>

            <SingleMatrixGrid
              label={resultMatrixData.label || "Result Matrix"}
              rows={resultMatrixData.rows}
              cols={resultMatrixData.cols}
              elements={resultMatrixData.elements}
              highlights={highlights}
              isResult={true}
              matrixKey="resultMatrix"
              cellSize={resultMatrixData.cols >= 4 ? "sm" : "md"}
            />
          </div>
        </div>
      </div>
    );
  }

  // Single Matrix Visualizer (Traversal, Search, Rotate, Transpose)
  return (
    <div
      className="flex items-center justify-center w-full h-full p-4 relative overflow-auto"
      role="region"
      aria-label="Matrix canvas"
      tabIndex={0}
    >
      <div className="my-auto">
        <SingleMatrixGrid
          rows={dataState.rows}
          cols={dataState.cols}
          elements={dataState.elements}
          highlights={highlights}
          matrixKey="singleMatrix"
          cellSize="lg"
        />
      </div>
    </div>
  );
}
