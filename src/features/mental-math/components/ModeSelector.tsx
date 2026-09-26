"use client";

import React from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Clock,
  Zap,
  Trophy,
  TrendingUp,
  Trophy as LeaderboardIcon,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingModeItem {
  id: string;
  href: string;
  title: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  btnClass?: string;
  primaryCTA: string;
  isFeatured?: boolean;
}

export function ModeSelector() {
  const modes: TrainingModeItem[] = [
    {
      id: "practice",
      href: "/mental-math/practice",
      title: "Practice Studio",
      description:
        "Uncapped calculation sandbox. Configure 1–4 digit ranges, toggle 4-choice hints, and master mental math breakdown patterns.",
      badge: "Configurable",
      icon: BrainCircuit,
      btnClass: "bg-primary text-white hover:bg-primary-hover shadow-(--shadow-raised-sm)",
      primaryCTA: "Open Studio",
      isFeatured: true,
    },
    {
      id: "speed",
      href: "/mental-math/speed",
      title: "60s Speed Sprint",
      description:
        "Rapid-fire high-velocity sprint. Solve as many problems as possible in 60 seconds with compounding streak combo multipliers.",
      badge: "High Cadence",
      icon: Zap,
      primaryCTA: "Launch Sprint",
    },
    {
      id: "test",
      href: "/mental-math/test",
      title: "Timed Assessment",
      description:
        "Standardized 20-question benchmark measuring raw calculation velocity (QPM), latency per operation, and overall precision.",
      badge: "20 Questions",
      icon: Clock,
      primaryCTA: "Take Assessment",
    },
    {
      id: "daily",
      href: "/mental-math/daily",
      title: "Daily Challenge",
      description:
        "Compete in today's official 10-problem seeded arithmetic challenge. Identical PRNG sequence for all global contenders.",
      badge: "Official Rank",
      icon: Trophy,
      btnClass: "bg-primary text-white hover:bg-primary-hover shadow-(--shadow-raised-sm)",
      primaryCTA: "Play Today's Run",
      isFeatured: true,
    },
    {
      id: "weakness",
      href: "/mental-math/practice?mode=weakness",
      title: "Weakness Drill",
      description:
        "Adaptive smart drill targeting your specific arithmetic pain points (carries, borrows, multi-digit products, and decimals).",
      badge: "Targeted Focus",
      icon: TrendingUp,
      primaryCTA: "Target Bottlenecks",
    },
    {
      id: "leaderboard",
      href: "/mental-math/leaderboard",
      title: "Global Leaderboards",
      description:
        "Inspect verified daily sprint standings, accuracy tiers, and all-time top calculation velocities across all registered learners.",
      badge: "Live Standings",
      icon: LeaderboardIcon,
      primaryCTA: "View Standings",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <Link
            key={mode.id}
            href={mode.href}
            className={cn(
              "group relative p-6 sm:p-7 rounded-[8px] border flex flex-col justify-between transition-all duration-200 hover:border-primary/40 hover:-translate-y-1 shadow-card hover:shadow-card-hover cursor-pointer",
              mode.isFeatured ? "border-primary/30 bg-surface/90" : "border-border bg-surface"
            )}
            aria-label={`Open ${mode.title}`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-border bg-surface-secondary text-primary shadow-xs transition-transform duration-200 group-hover:scale-105 group-hover:border-primary/40">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-border bg-surface-secondary text-text-muted shadow-xs">
                  {mode.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold font-display text-text-primary tracking-tight group-hover:text-primary transition-colors">
                {mode.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                {mode.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60">
              <div
                className={cn(
                  "w-full min-h-11 flex items-center justify-center gap-2 py-3 rounded-[4px] text-xs font-bold font-display transition-all duration-200 active:scale-95",
                  mode.btnClass
                    ? mode.btnClass
                    : "bg-surface group-hover:bg-surface-hover text-text-primary group-hover:text-primary border border-border shadow-card"
                )}
              >
                <span>{mode.primaryCTA}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
