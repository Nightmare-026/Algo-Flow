"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animation/spring-config";

const steps = [
  {
    number: "01",
    title: "Pick a Data Structure",
    description: "Browse 10 categories — from arrays and stacks to graphs and tries. Each structure has its own dedicated visualizer.",
    icon: "🎯",
    color: "#22D3EE",
  },
  {
    number: "02",
    title: "Choose an Algorithm",
    description: "Select from 200+ operations — sorting, searching, traversal, insertion, deletion, balancing, shortest path, and more.",
    icon: "🔍",
    color: "#A78BFA",
  },
  {
    number: "03",
    title: "Set Your Input",
    description: "Enter custom values, generate random data, or use preset configurations. Control array size, node count, and graph edges.",
    icon: "⚙️",
    color: "#F59E0B",
  },
  {
    number: "04",
    title: "Watch It Come Alive",
    description: "Hit play and watch the algorithm execute step-by-step with smooth animations, highlighted elements, and real-time variable tracking.",
    icon: "▶️",
    color: "#34D399",
  },
  {
    number: "05",
    title: "Learn at Your Pace",
    description: "Pause, step forward/backward, adjust speed, read line-by-line explanations, and study code in C++, Java, Python, or JavaScript.",
    icon: "📖",
    color: "#10B981",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-4"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
          >
            5 Steps to Mastery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto"
          >
            A structured learning path that takes you from concept to complete understanding.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="space-y-6"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              className="group flex items-start gap-5 sm:gap-8 p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]/40 backdrop-blur-sm hover:border-[var(--border-active)] hover:bg-[var(--bg-surface)]/70 transition-all duration-300"
            >
              {/* Number */}
              <div
                className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold"
                style={{
                  background: `${step.color}15`,
                  color: step.color,
                  border: `1px solid ${step.color}30`,
                }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: step.color }}
                  >
                    Step {step.number}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting line (not on last) */}
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute left-[2.75rem] sm:left-[3.25rem] w-px h-6 bg-[var(--border)]" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
