"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TableOfContentsItem } from "@/lib/learnings/types";
import { cn } from "@/lib/utils";
import { ListTree, ChevronRight, ArrowUp, Compass, ArrowRight } from "lucide-react";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  className?: string;
  onSelect?: () => void;
}

export function TableOfContents({ items, className, onSelect }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0% -65% 0%",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToTop = () => {
    const reader = document.getElementById("chapter-reader-container");
    if (reader) {
      reader.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-surface/90 shadow-[var(--shadow-raised)] p-3.5 h-full overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <ListTree className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">On this page</span>
        </div>
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
          title="Scroll to top"
        >
          <ArrowUp className="w-3 h-3" />
          <span>Top</span>
        </button>
      </div>

      {/* Scrollable Items List */}
      <ul className="flex flex-col gap-1 text-xs flex-1 overflow-y-auto min-h-0 py-2 pr-1 custom-scrollbar">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={cn(
                "transition-all duration-200",
                item.level === 3 ? "pl-2.5 text-[11px]" : "font-medium"
              )}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                    history.pushState(null, "", `#${item.id}`);
                    setActiveId(item.id);
                    if (onSelect) onSelect();
                  }
                }}
                className={cn(
                  "flex items-center gap-1 py-1 px-1.5 rounded-lg transition-colors group truncate",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-raised/60"
                )}
              >
                {isActive && (
                  <ChevronRight className="w-3 h-3 text-primary shrink-0 animate-in fade-in" />
                )}
                <span className="truncate">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Bottom Quick Action */}
      <div className="pt-2 border-t border-border/50 shrink-0">
        <Link
          href="/visualizers"
          className="flex items-center justify-between p-2 rounded-xl bg-surface-raised/80 hover:bg-surface-raised border border-border/60 text-[11px] font-medium text-foreground transition-all group"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Compass className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">Visualizers</span>
          </span>
          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 shrink-0" />
        </Link>
      </div>
    </nav>
  );
}
