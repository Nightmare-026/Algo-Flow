"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

export function FinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="neu-float relative overflow-hidden rounded-3xl border border-border p-8 sm:p-12 md:p-16 text-center"
        >
          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold font-display leading-tight text-text-primary sm:text-4xl md:text-5xl">
              Ready to Master Algorithms <span className="text-gradient-primary">Visually?</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-text-secondary">
              Open the catalog, pick your topic, configure inputs, and step through state changes.
              No installation required.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/visualizers"
                className={buttonVariants({
                  size: "lg",
                  className: "w-full sm:w-auto shadow-[var(--shadow-raised)]",
                })}
              >
                <Compass className="h-4 w-4" />
                Browse Visualizer Library
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({
                  variant: "secondary",
                  size: "lg",
                  className: "w-full sm:w-auto",
                })}
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
