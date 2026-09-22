"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar({ targetId }: { targetId?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getTarget = () => (targetId ? document.getElementById(targetId) : null);
    const target = getTarget();
    const scrollElement = target || window;

    const handleScroll = () => {
      const el = getTarget();
      let totalHeight = 0;
      let currentScroll = 0;

      if (el) {
        totalHeight = el.scrollHeight - el.clientHeight;
        currentScroll = el.scrollTop;
      } else {
        totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        currentScroll = window.scrollY;
      }

      if (totalHeight <= 0) {
        setProgress(0);
        return;
      }
      const percentage = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setProgress(percentage);
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [targetId]);

  return (
    <div
      className="fixed top-18 left-0 right-0 h-1 z-40 pointer-events-none bg-border/20"
      aria-hidden="true"
    >
      <div
        className="h-full bg-linear-to-r from-primary to-accent transition-all duration-75 ease-out shadow-[0_0_10px_rgba(21,128,61,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
