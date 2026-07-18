"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { PlaybackSpeed } from "@/types";
import { cn } from "@/lib/utils";

export function SpeedSlider() {
  const { speed, setSpeed } = usePlaybackStore();

  const speeds: { id: PlaybackSpeed; label: string }[] = [
    { id: "slow", label: "0.5x" },
    { id: "normal", label: "1x" },
    { id: "fast", label: "2x" },
  ];

  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/75 bg-surface-light p-1 shadow-[var(--shadow-raised-sm)]">
      {speeds.map((s) => (
        <button
          key={s.id}
          onClick={() => setSpeed(s.id)}
          className={cn(
            "min-h-10 px-3 text-xs font-semibold rounded-lg transition-[transform,box-shadow,border-color,background-color,color]",
            speed === s.id
              ? "bg-primary-muted text-primary-active shadow-[var(--shadow-inset)] border border-primary/10"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
