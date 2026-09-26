"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, X, LayoutDashboard, Compass, BrainCircuit, BookOpen } from "lucide-react";
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
  { label: "Learnings", href: "/learnings", icon: BookOpen },
  { label: "Mental Math", href: "/mental-math", icon: BrainCircuit },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function Navbar({ initialUser }: { initialUser?: User | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const isActive = (href: string) =>
    href === "/visualizers"
      ? pathname === href || pathname.startsWith("/visualizer")
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-subtle bg-surface/92 backdrop-blur-xl transition-colors duration-150 px-4 sm:px-6 lg:px-8">
      <nav aria-label="Primary navigation" className="mx-auto max-w-7xl">
        <div className="flex h-18 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex min-h-11 items-center gap-3 rounded-[4px] pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="AlgoFlow home"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-[4px] border border-border-subtle bg-surface shadow-card transition-transform duration-150 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="AlgoFlow logo - Interactive Data Structures & Algorithms Visualizer"
                width={26}
                height={26}
                className="object-contain"
                priority
              />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">
              Algo<span className="text-primary">Flow</span>
            </span>
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
                    "relative inline-flex min-h-10 items-center gap-2 rounded-[4px] px-3.5 text-sm font-semibold transition-colors duration-150 z-10 select-none",
                    active
                      ? "font-bold text-white shadow-card"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/80"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-[4px] bg-primary shadow-card -z-10"
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
                  title={`Signed in as ${user.email} - View Dashboard`}
                  aria-label={`Go to dashboard for ${user.email}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] border border-border-subtle bg-surface font-display text-sm font-bold text-text-primary shadow-card transition-colors duration-150 hover:border-primary hover:text-primary active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  {(
                    user.user_metadata?.first_name ||
                    user.user_metadata?.full_name ||
                    user.email?.split("@")[0] ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </Link>
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] border border-border-subtle bg-surface text-text-secondary shadow-card hover:text-primary active:scale-95 md:hidden cursor-pointer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Backdrop & Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 top-18 bg-black/40 backdrop-blur-xs z-40 md:hidden"
                aria-hidden="true"
              />
              <motion.div
                id="mobile-navigation"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="relative z-50 overflow-hidden border-t border-border-subtle bg-surface shadow-elevated rounded-b-[8px] md:hidden"
              >
                <div className="grid gap-2 py-4 px-2">
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
                          "flex min-h-11 items-center gap-3 rounded-[4px] px-4 text-sm font-semibold transition-colors",
                          active
                            ? "border border-primary bg-primary font-bold text-white shadow-card"
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
                    <div className="mt-2 border-t border-border-subtle pt-3">
                      <div className="mb-3 px-4 text-xs text-text-muted">
                        Signed in as{" "}
                        <span className="font-semibold text-text-primary">{user.email}</span>
                      </div>
                      <form action={signout}>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex min-h-11 w-full items-center gap-2 rounded-[4px] px-4 text-left text-sm font-semibold text-text-secondary hover:bg-surface-hover hover:text-error cursor-pointer"
                          type="submit"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          Sign out
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border-subtle pt-3">
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
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
