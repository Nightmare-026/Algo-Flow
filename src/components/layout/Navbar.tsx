"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, X, LayoutDashboard, Compass, BrainCircuit } from "lucide-react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/(auth)/login/actions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { label: "Visualizers", href: "/visualizers", icon: Compass },
  { label: "Mental Math", href: "/mental-math", icon: BrainCircuit },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function Navbar({ initialUser }: { initialUser?: User | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  const isActive = (href: string) =>
    href === "/visualizers"
      ? pathname === href || pathname.startsWith("/visualizer")
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl transition-colors duration-200">
      <nav aria-label="Primary navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex min-h-11 items-center gap-3 rounded-xl pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Algo Flow home"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface shadow-[var(--shadow-raised-sm)] transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Algo Flow"
                width={26}
                height={26}
                className="object-contain"
                priority
              />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-xl font-extrabold tracking-tight text-text-primary">
                Algo<span className="text-primary">Flow</span>
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-text-muted -mt-1">
                Visualizer Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1.5 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors duration-200 z-10 select-none",
                    active
                      ? "font-bold text-white shadow-[var(--shadow-raised-sm)]"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/60"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-xl border border-primary/30 bg-primary shadow-[var(--shadow-raised-sm)] -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      active ? "text-white" : "text-text-muted"
                    )}
                    aria-hidden="true"
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Suite */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/dashboard"
                  className="neu-inset flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="max-w-32 truncate">
                    {user.user_metadata?.first_name || user.email?.split("@")[0]}
                  </span>
                </Link>
                <form action={signout}>
                  <button
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                    type="submit"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only">Log out</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  Log in
                </Link>
                <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary shadow-[var(--shadow-raised-sm)] hover:text-primary active:scale-95 md:hidden"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="overflow-hidden border-t border-border bg-surface/98 backdrop-blur-2xl shadow-2xl rounded-b-2xl md:hidden"
            >
              <div className="grid gap-2 py-4">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors",
                        active
                          ? "border border-primary/30 bg-primary font-bold text-white shadow-[var(--shadow-raised-sm)]"
                          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      )}
                    >
                      <Icon
                        className={cn("h-4 w-4", active ? "text-white" : "text-text-muted")}
                        aria-hidden="true"
                      />
                      {link.label}
                    </Link>
                  );
                })}

                {user ? (
                  <div className="mt-2 border-t border-border pt-3">
                    <div className="mb-3 px-4 text-xs text-text-muted">
                      Signed in as{" "}
                      <span className="font-semibold text-text-primary">{user.email}</span>
                    </div>
                    <form action={signout}>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex min-h-11 w-full items-center gap-2 rounded-xl px-4 text-left text-sm font-semibold text-text-secondary hover:bg-surface-hover hover:text-error cursor-pointer"
                        type="submit"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Sign out
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className={buttonVariants()}
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
