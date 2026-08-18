"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { usePlaybackStore } from "@/stores/playback-store";
import type { CodeExample, CodeLanguage } from "@/types";
import type { CodeLineMapping } from "@/visualizers/registry/types";
import { resolvePhysicalCodeLine } from "@/visualizers/registry/code-line-mapping";
import { cn } from "@/lib/utils";

interface CodePanelProps {
  examples: CodeExample[];
  codeLineMapping?: ReadonlyArray<CodeLineMapping>;
  onLanguageChange?: (language: CodeLanguage) => void;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function languageLabel(language: CodeLanguage) {
  if (language === "javascript") return "JavaScript";
  if (language === "typescript") return "TypeScript";
  if (language === "python") return "Python";
  if (language === "java") return "Java";
  if (language === "cpp") return "C++";
  return language;
}

export function CodePanel({ examples, codeLineMapping, onLanguageChange }: CodePanelProps) {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  const pathname = usePathname();
  const [activeLang, setActiveLangState] = useState<CodeLanguage>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("algo-flow-lang") as CodeLanguage | null;
      if (saved && examples.some((example) => example.language === saved)) return saved;
    }
    return examples[0]?.language ?? "python";
  });

  const setActiveLang = (lang: CodeLanguage) => {
    setActiveLangState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("algo-flow-lang", lang);
    }
    onLanguageChange?.(lang);
  };
  const [highlightedDocument, setHighlightedDocument] = useState<{
    key: string;
    html: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const codeScrollRef = useRef<HTMLDivElement>(null);

  const activeExample = examples.find((example) => example.language === activeLang);
  const codeString = activeExample?.code ?? "";
  const documentKey = `${activeLang}:${codeString}`;
  const isDocumentReady = highlightedDocument?.key === documentKey;
  const htmlContent = isDocumentReady ? highlightedDocument.html : "";
  const activeLineNum = resolvePhysicalCodeLine(codeLineMapping, currentStep?.codeLine, activeLang);

  useEffect(() => {
    if (!codeString) return;

    let isMounted = true;
    async function highlight() {
      try {
        const { codeToHtml } = await import("shiki");
        const html = await codeToHtml(codeString, {
          lang:
            activeLang === "javascript" ? "js" : activeLang === "typescript" ? "ts" : activeLang,
          theme: "vitesse-dark",
        });
        if (isMounted) setHighlightedDocument({ key: documentKey, html });
      } catch (error) {
        console.error("Error highlighting code:", error);
        if (isMounted) {
          setHighlightedDocument({
            key: documentKey,
            html: `<pre><code>${escapeHtml(codeString)}</code></pre>`,
          });
        }
      }
    }
    highlight();
    return () => {
      isMounted = false;
    };
  }, [activeLang, codeString, documentKey]);

  useEffect(() => {
    if (!htmlContent || !codeString) return;

    const container = codeScrollRef.current;
    if (!container) return;

    const applyHighlight = () => {
      if (typeof container.checkVisibility === "function" && !container.checkVisibility()) {
        return;
      }
      const lines = codeContainerRef.current?.querySelectorAll<HTMLElement>(".shiki .line");
      lines?.forEach((line, index) => {
        const isActive = Boolean(activeLineNum && index + 1 === activeLineNum);
        line.classList.toggle("is-active-code-line", isActive);
        if (isActive) {
          line.setAttribute("aria-current", "step");
        } else {
          line.removeAttribute("aria-current");
        }
        line.dataset.line = String(index + 1);
      });

      const activeLine = codeContainerRef.current?.querySelector<HTMLElement>(
        ".shiki .is-active-code-line"
      );
      if (!activeLine) return;
      const top =
        container.scrollTop +
        activeLine.getBoundingClientRect().top -
        container.getBoundingClientRect().top -
        container.clientHeight / 2 +
        activeLine.offsetHeight / 2;
      container.scrollTo({
        top: Math.max(0, top),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    };

    const frame = window.requestAnimationFrame(applyHighlight);

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(applyHighlight);
      resizeObserver.observe(container);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, [activeLineNum, codeString, htmlContent, reducedMotion, pathname]);

  const handleCopy = async () => {
    if (!codeString) return;
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-raised-sm)]"
      aria-label="Source code"
    >
      <div className="flex min-h-[44px] shrink-0 items-center justify-between border-b border-border bg-surface px-2">
        <div
          className="hide-scrollbar flex items-center gap-1 overflow-x-auto"
          role="tablist"
          aria-label="Code languages"
        >
          {examples.map((example) => {
            const isActive = activeLang === example.language;
            return (
              <button
                id={`code-tab-${example.language}`}
                key={example.language}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls="code-language-panel"
                onClick={() => setActiveLang(example.language)}
                className={cn(
                  "min-h-8 rounded-lg px-2.5 text-xs font-semibold transition-all cursor-pointer select-none",
                  isActive
                    ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                    : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                {languageLabel(example.language)}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          {activeLineNum ? (
            <span className="font-mono text-[10px] font-bold text-primary bg-primary-muted px-2 py-0.5 rounded border border-primary/20">
              Line {activeLineNum}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!codeString}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-all hover:border-primary/40 hover:text-primary disabled:opacity-40"
            aria-label={copied ? "Code copied" : "Copy code"}
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div
        ref={codeScrollRef}
        id="code-language-panel"
        role="tabpanel"
        aria-labelledby={`code-tab-${activeLang}`}
        aria-busy={!isDocumentReady && Boolean(codeString)}
        className="group relative flex-1 overflow-auto bg-code-panel-bg shadow-[var(--shadow-inset)]"
      >
        {isDocumentReady && htmlContent && codeString ? (
          <div
            ref={codeContainerRef}
            className="code-lines p-4 font-mono text-xs leading-6 [&_.line]:-mx-2 [&_.line]:px-2 [&_.line]:py-0.5 [&_.line]:transition-all [&_pre]:!m-0 [&_pre]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-5 text-center text-xs text-emerald-100/50">
            {codeString ? "Loading syntax highlighter…" : "Code example unavailable."}
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {activeLineNum ? `Code line ${activeLineNum} selected.` : "No code line selected."}
      </p>
    </section>
  );
}
