"use client";

import React from "react";
import { MathOperation, OperationMastery } from "../core/types";
import { getOperatorSymbol } from "../core/generator";
import { cn } from "@/lib/utils";

interface MasteryRadarProps {
  masteryMap: Record<MathOperation, OperationMastery>;
}

export function MasteryRadar({ masteryMap }: MasteryRadarProps) {
  const operations: MathOperation[] = [
    "addition",
    "subtraction",
    "multiplication",
    "division",
    "squares",
    "roots",
    "percentages",
    "mixed",
  ];

  const opColors: Record<MathOperation, { badge: string; bar: string; text: string }> = {
    addition: {
      badge: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      bar: "from-emerald-500 to-teal-400",
      text: "text-emerald-500",
    },
    subtraction: {
      badge: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
      bar: "from-cyan-500 to-blue-400",
      text: "text-cyan-500",
    },
    multiplication: {
      badge: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      bar: "from-amber-500 to-yellow-400",
      text: "text-amber-500",
    },
    division: {
      badge: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      bar: "from-purple-500 to-pink-400",
      text: "text-purple-500",
    },
    squares: {
      badge: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      bar: "from-rose-500 to-pink-500",
      text: "text-rose-500",
    },
    roots: {
      badge: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      bar: "from-indigo-500 to-purple-500",
      text: "text-indigo-500",
    },
    percentages: {
      badge: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      bar: "from-blue-500 to-cyan-500",
      text: "text-blue-500",
    },
    mixed: {
      badge: "text-primary bg-primary-muted/20 border-primary/20",
      bar: "from-primary to-emerald-400",
      text: "text-primary",
    },
  };

  const totalPracticed = operations.reduce(
    (acc, op) => acc + (masteryMap[op]?.totalAttempts ?? 0),
    0
  );

  return (
    <div className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary tracking-tight">
            Operation Mastery Breakdown
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time competency index calculated from verified accuracy and solve speed.
          </p>
        </div>
        {totalPracticed === 0 && (
          <span className="self-start sm:self-auto text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-surface-inset border border-border text-text-muted">
            Initial State (0 Drills)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {operations.map((op) => {
          const stat = masteryMap[op] ?? {
            operation: op,
            level: 0,
            totalAttempts: 0,
            totalCorrect: 0,
            accuracy: 0,
            averageSpeedMs: 0,
            byDigitComplexity: {
              "1-digit": { accuracy: 0, total: 0 },
              "2-digit": { accuracy: 0, total: 0 },
              "3-digit": { accuracy: 0, total: 0 },
              "4-digit": { accuracy: 0, total: 0 },
            },
          };

          const symbol = getOperatorSymbol(op);
          const hasAttempts = stat.totalAttempts > 0;
          const levelPercent = hasAttempts ? Math.min(100, Math.max(0, stat.level)) : 0;
          const colors = opColors[op];

          return (
            <div
              key={op}
              className="neu-inset p-4 sm:p-5 rounded-2xl border border-border/80 flex flex-col gap-3 shadow-[var(--shadow-inset)]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl border font-mono font-extrabold text-base shadow-sm",
                      colors.badge
                    )}
                  >
                    {symbol}
                  </span>
                  <span className="text-xs font-bold font-display capitalize text-text-primary">
                    {op}
                  </span>
                </div>
                <span className={cn("font-mono text-xs font-bold tabular-nums", colors.text)}>
                  {hasAttempts ? `${levelPercent}% Mastery` : "Unpracticed"}
                </span>
              </div>

              <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border/60 p-0.5">
                <div
                  className={cn(
                    "bg-gradient-to-r h-full rounded-full transition-all duration-700 ease-out shadow-sm",
                    colors.bar
                  )}
                  style={{ width: `${Math.max(hasAttempts ? levelPercent : 0, 0)}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-text-muted mt-0.5">
                <span>
                  {hasAttempts ? `${stat.totalCorrect}/${stat.totalAttempts} correct` : "0 drills"}
                </span>
                <span className="font-semibold text-text-secondary">
                  {hasAttempts ? `${stat.accuracy}% acc` : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
