"use client";

import Link from "next/link";
import { ArrowRight, Clock, HardDrive, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { algorithms } from "@/data/seed/algorithms";
import { cardReveal, glowStyle, sectionReveal } from "./landing-effects";

const featuredSlugs = ["bubble-sort", "binary-search", "stack-push", "queue-enqueue", "sll-traversal", "matrix-search"];

export function FeaturedVisualizers() {
  const featured = featuredSlugs
    .map((slug) => algorithms.find((algorithm) => algorithm.slug === slug))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <section id="featured-visualizers" className="bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={sectionReveal}
          className="mb-10 max-w-3xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Ready to run</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Start with visualizers that are already interactive.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            These pages open directly into a working step engine with controls, explanations, and code panels.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((algorithm, index) => (
            <motion.div key={algorithm!.id} custom={index} variants={cardReveal}>
              <Link
                href={`/visualizer/${algorithm!.slug}`}
                style={glowStyle(index + 2)}
                className="landing-glow-card group flex h-full flex-col rounded-lg border bg-surface/70 p-5 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--landing-card-tone)]">
                    <PlayCircle className="h-3.5 w-3.5" />
                    {algorithm!.priority}
                  </span>
                  <span className="text-xs font-medium capitalize text-muted-foreground">{algorithm!.difficulty}</span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-[var(--landing-card-tone)]">
                  {algorithm!.name}
                </h3>
                <p className="mb-5 flex-1 text-sm leading-6 text-secondary-foreground">{algorithm!.shortDescription}</p>

                <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/15 p-3 text-xs text-secondary-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-secondary" />{algorithm!.timeComplexityAverage}</span>
                  <span className="flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5 text-primary" />{algorithm!.spaceComplexity}</span>
                </div>

                <span className="inline-flex items-center text-sm font-semibold text-[var(--landing-card-tone)]">
                  Open visualizer <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}