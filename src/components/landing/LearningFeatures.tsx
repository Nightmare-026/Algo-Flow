"use client";

import { Bookmark, Code2, Gauge, ListChecks, Route, Variable } from "lucide-react";
import { motion } from "framer-motion";
import { cardReveal, glowStyle, sectionReveal } from "./landing-effects";

const features = [
  {
    title: "Playback controls",
    description: "Run, pause, step backward or forward, restart, skip to the end, and tune the playback speed.",
    Icon: Gauge,
  },
  {
    title: "State-aware canvas",
    description: "Highlights show the active item, comparisons, swaps, insertions, deletions, and found targets.",
    Icon: Route,
  },
  {
    title: "Step explanations",
    description: "Each step carries a short explanation, operation label, complexity note, and changing variables where available.",
    Icon: Variable,
  },
  {
    title: "Pseudocode and code",
    description: "Use side panels to compare the animation with pseudocode and implementation snippets.",
    Icon: Code2,
  },
  {
    title: "Execution log",
    description: "Jump to any recorded step from the log instead of scrubbing blindly through the timeline.",
    Icon: ListChecks,
  },
  {
    title: "Bookmarks and sessions",
    description: "Logged-in learners can save useful pages and continue from saved sessions in the dashboard.",
    Icon: Bookmark,
  },
];

export function LearningFeatures() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28" id="features">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={sectionReveal}
          className="mb-12 max-w-3xl text-left"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            Study tools
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
            Enough context to understand the step you are seeing.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
            The visualizer keeps controls, state, explanation, and code visible together instead of scattering them across pages.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map(({ title, description, Icon }, index) => (
            <motion.div
              key={title}
              custom={index}
              variants={cardReveal}
              style={glowStyle(index + 1)}
              className="landing-glow-card group rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]/60 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-glow-primary)] hover:border-[var(--primary)]"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-[var(--landing-card-tone)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--landing-card-tone)]">
                {title}
              </h3>
              <p className="text-sm leading-6 text-[var(--text-muted)]">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}