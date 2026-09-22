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
        className="neu-float w-full max-w-lg rounded-3xl border border-border bg-surface p-8 sm:p-10 text-center shadow-(--shadow-float)"
        role="alert"
        aria-live="assertive"
      >
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-error/20 bg-error-muted text-error shadow-(--shadow-raised-sm)">
          <AlertTriangle aria-hidden="true" className="h-8 w-8" />
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-text-primary">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{message}</p>
        {reference ? (
          <p className="mt-3 rounded-lg border border-border bg-surface-inset px-3 py-1.5 font-mono text-xs text-text-muted">
            Reference: {reference}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry ? (
            <Button
              onClick={onRetry}
              size="lg"
              className="shadow-(--shadow-raised-sm) cursor-pointer"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Try again
            </Button>
          ) : null}
          <Link
            href="/visualizers"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "no-underline shadow-(--shadow-raised-sm)"
            )}
          >
            <Compass className="h-4 w-4" />
            Browse visualizers
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
