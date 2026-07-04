"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animation/spring-config";

const features = [
  {
    title: "Step-by-Step Playback",
    description: "Play, pause, step forward, step back — control every moment of the algorithm execution at your own speed.",
    icon: "⏯️",
  },
  {
    title: "Real-Time Variable Tracking",
    description: "Watch variables change in real time as the algorithm runs. See i, j, min, pivot, visited, and more update with each step.",
    icon: "📊",
  },
  {
    title: "Pseudocode Sync",
    description: "The current pseudocode line highlights in sync with the visualization, so you always know exactly which line is executing.",
    icon: "📝",
  },
  {
    title: "Code in 4 Languages",
    description: "View implementation in C++, Java, Python, and JavaScript/TypeScript — with syntax highlighting powered by Shiki.",
    icon: "💻",
  },
  {
    title: "Adjustable Speed",
    description: "From slow learning mode (1000ms) to fast review (150ms), or set your own custom speed with the slider.",
    icon: "⚡",
  },
  {
    title: "Custom Input Data",
    description: "Enter your own values, generate random arrays, sorted data, reverse sorted, or nearly sorted — test any scenario.",
    icon: "🎲",
  },
  {
    title: "Complexity Analysis",
    description: "See time and space complexity (best, average, worst case) displayed alongside the visualization.",
    icon: "📈",
  },
  {
    title: "Bookmarks & Sessions",
    description: "Save your progress, bookmark interesting algorithm states, and resume sessions right where you left off.",
    icon: "🔖",
  },
  {
    title: "Daily Streak & Progress",
    description: "Track your learning consistency with daily streaks, completion percentages, and a visual progress dashboard.",
    icon: "🔥",
  },
];

export function LearningFeatures() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8" id="features">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-4"
          >
            Powerful Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
          >
            Everything You Need to Learn DSA
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto"
          >
            A complete learning environment designed to make algorithms click in your mind.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[var(--border-active)] hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-3xl block mb-4">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
