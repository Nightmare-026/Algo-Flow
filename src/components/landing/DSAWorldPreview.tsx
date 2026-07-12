"use client";

import { useRef } from "react";
import { Code2, PanelsTopLeft, PlayCircle, SlidersHorizontal } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cardReveal, glowStyle, sectionReveal } from "./landing-effects";

const previewLayers = [
  {
    title: "Build the input",
    description: "Use random, sorted, reverse, or custom values before the animation starts.",
    detail: "Array: 15, 23, 4, 8, 42",
    Icon: SlidersHorizontal,
  },
  {
    title: "Control every step",
    description: "Play, pause, move one step at a time, change speed, or jump to the end.",
    detail: "Step 07 / 18",
    Icon: PlayCircle,
  },
  {
    title: "Watch the state change",
    description: "The active index, comparisons, swaps, found values, and errors are highlighted on the canvas.",
    detail: "compare i=2, j=3",
    Icon: PanelsTopLeft,
  },
  {
    title: "Read the logic beside it",
    description: "Pseudocode, code, explanations, variables, and step logs stay close to the animation.",
    detail: "line 4 highlighted",
    Icon: Code2,
  },
];

export function DSAWorldPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const ribbonY = useTransform(scrollYProgress, [0, 1], ["-12%", "14%"]);
  const ribbonOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.15, 0.55, 0.55, 0.15]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28" id="dsa-world">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-72 max-w-5xl rounded-full bg-primary/10 blur-3xl"
        style={{ y: ribbonY, opacity: ribbonOpacity }}
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={sectionReveal}
          className="mb-12 max-w-3xl text-left"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Visual Learning
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            The page is built around the execution, not decoration.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Every useful panel stays near the animation so learners can connect data, code, and explanation in the same moment.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {previewLayers.map(({ title, description, detail, Icon }, index) => (
            <motion.div
              key={title}
              custom={index}
              variants={cardReveal}
              style={glowStyle(index)}
              className="landing-glow-card rounded-lg border border-white/10 bg-surface/60 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-[var(--landing-card-tone)]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-md border border-white/10 bg-black/15 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                  {detail}
                </span>
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