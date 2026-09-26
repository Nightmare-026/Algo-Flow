import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { Braces, CheckCircle2 } from "lucide-react";
import { AuthVisual } from "@/components/auth/AuthVisual";
import { catalogStats } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  user?: User | null;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  activeTab?: "login" | "signup";
};

export function AuthShell({
  user,
  eyebrow,
  title,
  description,
  children,
  activeTab,
}: AuthShellProps) {
  return (
    <main
      id="main-content"
      className="page-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute left-[5%] top-[8%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[5%] right-[5%] h-80 w-80 rounded-full bg-secondary/8 blur-3xl" />

      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[8px] border border-border bg-surface shadow-elevated lg:grid-cols-2">
        {/* Left Form Section */}
        <section className="bg-surface p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            {/* Header Brand */}
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/"
                className="group flex min-h-10 items-center gap-2.5 rounded-[4px] pr-2"
                aria-label="AlgoFlow home"
              >
                <span className="relative flex h-9 w-9 items-center justify-center rounded-[4px] border border-border bg-surface shadow-xs">
                  <Image
                    src="/logo.png"
                    alt="AlgoFlow logo - Interactive Data Structures & Algorithms Visualizer"
                    width={22}
                    height={22}
                    className="object-contain"
                    priority
                  />
                </span>
                <span className="font-display text-lg font-extrabold tracking-tight text-text-primary">
                  Algo<span className="text-primary">Flow</span>
                </span>
              </Link>
              {user ? (
                <Link href="/dashboard" className="text-xs font-bold text-primary hover:underline">
                  Dashboard →
                </Link>
              ) : null}
            </div>

            {/* Auth Tab Switcher */}
            {activeTab ? (
              <nav
                aria-label="Authentication switcher"
                className="mt-8 grid grid-cols-2 rounded-[6px] p-1 border border-border bg-surface-secondary/70"
              >
                <Link
                  href="/login"
                  aria-current={activeTab === "login" ? "page" : undefined}
                  className={cn(
                    "flex min-h-9 items-center justify-center rounded-[4px] text-xs font-bold transition-all",
                    activeTab === "login"
                      ? "bg-surface text-primary border border-border shadow-xs"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  aria-current={activeTab === "signup" ? "page" : undefined}
                  className={cn(
                    "flex min-h-9 items-center justify-center rounded-[4px] text-xs font-bold transition-all",
                    activeTab === "signup"
                      ? "bg-surface text-primary border border-border shadow-xs"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  Sign up
                </Link>
              </nav>
            ) : null}

            <p className="section-kicker mt-8">{eyebrow}</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-text-primary">
              {title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
            <div className="mt-6">{children}</div>
          </div>
        </section>

        {/* Right Feature Panel */}
        <aside className="relative hidden lg:flex flex-col justify-center overflow-hidden border-l border-border bg-surface-hover/50 p-10 xl:p-12">
          <div className="relative">
            <AuthVisual />
            <div className="mx-auto mt-8 max-w-sm text-center">
              <h2 className="text-xl font-bold font-display text-text-primary">
                Master Algorithms Visually
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-secondary">
                Your study streak, quizzes, bookmarked visualizers, and saved state traces stay
                preserved across sessions.
              </p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold text-text-secondary">
                <li className="flex items-center gap-1.5 text-primary">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {catalogStats.visualizerCount} Interactive Visualizers
                </li>
                <li className="flex items-center gap-1.5 text-secondary">
                  <Braces className="h-4 w-4 text-secondary" />
                  {catalogStats.languageCount} Production Languages
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
