"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  Target,
  Zap,
  Clock,
  Trophy,
  BarChart3,
  ListOrdered,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMentalMathStore } from "@/features/mental-math/engine/session-store";

export const MENTAL_MATH_NAV_ITEMS = [
  {
    label: "Hub",
    shortLabel: "Hub",
    href: "/mental-math",
    icon: BrainCircuit,
    exact: true,
  },
  {
    label: "Practice",
    shortLabel: "Practice",
    href: "/mental-math/practice",
    icon: Target,
    exact: false,
  },
  {
    label: "Speed Sprint",
    shortLabel: "Speed",
    href: "/mental-math/speed",
    icon: Zap,
    exact: false,
  },
  {
    label: "Timed Test",
    shortLabel: "Test",
    href: "/mental-math/test",
    icon: Clock,
    exact: false,
  },
  {
    label: "Daily Challenge",
    shortLabel: "Daily",
    href: "/mental-math/daily",
    icon: Trophy,
    exact: false,
  },
  {
    label: "Leaderboards",
    shortLabel: "Ranks",
    href: "/mental-math/leaderboard",
    icon: ListOrdered,
    exact: false,
  },
  {
    label: "Mastery & Stats",
    shortLabel: "Mastery",
    href: "/mental-math/progress",
    icon: BarChart3,
    exact: false,
  },
];

const STORAGE_KEY = "algo-flow:mm-sidebar-collapsed";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Desktop Fixed Left Sidebar for Mental Math Studio
 * Spans full height from the bottom of Navbar (top-[4.5rem]) down to the bottom of the viewport (bottom-0).
 */
export function MentalMathSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Mental Math Navigation"
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-[4.5rem] bottom-0 z-40 border-r border-border/80 bg-surface/98 backdrop-blur-xl transition-all duration-300 ease-in-out select-none shadow-[2px_0_16px_rgba(0,0,0,0.03)]",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Studio Header (Pinned at Top of Sidebar) */}
      <div
        className={cn(
          "h-16 flex items-center px-3 border-b border-border/60 shrink-0 transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {isCollapsed ? (
          <div
            title="Mental Math Calculation Studio"
            className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm"
          >
            <BrainCircuit className="w-4 h-4" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold font-display text-text-primary tracking-tight truncate">
                Mental Math
              </span>
              <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">
                Calculation Studio
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items List (Scrollable Area) */}
      <nav className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-1 w-full">
        {MENTAL_MATH_NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "relative group flex items-center rounded-xl transition-all duration-200 font-display text-xs font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isCollapsed ? "justify-center h-10 w-full px-0" : "gap-3 px-3.5 py-2.5 w-full",
                isActive
                  ? "bg-primary text-white shadow-(--shadow-raised-sm)"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover active:scale-[0.98]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-primary"
                )}
              />

              {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}

              {/* Floating Tooltip for Collapsed State */}
              {isCollapsed && (
                <div className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-surface-elevated text-text-primary text-xs font-semibold whitespace-nowrap opacity-0 shadow-xl border border-border group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area: Collapse / Expand Toggle Button (Pinned at Bottom of Sidebar) */}
      <div className="p-2.5 border-t border-border/60 shrink-0 bg-surface/50">
        <button
          type="button"
          onClick={onToggle}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full flex items-center rounded-xl p-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors outline-none cursor-pointer",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && (
            <span className="text-[11px] tracking-tight font-medium">Collapse sidebar</span>
          )}
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-text-secondary" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-text-secondary" />
          )}
        </button>
      </div>
    </aside>
  );
}

/**
 * Mobile Bottom Navigation Bar for Mental Math Studio (< lg screens)
 */
export function MentalMathBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mental Math Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] select-none"
    >
      <div className="flex items-center justify-around overflow-x-auto no-scrollbar max-w-lg mx-auto gap-1">
        {MENTAL_MATH_NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[3rem] py-1 px-1.5 rounded-xl transition-all duration-150 shrink-0",
                isActive
                  ? "text-primary font-bold bg-primary/10"
                  : "text-text-secondary hover:text-text-primary active:scale-95"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform",
                  isActive ? "text-primary scale-110" : "text-text-secondary"
                )}
              />
              <span className="text-[10px] font-display mt-0.5 tracking-tight truncate leading-tight">
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Full-height fixed layout shell for Mental Math
 * Handles synchronized transition between fixed left sidebar and content area,
 * preventing any overlap or layout shift bugs.
 */
export function MentalMathShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  const storedCollapsed = React.useSyncExternalStore(
    subscribeToStorage,
    getStoredCollapsed,
    () => false
  );
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isCollapsed = userOverride !== null ? userOverride : storedCollapsed;

  // Read drill status from store to auto-condense during active calculation drills
  const drillStatus = useMentalMathStore((s) => s.status);
  const isActivelyDrilling =
    drillStatus === "active" || drillStatus === "feedback" || drillStatus === "countdown";

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setUserOverride(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
  };

  // During active calculations, auto-collapse unless user expands
  const effectiveCollapsed = isMounted ? (isActivelyDrilling ? true : isCollapsed) : false;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 1. Desktop Fixed Full-Height Left Sidebar */}
      <MentalMathSidebar isCollapsed={effectiveCollapsed} onToggle={toggleCollapsed} />

      {/* 2. Main Content Wrapper: dynamically offset by the exact fixed sidebar width */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out w-full pt-18 sm:pt-20",
          effectiveCollapsed ? "lg:pl-16" : "lg:pl-60"
        )}
      >
        <main id="main-content" className="flex-1 w-full min-w-0 pb-20 lg:pb-12">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
            {children}
          </div>
        </main>

        {/* Footer lives inside the offset content column so it doesn't overlap the fixed sidebar */}
        {footer}
      </div>

      {/* 3. Mobile Bottom Navigation (< lg viewports) */}
      <MentalMathBottomNav />
    </div>
  );
}

/**
 * Backward-compatible component (renders MentalMathSidebar standalone if used elsewhere)
 */
export function MentalMathSubNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <>
      <MentalMathSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((p) => !p)} />
      <MentalMathBottomNav />
    </>
  );
}
