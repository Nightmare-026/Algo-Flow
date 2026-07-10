"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animation/spring-config";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Visualizers", href: "/visualizers" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "DSA Topics",
    links: [
      { label: "Array", href: "/visualizers/array" },
      { label: "Linked List", href: "/visualizers/linked-list" },
      { label: "Stack & Queue", href: "/visualizers/stack" },
      { label: "Tree", href: "/visualizers/tree" },
      { label: "Graph", href: "/visualizers/graph" },
      { label: "Hash Table", href: "/visualizers/hash-table" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Code Examples", href: "/#code-languages" },
      { label: "Learning Paths", href: "/#features" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg-surface)]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] to-transparent pointer-events-none opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 lg:py-16"
        >
          {/* Brand Column */}
          <motion.div variants={staggerItem} className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                <Image src="/logo.png" alt="Algo Flow" fill sizes="32px" className="object-contain" />
              </div>
              <span className="text-base font-bold text-[var(--text-primary)]">
                Algo<span className="text-[var(--primary)]">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              Master Data Structures & Algorithms through beautiful, interactive visual journeys.
            </p>
          </motion.div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <motion.div key={section.title} variants={staggerItem}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200 animated-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            (c) {new Date().getFullYear()} Algo Flow. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Built for learners, by learners.
          </p>
        </div>
      </div>
    </footer>
  );
}


