"use client";

import { useState, useSyncExternalStore } from "react";
import type {
  LearningModule,
  LearningChapter,
  ParsedChapterContent,
  ChapterNavigation,
} from "@/lib/learnings/types";
import { CurriculumSidebar } from "./CurriculumSidebar";
import { TableOfContents } from "./TableOfContents";
import { ChapterReader } from "./ChapterReader";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { MobileCurriculumNav } from "./MobileCurriculumNav";
import { cn } from "@/lib/utils";

interface ChapterLayoutContainerProps {
  module: LearningModule;
  chapter: LearningChapter;
  allModules: LearningModule[];
  content: ParsedChapterContent;
  navigation: ChapterNavigation;
}

const SIDEBAR_STORAGE_KEY = "algoflow_curriculum_sidebar_collapsed";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function ChapterLayoutContainer({
  module,
  chapter,
  allModules,
  content,
  navigation,
}: ChapterLayoutContainerProps) {
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  const storedCollapsed = useSyncExternalStore(subscribeToStorage, getStoredCollapsed, () => false);
  const [focusMode, setFocusMode] = useState(false);

  const sidebarCollapsed = userOverride !== null ? userOverride : storedCollapsed;

  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setUserOverride(next);
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
    } catch {
      // Ignore
    }
  };

  const toggleFocusMode = () => {
    setFocusMode((prev) => !prev);
  };

  return (
    <div className="h-[calc(100vh-4.5rem)] overflow-hidden w-full px-2 sm:px-3 lg:px-4 2xl:px-6 py-2 sm:py-2.5 flex flex-col bg-background">
      {/* Scroll Reading Progress Bar tied to the middle reader container */}
      <ReadingProgressBar targetId="chapter-reader-container" />

      {/* Mobile Navigation Drawer Trigger (Hidden on Desktop) */}
      <MobileCurriculumNav
        modules={allModules}
        currentModuleSlug={module.slug}
        currentChapterSlug={chapter.slug}
        tableOfContents={content.tableOfContents}
        chapterTitle={chapter.title}
      />

      {/* Main 3-Section Unified Reading Workspace */}
      <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 flex-1 min-h-0 w-full overflow-hidden">
        {/* LEFT PANEL — Curriculum Navigation (Collapsible) */}
        {!focusMode && (
          <aside
            className={cn(
              "hidden lg:flex h-full shrink-0 min-w-0 flex-col transition-all duration-300 ease-in-out",
              sidebarCollapsed ? "w-16" : "w-70 xl:w-80 2xl:w-85"
            )}
          >
            <CurriculumSidebar
              modules={allModules}
              currentModuleSlug={module.slug}
              currentChapterSlug={chapter.slug}
              currentTableOfContents={content.tableOfContents}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={toggleSidebar}
              className="h-full"
            />
          </aside>
        )}

        {/* MIDDLE PANEL — Full Height Scrollable Reading Canvas */}
        <article
          id="chapter-reader-container"
          className={cn(
            "flex-1 h-full min-w-0 overflow-y-auto custom-scrollbar rounded-[8px] border border-border bg-surface shadow-card transition-all duration-300",
            focusMode
              ? "p-6 sm:p-10 md:p-12 xl:p-16 max-w-5xl mx-auto"
              : "p-5 sm:p-7 md:p-8 xl:p-10"
          )}
        >
          <ChapterReader
            module={module}
            chapter={chapter}
            content={content}
            navigation={navigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={toggleSidebar}
            focusMode={focusMode}
            onToggleFocusMode={toggleFocusMode}
          />
        </article>

        {/* RIGHT PANEL — Table of Contents (Hidden in Focus Mode) */}
        {!focusMode && (
          <aside className="hidden xl:flex xl:w-60 2xl:w-67.5 h-full shrink-0 min-w-0 flex-col transition-all duration-300">
            <TableOfContents items={content.tableOfContents} className="h-full" />
          </aside>
        )}
      </div>
    </div>
  );
}
