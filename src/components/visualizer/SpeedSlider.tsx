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
    <div className="flex items-center gap-1 rounded-xl bg-surface-hover p-1 neu-inset">
      {speeds.map((s) => (
        <button
          key={s.id}
          onClick={() => setSpeed(s.id)}
          className={cn(
            "min-h-10 px-3 text-xs font-semibold rounded-lg transition-all",
            speed === s.id
              ? "bg-surface text-primary-active neu-raised"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
