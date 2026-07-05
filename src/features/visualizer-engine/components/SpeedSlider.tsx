"use client";

import { usePlaybackStore } from "../playback-store";
import { PlaybackSpeed } from "@/types";
import { cn } from "@/lib/utils";

export function SpeedSlider() {
  const { speed, setSpeed } = usePlaybackStore();

  const speeds: { id: PlaybackSpeed; label: string }[] = [
    { id: 'slow', label: '0.5x' },
    { id: 'normal', label: '1x' },
    { id: 'fast', label: '2x' },
  ];

  return (
    <div className="flex items-center gap-1 bg-bg-surface-light p-1 rounded-lg border border-border">
      {speeds.map((s) => (
        <button
          key={s.id}
          onClick={() => setSpeed(s.id)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
            speed === s.id 
              ? "bg-bg-surface text-primary shadow-sm border border-border" 
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
