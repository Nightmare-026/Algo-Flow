"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-[var(--shadow-raised-sm)] transition-all duration-200 hover:border-primary/40 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        className
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Sun
        className={cn(
          "h-4.5 w-4.5 transition-transform duration-300",
          isDark ? "hidden rotate-90 scale-0" : "block rotate-0 scale-100 text-amber-600"
        )}
      />
      <Moon
        className={cn(
          "h-4.5 w-4.5 transition-transform duration-300",
          isDark ? "block rotate-0 scale-100 text-emerald-400" : "hidden -rotate-90 scale-0"
        )}
      />
    </button>
  );
}
