"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Flame, Zap, Target, TrendingUp, Play } from "lucide-react";
import { MasteryRadar } from "@/features/mental-math/components/MasteryRadar";
import { WeaknessCard } from "@/features/mental-math/components/WeaknessCard";
import { getLocalMentalMathStats } from "@/features/mental-math/storage/local-store";
import { getMentalMathUserStats } from "@/features/mental-math/api/actions";
import { UserMentalMathStats, SessionSummary } from "@/features/mental-math/core/types";

export default function MentalMathProgressPage() {
  const [stats, setStats] = useState<UserMentalMathStats | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (active) {
        setStats(getLocalMentalMathStats());
        setIsHydrated(true);
      }
    });

    getMentalMathUserStats()
      .then((cloudStats) => {
        if (active && cloudStats && cloudStats.totalQuestionsSolved > 0) {
          setStats(cloudStats);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const totalSolved = stats?.totalQuestionsSolved ?? 0;
  const accuracy = stats?.overallAccuracy ?? 0;
  const streak = stats?.currentStreakDays ?? 0;
  const maxStreak = stats?.maxStreakDays ?? 0;
  const fastestSpeed = stats?.personalBests?.fastestSpeedQPM ?? 0;
  const totalSessions = stats?.totalSessionsCompleted ?? 0;
  const totalCorrect = stats?.totalCorrect ?? 0;

  return (
    <div className="flex w-full flex-col gap-8 pb-20 pt-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-text-primary tracking-tight">
            Mental Math <span className="text-primary">Mastery & Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Granular breakdown of your arithmetic fluency, speed trajectories, and accuracy
            benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border bg-surface px-4 text-xs font-bold font-display text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-(--shadow-raised-sm) active:scale-95 transition-all cursor-pointer"
          >
            <span>Student Dashboard</span>
          </Link>
          <Link
            href="/mental-math/practice"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-5 text-xs font-bold font-display text-white shadow-(--shadow-raised-sm) hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Practice</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-(--shadow-raised-sm)">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Total Solved
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-inset text-primary border border-border shadow-inner">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {isHydrated ? totalSolved.toLocaleString() : "â€”"}
            </div>
            <p className="text-xs font-medium text-text-secondary mt-1">
              {totalSolved === 0 ? "Awaiting first run" : `${totalSessions} completed sessions`}
            </p>
          </div>
        </div>

        <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-(--shadow-raised-sm)">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Overall Accuracy
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-inset text-primary border border-border shadow-inner">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {isHydrated && totalSolved > 0 ? `${accuracy}%` : "â€”"}
            </div>
            <p className="text-xs font-medium text-text-secondary mt-1 tabular-nums">
              {totalSolved === 0 ? "Calibrating" : `${totalCorrect} of ${totalSolved} correct`}
            </p>
          </div>
        </div>

        <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-(--shadow-raised-sm)">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Active Streak
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-inset text-primary border border-border shadow-inner">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {isHydrated ? streak : "â€”"}{" "}
              <span className="text-sm font-normal text-text-muted">Days</span>
            </div>
            <p className="text-xs font-medium text-text-secondary mt-1">
              {streak === 0 ? "No active streak" : `Max streak: ${maxStreak} days`}
            </p>
          </div>
        </div>

        <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-(--shadow-raised-sm)">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Fastest Pace
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-inset text-primary border border-border shadow-inner">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {isHydrated && fastestSpeed > 0 ? fastestSpeed : "â€”"}
            </div>
            <p className="text-xs font-medium text-text-secondary mt-1">
              {fastestSpeed === 0 ? "Awaiting speed sprint" : "Questions per minute"}
            </p>
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
              weaknesses={stats.identifiedWeaknesses || []}
              hasHistory={totalSolved > 0}
            />
          </div>
        </section>
      )}

      {/* Full History Log */}
      <section className="neu-raised p-6 sm:p-8 rounded-3xl border border-border bg-surface flex flex-col gap-4 shadow-(--shadow-raised-sm)">
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary tracking-tight">
            Complete Practice Session History
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Historical log of all completed drills, assessments, and sprints.
          </p>
        </div>

        {stats && stats.recentSessions && stats.recentSessions.length > 0 ? (
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
          <div className="neu-inset p-10 rounded-2xl border border-border text-center flex flex-col items-center justify-center gap-2.5 shadow-inner">
            <BarChart3 className="w-10 h-10 text-primary/60 mb-1" />
            <h3 className="text-base font-bold font-display text-text-primary tracking-tight">
              No Completed Sessions Recorded Yet
            </h3>
            <p className="text-xs text-text-secondary max-w-sm">
              Your historical log will populate as you solve calculation drills and tests.
            </p>
            <Link
              href="/mental-math/practice"
              className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold font-display text-white shadow-(--shadow-raised-sm) hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
            >
              <span>Start Your First Drill</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
