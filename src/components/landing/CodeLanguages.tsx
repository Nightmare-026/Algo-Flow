"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, Copy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { CodeLanguage } from "@/types";
import { getArrayCodeExamples } from "@/visualizers/array/code-examples";
import { cn } from "@/lib/utils";

const languagePresentation: Record<
  CodeLanguage,
  { name: string; tag: string; description: string }
> = {
  python: {
    name: "Python",
    tag: "py",
    description: "Idiomatic Python 3 implementation with tuple unpacking and clean slicing.",
  },
  javascript: {
    name: "JavaScript",
    tag: "js",
    description: "Standard modern ECMAScript implementation with mutable in-place swaps.",
  },
  typescript: {
    name: "TypeScript",
    tag: "ts",
    description: "Strictly typed TypeScript implementation with number[] constraints.",
  },
  cpp: {
    name: "C++",
    tag: "cpp",
    description: "High-performance C++ implementation using std::vector and std::swap.",
  },
  java: {
    name: "Java",
    tag: "java",
    description: "Production Java class implementation with explicit temporary swaps.",
  },
};

const languages = getArrayCodeExamples("bubble-sort", "landing-bubble-sort").map((example) => ({
  ...example,
  ...languagePresentation[example.language],
}));

export function CodeLanguages() {
  const [activeTab, setActiveTab] = useState<CodeLanguage>("python");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const reduceMotion = useReducedMotion();
  const activeLanguage =
    languages.find((language) => language.language === activeTab) ?? languages[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeLanguage.code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    window.setTimeout(() => setCopyStatus("idle"), 1600);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + languages.length) % languages.length;
    const nextLanguage = languages[nextIndex];
    setActiveTab(nextLanguage.language);
    document.getElementById(`code-tab-${nextLanguage.language}`)?.focus();
  };

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28" id="code-languages">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="section-kicker">Multi-Language Code Tracing</p>
          <h2 className="mt-3 text-3xl font-extrabold font-display tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            Learn in the Language of Your Choice.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-text-secondary">
            Every algorithm in the library includes verified reference implementations across 4
            major languages with synchronized step pointers.
          </p>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="neu-float overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-float)]"
        >
          {/* Language Selector Tabs */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto border-b border-border bg-surface-inset p-2.5 sm:px-4"
            role="tablist"
            aria-label="Algorithm code languages"
          >
            {languages.map((language, index) => {
              const isActive = activeTab === language.language;
              return (
                <button
                  key={language.language}
                  id={`code-tab-${language.language}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="bubble-sort-code-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(language.language)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={cn(
                    "flex min-h-10 items-center gap-2 rounded-xl px-4 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none",
                    isActive
                      ? "border border-primary/30 bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  )}
                >
                  <span className="font-mono text-[11px] uppercase tracking-wider opacity-80">
                    {language.tag}
                  </span>
                  <span>{language.name}</span>
                </button>
              );
            })}
          </div>

          {/* Description & Copy Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-6 py-3.5">
            <span className="text-xs sm:text-sm font-medium text-text-secondary">
              {activeLanguage.description}
            </span>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 text-xs font-bold text-text-primary shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:text-primary active:scale-95 transition-all"
              onClick={handleCopy}
              aria-label={`Copy ${activeLanguage.name} code`}
            >
              {copyStatus === "copied" ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span aria-live="polite">
                {copyStatus === "copied"
                  ? "Copied!"
                  : copyStatus === "failed"
                    ? "Failed"
                    : "Copy Code"}
              </span>
            </button>
          </div>

          {/* Code Viewer Panel */}
          <div
            id="bubble-sort-code-panel"
            role="tabpanel"
            aria-labelledby={`code-tab-${activeLanguage.language}`}
            tabIndex={0}
            className="overflow-x-auto bg-code-panel-bg p-4 sm:p-6 text-xs sm:text-sm font-mono leading-7"
          >
            <div className="table w-full border-collapse">
              {activeLanguage.code.split("\n").map((line, idx) => (
                <div key={idx} className="table-row hover:bg-emerald-500/5 transition-colors">
                  <span className="table-cell select-none pr-4 sm:pr-6 text-right text-emerald-500/35 font-mono text-[11px] sm:text-xs w-8">
                    {idx + 1}
                  </span>
                  <span className="table-cell text-emerald-100 font-mono whitespace-pre">
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
