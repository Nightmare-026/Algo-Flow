"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-[var(--border)] overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--bg-surface)] to-[var(--secondary)]/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)] opacity-[0.06] blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--secondary)] opacity-[0.06] blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10 p-10 sm:p-14 md:p-20">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-5xl block mb-6"
            >
              🎯
            </motion.span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-5 leading-tight">
              Ready to See Algorithms
              <br />
              <span className="text-gradient-primary">Come Alive?</span>
            </h2>

            <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
              Stop reading about algorithms. Start watching them work.
              200+ interactive visualizations are waiting for you — completely free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/visualizers"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-10 py-4 text-lg font-semibold text-[var(--text-inverse)] transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-glow-primary)] hover:-translate-y-1 active:scale-[0.96]"
              >
                Start Visualizing Now
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] px-10 py-4 text-lg font-semibold text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--border-active)] hover:bg-[var(--bg-surface-hover)] hover:-translate-y-1"
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
