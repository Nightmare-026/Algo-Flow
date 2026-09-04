"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { PlaybackSpeed } from "@/types";
import { cn } from "@/lib/utils";

const speedLabels: Record<PlaybackSpeed, string> = {
  "0.25x": "0.25x",
  "0.5x": "0.5x",
  "0.75x": "0.75x",
  "1x": "1.0x",
  "2x": "2.0x",
  slow: "0.5x",
  normal: "1.0x",
  fast: "2.0x",
  custom: "Custom",
};

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
      className="flex items-center gap-0.5 rounded-full bg-bg-surface-inset p-1 border border-border shadow-[var(--shadow-inset)] shrink-0 overflow-hidden"
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
              "min-h-7 px-2 text-[10px] font-mono font-bold rounded-full transition-all cursor-pointer select-none",
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

export function SpeedDisplay() {
  const speed = usePlaybackStore((state) => state.speed);
  const customSpeedMs = usePlaybackStore((state) => state.customSpeedMs);

  const displayLabel = speed === "custom" ? `${customSpeedMs}ms` : speedLabels[speed] || "1.0x";

  return (
    <span
      id="speed-display"
      className="font-mono text-[10px] font-bold text-text-muted"
      aria-live="polite"
    >
      {displayLabel}
    </span>
  );
}
