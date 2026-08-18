"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import type { CodeLanguage } from "@/types";
import { getArrayCodeExamples } from "@/visualizers/array/code-examples";
import { glowStyle, sectionReveal } from "./landing-effects";

const languagePresentation: Record<
  CodeLanguage,
  { name: string; color: string; description: string }
> = {
  cpp: {
    name: "C++",
    color: "#BAE6FD",
    description: "A reference implementation using std::vector and std::swap.",
  },
  java: {
    name: "Java",
    color: "#FDE68A",
    description: "An explicit array implementation with a temporary swap value.",
  },
  python: {
    name: "Python",
    color: "#DDD6FE",
    description: "The same trace expressed with Python tuple assignment.",
  },
  javascript: {
    name: "JavaScript",
    color: "#BBF7D0",
    description: "The primary authored implementation for this visualizer.",
  },
  typescript: {
    name: "TypeScript",
    color: "#BFDBFE",
    description: "A typed JavaScript implementation.",
  },
};

const languages = getArrayCodeExamples("bubble-sort", "landing-bubble-sort").map((example) => ({
  ...example,
  ...languagePresentation[example.language],
}));

export function CodeLanguages() {
  const [activeTab, setActiveTab] = useState<CodeLanguage>("javascript");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
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
        <motion.div
          initial="visible"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={sectionReveal}
          className="mb-12 max-w-3xl text-left"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Code Translations
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Keep the implementation beside the animation.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            These tabs read the same Bubble Sort code examples as the visualizer, so the landing
            preview cannot drift into a separate implementation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          style={glowStyle(5)}
          className="landing-glow-card rounded-lg border border-white/75 bg-surface/70 shadow-xl"
        >
          <div
            className="flex items-center overflow-x-auto border-b border-white/75 bg-background px-2"
            role="tablist"
            aria-label="Bubble Sort code languages"
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
                  className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-secondary-foreground"
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: language.color }}
                    aria-hidden="true"
                  />
                  <span>{language.name}</span>
                  {isActive ? (
                    <motion.span
                      layoutId="code-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--landing-card-tone)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-white/75 px-5 py-3">
            <span className="text-xs leading-5 text-muted-foreground">
              Bubble Sort: {activeLanguage.description}
            </span>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-2 rounded-md border border-white/75 px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-[var(--landing-card-tone)]"
              onClick={handleCopy}
              aria-label={`Copy ${activeLanguage.name} Bubble Sort code`}
            >
              {copyStatus === "copied" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span aria-live="polite">
                {copyStatus === "copied"
                  ? "Copied"
                  : copyStatus === "failed"
                    ? "Copy failed"
                    : "Copy"}
              </span>
            </button>
          </div>

          <pre
            id="bubble-sort-code-panel"
            role="tabpanel"
            aria-labelledby={`code-tab-${activeLanguage.language}`}
            tabIndex={0}
            className="overflow-x-auto p-5 text-sm leading-relaxed"
          >
            <code className="font-mono text-secondary-foreground">{activeLanguage.code}</code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
