"use client";

import { useState, useEffect } from "react";
import { usePlaybackStore } from "../playback-store";
import { CodeExample, CodeLanguage } from "@/types";
import { cn } from "@/lib/utils";
import { codeToHtml } from "shiki";
import { Check, Copy } from "lucide-react";

interface CodePanelProps {
  examples: CodeExample[];
}

export function CodePanel({ examples }: CodePanelProps) {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  
  const [activeLang, setActiveLang] = useState<CodeLanguage>("javascript");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Load preferred language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("algo-flow-lang") as CodeLanguage | null;
    if (saved && examples.some(e => e.language === saved)) {
      setActiveLang(saved);
    } else if (examples.length > 0) {
      setActiveLang(examples[0].language);
    }
  }, [examples]);

  const activeExample = examples.find((e) => e.language === activeLang);
  const codeString = activeExample?.code || "";

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
    if (!htmlContent) return;
    
    // We wait a tick for React to dangerouslySetInnerHTML
    const timer = setTimeout(() => {
      const activeLineNum = currentStep?.codeLine;
      const lines = document.querySelectorAll(".shiki .line");
      
      lines.forEach((line, index) => {
        // Shiki lines are 0-indexed in DOM, but codeLine is usually 1-indexed
        if (activeLineNum && index + 1 === activeLineNum) {
          line.classList.add("bg-primary/20", "border-l-2", "border-primary");
        } else {
          line.classList.remove("bg-primary/20", "border-l-2", "border-primary");
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [htmlContent, currentStep?.codeLine]);

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
      <div className="flex items-center justify-between border-b border-border bg-bg-surface px-2">
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
          className="p-2 text-text-muted hover:text-text-primary transition-colors"
          title="Copy Code"
        >
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto bg-[#121212] relative group">
        {htmlContent ? (
          <div 
            className="p-4 text-sm font-mono [&_pre]:!bg-transparent [&_pre]:!m-0 [&_.line]:px-2 [&_.line]:-mx-2 [&_.line]:transition-colors"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            Loading code...
          </div>
        )}
      </div>
    </div>
  );
}
