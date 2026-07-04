"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  {
    id: "cpp",
    name: "C++",
    icon: "⚡",
    color: "#00599C",
    description: "Fast algorithms, competitive programming, memory-level understanding",
    code: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    color: "#ED8B00",
    description: "Strong OOP, clean DSA structure, college-level learning",
    code: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
  },
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    color: "#3776AB",
    description: "Easy syntax, beginners' best friend, quick explanation",
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "🌐",
    color: "#F7DF1E",
    description: "Web-native, live DSA logic, visualizer engine language",
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  },
];

export function CodeLanguages() {
  const [activeTab, setActiveTab] = useState("cpp");
  const activeLanguage = languages.find((l) => l.id === activeTab)!;

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8" id="code-languages">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-4"
          >
            Code Examples
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
          >
            Code in Your Language
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto"
          >
            Every algorithm includes implementation in C++, Java, Python, and JavaScript
            — with VS Code-quality syntax highlighting.
          </motion.p>
        </div>

        {/* Code Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden shadow-xl"
        >
          {/* Tab bar */}
          <div className="flex items-center border-b border-[var(--border)] bg-[var(--bg-surface-light)] px-2 overflow-x-auto">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setActiveTab(lang.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === lang.id
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <span>{lang.icon}</span>
                <span>{lang.name}</span>
                {activeTab === lang.id && (
                  <motion.div
                    layoutId="code-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Code display */}
          <div className="relative">
            {/* Algorithm label */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]/50">
              <span className="text-xs text-[var(--text-muted)]">
                Bubble Sort — {activeLanguage.description}
              </span>
              <button
                className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                onClick={() => navigator.clipboard.writeText(activeLanguage.code)}
              >
                Copy
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.pre
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-5 overflow-x-auto text-sm leading-relaxed"
              >
                <code className="font-mono text-[var(--text-secondary)]">
                  {activeLanguage.code}
                </code>
              </motion.pre>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Language badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/60 px-4 py-2 text-sm text-[var(--text-muted)]"
            >
              <span>{lang.icon}</span>
              <span>{lang.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
