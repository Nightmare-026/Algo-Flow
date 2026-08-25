"use client";

import React, { useState } from "react";
import {
  Flame,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
  Trophy,
  Zap,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { GameMode } from "../core/types";
import { soundEngine } from "../engine/sound";
import { cn } from "@/lib/utils";

interface SessionHUDProps {
  mode: GameMode;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  combo: number;
  timeRemainingSeconds?: number | null;
  isPaused: boolean;
  onPauseToggle: () => void;
  onAbort: () => void;
  onOpenConfig?: () => void;
}

export function SessionHUD({
  mode,
  currentIndex,
  totalQuestions,
  score,
  combo,
  timeRemainingSeconds,
  isPaused,
  onPauseToggle,
  onAbort,
  onOpenConfig,
}: SessionHUDProps) {
  const [isMuted, setIsMuted] = useState(() => soundEngine.getMuted());

  // Listen for Escape key to pause/resume session
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onPauseToggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPauseToggle]);

  const toggleSound = () => {
    const next = !isMuted;
    soundEngine.setMuted(next);
    setIsMuted(next);
  };

  const progressPercent =
    totalQuestions > 0 ? Math.min(100, Math.round(((currentIndex + 1) / totalQuestions) * 100)) : 0;

  const modeBadges: Record<
    GameMode,
    { label: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    practice: { label: "Practice Mode", icon: Sparkles },
    test: { label: "Assessment Mode", icon: Clock },
    speed: { label: "Speed 60s", icon: Zap },
    daily: { label: "Daily Challenge", icon: Trophy },
    weakness: { label: "Weakness Drill", icon: Sparkles },
  };

  const currentBadge = modeBadges[mode] || {
    label: "Mental Math",
    icon: Sparkles,
  };
  const ModeIcon = currentBadge.icon;

  return (
    <header
      className="w-full flex flex-col gap-3.5 max-w-2xl mx-auto neu-raised p-4 sm:p-5 rounded-3xl border border-border/90 backdrop-blur-sm"
      aria-label="Session status"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mode & Combo */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold font-display uppercase tracking-wider bg-surface-inset border border-border text-primary shadow-[var(--shadow-inset)]">
            <ModeIcon className="w-3.5 h-3.5" />
            <span>{currentBadge.label}</span>
          </span>

          {combo >= 2 && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-extrabold shadow-sm transition-all duration-300",
                combo >= 10
                  ? "bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-red-500/20"
                  : combo >= 5
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/20"
                    : "bg-primary-muted text-primary border border-primary/30"
              )}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{combo}x Combo</span>
            </span>
          )}
        </div>

        {/* Right: Score, Timer & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {timeRemainingSeconds !== undefined && timeRemainingSeconds !== null && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-xl border font-mono text-xs font-bold shadow-[var(--shadow-inset)] transition-colors",
                timeRemainingSeconds <= 10
                  ? "text-error border-error/40 bg-error-muted/20 animate-pulse"
                  : "text-text-primary border-border bg-surface-inset"
              )}
              aria-live="polite"
            >
              <Clock className="w-3.5 h-3.5 text-text-muted" />
              <span className="tabular-nums">{Math.ceil(timeRemainingSeconds)}s</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] font-mono text-xs font-bold">
            <span className="text-text-muted font-medium">PTS</span>
            <span className="text-primary font-extrabold tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-primary shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            type="button"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-text-muted" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-primary" />
            )}
          </button>

          {/* Pause toggle */}
          {mode !== "speed" && (
            <button
              onClick={onPauseToggle}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-primary shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all"
              aria-label={isPaused ? "Resume session" : "Pause session"}
              type="button"
            >
              {isPaused ? (
                <Play className="w-3.5 h-3.5 text-primary fill-current" />
              ) : (
                <Pause className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Config / Change Drill toggle */}
          {onOpenConfig && (
            <button
              onClick={onOpenConfig}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-primary shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all"
              aria-label="Change drill settings"
              title="Change Drill Settings"
              type="button"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Abort button */}
          <button
            onClick={onAbort}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-error hover:border-error/40 shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all"
            aria-label="Exit session"
            type="button"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Segmented / Smooth Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[11px] font-mono text-text-muted">
          <span>
            Question <strong className="text-text-primary tabular-nums">{currentIndex + 1}</strong>{" "}
            of <strong className="text-text-primary tabular-nums">{totalQuestions}</strong>
          </span>
          <span className="font-bold text-primary tabular-nums">{progressPercent}%</span>
        </div>
        <div className="w-full bg-surface-inset h-2 rounded-full overflow-hidden border border-border shadow-[var(--shadow-inset)] p-0.5">
          <div
            className="bg-gradient-to-r from-primary to-emerald-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
