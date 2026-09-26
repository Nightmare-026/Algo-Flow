"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Braces, Play } from "lucide-react";

const nodes = [
  { value: 3, x: 14, y: 62 },
  { value: 8, x: 31, y: 36 },
  { value: 12, x: 50, y: 18 },
  { value: 19, x: 69, y: 36 },
  { value: 27, x: 86, y: 62 },
];

export function AuthVisual() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-surface p-5 shadow-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,86,210,0.12),transparent_38%),radial-gradient(circle_at_50%_86%,rgba(15,138,95,0.08),transparent_42%)]" />
        <svg className="absolute inset-x-[8%] top-[12%] h-[55%] w-[84%]" viewBox="0 0 100 78">
          <path
            d="M14 62 L31 36 L50 18 L69 36 L86 62 M31 36 L69 36"
            fill="none"
            stroke="rgba(0,86,210,0.3)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="3 3"
          />
        </svg>

        {nodes.map((node, index) => (
          <motion.span
            key={node.value}
            className="absolute grid h-11 w-11 place-items-center rounded-full border border-border bg-surface font-mono text-xs font-bold text-primary shadow-xs"
            style={{ left: `${node.x}%`, top: `${node.y}%`, translate: "-50% -50%" }}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.65, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.48,
              delay: reducedMotion ? 0 : index * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {node.value}
          </motion.span>
        ))}

        <motion.div
          className="absolute bottom-5 left-1/2 w-[72%] -translate-x-1/2 rounded-md border border-border bg-surface shadow-elevated p-3.5"
          initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.55, delay: reducedMotion ? 0 : 0.38 }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white shadow-xs">
              <Play className="h-4 w-4 fill-current" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3 font-mono text-[10px] font-semibold text-primary-active">
                <span>Binary search</span>
                <span>04 / 07</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-muted shadow-inset">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={reducedMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: 0.58 }}
                  style={{ transformOrigin: "left" }}
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.65,
                    delay: reducedMotion ? 0 : 0.5,
                  }}
                />
              </div>
            </div>
            <Braces className="h-5 w-5 text-secondary" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
