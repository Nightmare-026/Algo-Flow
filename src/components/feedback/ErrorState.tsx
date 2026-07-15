"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  reference?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We could not finish loading this page. Try again, or return to the visualizer catalog.",
  reference,
  onRetry,
}: ErrorStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground">
      <section
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-lg"
        role="alert"
        aria-live="assertive"
      >
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle aria-hidden="true" className="h-7 w-7" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
        {reference ? (
          <p className="mt-3 text-xs text-muted-foreground">Reference: {reference}</p>
        ) : null}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry ? (
            <Button onClick={onRetry}>
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Try again
            </Button>
          ) : null}
          <Link
            href="/visualizers"
            className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          >
            Browse visualizers
          </Link>
        </div>
      </section>
    </main>
  );
}
