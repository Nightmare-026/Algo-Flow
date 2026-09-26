import React from "react";
import Link from "next/link";
import { BrainCircuit, Play, Crown, ChevronRight, Gauge, Target, Hash } from "lucide-react";
import type { UserMentalMathStats } from "@/features/mental-math/core/types";

export interface MentalMathRadarProps {
  stats: UserMentalMathStats | null;
}

export function MentalMathRadar({ stats }: MentalMathRadarProps) {
  const fastestQPM = stats?.personalBests?.fastestSpeedQPM ?? 0;
  const accuracy = stats && stats.totalQuestionsSolved > 0 ? stats.overallAccuracy : 0;
  const totalSolved = stats?.totalQuestionsSolved ?? 0;

  return (
    <section className="p-6 rounded-[8px] border border-border bg-surface shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-secondary-muted text-secondary border border-secondary/20">
              <BrainCircuit className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-base font-bold font-display text-text-primary">
              Arithmetic Fluency
            </h2>
          </div>
          <Link
            href="/mental-math/progress"
            className="text-[11px] font-mono text-secondary hover:underline flex items-center gap-0.5"
          >
            Diagnostics <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 3 Compact Telemetry Chips */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-3 rounded-[6px] border border-border bg-surface-secondary/70 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-text-muted">
              <Gauge className="w-3 h-3" />
              <span>Speed</span>
            </div>
            <div className="mt-1">
              <p className="text-base font-extrabold font-display text-text-primary tabular-nums">
                {fastestQPM > 0 ? `${fastestQPM}` : "—"}
              </p>
              <p className="text-[9px] font-mono text-text-muted">QPM</p>
            </div>
          </div>

          <div className="p-3 rounded-[6px] border border-border bg-surface-secondary/70 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-text-muted">
              <Target className="w-3 h-3" />
              <span>Acc.</span>
            </div>
            <div className="mt-1">
              <p className="text-base font-extrabold font-display text-text-primary tabular-nums">
                {totalSolved > 0 ? `${accuracy}%` : "—"}
              </p>
              <p className="text-[9px] font-mono text-text-muted">Precision</p>
            </div>
          </div>

          <div className="p-3 rounded-[6px] border border-border bg-surface-secondary/70 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-text-muted">
              <Hash className="w-3 h-3" />
              <span>Solved</span>
            </div>
            <div className="mt-1">
              <p className="text-base font-extrabold font-display text-text-primary tabular-nums">
                {totalSolved > 0 ? totalSolved.toLocaleString() : "0"}
              </p>
              <p className="text-[9px] font-mono text-text-muted">Math</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Link
          href="/mental-math/practice"
          className="flex-1 min-h-9 items-center justify-center gap-1.5 rounded-[4px] bg-secondary text-white text-xs font-bold font-display shadow-card hover:bg-secondary/90 transition-all active:scale-[0.99] flex"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Practice Studio</span>
        </Link>
        <Link
          href="/mental-math/leaderboard"
          className="h-9 w-9 items-center justify-center rounded-[4px] border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-secondary shadow-xs transition-all flex shrink-0"
          title="Global Leaderboard"
        >
          <Crown className="w-3.5 h-3.5 text-amber-500" />
        </Link>
      </div>
    </section>
  );
}
