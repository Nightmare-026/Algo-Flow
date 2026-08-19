"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { PlaybackSpeed } from "@/types";
import { cn } from "@/lib/utils";

export function SpeedSlider() {
  const speed = usePlaybackStore((state) => state.speed);
  const setSpeed = usePlaybackStore((state) => state.setSpeed);

  const speeds: { id: PlaybackSpeed; label: string }[] = [
    { id: "0.25x", label: "0.25x" },
    { id: "0.5x", label: "0.5x" },
    { id: "0.75x", label: "0.75x" },
    { id: "1x", label: "1.0x" },
    { id: "2x", label: "2.0x" },
  ];

  const isSpeedActive = (id: PlaybackSpeed) => {
    if (speed === id) return true;
    if (id === "0.5x" && speed === "slow") return true;
    if (id === "1x" && speed === "normal") return true;
    if (id === "2x" && speed === "fast") return true;
    return false;
  };

  return (
    <div
      className="flex items-center gap-0.5 sm:gap-1 rounded-xl bg-bg-surface-inset p-1 border border-border shadow-[var(--shadow-inset)]"
      role="group"
      aria-label="Playback speed"
    >
      {speeds.map((s) => {
        const active = isSpeedActive(s.id);
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setSpeed(s.id)}
            aria-pressed={active}
            aria-label={`Set speed to ${s.label}`}
            className={cn(
              "min-h-8 px-2 sm:px-2.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer select-none",
              active
                ? "bg-surface text-primary border border-border shadow-[var(--shadow-raised-sm)]"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
