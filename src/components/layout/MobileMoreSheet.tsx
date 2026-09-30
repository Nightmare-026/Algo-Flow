"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  Compass,
  BookOpen,
  BrainCircuit,
  LayoutDashboard,
  Trophy,
  Search,
  MessageSquare,
  LogOut,
  ChevronRight,
  SunMoon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { signout } from "@/app/(auth)/login/actions";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function MobileMoreSheet({ isOpen, onClose, user }: MobileMoreSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const dialog = document.getElementById("mobile-navigation");
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", handleKey);
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-100 lg:hidden flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation and settings"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-2xl border-t border-border bg-surface shadow-elevated pb-safe overflow-hidden"
          >
            {/* Sheet Handle & Header */}
            <div className="shrink-0 px-4 pt-3 pb-2 border-b border-border/60 bg-surface/95 backdrop-blur-md">
              <div className="drag-handle mb-2.5" aria-hidden="true" />
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-text-primary tracking-tight">
                  Algo<span className="text-primary">Flow</span> Navigation
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  ref={closeButtonRef}
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-all active:scale-95 cursor-pointer touch-manipulation"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-4 momentum-scroll">
              {/* User Account Card */}
              {user ? (
                <div className="rounded-xl border border-border bg-surface-secondary/70 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-white shadow-card">
                        {(
                          user.user_metadata?.first_name ||
                          user.user_metadata?.full_name ||
                          user.email?.split("@")[0] ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-primary truncate">
                          {user.user_metadata?.full_name || user.email?.split("@")[0]}
                        </p>
                        <p className="text-[11px] text-text-muted truncate">{user.email}</p>
                      </div>
                    </div>
                    <form action={signout}>
                      <button
                        type="submit"
                        onClick={onClose}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 text-xs font-semibold text-text-secondary hover:text-error hover:border-error/40 transition-colors cursor-pointer touch-manipulation"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign out</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-surface-secondary/60 p-3.5 shadow-xs">
                  <div className="mb-2.5">
                    <p className="text-xs font-bold text-text-primary">Save Your Progress</p>
                    <p className="text-[11px] text-text-secondary">
                      Sign in to sync your algorithm bookmarks, streaks, and quiz trophies.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "min-h-10 text-xs font-bold touch-manipulation",
                      })}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className={buttonVariants({
                        size: "sm",
                        className: "min-h-10 text-xs font-bold touch-manipulation",
                      })}
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              )}

              {/* Quick Actions Grid */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-2 px-1">
                  Quick Access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/visualizers"
                    onClick={onClose}
                    className="flex min-h-12 items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5 shadow-xs hover:border-primary/40 active:scale-98 transition-all touch-manipulation"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                      <Compass className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary">Visualizers</p>
                      <p className="text-[10px] text-text-muted">138 Interactive</p>
                    </div>
                  </Link>

                  <Link
                    href="/learnings"
                    onClick={onClose}
                    className="flex min-h-12 items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5 shadow-xs hover:border-primary/40 active:scale-98 transition-all touch-manipulation"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-secondary/10 text-secondary">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary">Curriculum</p>
                      <p className="text-[10px] text-text-muted">62 Chapters</p>
                    </div>
                  </Link>

                  <Link
                    href="/mental-math"
                    onClick={onClose}
                    className="flex min-h-12 items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5 shadow-xs hover:border-primary/40 active:scale-98 transition-all touch-manipulation"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent/10 text-accent">
                      <BrainCircuit className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary">Mental Math</p>
                      <p className="text-[10px] text-text-muted">Arithmetic Studio</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="flex min-h-12 items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5 shadow-xs hover:border-primary/40 active:scale-98 transition-all touch-manipulation"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-warning/10 text-warning">
                      <LayoutDashboard className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary">Dashboard</p>
                      <p className="text-[10px] text-text-muted">Mastery &amp; Streaks</p>
                    </div>
                  </Link>

                  <Link
                    href="/quizzes/bubble-sort"
                    onClick={onClose}
                    className="flex min-h-12 items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5 shadow-xs hover:border-primary/40 active:scale-98 transition-all touch-manipulation"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                      <Trophy className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary">DSA Quizzes</p>
                      <p className="text-[10px] text-text-muted">Test Knowledge</p>
                    </div>
                  </Link>

                  <Link
                    href="/visualizers?category=linear"
                    onClick={onClose}
                    className="flex min-h-12 items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5 shadow-xs hover:border-primary/40 active:scale-98 transition-all touch-manipulation"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-success/10 text-success">
                      <Search className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary">Search Catalog</p>
                      <p className="text-[10px] text-text-muted">Filter Algorithms</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Appearance Row */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <SunMoon className="h-4 w-4 text-text-muted" />
                  <span className="text-xs font-semibold text-text-primary">Interface Theme</span>
                </div>
                <ThemeToggle />
              </div>

              {/* Secondary Reference Links */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1 px-1">
                  Resources &amp; Transparency
                </p>
                <div className="divide-y divide-border/60 rounded-lg border border-border bg-surface text-xs font-medium">
                  <Link
                    href="/learnings/front-matter/dsa-roadmap"
                    onClick={onClose}
                    className="flex min-h-11 items-center justify-between px-3 py-2 text-text-secondary hover:text-text-primary transition-colors touch-manipulation"
                  >
                    <span>Curriculum Roadmap</span>
                    <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                  </Link>
                  <Link
                    href="/learnings/front-matter/complexity-quick-ref"
                    onClick={onClose}
                    className="flex min-h-11 items-center justify-between px-3 py-2 text-text-secondary hover:text-text-primary transition-colors touch-manipulation"
                  >
                    <span>Complexity Quick Reference</span>
                    <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                  </Link>
                  <Link
                    href="/feedback"
                    onClick={onClose}
                    className="flex min-h-11 items-center justify-between px-3 py-2 text-text-secondary hover:text-text-primary transition-colors touch-manipulation"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      <span>Send Feedback</span>
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={onClose}
                    className="flex min-h-11 items-center justify-between px-3 py-2 text-text-secondary hover:text-text-primary transition-colors touch-manipulation"
                  >
                    <span>Privacy Policy</span>
                    <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                  </Link>
                  <Link
                    href="/terms"
                    onClick={onClose}
                    className="flex min-h-11 items-center justify-between px-3 py-2 text-text-secondary hover:text-text-primary transition-colors touch-manipulation"
                  >
                    <span>Terms of Service</span>
                    <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                  </Link>
                </div>
              </div>

              {/* Version & Copyright */}
              <div className="pt-2 text-center text-[10px] font-mono text-text-muted">
                AlgoFlow v0.1 • Interactive CS Learning
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
