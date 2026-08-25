"use client";

import React from "react";
import Link from "next/link";
import { BrainCircuit, Clock, Zap, Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { GameMode } from "../core/types";
import { cn } from "@/lib/utils";

export function ModeSelector() {
  const modes: Array<{
    id: GameMode;
    href: string;
    title: string;
    description: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
    btnClass?: string;
    primaryCTA: string;
    isFeatured?: boolean;
  }> = [
    {
      id: "daily",
      href: "/mental-math/daily",
      title: "Daily Challenge",
      description:
        "Compete in today's official 10-problem seeded challenge. Compare your speed and accuracy on the global daily leaderboard.",
      badge: "Official Rank",
      icon: Trophy,
      accentClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      btnClass: "bg-primary text-white hover:bg-primary-hover shadow-[var(--shadow-raised-sm)]",
      primaryCTA: "Play Today's Challenge",
      isFeatured: true,
    },
    {
      id: "speed",
      href: "/mental-math/speed",
      title: "60s Speed Sprint",
      description:
        "Solve as many calculations as possible in 60 seconds. Build combo streaks for compounding score multipliers.",
      badge: "High Cadence",
      icon: Zap,
      accentClass: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      primaryCTA: "Launch Sprint",
      isFeatured: true,
    },
    {
      id: "practice",
      href: "/mental-math/practice",
      title: "Practice Studio",
      description:
        "Uncapped calculation sandbox. Customize digit ranges, enable 4-choice hints, and review step-by-step mental math strategies.",
      badge: "Configurable",
      icon: BrainCircuit,
      accentClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      primaryCTA: "Start Practice",
    },
    {
      id: "test",
      href: "/mental-math/test",
      title: "Timed Assessment",
      description:
        "Standardized 20-question arithmetic benchmark measuring raw calculation velocity (QPM) and precision accuracy.",
      badge: "20 Questions",
      icon: Clock,
      accentClass: "text-teal-500 bg-teal-500/10 border-teal-500/20",
      primaryCTA: "Take Assessment",
    },
    {
      id: "weakness",
      href: "/mental-math/practice?mode=weakness",
      title: "Weakness Drill",
      description:
        "Adaptive smart drill targeting your specific arithmetic pain points (carries, borrows, multi-digit products).",
      badge: "Adaptive AI",
      icon: TrendingUp,
      accentClass: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      primaryCTA: "Drill Weaknesses",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <div
            key={mode.id}
            className={cn(
              "neu-raised group relative p-6 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:border-primary/40 hover:-translate-y-1",
              mode.isFeatured
                ? "border-primary/30 bg-surface/90 shadow-md"
                : "border-border bg-surface"
            )}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition-transform group-hover:scale-105",
                    mode.accentClass
                  )}
                >
                  <Icon className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-border bg-surface-inset text-text-muted shadow-inner">
                  {mode.badge}
                </span>
              </div>

              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight group-hover:text-primary transition-colors">
                {mode.title}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                {mode.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
              <Link
                href={mode.href}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold font-display transition-all duration-200 active:scale-95",
                  mode.btnClass
                    ? mode.btnClass
                    : "bg-surface hover:bg-surface-hover text-text-primary hover:text-primary border border-border shadow-[var(--shadow-raised-sm)]"
                )}
              >
                <span>{mode.primaryCTA}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
