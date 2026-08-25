"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, CheckCircle2, Play, Sparkles } from "lucide-react";
import { WeaknessPattern } from "../core/types";

interface WeaknessCardProps {
  weaknesses: WeaknessPattern[];
}

export function WeaknessCard({ weaknesses }: WeaknessCardProps) {
  const topWeakness = weaknesses[0];

  if (!topWeakness) {
    return (
      <div className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold font-display text-text-primary">
              No Cognitive Bottlenecks
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-1">
            Your accuracy across all tested arithmetic operations is consistent and balanced. Ready
            to test your maximum speed in the 60-second sprint?
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/mental-math/speed"
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-primary text-white text-xs font-bold font-display shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Launch Speed Sprint</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="neu-raised p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">
              Recommended Focus
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-error bg-error-muted/40 px-2.5 py-0.5 rounded-lg border border-error/20">
            {topWeakness.errorRate}% Error Rate
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold font-display capitalize text-text-primary tracking-tight">
          {topWeakness.operation} ({topWeakness.digitComplexity})
        </h2>

        <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
          {topWeakness.suggestedAction} Sample problem:{" "}
          <strong className="font-mono text-text-primary">{topWeakness.sampleProblem}</strong>.
        </p>
      </div>

      <div className="mt-6">
        <Link
          href={`/mental-math/practice?mode=weakness&operation=${topWeakness.operation}`}
          className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-primary text-white text-xs font-bold font-display shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Targeted Drill</span>
        </Link>
      </div>
    </div>
  );
}
