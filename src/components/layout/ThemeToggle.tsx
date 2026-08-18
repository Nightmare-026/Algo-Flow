"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sparkles, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { ThemePreference } from "@/types";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: Array<{
  id: ThemePreference;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}> = [
  {
    id: "light-edu",
    label: "Light Green",
    sublabel: "Edu Mint / Emerald",
    icon: Sun,
  },
  {
    id: "dark-neon",
    label: "Dark Neon",
    sublabel: "Obsidian / Neon Green",
    icon: Moon,
  },
  {
    id: "nature-cinematic",
    label: "Nature Forest",
    sublabel: "Deep Emerald / Cyan",
    icon: Sparkles,
  },
  {
    id: "system",
    label: "System",
    sublabel: "Device default",
    icon: Laptop,
  },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const CurrentIcon =
    resolvedTheme === "dark-neon"
      ? Moon
      : resolvedTheme === "nature-cinematic"
        ? Sparkles
        : Sun;

  return (
    <div ref={dropdownRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-bg-surface-light text-text-primary shadow-[var(--shadow-raised-sm)] transition-all hover:border-primary/50 hover:bg-bg-surface-hover hover:text-primary active:scale-95"
        aria-label={`Theme: ${theme}. Click to change theme`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CurrentIcon className="h-4.5 w-4.5 transition-transform duration-200" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-border bg-bg-surface-light p-1.5 shadow-[var(--shadow-float)] backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-text-muted">
            Theme Palette
          </div>
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setTheme(option.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                  isSelected
                    ? "bg-primary-muted font-bold text-primary-active shadow-[var(--shadow-inset)]"
                    : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg border",
                    isSelected
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-bg-surface text-text-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  <span className="text-[11px] text-text-muted">{option.sublabel}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
