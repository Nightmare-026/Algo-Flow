"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PseudocodePanel } from "./PseudocodePanel";
import { CodePanel } from "./CodePanel";
import { StepExplanation } from "./StepExplanation";
import { StepLog } from "./StepLog";
import { Algorithm, CodeExample } from "@/types";
import type { CodeLineMapping } from "@/visualizers/registry/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface InspectorPanelProps {
  activeRightTab: "pseudocode" | "code";
  setActiveRightTab: (tab: "pseudocode" | "code") => void;
  activeLowerTab: "explanation" | "log";
  setActiveLowerTab: (tab: "explanation" | "log") => void;
  setActiveLanguage: (lang: string) => void;
  algorithm: Algorithm;
  codeExamples: CodeExample[];
  codeLineMapping?: ReadonlyArray<CodeLineMapping>;
}

export function InspectorPanel({
  activeRightTab,
  setActiveRightTab,
  activeLowerTab,
  setActiveLowerTab,
  setActiveLanguage,
  algorithm,
  codeExamples,
  codeLineMapping,
}: InspectorPanelProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // On mobile, use a clean 4-segment tab bar so exactly one panel is active at full height
  const [mobileTab, setMobileTab] = useState<"pseudocode" | "code" | "explanation" | "log">(
    "pseudocode"
  );

  // Sync with keyboard shortcut events
  useEffect(() => {
    const handleTabPseudocode = () => {
      setMobileTab("pseudocode");
      setActiveRightTab("pseudocode");
    };
    const handleTabCode = () => {
      setMobileTab("code");
      setActiveRightTab("code");
    };
    const handleTabExplanation = () => {
      setMobileTab("explanation");
      setActiveLowerTab("explanation");
    };
    const handleTabLog = () => {
      setMobileTab("log");
      setActiveLowerTab("log");
    };

    window.addEventListener("tab-pseudocode", handleTabPseudocode);
    window.addEventListener("tab-code", handleTabCode);
    window.addEventListener("tab-explanation", handleTabExplanation);
    window.addEventListener("tab-log", handleTabLog);

    return () => {
      window.removeEventListener("tab-pseudocode", handleTabPseudocode);
      window.removeEventListener("tab-code", handleTabCode);
      window.removeEventListener("tab-explanation", handleTabExplanation);
      window.removeEventListener("tab-log", handleTabLog);
    };
  }, [setActiveLowerTab, setActiveRightTab]);

  if (isMobile) {
    return (
      <div className="flex h-full flex-col overflow-hidden p-3 gap-3">
        {/* Unified 4-Segment Mobile Tab Bar */}
        <div
          className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-bg-surface-inset border border-border shadow-[var(--shadow-inset)] shrink-0"
          role="tablist"
          aria-label="Inspector panels"
        >
          <button
            id="mobile-tab-pseudocode"
            role="tab"
            type="button"
            aria-selected={mobileTab === "pseudocode"}
            aria-controls="mobile-panel-pseudocode"
            onClick={() => setMobileTab("pseudocode")}
            className={cn(
              "min-h-9 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer select-none text-center truncate px-1",
              mobileTab === "pseudocode"
                ? "bg-surface text-primary border border-border shadow-[var(--shadow-raised-sm)]"
                : "text-text-muted hover:text-text-primary active:scale-95"
            )}
          >
            Pseudocode
          </button>
          <button
            id="mobile-tab-code"
            role="tab"
            type="button"
            aria-selected={mobileTab === "code"}
            aria-controls="mobile-panel-code"
            onClick={() => setMobileTab("code")}
            className={cn(
              "min-h-9 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer select-none text-center truncate px-1",
              mobileTab === "code"
                ? "bg-surface text-primary border border-border shadow-[var(--shadow-raised-sm)]"
                : "text-text-muted hover:text-text-primary active:scale-95"
            )}
          >
            Code
          </button>
          <button
            id="mobile-tab-explanation"
            role="tab"
            type="button"
            aria-selected={mobileTab === "explanation"}
            aria-controls="mobile-panel-explanation"
            onClick={() => setMobileTab("explanation")}
            className={cn(
              "min-h-9 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer select-none text-center truncate px-1",
              mobileTab === "explanation"
                ? "bg-surface text-primary border border-border shadow-[var(--shadow-raised-sm)]"
                : "text-text-muted hover:text-text-primary active:scale-95"
            )}
          >
            Explain
          </button>
          <button
            id="mobile-tab-log"
            role="tab"
            type="button"
            aria-selected={mobileTab === "log"}
            aria-controls="mobile-panel-log"
            onClick={() => setMobileTab("log")}
            className={cn(
              "min-h-9 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer select-none text-center truncate px-1",
              mobileTab === "log"
                ? "bg-surface text-primary border border-border shadow-[var(--shadow-raised-sm)]"
                : "text-text-muted hover:text-text-primary active:scale-95"
            )}
          >
            Step Log
          </button>
        </div>

        {/* Mobile Full-Height Scrollable Panel Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {mobileTab === "pseudocode" && (
            <div
              id="mobile-panel-pseudocode"
              role="tabpanel"
              aria-labelledby="mobile-tab-pseudocode"
              className="h-full min-h-[300px]"
            >
              <PseudocodePanel
                slug={algorithm.slug}
                fallback={algorithm.pseudocode}
                isVisible={true}
              />
            </div>
          )}

          {mobileTab === "code" && (
            <div
              id="mobile-panel-code"
              role="tabpanel"
              aria-labelledby="mobile-tab-code"
              className="h-full min-h-[300px]"
            >
              <CodePanel
                examples={codeExamples}
                codeLineMapping={codeLineMapping}
                onLanguageChange={setActiveLanguage}
                isVisible={true}
              />
            </div>
          )}

          {mobileTab === "explanation" && (
            <div
              id="mobile-panel-explanation"
              role="tabpanel"
              aria-labelledby="mobile-tab-explanation"
              className="h-full"
            >
              <StepExplanation />
            </div>
          )}

          {mobileTab === "log" && (
            <div
              id="mobile-panel-log"
              role="tabpanel"
              aria-labelledby="mobile-tab-log"
              className="h-full"
            >
              <StepLog />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop: Traditional Dual-Split Layout
  return (
    <>
      {/* Upper Inspector Panel (Pseudocode / Code) */}
      <div className="flex flex-col overflow-hidden h-1/2">
        <div
          className="my-1.5 flex items-center gap-1 px-0.5"
          role="tablist"
          aria-label="Algorithm representation"
        >
          <button
            type="button"
            id="tab-pseudocode"
            role="tab"
            aria-selected={activeRightTab === "pseudocode"}
            aria-controls="panel-pseudocode"
            onClick={() => setActiveRightTab("pseudocode")}
            className={cn(
              "min-h-7 rounded-lg px-2.5 text-[11px] font-bold transition-all cursor-pointer select-none",
              activeRightTab === "pseudocode"
                ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            Pseudocode
          </button>
          <button
            type="button"
            id="tab-code"
            role="tab"
            aria-selected={activeRightTab === "code"}
            aria-controls="panel-code"
            onClick={() => setActiveRightTab("code")}
            className={cn(
              "min-h-7 rounded-lg px-2.5 text-[11px] font-bold transition-all cursor-pointer select-none",
              activeRightTab === "code"
                ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            Code
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          <div
            id="panel-pseudocode"
            role="tabpanel"
            aria-labelledby="tab-pseudocode"
            className={cn(
              "h-full w-full",
              activeRightTab === "pseudocode" ? "block" : "hidden pointer-events-none invisible"
            )}
          >
            <PseudocodePanel
              slug={algorithm.slug}
              fallback={algorithm.pseudocode}
              isVisible={activeRightTab === "pseudocode"}
            />
          </div>

          <div
            id="panel-code"
            role="tabpanel"
            aria-labelledby="tab-code"
            className={cn(
              "h-full w-full",
              activeRightTab === "code" ? "block" : "hidden pointer-events-none invisible"
            )}
          >
            <CodePanel
              examples={codeExamples}
              codeLineMapping={codeLineMapping}
              onLanguageChange={setActiveLanguage}
              isVisible={activeRightTab === "code"}
            />
          </div>
        </div>
      </div>

      {/* Lower Inspector Panel (Explanation / Step Log) */}
      <div className="flex flex-col overflow-hidden mt-2 h-1/2">
        <div
          className="mb-1.5 flex items-center gap-1 px-0.5"
          role="tablist"
          aria-label="Step details"
        >
          <button
            type="button"
            id="tab-explanation"
            role="tab"
            aria-selected={activeLowerTab === "explanation"}
            aria-controls="panel-explanation"
            onClick={() => setActiveLowerTab("explanation")}
            className={cn(
              "min-h-7 rounded-lg px-2.5 text-[11px] font-bold transition-all cursor-pointer select-none",
              activeLowerTab === "explanation"
                ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            Step Explanation
          </button>
          <button
            type="button"
            id="tab-log"
            role="tab"
            aria-selected={activeLowerTab === "log"}
            aria-controls="panel-log"
            onClick={() => setActiveLowerTab("log")}
            className={cn(
              "min-h-7 rounded-lg px-2.5 text-[11px] font-bold transition-all cursor-pointer select-none",
              activeLowerTab === "log"
                ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            Step Log
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          <div
            id="panel-explanation"
            role="tabpanel"
            aria-labelledby="tab-explanation"
            className={cn("h-full w-full", activeLowerTab === "explanation" ? "block" : "hidden")}
          >
            <StepExplanation />
          </div>
          <div
            id="panel-log"
            role="tabpanel"
            aria-labelledby="tab-log"
            className={cn("h-full w-full", activeLowerTab === "log" ? "block" : "hidden")}
          >
            <StepLog />
          </div>
        </div>
      </div>
    </>
  );
}
