"use client";

import { BookOpenCheck, MousePointer2, Play, SlidersHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Pick an Algorithm",
    description:
      "Explore 12 core data structure categories or filter by operation (Sorting, Search, Trees, Graphs, DP).",
    Icon: MousePointer2,
  },
  {
    step: "02",
    title: "Generate or Customize Input",
    description:
      "Use built-in test generators or input custom arrays, graphs, and matrices to simulate specific edge cases.",
    Icon: SlidersHorizontal,
  },
  {
    step: "03",
    title: "Step & Trace Live State",
    description:
      "Watch pointers shift, comparisons highlight, values swap, and nodes traverse with fine-grained playback speed.",
    Icon: Play,
  },
  {
    step: "04",
    title: "Master Multi-Language Code",
    description:
      "Synchronize visual state transitions with line-by-line code in Python, C++, Java, JavaScript, and TypeScript.",
    Icon: BookOpenCheck,
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="section-kicker">Interactive Workflow</p>
          <h2 className="mt-3 text-3xl font-extrabold font-display tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            From Visual Intuition to Code Execution.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-text-secondary">
            Algo Flow eliminates abstract memorization by uniting visual state, step explanations, and production code in one tactile workspace.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, title, description, Icon }, index) => (
            <motion.div
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="neu-raised group relative flex flex-col justify-between rounded-2xl p-6 border border-border hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-inset text-primary shadow-[var(--shadow-inset)] group-hover:scale-105 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs font-bold text-text-muted px-2.5 py-1 rounded-md bg-surface-hover border border-border">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {description}
                </p>
              </div>
              <div className="mt-6 h-1 w-full rounded-full bg-surface-inset overflow-hidden">
                <div className="h-full bg-primary/40 group-hover:bg-primary transition-colors duration-300 w-1/3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
