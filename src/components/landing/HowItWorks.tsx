"use client";

import { BookOpenCheck, MousePointer2, Play, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cardReveal, glowStyle, sectionReveal } from "./landing-effects";

const steps = [
  {
    title: "Pick a topic",
    description: "Open a data structure, filter by operation, then choose a concrete algorithm page.",
    Icon: MousePointer2,
  },
  {
    title: "Set the input",
    description: "Use generated data or enter your own values so the run matches the case you want to study.",
    Icon: SlidersHorizontal,
  },
  {
    title: "Trace the run",
    description: "Step through the animation while highlights show comparisons, updates, swaps, and targets.",
    Icon: Play,
  },
  {
    title: "Review the logic",
    description: "Use the explanation, variables, step log, pseudocode, and code panel to connect the visual state to the algorithm.",
    Icon: BookOpenCheck,
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={sectionReveal}
          className="mb-12 max-w-3xl text-left"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            One loop: choose, run, inspect, repeat.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            The landing page should point learners to the real workflow quickly, then let the visualizer do the teaching.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map(({ title, description, Icon }, index) => (
            <motion.div
              key={title}
              custom={index}
              variants={cardReveal}
              style={glowStyle(index + 4)}
              className="landing-glow-card rounded-xl border border-border bg-surface/60 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-glow-primary)] hover:border-primary"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-[var(--landing-card-tone)]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}