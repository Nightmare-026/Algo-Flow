"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Target, Zap, Clock, Trophy, BarChart3, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Hub",
    href: "/mental-math",
    icon: BrainCircuit,
    exact: true,
  },
  {
    label: "Practice",
    href: "/mental-math/practice",
    icon: Target,
    exact: false,
  },
  {
    label: "Speed Sprint",
    href: "/mental-math/speed",
    icon: Zap,
    exact: false,
  },
  {
    label: "Timed Test",
    href: "/mental-math/test",
    icon: Clock,
    exact: false,
  },
  {
    label: "Daily Challenge",
    href: "/mental-math/daily",
    icon: Trophy,
    exact: false,
  },
  {
    label: "Leaderboards",
    href: "/mental-math/leaderboard",
    icon: ListOrdered,
    exact: false,
  },
  {
    label: "Mastery & Stats",
    href: "/mental-math/progress",
    icon: BarChart3,
    exact: false,
  },
];

export function MentalMathSubNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mental Math Navigation"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sticky top-[4.5rem] z-30"
    >
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-surface/90 backdrop-blur-xl border border-border/90 shadow-[var(--shadow-raised-sm)]">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-display tracking-tight transition-all duration-200 shrink-0 select-none",
                isActive
                  ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover active:scale-95"
              )}
            >
              <Icon
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isActive ? "text-white" : "text-primary"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
