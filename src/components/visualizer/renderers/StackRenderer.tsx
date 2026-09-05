"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle, Info, Calculator } from "lucide-react";
import { usePlaybackStore } from "@/stores/playback-store";
import type { VisualStepHighlights } from "@/types";
import type { StackVisualState, StackElement } from "@/visualizers/stack/types";
import {
  getVisualElementClassName,
  getVisualElementMotion,
  getVisualElementState,
} from "@/components/visualizer/visual-state";
import { cn } from "@/lib/utils";

function SingleStackBeaker({
  elements,
  highlights,
  maxCapacity = 8,
  reducedMotion = false,
  label = "Stack",
  isMinStack = false,
}: {
  elements: StackElement[];
  highlights: VisualStepHighlights;
  maxCapacity?: number;
  reducedMotion?: boolean;
  label?: string;
  isMinStack?: boolean;
}) {
  const isEmpty = elements.length === 0;

  return (
    <div className="flex flex-col items-center justify-end">
      {/* Label / Beaker Header */}
      <div className="flex items-center gap-1 mb-1 text-[10px] font-mono font-bold tracking-wider uppercase text-text-muted/70">
        <span>{label}</span>
      </div>

      <div className="relative flex h-64 sm:h-72 w-28 sm:w-32 flex-col-reverse justify-start gap-1.5 overflow-visible rounded-b-xl border-b-4 border-x-4 border-border bg-bg-surface-light/35 p-1.5 pb-0">
        {/* Empty Stack TOP [-1] Indicator */}
        {isEmpty && (
          <>
            <div className="absolute -left-20 sm:-left-24 bottom-2 flex items-center font-mono text-[10px] font-bold text-vis-pointer">
              <span>TOP [-1]</span>
              <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
            </div>
            <div className="absolute inset-x-0 bottom-3 text-center font-mono text-[10px] font-medium text-text-muted/50 pointer-events-none">
              Empty
              <span className="block text-[8px] text-text-muted/40 font-normal">top = -1</span>
            </div>
          </>
        )}

        <AnimatePresence mode="popLayout" initial={!reducedMotion}>
          {elements.map((element, index) => {
            const state = getVisualElementState(highlights, element.id);
            const visualMotion = getVisualElementMotion(state, reducedMotion);
            const isTop = index === elements.length - 1;

            return (
              <motion.div
                layout={!reducedMotion}
                key={element.id}
                initial={visualMotion.initial}
                animate={visualMotion.animate}
                exit={visualMotion.exit}
                transition={{
                  layout: reducedMotion
                    ? { duration: 0.01 }
                    : { type: "spring", stiffness: 320, damping: 27 },
                  ...visualMotion.transition,
                }}
                className="relative flex flex-col items-center"
              >
                {/* Active Top Pointer */}
                {isTop && (
                  <motion.div
                    layoutId={`top-pointer-${label}`}
                    className="absolute -left-20 sm:-left-24 top-1/2 flex -translate-y-1/2 items-center font-mono text-[10px] font-bold text-vis-pointer whitespace-nowrap"
                    initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={
                      reducedMotion
                        ? { duration: 0.01 }
                        : { type: "spring", stiffness: 500, damping: 30 }
                    }
                  >
                    <span>TOP [{index}]</span>
                    <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
                  </motion.div>
                )}

                {/* Index label on right */}
                <span
                  className="absolute -right-5 top-1/2 -translate-y-1/2 font-mono text-[8px] font-semibold text-text-muted/60 select-none"
                  title={`Index ${index}`}
                >
                  [{index}]
                </span>

                <div
                  data-visual-state={state}
                  className={cn(
                    "visual-element flex h-10 sm:h-11 w-full items-center justify-center rounded-lg border-2 font-mono text-sm sm:text-base font-bold",
                    isMinStack && "border-amber-500/50 bg-amber-500/10 text-amber-500",
                    getVisualElementClassName(highlights, element.id)
                  )}
                >
                  {element.value}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty capacity slots */}
        {Array.from({ length: Math.max(0, maxCapacity - elements.length) }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="h-10 sm:h-11 w-full shrink-0 rounded-lg border-2 border-dashed border-border/30 opacity-30"
          />
        ))}
      </div>

      {/* Chamber Pedestal Base */}
      <div className="h-2 w-32 sm:w-36 rounded-full border-t-2 border-border/70 bg-surface shadow-[var(--shadow-raised-sm)] -mt-0.5" />
      <div className="h-1 w-36 sm:w-40 rounded-full bg-border/30 -mt-0.5" />
    </div>
  );
}

export function StackRenderer() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep?.dataState) {
    return null;
  }

  const dataState = currentStep.dataState as StackVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights ?? {};
  const maxCapacity = dataState.maxCapacity || 8;

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between p-3 sm:p-5 overflow-y-auto"
      role="img"
      aria-label={`${currentStep.title}. Stack contains ${dataState.elements.map((element) => element.value).join(", ") || "no values"}.`}
    >
      {/* 1. TOP TAPE: Input Token Scanner (for Parentheses / Expressions) */}
      {dataState.inputTokens && dataState.inputTokens.length > 0 && (
        <div className="w-full max-w-xl flex flex-col items-center gap-1 mb-2">
          <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-text-muted">
            Input Stream Scanner
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-xl border border-border bg-surface shadow-[var(--shadow-raised-sm)]">
            {dataState.inputTokens.map((token, idx) => {
              const isCurrent = idx === dataState.activeTokenIndex;
              return (
                <div
                  key={token.id}
                  className={cn(
                    "relative flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all",
                    isCurrent
                      ? "border-primary bg-primary/15 text-primary scale-110 shadow-sm ring-2 ring-primary/30"
                      : token.status === "matched"
                        ? "border-success/60 bg-success-muted text-success"
                        : token.status === "error"
                          ? "border-error/60 bg-error-muted text-error"
                          : token.status === "scanned"
                            ? "border-border bg-bg-surface-inset text-text-muted opacity-60"
                            : "border-border bg-surface text-text-primary"
                  )}
                >
                  {token.label}
                  {isCurrent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-black text-primary animate-pulse">
                      ▼
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Live Status & Computation Pill */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
        {dataState.computation && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary font-mono text-xs font-bold shadow-sm animate-in fade-in">
            <Calculator className="h-3.5 w-3.5" />
            <span>{dataState.computation.formula}</span>
          </div>
        )}

        {dataState.statusMessage && (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-sm animate-in fade-in",
              dataState.statusMessage.type === "success" && "border-success/40 bg-success-muted text-success",
              dataState.statusMessage.type === "error" && "border-error/40 bg-error-muted text-error",
              dataState.statusMessage.type === "warning" && "border-warning/40 bg-warning-muted text-warning",
              dataState.statusMessage.type === "info" && "border-border bg-surface text-text-secondary"
            )}
          >
            {dataState.statusMessage.type === "success" && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
            {dataState.statusMessage.type === "error" && <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
            {dataState.statusMessage.type === "info" && <Info className="h-3.5 w-3.5 shrink-0" />}
            <span>{dataState.statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* 3. CENTER: Stack Beakers (Single Stack OR Dual Min-Stack) */}
      <div className="flex items-end justify-center gap-8 sm:gap-12 my-auto">
        {/* Main Stack */}
        <SingleStackBeaker
          elements={dataState.elements}
          highlights={highlights}
          maxCapacity={maxCapacity}
          reducedMotion={reducedMotion}
          label={dataState.minElements ? "Main Stack" : "Stack (LIFO)"}
        />

        {/* Auxiliary Min Stack (renders if algorithm is Min Stack) */}
        {dataState.minElements && (
          <SingleStackBeaker
            elements={dataState.minElements}
            highlights={highlights}
            maxCapacity={maxCapacity}
            reducedMotion={reducedMotion}
            label="Min Stack O(1)"
            isMinStack={true}
          />
        )}
      </div>

      {/* 4. BOTTOM TRAY: Output Stream (Postfix output or Next Greater Element) */}
      {dataState.outputTokens && (
        <div className="w-full max-w-xl flex flex-col items-center gap-1 mt-3">
          <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-text-muted">
            Postfix Output Stream
          </div>
          <div className="flex flex-wrap items-center justify-center min-h-[36px] w-full gap-1.5 p-2 rounded-xl border border-border bg-surface shadow-[var(--shadow-inset)]">
            {dataState.outputTokens.length === 0 ? (
              <span className="text-[10px] font-mono text-text-muted/60 italic">
                Waiting for operands & popped operators...
              </span>
            ) : (
              dataState.outputTokens.map((token) => (
                <span
                  key={token.id}
                  className="flex h-7 px-2.5 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 font-mono text-xs font-bold text-primary animate-in zoom-in-95"
                >
                  {token.label}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. BOTTOM TRAY: Next Greater Element Result Mapping */}
      {dataState.resultMapping && (
        <div className="w-full max-w-xl flex flex-col items-center gap-1 mt-3">
          <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-text-muted">
            Next Greater Element Map
          </div>
          <div className="grid grid-flow-col auto-cols-max items-center justify-center gap-2 p-2 rounded-xl border border-border bg-surface shadow-[var(--shadow-raised-sm)] overflow-x-auto max-w-full">
            {dataState.resultMapping.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center p-1.5 rounded-lg border border-border bg-bg-surface-light min-w-[48px]"
              >
                <span className="text-[9px] font-mono text-text-muted">[{item.index}]</span>
                <span className="font-mono text-xs font-bold text-text-primary">{item.value}</span>
                <span className="text-[9px] text-text-muted">↓</span>
                <span
                  className={cn(
                    "font-mono text-xs font-black",
                    item.result !== "-" && item.result !== -1
                      ? "text-success"
                      : item.result === -1
                        ? "text-error"
                        : "text-text-muted"
                  )}
                >
                  {item.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

