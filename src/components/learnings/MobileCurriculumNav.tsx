"use client";

import { useState, useEffect } from "react";
import type { LearningModule, TableOfContentsItem } from "@/lib/learnings/types";
import { CurriculumSidebar } from "./CurriculumSidebar";
import { TableOfContents } from "./TableOfContents";
import { BookOpen, ListTree, X } from "lucide-react";

interface MobileCurriculumNavProps {
  modules: LearningModule[];
  currentModuleSlug: string;
  currentChapterSlug: string;
  tableOfContents: TableOfContentsItem[];
  chapterTitle: string;
}

export function MobileCurriculumNav({
  modules,
  currentModuleSlug,
  currentChapterSlug,
  tableOfContents,
  chapterTitle,
}: MobileCurriculumNavProps) {
  const [activeDrawer, setActiveDrawer] = useState<"curriculum" | "toc" | null>(null);

  useEffect(() => {
    if (!activeDrawer) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDrawer(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", handleKey);
    };
  }, [activeDrawer]);

  return (
    <>
      {/* Sticky Mobile Sub-Navbar */}
      <div className="lg:hidden sticky top-16 z-30 flex items-center justify-between gap-2 px-4 py-2.5 bg-surface/90 backdrop-blur-md border-b border-border/80 neu-raised mb-6">
        <button
          onClick={() => setActiveDrawer("curriculum")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface-raised/80 text-xs font-semibold text-foreground hover:bg-surface-raised cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span>Curriculum Menu</span>
        </button>

        <button
          onClick={() => setActiveDrawer("toc")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface-raised/80 text-xs font-semibold text-foreground hover:bg-surface-raised cursor-pointer"
        >
          <ListTree className="w-3.5 h-3.5 text-primary" />
          <span>On This Page</span>
        </button>
      </div>

      {/* Slide-over Drawer / Modal */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setActiveDrawer(null)} aria-hidden="true" />

          <div className="relative z-10 max-h-[85vh] bg-surface rounded-t-3xl sm:rounded-3xl p-5 border border-border shadow-2xl flex flex-col mx-auto w-full max-w-lg neu-raised">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-foreground truncate pr-2">
                {activeDrawer === "curriculum"
                  ? "DSA Curriculum (62 Chapters)"
                  : chapterTitle
                    ? `On This Page: ${chapterTitle}`
                    : "On This Page"}
              </h3>
              <button
                onClick={() => setActiveDrawer(null)}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-surface-raised"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="overflow-y-auto flex-1">
              {activeDrawer === "curriculum" ? (
                <CurriculumSidebar
                  modules={modules}
                  currentModuleSlug={currentModuleSlug}
                  currentChapterSlug={currentChapterSlug}
                  currentTableOfContents={tableOfContents}
                  onNavigate={() => setActiveDrawer(null)}
                  className="border-0 shadow-none p-0 bg-transparent"
                />
              ) : (
                <TableOfContents
                  items={tableOfContents}
                  onSelect={() => setActiveDrawer(null)}
                  className="border-0 shadow-none p-0 bg-transparent"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
