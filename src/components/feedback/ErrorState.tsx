"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Compass } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground"
    >
      <motion.section
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-lg border border-border bg-surface p-8 sm:p-10 text-center shadow-elevated"
        role="alert"
        aria-live="assertive"
      >
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-crimson/20 bg-crimson/10 text-crimson shadow-card">
          <AlertTriangle aria-hidden="true" className="h-8 w-8" />
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-text-primary">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{message}</p>
        {reference ? (
          <p className="mt-3 rounded-sm border border-border bg-surface-secondary/70 px-3 py-1.5 font-mono text-xs text-muted-foreground">
            Reference: {reference}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry ? (
            <Button onClick={onRetry} size="lg" className="cursor-pointer">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Try again
            </Button>
          ) : null}
          <Link
            href="/visualizers"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "no-underline")}
          >
            <Compass className="h-4 w-4" />
            Browse visualizers
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
