"use client";

import { Bookmark, Code2, Gauge, ListChecks, Network, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const features = [
  {
    title: "Granular Playback Controls",
    description:
      "Full VCR-style transport: play, pause, step forward/backward, jump to start/end, and scrub with 0.25x - 4x speed scaling.",
    Icon: Gauge,
  },
  {
    title: "12 Data Structure Renderers",
    description:
      "Bespoke visual canvases for Arrays, Linked Lists, Trees, Graphs, Hash Tables, Stacks, Queues, Matrices, and Strings.",
    Icon: Network,
  },
  {
    title: "Synchronized Code & Pseudocode",
    description:
      "Dual code inspection tabs with syntax highlighting in Python, C++, Java, JS, and TS, featuring active line glow and auto-scrolling.",
    Icon: Code2,
  },
  {
    title: "Interactive Practice Mode",
    description:
      "Predict next steps during live simulation to test algorithmic intuition and reinforce pattern recognition in real time.",
    Icon: Trophy,
  },
  {
    title: "Chronological Step Log",
    description:
      "Every calculation, pointer shift, and swap is recorded with human-readable explanations and complexity telemetry.",
    Icon: ListChecks,
  },
  {
    title: "Personal Learning Dashboard",
    description:
      "Track daily challenges, study streaks, algorithmic mastery percentages, bookmarked visualizers, and saved state sessions.",
    Icon: Bookmark,
  },
];

export function LearningFeatures() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28 bg-surface/30 border-y border-border" id="features">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="section-kicker">Engineered For Mastery</p>
          <h2 className="mt-3 text-3xl font-extrabold font-display tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            Everything You Need to Understand What Happens Inside Code.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-text-secondary">
            Built from first principles to provide complete transparency into computational states, memory representations, and algorithmic invariants.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, Icon }, index) => (
            <motion.div
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="neu-raised group rounded-2xl border border-border p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-inset text-primary shadow-[var(--shadow-inset)] group-hover:scale-105 transition-transform">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold font-display text-text-primary group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
