import Link from "next/link";
import Image from "next/image";
import { catalogStats } from "@/lib/catalog";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Visualizer Library", href: "/visualizers" },
      { label: "Mental Math Trainer", href: "/mental-math" },
      { label: "User Dashboard", href: "/dashboard" },
      { label: "Interactive Quizzes", href: "/quizzes/bubble-sort" },
    ],
  },
  {
    title: "Structures",
    links: [
      { label: "Array Algorithms", href: "/visualizers/array" },
      { label: "Linked Lists", href: "/visualizers/linked-list" },
      { label: "Stacks & Queues", href: "/visualizers/stack" },
      { label: "Trees & Traversals", href: "/visualizers/tree" },
      { label: "Graph Algorithms", href: "/visualizers/graph" },
      { label: "Hash Tables & Sets", href: "/visualizers/hash-table" },
    ],
  },
  {
    title: "Learning",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Multi-Language Code", href: "/#code-languages" },
      { label: "Study Features", href: "/#features" },
    ],
  },
  {
    title: "Transparency",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "License Agreement", href: "/license" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border bg-surface/50 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-8 sm:gap-10 grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <Link href="/" className="inline-flex min-h-11 items-center gap-3 rounded-xl pr-2">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface shadow-[var(--shadow-raised-sm)]">
                <Image
                  src="/logo.png"
                  alt="Algo Flow"
                  width={26}
                  height={26}
                  className="object-contain"
                />
              </span>
              <span className="font-display text-xl font-extrabold text-text-primary">
                Algo<span className="text-primary">Flow</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
              An advanced algorithm visualization workstation and CS learning platform. Trace logic,
              inspect state, and master code in 4 languages.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
              <span>
                {catalogStats.visualizerCount} Published Algorithms • {catalogStats.structureCount}{" "}
                Data Structures
              </span>
            </div>
          </div>

          {/* Directory Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex text-sm text-text-secondary hover:text-primary transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex items-center justify-center border-t border-border pt-8 text-xs text-text-muted text-center">
          <p>© {new Date().getFullYear()} Algo Flow by Nightmare. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
