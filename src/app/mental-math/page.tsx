"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Flame,
  Trophy,
  Play,
  ArrowRight,
  Award,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { ModeSelector } from "@/features/mental-math/components/ModeSelector";
import { MasteryRadar } from "@/features/mental-math/components/MasteryRadar";
import { WeaknessCard } from "@/features/mental-math/components/WeaknessCard";
import { OperationsExplorer } from "@/features/mental-math/components/OperationsExplorer";
import { getLocalMentalMathStats } from "@/features/mental-math/storage/local-store";
import { getOperatorSymbol } from "@/features/mental-math/core/generator";
import { UserMentalMathStats, SessionSummary } from "@/features/mental-math/core/types";

export default function MentalMathHubPage() {
  const [stats] = useState<UserMentalMathStats>(() => getLocalMentalMathStats());

  const [todayStr] = useState(() =>
    new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  );

  return (
    <div className="flex w-full flex-col px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-10 pb-16">
      {/* Hero Section */}
      <section className="neu-float relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl">
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <div className="inline-flex min-h-7 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-[11px] font-bold font-display uppercase tracking-wider text-primary shadow-[var(--shadow-raised-sm)] mb-3">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Precision Arithmetic Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Algo Flow <span className="text-primary">Mental Math</span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-text-secondary mt-3">
            Develop instant calculation speed, algorithmic number sense, and flawless arithmetic
            precision with structured multi-digit drills, timed assessments, and official daily
            challenges.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-7">
            <Link
              href="/mental-math/practice"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl bg-primary px-6 text-xs font-bold font-display text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Open Drill Studio</span>
            </Link>

            <Link
              href="/mental-math/daily"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface px-6 text-xs font-bold font-display text-text-primary hover:text-primary hover:bg-surface-hover shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-warning" />
              <span>Today&apos;s Challenge</span>
            </Link>

            <Link
              href="/mental-math/progress"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-5 text-xs font-bold font-display text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & Mastery</span>
            </Link>
          </div>
        </div>

        {/* Local Practice Telemetry Widget */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-72 shrink-0">
          <div className="neu-inset flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
              <Flame className="h-6 w-6 fill-current" />
            </span>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
                Local Solved
              </p>
              <p className="text-xl font-extrabold font-display text-text-primary tabular-nums">
                {stats?.totalQuestionsSolved || 0}{" "}
                <span className="text-xs font-normal font-sans text-text-secondary">Problems</span>
              </p>
            </div>
          </div>

          <div className="neu-inset flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-sm">
              <Award className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
                Local Best Score
              </p>
              <p className="text-xl font-extrabold font-display text-text-primary tabular-nums">
                {stats?.personalBests.highestScore.toLocaleString() || 0}{" "}
                <span className="text-xs font-mono font-bold text-text-secondary">PTS</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visualizers-Style Operations Explorer Catalog */}
      <section className="flex flex-col gap-4">
        <div>
          <div className="inline-flex min-h-6 items-center gap-1.5 rounded-md bg-surface border border-border px-2.5 text-[10px] font-mono font-bold uppercase text-primary mb-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Curriculum Library</span>
          </div>
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Explore Arithmetic Operations
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Search and filter by category. Click any operation card to configure digit counts and
            launch your drill.
          </p>
        </div>

        <OperationsExplorer />
      </section>

      {/* Daily Challenge Highlight Banner */}
      <section className="neu-raised relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-primary/30 bg-primary-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-white text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md shadow-sm">
              Official Daily
            </span>
            <span className="text-xs font-mono font-bold text-text-muted">{todayStr}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Today&apos;s Seeded Arithmetic Sprint
          </h2>

          <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
            10 verified calculation questions. Every learner gets the exact same seeded PRNG
            sequence. Complete your run to climb the global leaderboard.
          </p>
        </div>

        <Link
          href="/mental-math/daily"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold font-display text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <span>Enter Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Training Formats Arena */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Training Formats
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Choose your format: customizable studio, high-cadence 60s sprint, or standardized timed
            test.
          </p>
        </div>

        <ModeSelector />
      </section>

      {/* Performance & Mastery Snapshot */}
      {stats && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MasteryRadar masteryMap={stats.operationMastery} />
          </div>
          <div>
            <WeaknessCard
              weaknesses={stats.identifiedWeaknesses}
              hasHistory={stats.totalQuestionsSolved > 0}
            />
          </div>
        </section>
      )}

      {/* Recent Activity Section */}
      {stats && stats.recentSessions.length > 0 && (
        <section className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold font-display text-text-primary tracking-tight">
                Recent Training Activity
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Past arithmetic sessions and calculated scores.
              </p>
            </div>
            <Link
              href="/mental-math/progress"
              className="text-xs font-bold font-display text-primary hover:underline cursor-pointer"
            >
              View Full Analytics →
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {stats.recentSessions.slice(0, 5).map((session: SessionSummary) => (
              <div
                key={session.sessionId}
                className="py-3.5 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-inset border border-border font-mono font-bold text-primary shadow-inner">
                    {getOperatorSymbol(session.operation)}
                  </span>
                  <div>
                    <p className="font-bold text-text-primary capitalize">
                      {session.mode} • {session.operation} ({session.difficulty})
                    </p>
                    <p className="text-[11px] font-mono text-text-muted mt-0.5">
                      {new Date(session.completedAt).toLocaleDateString()} at{" "}
                      {new Date(session.completedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="font-mono font-extrabold text-text-primary tabular-nums">
                      {session.finalScore.toLocaleString()} PTS
                    </p>
                    <p className="text-[11px] font-mono text-text-secondary tabular-nums">
                      {session.accuracyPercentage}% accuracy
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
