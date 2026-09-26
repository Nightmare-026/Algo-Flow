"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Trophy, Crown, Sparkles, Zap, Timer, Calendar, ArrowRight, RefreshCw } from "lucide-react";
import { getMentalMathLeaderboard } from "@/features/mental-math/api/actions";
import { GameMode, LeaderboardEntry, MathOperation } from "@/features/mental-math/core/types";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<GameMode>("daily");
  const [selectedOp, setSelectedOp] = useState<MathOperation | "all">("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let isCancelled = false;
    getMentalMathLeaderboard(activeTab)
      .then((data) => {
        if (!isCancelled) {
          setEntries(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("Leaderboard fetch error:", err);
          setEntries([]);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [activeTab]);

  const handleTabChange = (mode: GameMode) => {
    setIsLoading(true);
    startTransition(() => {
      setActiveTab(mode);
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    getMentalMathLeaderboard(activeTab)
      .then((data) => setEntries(data))
      .catch((err) => {
        console.error("Leaderboard fetch error:", err);
        setEntries([]);
      })
      .finally(() => setIsLoading(false));
  };

  const filteredEntries =
    selectedOp === "all" ? entries : entries.filter((e) => e.operation === selectedOp);

  const top1 = filteredEntries.find((e) => e.rank === 1);
  const top2 = filteredEntries.find((e) => e.rank === 2);
  const top3 = filteredEntries.find((e) => e.rank === 3);

  const operations: Array<{ id: MathOperation | "all"; label: string }> = [
    { id: "all", label: "All Operations" },
    { id: "addition", label: "Addition (+)" },
    { id: "subtraction", label: "Subtraction (−)" },
    { id: "multiplication", label: "Multiplication (×)" },
    { id: "division", label: "Division (÷)" },
    { id: "squares", label: "Squares (x²)" },
    { id: "roots", label: "Square Roots (√x)" },
    { id: "percentages", label: "Percentages (%)" },
    { id: "mixed", label: "Mixed Operations" },
  ];

  return (
    <div className="flex w-full flex-col gap-8 pb-20 pt-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-text-primary tracking-tight">
            Mental Math <span className="text-primary">Leaderboards</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
            Live rankings tracking real-time mental calculation speed, solve accuracy, and verified
            score metrics across students and engineers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-border bg-surface px-3.5 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-card active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh Leaderboard"
            aria-label="Refresh Leaderboard"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin text-primary")} />
          </button>
          <Link
            href="/mental-math/daily"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-5 text-xs font-bold font-display text-white shadow-card hover:bg-primary-hover active:scale-95 transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Play Today&apos;s Challenge</span>
          </Link>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-3">
        <button
          onClick={() => handleTabChange("daily")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold font-display transition-all cursor-pointer",
            activeTab === "daily"
              ? "bg-primary text-white shadow-card"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Daily Challenge</span>
        </button>
        <button
          onClick={() => handleTabChange("speed")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold font-display transition-all cursor-pointer",
            activeTab === "speed"
              ? "bg-primary text-white shadow-card"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>60s Speed Sprint</span>
        </button>
        <button
          onClick={() => handleTabChange("test")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold font-display transition-all cursor-pointer",
            activeTab === "test"
              ? "bg-primary text-white shadow-card"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
          )}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Timed Assessment</span>
        </button>
      </div>

      {/* Podium Showcase (Top 3) */}
      {!isLoading && (top1 || top2 || top3) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
          {/* #2 Rank */}
          {top2 ? (
            <div
              className={cn(
                "order-2 md:order-1 p-5 rounded-lg border bg-surface flex flex-col items-center text-center shadow-card relative",
                top2.isCurrentUser ? "border-primary ring-2 ring-primary/20" : "border-slate-400/40"
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-sm mb-2 shadow-xs">
                #2
              </span>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold font-display text-text-primary truncate max-w-45">
                  {top2.displayName}
                </h2>
                {top2.isCurrentUser && (
                  <span className="px-1.5 py-0.5 rounded-xs bg-primary text-white text-[9px] font-bold">
                    You
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase mt-0.5">
                {top2.operation}
              </span>
              <div className="mt-3 pt-3 border-t border-border w-full flex justify-around text-xs font-mono">
                <div>
                  <p className="text-text-muted text-[10px]">Score</p>
                  <p className="font-extrabold text-primary">{top2.score.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-muted text-[10px]">Acc</p>
                  <p className="font-extrabold text-text-primary">{top2.accuracy}%</p>
                </div>
                <div>
                  <p className="text-text-muted text-[10px]">Speed</p>
                  <p className="font-extrabold text-text-primary">{top2.speedQPM} QPM</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="order-2 md:order-1" />
          )}

          {/* #1 Rank (Champion) */}
          {top1 ? (
            <div
              className={cn(
                "order-1 md:order-2 p-6 sm:p-7 rounded-lg border-2 bg-amber-500/5 flex flex-col items-center text-center shadow-elevated md:-translate-y-2 relative",
                top1.isCurrentUser ? "border-primary ring-4 ring-primary/30" : "border-amber-500/50"
              )}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-md bg-amber-500 text-white font-extrabold text-base mb-2 shadow-md ring-4 ring-amber-500/20">
                <Crown className="w-7 h-7 fill-current" />
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold uppercase mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Leaderboard Champion</span>
              </div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-extrabold font-display text-text-primary tracking-tight truncate max-w-55">
                  {top1.displayName}
                </h2>
                {top1.isCurrentUser && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
                    You
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-bold text-primary uppercase mt-0.5">
                {top1.operation}
              </span>
              <div className="mt-4 pt-3 border-t border-border w-full flex justify-around text-xs font-mono">
                <div>
                  <p className="text-text-muted text-[10px]">Score</p>
                  <p className="font-extrabold text-primary text-sm">
                    {top1.score.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-[10px]">Acc</p>
                  <p className="font-extrabold text-text-primary text-sm">{top1.accuracy}%</p>
                </div>
                <div>
                  <p className="text-text-muted text-[10px]">Speed</p>
                  <p className="font-extrabold text-text-primary text-sm">{top1.speedQPM} QPM</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="order-1 md:order-2" />
          )}

          {/* #3 Rank */}
          {top3 ? (
            <div
              className={cn(
                "order-3 p-5 rounded-lg border bg-surface flex flex-col items-center text-center shadow-card relative",
                top3.isCurrentUser ? "border-primary ring-2 ring-primary/20" : "border-amber-700/30"
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-amber-700 text-white font-extrabold text-sm mb-2 shadow-xs">
                #3
              </span>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold font-display text-text-primary truncate max-w-45">
                  {top3.displayName}
                </h2>
                {top3.isCurrentUser && (
                  <span className="px-1.5 py-0.5 rounded-xs bg-primary text-white text-[9px] font-bold">
                    You
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-500 uppercase mt-0.5">
                {top3.operation}
              </span>
              <div className="mt-3 pt-3 border-t border-border w-full flex justify-around text-xs font-mono">
                <div>
                  <p className="text-text-muted text-[10px]">Score</p>
                  <p className="font-extrabold text-primary">{top3.score.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-muted text-[10px]">Acc</p>
                  <p className="font-extrabold text-text-primary">{top3.accuracy}%</p>
                </div>
                <div>
                  <p className="text-text-muted text-[10px]">Speed</p>
                  <p className="font-extrabold text-text-primary">{top3.speedQPM} QPM</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="order-3" />
          )}
        </div>
      )}

      {/* Operation Filter Chips */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
        role="tablist"
        aria-label="Filter leaderboard by operation"
      >
        {operations.map((op) => (
          <button
            key={op.id}
            onClick={() => setSelectedOp(op.id)}
            className={cn(
              "h-10 shrink-0 rounded-sm px-4 text-xs font-bold font-display transition-all duration-200 cursor-pointer select-none flex items-center justify-center whitespace-nowrap",
              selectedOp === op.id
                ? "bg-primary text-white shadow-card"
                : "border border-border bg-surface text-text-secondary shadow-card hover:text-text-primary hover:bg-surface-hover active:scale-95"
            )}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table Container */}
      <div className="p-6 sm:p-8 rounded-lg border border-border flex flex-col gap-4 shadow-card bg-surface">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Querying verified leaderboard records...
            </p>
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-text-muted font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3.5 w-16">Rank</th>
                  <th className="py-3 px-3.5">Learner</th>
                  <th className="py-3 px-3.5">Operation</th>
                  <th className="py-3 px-3.5">Accuracy</th>
                  <th className="py-3 px-3.5">Cadence (QPM)</th>
                  <th className="py-3 px-3.5 text-right">Verified Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={cn(
                      "hover:bg-surface-hover/50 transition-colors",
                      entry.isCurrentUser && "bg-primary/10 border-l-2 border-l-primary"
                    )}
                  >
                    <td className="py-3.5 px-3.5">
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-sm font-extrabold text-xs shadow-xs",
                          entry.rank === 1
                            ? "bg-amber-500 text-white"
                            : entry.rank === 2
                              ? "bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                              : entry.rank === 3
                                ? "bg-amber-700 text-white"
                                : "bg-surface-secondary border border-border text-text-secondary"
                        )}
                      >
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 font-sans font-bold text-text-primary text-sm">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-mono shrink-0">
                          {entry.displayName.charAt(0).toUpperCase()}
                        </span>
                        <span className="truncate max-w-40 sm:max-w-xs">{entry.displayName}</span>
                        {entry.isCurrentUser && (
                          <span className="px-1.5 py-0.5 rounded-xs bg-primary text-white text-[9px] font-bold shrink-0">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5 font-sans capitalize text-primary font-bold">
                      {entry.operation}
                    </td>
                    <td className="py-3.5 px-3.5 font-bold text-text-primary tabular-nums">
                      {entry.accuracy}%
                    </td>
                    <td className="py-3.5 px-3.5 text-text-secondary tabular-nums">
                      {entry.speedQPM} QPM
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-extrabold text-primary font-display text-sm tabular-nums">
                      {entry.score.toLocaleString()} PTS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 rounded-lg border border-border bg-surface-secondary/50 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20 shadow-xs">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold font-display text-text-primary tracking-tight">
              No Verified Records in this Category Yet
            </h3>
            <p className="text-xs text-text-secondary max-w-sm leading-relaxed">
              Be the first learner to complete a verified{" "}
              {activeTab === "daily"
                ? "Daily Challenge"
                : activeTab === "speed"
                  ? "60-second Speed Sprint"
                  : "Timed Assessment"}{" "}
              session and claim Rank #1!
            </p>
            <Link
              href={
                activeTab === "daily"
                  ? "/mental-math/daily"
                  : activeTab === "speed"
                    ? "/mental-math/speed"
                    : "/mental-math/test"
              }
              className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-primary px-6 text-xs font-bold font-display text-white shadow-card hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>
                Start{" "}
                {activeTab === "daily"
                  ? "Daily Challenge"
                  : activeTab === "speed"
                    ? "Speed Sprint"
                    : "Assessment"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
