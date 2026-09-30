"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, BrainCircuit, LayoutDashboard, Menu } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { MobileMoreSheet } from "./MobileMoreSheet";

interface MobileBottomBarProps {
  user?: User | null;
}

const navItems = [
  {
    label: "Explore",
    href: "/visualizers",
    icon: Compass,
    matchPrefix: ["/visualizer", "/visualizers"],
  },
  { label: "Learnings", href: "/learnings", icon: BookOpen, matchPrefix: ["/learnings"] },
  { label: "Mental Math", href: "/mental-math", icon: BrainCircuit, matchPrefix: ["/mental-math"] },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, matchPrefix: ["/dashboard"] },
];

export function MobileBottomBar({ user = null }: MobileBottomBarProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [clientUser, setClientUser] = useState<User | null>(null);

  useEffect(() => {
    if (user !== null && user !== undefined) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setClientUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setClientUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const currentUser = user ?? clientUser;

  // Dedicated visualizer route (/visualizer/[slug]) has its own specialized bottom playback dock
  // and Mental Math (/mental-math) has its dedicated sub-studio bottom nav
  if (pathname.startsWith("/visualizer/") || pathname.startsWith("/mental-math")) {
    return null;
  }

  const isTabActive = (item: (typeof navItems)[number]) => {
    return item.matchPrefix.some((prefix) =>
      prefix === "/visualizers"
        ? pathname === prefix || pathname.startsWith("/visualizers/")
        : pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
  };

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-border-subtle bg-surface/96 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-safe transition-colors select-none"
      >
        <div className="flex h-15 max-w-lg mx-auto items-center justify-around px-2">
          {navItems.map((item) => {
            const active = isTabActive(item);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center flex-1 h-full py-1 rounded-md transition-all active:scale-95 touch-manipulation",
                  active ? "text-primary font-bold" : "text-text-muted hover:text-text-primary"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-all duration-200",
                    active ? "bg-primary-muted text-primary" : "text-text-muted"
                  )}
                >
                  <Icon className={cn("h-4.5 w-4.5 transition-transform", active && "scale-110")} />
                </div>
                <span
                  className={cn(
                    "text-[10px] tracking-tight leading-tight mt-0.5",
                    active ? "font-bold text-primary" : "font-medium text-text-secondary"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More Sheet Trigger */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            aria-expanded={isMoreOpen}
            aria-label="Open more navigation options"
            className={cn(
              "relative flex flex-col items-center justify-center flex-1 h-full py-1 rounded-md transition-all active:scale-95 cursor-pointer touch-manipulation",
              isMoreOpen ? "text-primary font-bold" : "text-text-muted hover:text-text-primary"
            )}
          >
            <div
              className={cn(
                "flex h-7 w-12 items-center justify-center rounded-full transition-all duration-200",
                isMoreOpen ? "bg-primary-muted text-primary" : "text-text-muted"
              )}
            >
              <Menu className={cn("h-4.5 w-4.5 transition-transform", isMoreOpen && "scale-110")} />
            </div>
            <span
              className={cn(
                "text-[10px] tracking-tight leading-tight mt-0.5",
                isMoreOpen ? "font-bold text-primary" : "font-medium text-text-secondary"
              )}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-up "More" Sheet Modal */}
      <MobileMoreSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        user={currentUser}
      />
    </>
  );
}
