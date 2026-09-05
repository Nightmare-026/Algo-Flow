"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEngine } from "../engine/sound";

interface CountdownOverlayProps {
  onComplete: () => void;
}

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Initial tick at 3
    soundEngine.playCountdownTick(false);

    let current = 3;
    let finishTimer: NodeJS.Timeout | null = null;

    const interval = setInterval(() => {
      current -= 1;
      if (current > 0) {
        // Standard tick on 2 and 1
        soundEngine.playCountdownTick(false);
        setCount(current);
      } else {
        // High chime precisely when "GO!" appears
        soundEngine.playCountdownTick(true);
        setCount(0);
        clearInterval(interval);

        finishTimer = setTimeout(() => {
          onCompleteRef.current();
        }, 400);
      }
    }, 750);

    return () => {
      clearInterval(interval);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent pointer-events-auto select-none"
      role="dialog"
      aria-label="Timed test countdown"
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
