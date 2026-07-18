"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { usePlaybackStore } from "@/stores/playback-store";
import type { CodeExample, CodeLanguage } from "@/types";
import type { CodeLineMapping } from "@/visualizers/registry/types";
import { resolvePhysicalCodeLine } from "@/visualizers/registry/code-line-mapping";
import { cn } from "@/lib/utils";

interface CodePanelProps {
  examples: CodeExample[];
  codeLineMapping?: ReadonlyArray<CodeLineMapping>;
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

export function CodePanel({ examples, codeLineMapping }: CodePanelProps) {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  const [activeLang, setActiveLang] = useState<CodeLanguage>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("algo-flow-lang") as CodeLanguage | null;
      if (saved && examples.some((example) => example.language === saved)) return saved;
    }
    return examples[0]?.language ?? "javascript";
  });
  const [htmlContent, setHtmlContent] = useState("");
  const [copied, setCopied] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const codeScrollRef = useRef<HTMLDivElement>(null);

  const activeExample = examples.find((example) => example.language === activeLang);
  const codeString = activeExample?.code ?? "";
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
        if (isMounted) setHtmlContent(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        if (isMounted) setHtmlContent(`<pre><code>${escapeHtml(codeString)}</code></pre>`);
      }
    }
    highlight();
    return () => {
      isMounted = false;
    };
  }, [activeLang, codeString]);

  useEffect(() => {
    if (!htmlContent || !codeString) return;
    const frame = window.requestAnimationFrame(() => {
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
        if (isActive) {
          const container = codeScrollRef.current;
          if (container) {
            const top =
              container.scrollTop +
              line.getBoundingClientRect().top -
              container.getBoundingClientRect().top -
              container.clientHeight / 2 +
              line.offsetHeight / 2;
            container.scrollTo({
              top: Math.max(0, top),
              behavior: reducedMotion ? "auto" : "smooth",
            });
          }
        }
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeLineNum, codeString, htmlContent, reducedMotion]);

  const handleLangChange = (language: CodeLanguage) => {
    setActiveLang(language);
    localStorage.setItem("algo-flow-lang", language);
  };

  const handleCopy = async () => {
    if (!codeString) return;
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-surface-light"
      aria-label="Source code"
    >
      <div className="flex min-h-[46px] shrink-0 items-center justify-between border-b border-border bg-bg-surface px-2">
        <div
          className="hide-scrollbar flex overflow-x-auto"
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
                onClick={() => handleLangChange(example.language)}
                className={cn(
                  "min-h-11 whitespace-nowrap border-b-2 px-4 text-sm font-medium transition-[border-color,background-color,color]",
                  isActive
                    ? "border-primary text-primary-active"
                    : "border-transparent text-text-muted hover:bg-bg-surface-light hover:text-text-primary"
                )}
              >
                {languageLabel(example.language)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!codeString}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-primary-muted hover:text-primary-active disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      <div
        ref={codeScrollRef}
        id="code-language-panel"
        role="tabpanel"
        aria-labelledby={`code-tab-${activeLang}`}
        className="group relative flex-1 overflow-auto bg-[#121a15]"
      >
        {htmlContent && codeString ? (
          <div
            ref={codeContainerRef}
            className="code-lines p-4 font-mono text-sm [&_.line]:-mx-2 [&_.line]:px-2 [&_.line]:py-0.5 [&_.line]:transition-[background-color,border-color,box-shadow] [&_pre]:!m-0 [&_pre]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-5 text-center text-sm text-emerald-50/70">
            {codeString ? "Loading code…" : "Code example unavailable for this visualizer."}
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {activeLineNum ? `Code line ${activeLineNum} selected.` : "No code line selected."}
      </p>
    </section>
  );
}
