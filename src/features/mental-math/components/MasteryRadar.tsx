"use client";

import React from "react";
import { Plus, Minus, X, Divide, Superscript, Box, Radical, Percent, Shuffle } from "lucide-react";
import { MathOperation, OperationMastery } from "../core/types";
import { cn } from "@/lib/utils";

interface MasteryRadarProps {
  masteryMap: Record<MathOperation, OperationMastery>;
}

interface OperationMeta {
  id: MathOperation;
  name: string;
  icon: React.ElementType;
}

const OPERATIONS_META: OperationMeta[] = [
  { id: "addition", name: "Addition", icon: Plus },
  { id: "subtraction", name: "Subtraction", icon: Minus },
  { id: "multiplication", name: "Multiplication", icon: X },
  { id: "division", name: "Division", icon: Divide },
  { id: "squares", name: "Squares (xÂ²)", icon: Superscript },
  { id: "cubes", name: "Cubes (xÂ³)", icon: Box },
  { id: "roots", name: "Square Roots (âˆšx)", icon: Radical },
  { id: "percentages", name: "Percentages (%)", icon: Percent },
  { id: "mixed", name: "Mixed Operations", icon: Shuffle },
];

export function MasteryRadar({ masteryMap }: MasteryRadarProps) {
  const totalPracticed = OPERATIONS_META.reduce(
    (acc, op) => acc + (masteryMap[op.id]?.totalAttempts ?? 0),
    0
  );

  return (
    <div className="neu-raised p-6 sm:p-7 rounded-3xl border border-border bg-surface flex flex-col justify-between h-full shadow-(--shadow-raised-sm)">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold font-display text-text-primary tracking-tight">
              Operation Mastery Breakdown
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Real-time competency index calculated from verified accuracy and solve speed.
            </p>
          </div>
          {totalPracticed === 0 && (
            <span className="self-start sm:self-auto text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-surface-inset border border-border text-text-muted shadow-inner">
              Initial State (0 Drills)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {OPERATIONS_META.map((op) => {
            const stat = masteryMap[op.id] ?? {
              operation: op.id,
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

            const Icon = op.icon;
            const hasAttempts = stat.totalAttempts > 0;
            const levelPercent = hasAttempts ? Math.min(100, Math.max(0, stat.level)) : 0;

            return (
              <div
                key={op.id}
                className="neu-inset p-3.5 sm:p-4 rounded-2xl border border-border bg-surface-inset flex flex-col gap-2.5 shadow-(--shadow-inset) transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-xs">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold font-display text-text-primary">
                      {op.name}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-xs tabular-nums font-semibold",
                      hasAttempts ? "text-primary font-bold" : "text-text-muted"
                    )}
                  >
                    {hasAttempts ? `${levelPercent}% Mastery` : "Unpracticed"}
                  </span>
                </div>

                <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border/70 p-0.5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out",
                      hasAttempts
                        ? "bg-linear-to-r from-primary to-emerald-400 shadow-sm"
                        : "bg-transparent"
                    )}
                    style={{ width: `${hasAttempts ? levelPercent : 0}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-text-muted">
                  <span>
                    {hasAttempts
                      ? `${stat.totalCorrect}/${stat.totalAttempts} correct`
                      : "0 drills"}
                  </span>
                  <span className={cn(hasAttempts ? "font-semibold text-text-secondary" : "")}>
                    {hasAttempts ? `${stat.accuracy}% acc` : "â€”"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
