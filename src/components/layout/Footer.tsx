import Link from "next/link";
import Image from "next/image";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Visualizers", href: "/visualizers" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "DSA topics",
    links: [
      { label: "Array", href: "/visualizers/array" },
      { label: "Linked list", href: "/visualizers/linked-list" },
      { label: "Stack", href: "/visualizers/stack" },
      { label: "Tree", href: "/visualizers/tree" },
      { label: "Graph", href: "/visualizers/graph" },
      { label: "Hash table", href: "/visualizers/hash-table" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Code examples", href: "/#code-languages" },
      { label: "Study tools", href: "/#features" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms & conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/80 bg-surface/72">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-xl pr-2">
              <span className="relative h-9 w-9 rounded-xl bg-primary-muted shadow-[var(--shadow-raised-sm)]">
                <Image src="/logo.png" alt="" fill sizes="36px" className="object-contain p-1" />
              </span>
              <span className="font-display text-lg font-extrabold text-foreground">
                Algo<span className="text-primary-active">Flow</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Trace data, code, and decisions together—one algorithm step at a time.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-bold text-foreground">{section.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="animated-underline inline-flex min-h-8 items-center text-sm text-muted-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Algo Flow. All rights reserved.</p>
          <p>Built for careful, visual learning.</p>
        </div>
      </div>
    </footer>
  );
}
