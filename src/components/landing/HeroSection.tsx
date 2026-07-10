"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/* Floating array block element */
function FloatingBlock({
  value,
  x,
  y,
  delay,
  size = 48,
}: {
  value: string;
  x: string;
  y: string;
  delay: number;
  size?: number;
}) {
  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]/60 backdrop-blur-sm text-[var(--primary)] font-mono text-sm font-bold"
      style={{ left: x, top: y, width: size, height: size }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.7, 0.5],
        scale: [0, 1.1, 1],
        y: [0, -12, 0, 12, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      {value}
    </motion.div>
  );
}

/* Floating graph node */
function FloatingNode({
  x,
  y,
  delay,
  color,
}: {
  x: string;
  y: string;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      className="absolute w-4 h-4 rounded-full"
      style={{ left: x, top: y, backgroundColor: color, boxShadow: `0 0 16px ${color}40` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0.6],
        scale: [0, 1.2, 0.8, 1],
        x: [0, 8, -4, 0],
        y: [0, -6, 4, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  );
}

/* Connection line between nodes */
function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--primary)"
      strokeWidth={1}
      strokeOpacity={0.15}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay, ease: "easeInOut" }}
    />
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-deep)] via-[var(--bg-deep)] to-[var(--bg-surface)]" />
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--primary)] opacity-[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--secondary)] opacity-[0.03] blur-[100px] rounded-full" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Array blocks */}
        <FloatingBlock value="42" x="8%" y="20%" delay={0} />
        <FloatingBlock value="17" x="85%" y="25%" delay={0.8} />
        <FloatingBlock value="93" x="12%" y="70%" delay={1.6} />
        <FloatingBlock value="58" x="78%" y="65%" delay={2.4} />
        <FloatingBlock value="31" x="92%" y="45%" delay={1.2} size={40} />
        <FloatingBlock value="76" x="3%" y="45%" delay={2} size={40} />

        {/* Graph nodes */}
        <FloatingNode x="20%" y="30%" delay={0.5} color="var(--primary)" />
        <FloatingNode x="75%" y="35%" delay={1.3} color="var(--secondary)" />
        <FloatingNode x="25%" y="60%" delay={2.1} color="var(--primary)" />
        <FloatingNode x="70%" y="70%" delay={0.9} color="var(--success)" />
        <FloatingNode x="50%" y="15%" delay={1.7} color="var(--primary)" />
        <FloatingNode x="60%" y="80%" delay={2.5} color="var(--secondary)" />

        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <ConnectionLine x1={200} y1={250} x2={400} y2={180} delay={1} />
          <ConnectionLine x1={700} y1={300} x2={600} y2={500} delay={1.5} />
          <ConnectionLine x1={300} y1={500} x2={500} y2={450} delay={2} />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            <Image
              src="/logo.png"
              alt="Algo Flow Logo"
              fill
              sizes="(max-width: 640px) 80px, 96px"
              className="object-contain drop-shadow-[0_0_24px_var(--primary-glow)]"
              priority
            />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/60 backdrop-blur-sm px-5 py-2 text-sm text-[var(--text-muted)]">
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              Start
            </motion.span>
            Learn DSA Visually
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Master Data Structures
          <br />
          Through{" "}
          <span className="text-gradient-primary">
            Beautiful Visual
            <br className="hidden sm:inline" /> Journeys
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Explore arrays, stacks, queues, trees, graphs, and more with
          step-by-step animated explanations. 98 interactive visualizers
          in 4 programming languages.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Link
            href="/visualizers"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-[var(--text-inverse)] transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-glow-primary)] hover:-translate-y-1 active:scale-[0.96]"
          >
            Start Visualizing
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/visualizers"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-8 py-3.5 text-base font-semibold text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--border-active)] hover:bg-[var(--bg-surface-hover)] hover:-translate-y-1"
          >
            Explore Algorithms
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {[
            { value: "98", label: "Visualizers" },
            { value: "10", label: "Data Structures" },
            { value: "4", label: "Code Languages" },
            { value: "Free", label: "For Everyone" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-bold text-[var(--primary)]">
                {stat.value}
              </span>
              <span className="text-sm text-[var(--text-muted)]">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-deep)] to-transparent pointer-events-none" />
    </section>
  );
}
