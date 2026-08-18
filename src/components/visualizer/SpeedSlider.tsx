"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { PlaybackSpeed } from "@/types";
import { cn } from "@/lib/utils";

export function SpeedSlider() {
  const { speed, setSpeed } = usePlaybackStore();

  const speeds: { id: PlaybackSpeed; label: string }[] = [
    { id: "slow", label: "0.5x" },
    { id: "normal", label: "1.0x" },
    { id: "fast", label: "2.0x" },
  ];

  return (
    <div className="flex items-center gap-1 rounded-xl bg-bg-surface-inset p-1 border border-border shadow-[var(--shadow-inset)]" aria-label="Playback speed">
      {speeds.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setSpeed(s.id)}
          className={cn(
            "min-h-8 px-2.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer select-none",
            speed === s.id
              ? "bg-surface text-primary border border-border shadow-[var(--shadow-raised-sm)]"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
