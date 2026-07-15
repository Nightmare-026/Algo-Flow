"use client";

import { useState, useEffect, useRef } from "react";
import { usePlaybackStore } from "../playback-store";
import { CodeExample, CodeLanguage } from "@/types";
import { cn } from "@/lib/utils";
import { codeToHtml } from "shiki";
import { Check, Copy } from "lucide-react";
import type { CodeLineMapping } from "../registry/types";
import { resolvePhysicalCodeLine } from "../registry/code-line-mapping";

interface CodePanelProps {
  examples: CodeExample[];
  codeLineMapping?: ReadonlyArray<CodeLineMapping>;
}

export function CodePanel({ examples, codeLineMapping }: CodePanelProps) {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  
  const [activeLang, setActiveLang] = useState<CodeLanguage>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("algo-flow-lang") as CodeLanguage | null;
      if (saved && examples.some(e => e.language === saved)) {
        return saved;
      }
    }
    return examples.length > 0 ? examples[0].language : "javascript";
  });
  
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  const activeExample = examples.find((e) => e.language === activeLang);
  const codeString = activeExample?.code || "";
  const renderedHtml = codeString ? htmlContent : "";

  // Highlight code using Shiki
  useEffect(() => {
    if (!codeString) return;

    let isMounted = true;
    
    async function highlight() {
      try {
        const html = await codeToHtml(codeString, {
          lang: activeLang === "javascript" ? "js" : activeLang === "typescript" ? "ts" : activeLang,
          theme: "vitesse-dark",
        });
        if (isMounted) setHtmlContent(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        if (isMounted) setHtmlContent(`<pre><code>${codeString}</code></pre>`);
      }
    }

    highlight();

    return () => { isMounted = false; };
  }, [codeString, activeLang]);

  // Sync active line by manipulating DOM
  useEffect(() => {
    if (!htmlContent || !codeString) return;
    
    // We wait a tick for React to dangerouslySetInnerHTML
    const timer = setTimeout(() => {
      const activeLineNum = resolvePhysicalCodeLine(
        codeLineMapping,
        currentStep?.codeLine,
        activeLang,
      );
      const lines = codeContainerRef.current?.querySelectorAll(".shiki .line");
      
      lines?.forEach((line, index) => {
        // Shiki lines are 0-indexed in DOM, but codeLine is usually 1-indexed
        if (activeLineNum && index + 1 === activeLineNum) {
          line.classList.add("bg-primary/20", "border-l-2", "border-primary");
        } else {
          line.classList.remove("bg-primary/20", "border-l-2", "border-primary");
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [
    activeLang,
    codeLineMapping,
    htmlContent,
    codeString,
    currentStep?.codeLine,
  ]);

  const handleLangChange = (lang: CodeLanguage) => {
    setActiveLang(lang);
    localStorage.setItem("algo-flow-lang", lang);
  };

  const handleCopy = () => {
    if (!codeString) return;
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface-light rounded-xl border border-border overflow-hidden">
      {/* Tabs Header */}
      <div className="flex h-[46px] items-center justify-between border-b border-border bg-bg-surface px-2 shrink-0">
        <div className="flex overflow-x-auto hide-scrollbar">
          {examples.map((ex) => (
            <button
              key={ex.language}
              onClick={() => handleLangChange(ex.language)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                activeLang === ex.language
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-primary hover:bg-bg-surface-light"
              )}
            >
              {ex.language === "javascript" ? "JavaScript" : 
               ex.language === "typescript" ? "TypeScript" : 
               ex.language === "python" ? "Python" : 
               ex.language === "java" ? "Java" : 
               ex.language === "cpp" ? "C++" : ex.language}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          disabled={!codeString}
          className="p-2 text-text-muted hover:text-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          title="Copy Code"
        >
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto bg-[#121212] relative group">
        {renderedHtml ? (
          <div
            ref={codeContainerRef}
            className="p-4 text-sm font-mono [&_pre]:!bg-transparent [&_pre]:!m-0 [&_.line]:px-2 [&_.line]:-mx-2 [&_.line]:transition-colors"
            dangerouslySetInnerHTML={{ __html: renderedHtml }} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            {codeString ? "Loading code..." : "Code example unavailable for this visualizer."}
          </div>
        )}
      </div>
    </div>
  );
}
