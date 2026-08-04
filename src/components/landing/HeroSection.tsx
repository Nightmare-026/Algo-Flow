"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VisualStep } from "@/types";
import { generateBubbleSortSteps } from "@/visualizers/array/sort";
import type { ArrayVisualState } from "@/visualizers/array/types";

const PREVIEW_INPUT = [12, 5, 9, 3, 16];
const fullPreviewTrace = generateBubbleSortSteps(PREVIEW_INPUT);
const firstPassEnd = fullPreviewTrace.findIndex((step) => step.title === "Element Sorted");
const traceSteps = fullPreviewTrace.slice(0, firstPassEnd + 1);
const previewPseudocode = [
  "for each pass through the unsorted region",
  "  compare adjacent values",
  "  if left > right, swap them",
  "mark the pass's final value as sorted",
] as const;

function getPreviewLine(step: VisualStep) {
  if (step.actionType === "compare") return 2;
  if (step.actionType === "swap") return 3;
  if (step.actionType === "success") return 4;
  return 1;
}

type HeroSectionProps = {
  visualizerCount: number;
  structureCount: number;
};

function WorkbenchPreview() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();
  const step = traceSteps[stepIndex];
  const state = step.dataState as ArrayVisualState;
  const activeIds = new Set([
    ...(step.highlights.current ?? []),
    ...(step.highlights.compared ?? []),
    ...(step.highlights.swapped ?? []),
  ]);
  const settledIds = new Set(step.highlights.sorted ?? []);
  const comparedIndexes = (step.highlights.compared ?? [])
    .map((id) => state.elements.findIndex((element) => element.id === id))
    .filter((index) => index >= 0);
  const isPlaying = playing && !reduceMotion;

  useEffect(() => {
    if (!isPlaying) return;
    const atFinalStep = stepIndex === traceSteps.length - 1;
    const timer = window.setTimeout(
      () => {
        if (atFinalStep) {
          setPlaying(false);
        } else {
          setStepIndex((current) => current + 1);
        }
      },
      atFinalStep ? 0 : 1350
    );
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex]);

  const reset = () => {
    setPlaying(false);
    setStepIndex(0);
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="neu-float relative overflow-hidden rounded-[1.75rem] p-4 sm:p-5"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-emerald-300 to-secondary" />
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary-active">
            Generator-backed trace
          </p>
          <h2 className="mt-1 text-base font-bold">Bubble Sort: first pass</h2>
        </div>
        <span className="rounded-full bg-primary-muted px-3 py-1 font-mono text-xs font-semibold text-primary-active">
          Step {stepIndex + 1}/{traceSteps.length}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-border/80 bg-background p-4 shadow-[var(--shadow-inset)]">
        <div className="mb-4 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-text-secondary">Input: [{PREVIEW_INPUT.join(", ")}]</span>
          <span className="font-mono text-text-muted">O(n^2)</span>
        </div>
        <div
          className="flex min-h-44 items-end justify-center gap-2 sm:gap-3"
          role="img"
          aria-label={`Array values ${state.elements.map((element) => element.value).join(", ")}. ${step.title}. ${step.description}`}
        >
          {state.elements.map((element, index) => {
            const isActive = activeIds.has(element.id);
            const isSettled = settledIds.has(element.id);
            return (
              <div
                key={index}
                className="flex w-full max-w-14 flex-col items-center gap-2"
              >
                <motion.div
                  layout
                  animate={{ height: element.value * 6.8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "relative w-full rounded-t-xl border",
                    isActive
                      ? "border-primary-active bg-primary shadow-[0_8px_24px_rgba(34,197,94,0.24)]"
                      : isSettled
                        ? "border-secondary/30 bg-secondary-muted"
                        : "border-border bg-surface-light"
                  )}
                >
                  {isSettled ? (
                    <Check
                      className="absolute left-1/2 top-2 h-3.5 w-3.5 -translate-x-1/2 text-secondary"
                      aria-hidden="true"
                    />
                  ) : null}
                </motion.div>
                <span className="font-mono text-xs font-bold text-text-secondary">{element.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.12fr]">
        <div className="rounded-2xl border border-white/70 bg-surface-light p-3 shadow-[var(--shadow-raised-sm)]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-foreground">{step.title}</p>
            <span className="font-mono text-[10px] text-muted-foreground">Pass 1</span>
          </div>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground" aria-live="polite">
            {step.description}
          </p>
          {comparedIndexes.length === 2 ? (
            <p className="mt-1 font-mono text-[10px] text-primary-active">
              Comparing indexes {comparedIndexes[0]} and {comparedIndexes[1]}
            </p>
          ) : null}
        </div>
        <div className="overflow-hidden rounded-2xl bg-[#173126] p-3 font-mono text-[11px] leading-5 text-emerald-50 shadow-inner">
          {previewPseudocode.map((line, index) => (
            <div
              key={line}
              className={cn(
                "rounded px-2",
                getPreviewLine(step) === index + 1
                  ? "bg-emerald-300/18 text-emerald-100"
                  : "text-emerald-50/62"
              )}
            >
              <span className="mr-2 text-emerald-300/55">{index + 1}</span>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-primary-muted hover:text-primary-active disabled:opacity-35"
          onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
          disabled={stepIndex === 0}
          aria-label="Previous preview step"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-primary-muted hover:text-primary-active"
            aria-label="Restart preview"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (stepIndex === traceSteps.length - 1) setStepIndex(0);
              setPlaying((current) => !current);
            }}
            disabled={Boolean(reduceMotion)}
            aria-pressed={isPlaying}
            aria-label={
              reduceMotion
                ? "Autoplay is disabled because reduced motion is enabled"
                : isPlaying
                  ? "Pause Bubble Sort preview"
                  : "Play Bubble Sort preview"
            }
            className="inline-flex h-11 min-w-28 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-[var(--shadow-glow-primary)] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            {reduceMotion ? "Use arrows" : isPlaying ? "Pause" : "Play trace"}
          </button>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-primary-muted hover:text-primary-active disabled:opacity-35"
          onClick={() => setStepIndex((current) => Math.min(traceSteps.length - 1, current + 1))}
          disabled={stepIndex === traceSteps.length - 1}
          aria-label="Next preview step"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

export function HeroSection({ visualizerCount, structureCount }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
      <div
        className="pointer-events-none absolute left-[7%] top-32 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[6%] top-20 h-72 w-72 rounded-full bg-secondary/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/75 bg-surface-light/90 px-4 text-sm font-semibold text-primary-active shadow-[var(--shadow-raised-sm)]">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            Learn by tracing what changes
          </div>
          <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.45rem]">
            See the logic.
            <span className="block text-gradient-primary">Then make it stick.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-text-secondary">
            Build an input, run the algorithm, and connect every state change to the code that
            caused it without losing your place.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/visualizers"
              className={buttonVariants({ size: "lg", className: "group" })}
            >
              Start visualizing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/visualizers/array"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Explore array algorithms
            </Link>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-border">
            {[
              { value: visualizerCount, label: "published pages" },
              { value: structureCount, label: "data structures" },
              { value: 4, label: "code languages" },
            ].map((stat) => (
              <div key={stat.label} className="px-3 first:pl-0 sm:px-5">
                <dt className="text-xs leading-4 text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold text-primary-active">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <WorkbenchPreview />
      </div>
    </section>
  );
}
