"use client";

import { useRef } from "react";
import { Code2, PanelsTopLeft, PlayCircle, SlidersHorizontal } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const previewLayers = [
  {
    title: "1. Configure the Inputs",
    description:
      "Generate random, sorted, or inverted collections, or enter custom arrays, graphs, and matrices.",
    detail: "Array: [15, 23, 4, 8, 42]",
    Icon: SlidersHorizontal,
  },
  {
    title: "2. Control the Timeline",
    description:
      "Play, pause, inspect one step at a time, adjust speed scaling (0.25x - 2.0x), or scrub freely.",
    detail: "Step 07 / 18",
    Icon: PlayCircle,
  },
  {
    title: "3. Observe State Mutation",
    description:
      "Active indices, swaps, comparisons, pointer traversals, and found targets illuminate on canvas.",
    detail: "comparing [2] and [3]",
    Icon: PanelsTopLeft,
  },
  {
    title: "4. Read Synchronized Code",
    description:
      "Pseudocode and production language source code highlight the exact line causing the state change.",
    detail: "line 3 active",
    Icon: Code2,
  },
];

export function DSAWorldPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const ribbonY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const ribbonOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.1, 0.4, 0.4, 0.1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      id="dsa-world"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-72 max-w-5xl rounded-full bg-primary/10 blur-3xl"
        style={{ y: reduceMotion ? 0 : ribbonY, opacity: ribbonOpacity }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="section-kicker">Unified Architecture</p>
          <h2 className="mt-2.5 text-2xl font-extrabold font-display tracking-tight text-text-primary sm:text-3xl md:text-4xl">
            One Integrated Workstation. Complete Clarity.
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-text-secondary">
            Keep visual representations, playback controls, variable inspection, and code execution
            visible simultaneously.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {previewLayers.map(({ title, description, detail, Icon }, index) => (
            <motion.div
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="neu-raised group flex flex-col justify-between rounded-2xl border border-border p-5 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-inset text-primary shadow-(--shadow-inset) group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-lg border border-border bg-bg-surface-inset px-2.5 py-0.5 font-mono text-[10px] font-bold text-text-muted shadow-(--shadow-inset)">
                    {detail}
                  </span>
                </div>
                <h3 className="mb-1.5 text-base font-bold font-display text-text-primary group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-[13px] leading-relaxed text-text-secondary">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
