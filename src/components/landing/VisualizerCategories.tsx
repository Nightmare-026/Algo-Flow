"use client";

import Link from "next/link";
import type { ElementType } from "react";
import {
  AlignRight,
  ChevronRight,
  CircleDashed,
  Grid3X3,
  Hash,
  Layers,
  Link as LinkIcon,
  Network,
  Share2,
  SquareSquare,
  Type,
} from "lucide-react";
import { motion } from "framer-motion";
import { algorithms } from "@/data/seed/algorithms";
import { dataStructures } from "@/data/seed/data-structures";
import { operations } from "@/data/seed/operations";
import { cardReveal, glowStyle, sectionReveal } from "./landing-effects";

const iconMap: Record<string, ElementType> = {
  SquareSquare,
  Link: LinkIcon,
  Layers,
  AlignRight,
  Network,
  Share2,
  Hash,
  CircleDashed,
  Grid3X3,
  Type,
};

export function VisualizerCategories() {
  const publishedStructures = dataStructures
    .filter((structure) => structure.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28" id="categories">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="visible"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={sectionReveal}
          className="mb-12 max-w-3xl text-left"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            Visualizer catalog
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
            Choose the structure you want to understand.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
            The library is organized by data structure first, then by operation, so you can move
            from basics to harder cases without hunting.
          </p>
        </motion.div>

        <motion.div
          initial="visible"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {publishedStructures.map((structure, index) => {
            const Icon =
              structure.icon && iconMap[structure.icon] ? iconMap[structure.icon] : SquareSquare;
            const algorithmCount = algorithms.filter(
              (algorithm) => algorithm.dataStructureId === structure.id && algorithm.isPublished
            ).length;
            const operationNames = operations
              .filter(
                (operation) => operation.dataStructureId === structure.id && operation.isPublished
              )
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .slice(0, 3)
              .map((operation) => operation.name)
              .join(" / ");

            return (
              <motion.div key={structure.id} custom={index} variants={cardReveal}>
                <Link
                  href={`/visualizers/${structure.slug}`}
                  style={glowStyle(index)}
                  className="landing-glow-card group block h-full rounded-lg border bg-[var(--bg-surface)]/60 p-5 backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color,color] duration-500 hover:-translate-y-1"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/75 bg-surface-light text-[var(--landing-card-tone)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-md border border-white/75 bg-background px-2.5 py-1 text-xs font-medium capitalize text-[var(--text-muted)]">
                      {structure.difficulty}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--landing-card-tone)]">
                    {structure.name}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
                    {structure.description}
                  </p>
                  <div className="mb-5 min-h-10 text-xs leading-5 text-[var(--text-secondary)]">
                    {operationNames && (
                      <p className="mt-1 text-sm text-text-muted/70">{operationNames}</p>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/75 pt-4">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {algorithmCount} topics
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-light text-[var(--text-secondary)] transition-[background-color,color,transform] group-hover:bg-[var(--landing-card-tone)] group-hover:text-[var(--text-inverse)]">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
