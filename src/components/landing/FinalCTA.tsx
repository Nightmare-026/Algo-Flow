"use client";

import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { glowStyle } from "./landing-effects";

export function FinalCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl text-left">
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          style={glowStyle(7)}
          className="landing-glow-card max-w-4xl rounded-lg border bg-[var(--bg-surface)]/70 p-8 backdrop-blur-sm sm:p-12 md:p-16"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--landing-card-tone)]">
            Start with a working page
          </p>
          <h2 className="mb-5 text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
            Open the catalog and run your first trace.
          </h2>
          <p className="mb-9 max-w-xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
            Pick a core algorithm, set the input, and move through the execution one step at a time.
          </p>

          <div className="flex flex-col items-start justify-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/visualizers"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-7 py-3.5 text-sm font-semibold text-[var(--text-inverse)] transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
            >
              Browse visualizers
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-7 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--landing-card-tone)] hover:bg-white/[0.06] hover:-translate-y-0.5 sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              Save progress
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}