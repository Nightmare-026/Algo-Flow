import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Braces, CheckCircle2 } from "lucide-react";
import { AuthVisual } from "@/components/auth/AuthVisual";
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
    <main className="page-shell relative flex min-h-screen items-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute left-[4%] top-[7%] h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[3%] right-[4%] h-80 w-80 rounded-full bg-secondary/7 blur-3xl" />

      <div className="neu-float mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border-white/90 lg:grid-cols-2">
        <section className="bg-white/78 p-6 sm:p-10 lg:p-12 xl:p-14">
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl pr-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary-active">
                  dataset
                </span>
                <span className="font-display text-lg font-extrabold tracking-tight text-text-primary">
                  AlgoFlow
                </span>
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold text-primary-active hover:underline"
                >
                  Dashboard
                </Link>
              ) : null}
            </div>

            {activeTab ? (
              <nav
                aria-label="Authentication"
                className="neu-inset mt-7 grid grid-cols-2 rounded-xl p-1"
              >
                <Link
                  href="/login"
                  aria-current={activeTab === "login" ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center justify-center rounded-lg text-sm font-semibold transition-[background-color,color,box-shadow]",
                    activeTab === "login"
                      ? "bg-white text-primary-active shadow-[var(--shadow-raised-sm)]"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  aria-current={activeTab === "signup" ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center justify-center rounded-lg text-sm font-semibold transition-[background-color,color,box-shadow]",
                    activeTab === "signup"
                      ? "bg-white text-primary-active shadow-[var(--shadow-raised-sm)]"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  Sign up
                </Link>
              </nav>
            ) : null}

            <p className="section-kicker mt-8">{eyebrow}</p>
            <h1 className="mt-2 text-pretty text-3xl font-extrabold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-pretty text-sm leading-6 text-text-secondary">{description}</p>
            <div className="mt-7">{children}</div>
          </div>
        </section>

        <aside className="relative flex flex-col justify-center overflow-hidden border-t border-white/85 bg-primary-muted/38 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.92),transparent_38%),radial-gradient(circle_at_85%_85%,rgba(34,197,94,0.10),transparent_35%)]" />
          <div className="relative">
            <AuthVisual />
            <div className="mx-auto mt-7 max-w-md text-center">
              <h2 className="text-2xl font-extrabold">Master your algorithms</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-text-secondary">
                Your progress, saved sessions, and interactive traces stay organized in one focused
                workspace.
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-text-secondary">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary-active" />
                  Saved progress
                </li>
                <li className="flex items-center gap-1.5">
                  <Braces className="h-4 w-4 text-secondary" />4 languages
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
