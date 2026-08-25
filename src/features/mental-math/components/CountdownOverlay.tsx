"use client";

import React, { useEffect, useState } from "react";
import { soundEngine } from "../engine/sound";

interface CountdownOverlayProps {
  onComplete: () => void;
}

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    soundEngine.playCountdownTick(false);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        soundEngine.playCountdownTick(prev === 2);
        return prev - 1;
      });
    }, 750);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-deep/80 backdrop-blur-lg animate-in fade-in duration-200"
      role="dialog"
      aria-label="Starting practice session"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Glowing pulse ring */}
        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse" />

        <div className="neu-float relative flex flex-col items-center justify-center h-52 w-52 rounded-full border-2 border-primary/40 bg-surface text-center shadow-2xl animate-in zoom-in-90 duration-300">
          <span className="font-mono tabular-nums text-7xl sm:text-8xl font-black text-primary tracking-tighter drop-shadow-sm">
            {count > 0 ? count : "GO!"}
          </span>
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-text-muted mt-2">
            {count > 0 ? "Focus Ready" : "Accelerate"}
          </span>
        </div>
      </div>
    </div>
  );
}
