"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { glowStyle, sectionReveal } from "./landing-effects";

const languages = [
  {
    id: "cpp",
    name: "C++",
    color: "#BAE6FD",
    description: "Pointer-free view of the loop structure for competitive-programming style study.",
    code: `void bubbleSort(vector<int>& a) {
  for (int pass = 0; pass < a.size() - 1; pass++) {
    for (int i = 0; i < a.size() - pass - 1; i++) {
      if (a[i] > a[i + 1]) swap(a[i], a[i + 1]);
    }
  }
}`,
  },
  {
    id: "java",
    name: "Java",
    color: "#FDE68A",
    description: "Classroom-friendly implementation with explicit temporary values.",
    code: `void bubbleSort(int[] a) {
  for (int pass = 0; pass < a.length - 1; pass++) {
    for (int i = 0; i < a.length - pass - 1; i++) {
      if (a[i] > a[i + 1]) {
        int temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
      }
    }
  }
}`,
  },
  {
    id: "python",
    name: "Python",
    color: "#DDD6FE",
    description: "Compact syntax for tracing the same comparisons and swaps.",
    code: `def bubble_sort(a):
    for pass_no in range(len(a) - 1):
        for i in range(len(a) - pass_no - 1):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
    return a`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    color: "#BBF7D0",
    description: "The visualizer engine's primary authored example format.",
    code: `function bubbleSort(a) {
  for (let pass = 0; pass < a.length - 1; pass++) {
    for (let i = 0; i < a.length - pass - 1; i++) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
      }
    }
  }
  return a;
}`,
  },
] as const;

export function CodeLanguages() {
  const [activeTab, setActiveTab] = useState<(typeof languages)[number]["id"]>("javascript");
  const [copied, setCopied] = useState(false);
  const activeLanguage = languages.find((language) => language.id === activeTab) ?? languages[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeLanguage.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
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
            The visualizer page supports language tabs and highlighted code lines. This preview
            shows the format learners use across published visualizers.
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
          <div className="flex items-center overflow-x-auto border-b border-white/75 bg-background px-2">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => setActiveTab(language.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === language.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-secondary-foreground"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: language.color }}
                />
                <span>{language.name}</span>
                {activeTab === language.id && (
                  <motion.div
                    layoutId="code-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--landing-card-tone)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-white/75 px-5 py-3">
            <span className="text-xs leading-5 text-muted-foreground">
              Bubble Sort: {activeLanguage.description}
            </span>
            <button
              className="inline-flex h-8 items-center gap-2 rounded-md border border-white/75 px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-[var(--landing-card-tone)]"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.pre
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="overflow-x-auto p-5 text-sm leading-relaxed"
            >
              <code className="font-mono text-secondary-foreground">{activeLanguage.code}</code>
            </motion.pre>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
