import Link from "next/link";
import { FileText, ShieldCheck, FileCode2, Cookie } from "lucide-react";

interface LegalNavProps {
  currentPath: "/terms" | "/privacy" | "/license" | "/cookies";
}

const legalPages = [
  {
    href: "/terms",
    label: "Terms of Service",
    icon: FileText,
  },
  {
    href: "/privacy",
    label: "Privacy Policy",
    icon: ShieldCheck,
  },
  {
    href: "/license",
    label: "License Agreement",
    icon: FileCode2,
  },
  {
    href: "/cookies",
    label: "Cookie Policy",
    icon: Cookie,
  },
] as const;

export function LegalNav({ currentPath }: LegalNavProps) {
  return (
    <nav
      aria-label="Legal Document Navigation"
      className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3"
    >
      {legalPages.map((page) => {
        const isActive = currentPath === page.href;
        const Icon = page.icon;

        return (
          <Link
            key={page.href}
            href={page.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-medium transition-all duration-150 ${
              isActive
                ? "border-primary/40 bg-primary-muted font-bold text-primary shadow-xs ring-1 ring-primary/20"
                : "border-border bg-surface text-text-secondary hover:border-border-hover hover:bg-surface-hover hover:text-text-primary"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-text-muted"}`} />
            <span>{page.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
