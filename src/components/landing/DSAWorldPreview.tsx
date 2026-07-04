"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Individual Scene Component ── */
function DSAScene({
  title,
  description,
  metaphor,
  color,
  icon,
  index,
}: {
  title: string;
  description: string;
  metaphor: string;
  color: string;
  icon: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);

  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative min-h-[50vh] flex items-center py-16">
      <motion.div
        style={{ y, opacity, scale }}
        className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full`}
      >
        {/* Visual Metaphor */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)]/40 backdrop-blur-sm flex items-center justify-center overflow-hidden"
            whileInView={{ rotateY: [5, 0], rotateX: [-3, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow background */}
            <div
              className="absolute inset-0 opacity-20 blur-3xl"
              style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
            />

            {/* Scene icon/art */}
            <div className="relative z-10 text-center">
              <span className="text-7xl sm:text-8xl block mb-3">{icon}</span>
              <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
                {metaphor}
              </p>
            </div>

            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                boxShadow: `inset 0 0 30px ${color}15, 0 0 20px ${color}10`,
              }}
              animate={{
                boxShadow: [
                  `inset 0 0 30px ${color}15, 0 0 20px ${color}10`,
                  `inset 0 0 50px ${color}25, 0 0 40px ${color}20`,
                  `inset 0 0 30px ${color}15, 0 0 20px ${color}10`,
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <motion.span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color }}
          >
            Data Structure #{index + 1}
          </motion.span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
            {title}
          </h3>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Data for each DS scene ── */
const scenes = [
  {
    title: "Arrays — The Flowing River",
    description:
      "Watch elements flow through indexed positions like a river of data. See sorting algorithms dance, searching algorithms hunt, and insertion operations ripple through the stream.",
    metaphor: "Flowing Data Stream",
    color: "#22D3EE",
    icon: "🌊",
  },
  {
    title: "Stacks — Stacked Stones",
    description:
      "Push elements onto towering stone pillars and pop them off the top. Experience LIFO operations with satisfying vertical animations — each stone finds its place.",
    metaphor: "Stone Pillars Rising",
    color: "#A78BFA",
    icon: "🪨",
  },
  {
    title: "Queues — The Winding Path",
    description:
      "Follow elements as they enter from one end and leave from the other. Circular queues wrap around, priority queues reorder — every path tells a story.",
    metaphor: "Ordered Procession",
    color: "#F59E0B",
    icon: "🛤️",
  },
  {
    title: "Linked Lists — Chain of Connections",
    description:
      "Watch nodes link together with animated pointers. Insert at head, tail, or middle — see the chain reconnect in real time as pointers swing from one node to the next.",
    metaphor: "Connected Chain Links",
    color: "#34D399",
    icon: "🔗",
  },
  {
    title: "Trees — The Growing Forest",
    description:
      "Watch binary trees grow from seeds, AVL trees self-balance with rotations, and traversals illuminate branches one by one. Each node blooms with purpose.",
    metaphor: "Living Forest Growth",
    color: "#10B981",
    icon: "🌳",
  },
  {
    title: "Graphs — Constellations of Nodes",
    description:
      "Navigate interconnected nodes like stars in a constellation. BFS ripples outward, DFS dives deep, and shortest paths light up like cosmic highways.",
    metaphor: "Star Network Mapping",
    color: "#67E8F9",
    icon: "✨",
  },
  {
    title: "Hash Tables — The Collision Engine",
    description:
      "Watch keys hash to buckets, collisions ripple and resolve through chaining or probing. Rehashing transforms the entire table before your eyes.",
    metaphor: "Collision & Resolution",
    color: "#FB7185",
    icon: "💥",
  },
];

export function DSAWorldPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax for the background decorative line
  const lineY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative py-20 md:py-32" id="dsa-world">
      {/* Section Header */}
      <div className="text-center mb-16 px-4">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-4"
        >
          Interactive DSA World
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
        >
          Every Data Structure Tells a Story
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto"
        >
          Scroll through visual metaphors that bring algorithms to life.
          Each structure has its own world — discover them all.
        </motion.p>
      </div>

      {/* Vertical progress line */}
      <div className="absolute left-1/2 top-[200px] bottom-20 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent hidden md:block">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[var(--primary)] to-transparent"
          style={{ height: lineY }}
        />
      </div>

      {/* Scenes */}
      <div className="space-y-4">
        {scenes.map((scene, i) => (
          <DSAScene key={scene.title} {...scene} index={i} />
        ))}
      </div>
    </section>
  );
}
