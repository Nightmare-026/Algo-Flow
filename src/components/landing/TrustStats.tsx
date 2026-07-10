"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { algorithms } from "@/data/seed/algorithms";
import { dataStructures } from "@/data/seed/data-structures";
import { operations } from "@/data/seed/operations";
import { glowStyle, sectionReveal } from "./landing-effects";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(count, target, { duration: 1.8, ease: "easeOut" });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [count, target]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) ref.current.textContent = `${latest}${suffix}`;
    });

    return unsubscribe;
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const stats = [
  {
    value: algorithms.filter((algorithm) => algorithm.isPublished).length,
    label: "catalog topics",
  },
  {
    value: dataStructures.filter((structure) => structure.isPublished).length,
    label: "data structures",
  },
  {
    value: operations.filter((operation) => operation.isPublished).length,
    label: "operation groups",
  },
  {
    value: 4,
    label: "language tabs",
  },
];

export function TrustStats() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 md:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={sectionReveal}
          style={glowStyle(6)}
          className="landing-glow-card rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]/60 p-8 text-center backdrop-blur-sm sm:p-12 transition-all duration-500 hover:shadow-[var(--shadow-glow-primary)] hover:border-[var(--primary)]"
        >
          <h2 className="mb-3 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            A catalog with real learning surfaces behind it.
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-sm leading-6 text-[var(--text-muted)] sm:text-base">
            The numbers below come from the local seed catalog, so the section stays aligned with the app instead of marketing guesses.
          </p>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-black/15 p-4 transition-all duration-500 hover:shadow-[var(--shadow-glow-primary)] hover:border-[var(--primary)]">
                <div className="mb-2 text-4xl font-bold sm:text-5xl" style={{ color: `var(--landing-card-tone)` }}>
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  {stat.label}
                </div>
                <span className="mt-3 block h-1 rounded-full" style={{ backgroundColor: `var(--landing-card-tone)`, opacity: 0.5 - index * 0.06 }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}