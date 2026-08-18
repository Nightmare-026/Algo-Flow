"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/(auth)/login/actions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { label: "Visualizers", href: "/visualizers" },
  { label: "Dashboard", href: "/dashboard" },
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-background/88 backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <Link
            href="/"
            className="group flex min-h-11 items-center gap-2.5 rounded-xl pr-2"
            aria-label="Algo Flow home"
          >
            <span className="relative h-9 w-9 rounded-xl bg-primary-muted shadow-[var(--shadow-raised-sm)]">
              <Image
                src="/logo.png"
                alt=""
                fill
                sizes="36px"
                className="object-contain p-1"
                priority
              />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
              Algo<span className="text-primary-active">Flow</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary-muted text-primary-active shadow-[var(--shadow-inset)]"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="max-w-40 truncate px-2 text-sm font-medium text-text-secondary">
                  {user.user_metadata?.first_name || user.email?.split("@")[0]}
                </span>
                <form action={signout}>
                  <button
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                    type="submit"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Log out
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

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-primary-muted hover:text-primary-active md:hidden"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div id="mobile-navigation" className="border-t border-border py-3 md:hidden">
            <div className="grid gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold",
                      active
                        ? "bg-primary-muted text-primary-active"
                        : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {user ? (
                <form action={signout}>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 w-full items-center gap-2 rounded-xl px-4 text-left text-sm font-semibold text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    type="submit"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Log out
                  </button>
                </form>
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
          </div>
        ) : null}
      </nav>
    </header>
  );
}
