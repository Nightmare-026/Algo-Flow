"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  CheckCircle2,
  Play,
  Sparkles,
  BrainCircuit,
  Activity,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { WeaknessPattern } from "../core/types";

interface WeaknessCardProps {
  weaknesses: WeaknessPattern[];
  hasHistory?: boolean;
}

export function WeaknessCard({ weaknesses, hasHistory = true }: WeaknessCardProps) {
  const topWeakness = weaknesses[0];

  // 1. Initial State: No practice history yet -> Intelligent Diagnostic Calibration Overview
  if (!hasHistory) {
    return (
      <div className="neu-raised p-6 sm:p-7 rounded-3xl border border-border bg-surface flex flex-col justify-between h-full shadow-(--shadow-raised-sm)">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-inset border border-border text-primary shadow-inner">
              <BrainCircuit className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold font-display text-text-primary">
                Cognitive Diagnostics
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                Calibration Ready
              </p>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed mt-2.5">
            Complete your first session to activate automated error-pattern clustering and targeted
            arithmetic coaching:
          </p>

          <div className="mt-4 flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-inset border border-border/80 text-xs shadow-inner">
              <Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary font-display block">
                  Carry & Borrow Detection
                </span>
                <span className="text-[11px] text-text-secondary leading-snug block mt-0.5">
                  Tracks calculation hesitation during multi-digit regrouping.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-inset border border-border/80 text-xs shadow-inner">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary font-display block">
                  Cadence & QPM Tracking
                </span>
                <span className="text-[11px] text-text-secondary leading-snug block mt-0.5">
                  Measures raw questions-per-minute speed and endurance.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-inset border border-border/80 text-xs shadow-inner">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text-primary font-display block">
                  Precision Error Profiling
                </span>
                <span className="text-[11px] text-text-secondary leading-snug block mt-0.5">
                  Identifies neighbor slips, digit swaps, and quotient errors.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/60">
          <Link
            href="/mental-math/test"
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-primary text-white text-xs font-bold font-display shadow-(--shadow-raised-sm) hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Benchmark Assessment</span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Practice done, but no bottlenecks identified
  if (!topWeakness) {
    return (
      <div className="neu-raised p-6 sm:p-7 rounded-3xl border border-border bg-surface flex flex-col justify-between h-full shadow-(--shadow-raised-sm)">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-inset border border-border text-primary shadow-inner">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold font-display text-text-primary">
                Balanced Mastery
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-primary">
                0 Critical Bottlenecks
              </p>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mt-2">
            Your accuracy across all tested arithmetic operations is consistent and balanced with no
            prominent error clusters. Ready to test your maximum speed in the 60-second sprint?
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/60">
          <Link
            href="/mental-math/speed"
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-primary text-white text-xs font-bold font-display shadow-(--shadow-raised-sm) hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Launch Speed Sprint</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Bottleneck identified -> targeted practice card
  return (
    <div className="neu-raised p-6 sm:p-7 rounded-3xl border border-primary/30 bg-surface flex flex-col justify-between h-full shadow-(--shadow-raised-sm)">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-inset border border-border text-primary shadow-inner">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
              Recommended Focus
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-error bg-error-muted/40 px-2.5 py-0.5 rounded-lg border border-error/20">
            {topWeakness.errorRate}% Error Rate
          </span>
        </div>

        <h3 className="text-lg font-extrabold font-display capitalize text-text-primary tracking-tight">
          {topWeakness.operation} ({topWeakness.digitComplexity})
        </h3>

        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
          {topWeakness.suggestedAction} Sample problem:{" "}
          <strong className="font-mono text-text-primary">{topWeakness.sampleProblem}</strong>.
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/60">
        <Link
          href={`/mental-math/practice?mode=weakness&operation=${topWeakness.operation}`}
          className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-primary text-white text-xs font-bold font-display shadow-(--shadow-raised-sm) hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Targeted Drill</span>
        </Link>
      </div>
    </div>
  );
}
