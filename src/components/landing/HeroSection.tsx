"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VisualStep } from "@/types";
import { generateBubbleSortSteps } from "@/visualizers/array/sort";
import type { ArrayVisualState } from "@/visualizers/array/types";

const PREVIEW_INPUT = [12, 5, 9, 3, 16];
const fullPreviewTrace = generateBubbleSortSteps(PREVIEW_INPUT);

const previewPseudocode = [
  "for each pass through the unsorted region:",
  "  compare adjacent elements (arr[j], arr[j+1])",
  "  if left > right: swap(arr[j], arr[j+1])",
  "mark the highest element as sorted",
] as const;

function getPreviewLine(step: VisualStep) {
  if (step.actionType === "compare") return 2;
  if (step.actionType === "swap") return 3;
  if (step.actionType === "success") return 4;
  return 1;
}

function getPassInfo(stepIndex: number, steps: VisualStep[]) {
  const current = steps[stepIndex];
  if (!current) return { passText: "Pass 1", titleText: "Bubble Sort: Pass 1" };
  if (current.title === "Sort Complete" || stepIndex === steps.length - 1) {
    return { passText: "Sorted", titleText: "Bubble Sort: Array Sorted" };
  }
  let completedPasses = 0;
  for (let i = 0; i < stepIndex; i++) {
    if (steps[i].title === "Element Sorted") {
      completedPasses++;
    }
  }
  const currentPass = completedPasses + 1;
  return {
    passText: `Pass ${currentPass}`,
    titleText: `Bubble Sort: Pass ${currentPass}`,
  };
}

type HeroSectionProps = {
  visualizerCount: number;
  structureCount: number;
  languageCount?: number;
};

const emptySubscribe = () => () => {};

function WorkbenchPreview() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const motionPreference = useReducedMotion();
  const reduceMotion = isMounted ? Boolean(motionPreference) : false;

  const step = fullPreviewTrace[stepIndex] || fullPreviewTrace[0];
  const state = step.dataState as ArrayVisualState;
  const activeIds = new Set([
    ...(step.highlights?.current ?? []),
    ...(step.highlights?.compared ?? []),
    ...(step.highlights?.swapped ?? []),
  ]);
  const settledIds = new Set(step.highlights?.sorted ?? []);
  const comparedIndexes = (step.highlights?.compared ?? [])
    .map((id) => state?.elements?.findIndex((element) => element.id === id) ?? -1)
    .filter((index) => index >= 0);
  const isPlaying = playing && reduceMotion !== true;

  const { passText, titleText } = getPassInfo(stepIndex, fullPreviewTrace);

  useEffect(() => {
    if (!isPlaying) return;
    const atFinalStep = stepIndex === fullPreviewTrace.length - 1;
    const timer = window.setTimeout(
      () => {
        if (atFinalStep) {
          setPlaying(false);
        } else {
          setStepIndex((current) => current + 1);
        }
      },
      atFinalStep ? 0 : 950
    );
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex]);

  const reset = () => {
    setPlaying(false);
    setStepIndex(0);
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="neu-float relative overflow-hidden rounded-3xl p-5 sm:p-6 border border-border"
    >
      {/* Top Accent Strip with progress indication */}
      <div className="absolute inset-x-0 top-0 h-1 bg-border overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary via-emerald-400 to-secondary transition-all duration-300 ease-out"
          style={{ width: `${((stepIndex + 1) / fullPreviewTrace.length) * 100}%` }}
        />
      </div>

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-2.5 w-2.5 rounded-full transition-colors",
              isPlaying ? "bg-primary animate-pulse" : "bg-emerald-400"
            )}
          />
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              Live Simulation Sandbox
            </span>
            <h2 className="text-base font-bold font-display text-text-primary">{titleText}</h2>
          </div>
        </div>
        <span className="neu-inset rounded-full px-3 py-1 font-mono text-xs font-bold text-primary">
          Step {stepIndex + 1}/{fullPreviewTrace.length}
        </span>
      </div>

      {/* Array Canvas Well */}
      <div className="mt-4 rounded-2xl border border-border bg-bg-surface-inset p-5 shadow-[var(--shadow-inset)]">
        <div className="mb-4 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-text-secondary font-mono">
            Input: [{PREVIEW_INPUT.join(", ")}]
          </span>
          <span className="font-mono font-bold text-text-muted bg-surface px-2 py-0.5 rounded border border-border">
            Avg Time: O(n²)
          </span>
        </div>

        <div
          className="flex min-h-40 items-end justify-center gap-3 sm:gap-4 pt-4"
          role="img"
          aria-label={`Array values ${state?.elements?.map((e) => e.value).join(", ")}. ${step.title}. ${step.description}`}
        >
          {state?.elements?.map((element, index) => {
            const isActive = activeIds.has(element.id);
            const isSettled = settledIds.has(element.id);
            return (
              <div key={index} className="flex w-full max-w-14 flex-col items-center gap-2">
                <motion.div
                  layout
                  animate={{ height: element.value * 7 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "relative w-full rounded-t-xl border transition-colors duration-200",
                    isActive
                      ? "border-primary bg-primary text-white shadow-[var(--shadow-glow-primary)]"
                      : isSettled
                        ? "border-secondary/40 bg-secondary-muted"
                        : "border-border bg-surface shadow-[var(--shadow-raised-sm)]"
                  )}
                >
                  {isSettled ? (
                    <Check
                      className="absolute left-1/2 top-2 h-3.5 w-3.5 -translate-x-1/2 text-secondary"
                      aria-hidden="true"
                    />
                  ) : null}
                </motion.div>
                <span
                  className={cn(
                    "font-mono text-xs font-bold",
                    isActive ? "text-primary" : "text-text-secondary"
                  )}
                >
                  {element.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Panel: Step Explanation & Synchronized Pseudocode */}
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.15fr]">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-raised-sm)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-text-primary uppercase tracking-wide">
                {step.title}
              </p>
              <span className="font-mono text-[10px] font-bold text-primary bg-primary-muted px-2 py-0.5 rounded border border-primary/20">
                {passText}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary" aria-live="polite">
              {step.description}
            </p>
          </div>
          {comparedIndexes.length === 2 ? (
            <p className="mt-2 font-mono text-[11px] font-bold text-primary">
              Comparing indices [{comparedIndexes[0]}] and [{comparedIndexes[1]}]
            </p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl bg-pseudocode-panel-bg p-3.5 font-mono text-[11px] leading-6 text-emerald-100 shadow-[var(--shadow-inset)] border border-emerald-900/30">
          {previewPseudocode.map((line, index) => {
            const isHighlight = getPreviewLine(step) === index + 1;
            return (
              <div
                key={line}
                className={cn(
                  "rounded px-2 transition-colors duration-150",
                  isHighlight
                    ? "bg-emerald-500/25 text-emerald-300 font-bold border-l-2 border-primary"
                    : "text-emerald-300/50"
                )}
              >
                <span className="mr-2 text-emerald-500/40 text-[10px]">{index + 1}</span>
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* Playback Controls Footer */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary shadow-[var(--shadow-raised-sm)] hover:text-primary hover:border-primary/40 disabled:opacity-30 active:scale-95 cursor-pointer"
          onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
          disabled={stepIndex === 0}
          aria-label="Previous preview step"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary shadow-[var(--shadow-raised-sm)] hover:text-primary hover:border-primary/40 active:scale-95 cursor-pointer"
            aria-label="Restart preview"
            title="Restart simulation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (stepIndex === fullPreviewTrace.length - 1) setStepIndex(0);
              setPlaying((current) => !current);
            }}
            disabled={reduceMotion === true}
            aria-pressed={isPlaying}
            className="inline-flex h-10 min-w-32 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            {reduceMotion ? "Manual Mode" : isPlaying ? "Pause" : "Play Trace"}
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary shadow-[var(--shadow-raised-sm)] hover:text-primary hover:border-primary/40 disabled:opacity-30 active:scale-95 cursor-pointer"
          onClick={() =>
            setStepIndex((current) => Math.min(fullPreviewTrace.length - 1, current + 1))
          }
          disabled={stepIndex === fullPreviewTrace.length - 1}
          aria-label="Next preview step"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function HeroSection({
  visualizerCount,
  structureCount,
  languageCount = 4,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-36">
      {/* Background Ambient Glows */}
      <div
        className="pointer-events-none absolute left-[5%] top-28 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[5%] top-20 h-80 w-80 rounded-full bg-secondary/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-xs font-bold text-primary shadow-[var(--shadow-raised-sm)]">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            Interactive CS Visualizer &amp; Learning Workstation
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold font-display leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-text-primary">
            Master Data Structures &amp; Algorithms{" "}
            <span className="text-gradient-primary">Step by Step.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-text-secondary">
            Execute algorithms visually, step through state transitions in real time, and connect
            every pointer change to synchronized multi-language source code.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/visualizers"
              className={buttonVariants({
                size: "lg",
                className: "group shadow-[var(--shadow-raised)]",
              })}
            >
              <Compass className="h-4 w-4" />
              Explore All {visualizerCount} Visualizers
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/visualizers/array"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Start with Arrays
            </Link>
          </div>

          {/* Metrics Row */}
          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { value: `${visualizerCount}`, label: "Interactive Visualizers" },
              { value: `${structureCount}`, label: "Data Structures" },
              { value: `${languageCount}`, label: "Languages (Python, C++, Java, JS)" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-xs font-medium text-text-muted mt-0.5 leading-snug">
                  {stat.label}
                </dt>
                <dd className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Interactive Workbench Preview */}
        <WorkbenchPreview />
      </div>
    </section>
  );
}
