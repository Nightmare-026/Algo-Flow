import React from "react";
import Link from "next/link";
import { Play, Trophy, Star, CheckCircle2, Zap, BrainCircuit, Code2 } from "lucide-react";
import type { Algorithm } from "@/types";
import { cn } from "@/lib/utils";

export interface DailyDualQuestCardProps {
  dsaAlgorithm: Algorithm | null;
  dsaCompleted: boolean;
  mathCompleted: boolean;
}

export function DailyDualQuestCard({
  dsaAlgorithm,
  dsaCompleted,
  mathCompleted,
}: DailyDualQuestCardProps) {
  const questsDone = (dsaCompleted ? 1 : 0) + (mathCompleted ? 1 : 0);
  const allDone = questsDone === 2;

  return (
    <section className="neu-float rounded-3xl p-6 sm:p-8 border border-border bg-surface relative overflow-hidden transition-all duration-300">
      {/* Background Accent Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-glow blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-warning-muted text-warning border border-warning/20 text-xs">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Daily Training Quests
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-text-primary tracking-tight mt-1">
            Today&apos;s Computational Challenges
          </h2>
        </div>

        {/* Quest Completion Tracker Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-bg-surface-inset border border-border shadow-[var(--shadow-inset)] w-fit">
          <span className="text-[11px] font-mono font-bold text-text-muted uppercase">
            Quests Completed:
          </span>
          <span
            className={cn(
              "font-mono font-bold text-xs px-2 py-0.5 rounded-lg",
              allDone
                ? "bg-success text-white"
                : questsDone === 1
                  ? "bg-warning text-white"
                  : "bg-surface text-text-primary border border-border"
            )}
          >
            {questsDone}/2 Done
          </span>
          {allDone && (
            <span className="text-xs text-success flex items-center gap-1 font-bold">
              ★ Duo Bonus Active
            </span>
          )}
        </div>
      </div>

      {/* Dual Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quest 1: DSA Algorithm Challenge */}
        <div
          className={cn(
            "neu-raised p-5 sm:p-6 rounded-2xl border flex flex-col justify-between transition-all",
            dsaCompleted
              ? "border-success/30 bg-success-muted/15"
              : "border-border bg-surface hover:border-primary/30"
          )}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-primary-muted text-primary border border-primary/20">
                <Code2 className="w-3 h-3" />
                Algorithm Track
              </span>
              <span className="text-[11px] font-mono font-bold text-primary flex items-center gap-1 bg-surface px-2 py-0.5 rounded-md border border-border">
                <Star className="w-3 h-3 fill-current text-warning" /> +30 XP
              </span>
            </div>

            <h3 className="text-base font-bold font-display text-text-primary">
              {dsaAlgorithm ? dsaAlgorithm.name : "Daily Algorithm Challenge"}
            </h3>
            <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
              {dsaCompleted
                ? "You have successfully completed today's algorithm simulation."
                : dsaAlgorithm?.shortDescription ||
                  "Inspect invariants and complete this interactive trace to build your streak."}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between">
            {dsaCompleted ? (
              <div className="flex items-center gap-2 text-xs font-bold text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed Today</span>
              </div>
            ) : (
              <span className="text-[11px] font-mono text-text-muted">Unfinished</span>
            )}

            <Link
              href={
                dsaCompleted
                  ? `/quizzes/${dsaAlgorithm?.id || ""}`
                  : `/visualizer/${dsaAlgorithm?.slug || ""}`
              }
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold font-display shadow-[var(--shadow-raised-sm)] transition-all active:scale-95",
                dsaCompleted
                  ? "border border-border bg-surface text-text-primary hover:bg-surface-hover"
                  : "bg-primary text-white hover:bg-primary-hover"
              )}
            >
              <span>{dsaCompleted ? "Review Quiz" : "Launch Trace"}</span>
              <Play className="w-3 h-3 fill-current" />
            </Link>
          </div>
        </div>

        {/* Quest 2: Mental Math Sprint */}
        <div
          className={cn(
            "neu-raised p-5 sm:p-6 rounded-2xl border flex flex-col justify-between transition-all",
            mathCompleted
              ? "border-success/30 bg-success-muted/15"
              : "border-border bg-surface hover:border-secondary/30"
          )}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-secondary-muted text-secondary border border-secondary/20">
                <BrainCircuit className="w-3 h-3" />
                Mental Math Track
              </span>
              <span className="text-[11px] font-mono font-bold text-secondary flex items-center gap-1 bg-surface px-2 py-0.5 rounded-md border border-border">
                <Trophy className="w-3 h-3 text-warning" /> +40 XP
              </span>
            </div>

            <h3 className="text-base font-bold font-display text-text-primary">
              60-Second Calculation Sprint
            </h3>
            <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
              {mathCompleted
                ? "You recorded an official verified score on today's global sprint leaderboard."
                : "Test arithmetic cadence under a 60-second timer. Verified anti-cheat leaderboard ranking."}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between">
            {mathCompleted ? (
              <div className="flex items-center gap-2 text-xs font-bold text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sprint Verified</span>
              </div>
            ) : (
              <span className="text-[11px] font-mono text-text-muted">Unfinished</span>
            )}

            <Link
              href="/mental-math/daily"
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold font-display shadow-[var(--shadow-raised-sm)] transition-all active:scale-95",
                mathCompleted
                  ? "border border-border bg-surface text-text-primary hover:bg-surface-hover"
                  : "bg-secondary text-white hover:bg-secondary-hover"
              )}
            >
              <span>{mathCompleted ? "Leaderboard" : "Start Sprint"}</span>
              <Zap className="w-3 h-3 fill-current" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
