"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BarChart3, Flame, Zap, Target, TrendingUp, Play } from "lucide-react";
import { MasteryRadar } from "@/features/mental-math/components/MasteryRadar";
import { WeaknessCard } from "@/features/mental-math/components/WeaknessCard";
import { getLocalMentalMathStats } from "@/features/mental-math/storage/local-store";
import { UserMentalMathStats, SessionSummary } from "@/features/mental-math/core/types";

export default function MentalMathProgressPage() {
  const [stats] = useState<UserMentalMathStats>(() => getLocalMentalMathStats());

  return (
    <div className="flex w-full flex-col px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex min-h-7 items-center gap-2 rounded-full border border-border bg-surface px-3 text-[11px] font-bold font-display uppercase tracking-wider text-primary shadow-[var(--shadow-raised-sm)] mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Calculation Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-text-primary tracking-tight">
            Mental Math <span className="text-primary">Mastery & Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Granular breakdown of your arithmetic fluency, speed trajectories, and accuracy
            benchmarks.
          </p>
        </div>

        <Link
          href="/mental-math/practice"
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-6 text-xs font-bold font-display text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Practice</span>
        </Link>
      </div>

      {/* 4 Summary Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="neu-raised p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Total Solved
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-sm">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {stats?.totalQuestionsSolved.toLocaleString() || 0}
            </div>
            <p className="text-xs font-medium text-text-secondary mt-1">
              {stats?.totalSessionsCompleted || 0} completed sessions
            </p>
          </div>
        </div>

        <div className="neu-raised p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Overall Accuracy
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {stats?.overallAccuracy ?? 0}%
            </div>
            <p className="text-xs font-medium text-text-secondary mt-1 tabular-nums">
              {stats?.totalCorrect || 0} of {stats?.totalQuestionsSolved || 0} correct
            </p>
          </div>
        </div>

        <div className="neu-raised p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Active Streak
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
              <Flame className="w-4 h-4 fill-current" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {stats?.currentStreakDays || 0}{" "}
              <span className="text-sm font-normal text-text-muted">Days</span>
            </div>
            <p className="text-xs font-medium text-text-secondary mt-1">
              Max streak: {stats?.maxStreakDays || 0} days
            </p>
          </div>
        </div>

        <div className="neu-raised p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Fastest Pace
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500 border border-teal-500/20 shadow-sm">
              <Zap className="w-4 h-4 fill-current" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {stats?.personalBests.fastestSpeedQPM || 0}
            </div>
            <p className="text-xs font-medium text-text-secondary mt-1">Questions per minute</p>
          </div>
        </div>
      </section>

      {/* Operation Mastery & Weakness Card Grid */}
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

      {/* Full History Log */}
      <section className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary tracking-tight">
            Complete Practice Session History
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Historical log of all completed drills, assessments, and sprints.
          </p>
        </div>

        {stats && stats.recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-text-muted font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5">Mode</th>
                  <th className="py-3 px-3.5">Operation</th>
                  <th className="py-3 px-3.5">Difficulty</th>
                  <th className="py-3 px-3.5">Accuracy</th>
                  <th className="py-3 px-3.5">Avg Speed</th>
                  <th className="py-3 px-3.5 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {stats.recentSessions.map((session: SessionSummary) => (
                  <tr
                    key={session.sessionId}
                    className="hover:bg-surface-hover/50 transition-colors"
                  >
                    <td className="py-3.5 px-3.5 text-text-secondary">
                      {new Date(session.completedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3.5 font-sans font-bold capitalize text-text-primary">
                      {session.mode}
                    </td>
                    <td className="py-3.5 px-3.5 font-sans capitalize text-primary font-bold">
                      {session.operation}
                    </td>
                    <td className="py-3.5 px-3.5 capitalize text-text-secondary">
                      {session.difficulty}
                    </td>
                    <td className="py-3.5 px-3.5 font-bold text-text-primary tabular-nums">
                      {session.accuracyPercentage}% ({session.correctCount}/{session.totalQuestions}
                      )
                    </td>
                    <td className="py-3.5 px-3.5 text-text-secondary tabular-nums">
                      {(session.averageSolveTimeMs / 1000).toFixed(1)}s
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-extrabold text-primary font-display text-sm tabular-nums">
                      {session.finalScore.toLocaleString()} PTS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="neu-inset p-8 rounded-2xl border border-border text-center text-xs text-text-muted shadow-inner">
            No completed sessions recorded yet. Start practicing to generate analytics.
          </div>
        )}
      </section>
    </div>
  );
}
