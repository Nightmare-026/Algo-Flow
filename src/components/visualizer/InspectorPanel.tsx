"use client";

import { useState } from "react";
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
  const isMobile = useMediaQuery("(max-width: 767px)");

  // On mobile, use accordion-style: only one panel open at a time
  // We'll use a single active panel state instead of separate right/lower tabs
  // Default to "pseudocode" to match desktop behavior
  const [mobileActivePanel, setMobileActivePanel] = useState<
    "pseudocode" | "code" | "explanation" | "log" | null
  >("pseudocode");

  // On desktop, use the traditional tabbed interface
  // On mobile, we use accordion-style with a single active panel
  const isRightTabActive = (tab: "pseudocode" | "code") =>
    isMobile ? mobileActivePanel === tab : activeRightTab === tab;
  const isLowerTabActive = (tab: "explanation" | "log") =>
    isMobile ? mobileActivePanel === tab : activeLowerTab === tab;

  const handleRightTabClick = (tab: "pseudocode" | "code") => {
    if (isMobile) {
      setMobileActivePanel(mobileActivePanel === tab ? null : tab);
    } else {
      setActiveRightTab(tab);
    }
  };

  const handleLowerTabClick = (tab: "explanation" | "log") => {
    if (isMobile) {
      setMobileActivePanel(mobileActivePanel === tab ? null : tab);
    } else {
      setActiveLowerTab(tab);
    }
  };

  return (
    <>
      {/* Upper Inspector Panel - Accordion on Mobile, Tabs on Desktop */}
      <div className={cn("flex flex-col overflow-hidden", isMobile ? "h-auto" : "h-1/2")}>
        {/* Desktop: Tabs | Mobile: Accordion Headers */}
        {!isMobile ? (
          <div
            className="mb-1.5 flex items-center gap-1 px-0.5"
            role="tablist"
            aria-label="Algorithm representation"
          >
            <button
              type="button"
              id="tab-pseudocode"
              role="tab"
              aria-selected={activeRightTab === "pseudocode"}
              aria-controls="panel-pseudocode-or-code"
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
              aria-controls="panel-pseudocode-or-code"
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
        ) : (
          // Mobile accordion headers
          <div className="flex flex-col gap-1" role="tablist" aria-label="Algorithm representation">
            <button
              type="button"
              id="mobile-tab-pseudocode"
              role="tab"
              aria-selected={isRightTabActive("pseudocode")}
              aria-controls="mobile-panel-pseudocode"
              onClick={() => handleRightTabClick("pseudocode")}
              className={cn(
                "min-h-9 rounded-lg px-3 py-2 text-[11px] font-bold transition-all cursor-pointer select-none w-full text-left",
                isRightTabActive("pseudocode")
                  ? "bg-primary-muted text-primary border border-primary/30 shadow-[var(--shadow-inset)]"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border"
              )}
            >
              Pseudocode
            </button>
            <button
              type="button"
              id="mobile-tab-code"
              role="tab"
              aria-selected={isRightTabActive("code")}
              aria-controls="mobile-panel-code"
              onClick={() => handleRightTabClick("code")}
              className={cn(
                "min-h-9 rounded-lg px-3 py-2 text-[11px] font-bold transition-all cursor-pointer select-none w-full text-left",
                isRightTabActive("code")
                  ? "bg-primary-muted text-primary border border-primary/30 shadow-[var(--shadow-inset)]"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border"
              )}
            >
              Code
            </button>
          </div>
        )}

        {/* Panel Content */}
        <div className={cn("flex-1 overflow-hidden min-h-0", isMobile ? "h-auto" : "")}>
          {/* Pseudocode Panel */}
          <div
            id={isMobile ? "mobile-panel-pseudocode" : "panel-pseudocode"}
            role="tabpanel"
            aria-labelledby={isMobile ? "mobile-tab-pseudocode" : "tab-pseudocode"}
            className={cn(
              isMobile ? "overflow-hidden transition-all duration-200" : "h-full w-full",
              isRightTabActive("pseudocode") ? "block" : "hidden pointer-events-none invisible"
            )}
            style={isMobile && !isRightTabActive("pseudocode") ? { display: "none" } : undefined}
          >
            <PseudocodePanel
              slug={algorithm.slug}
              fallback={algorithm.pseudocode}
              isVisible={isRightTabActive("pseudocode")}
            />
          </div>

          {/* Code Panel */}
          <div
            id={isMobile ? "mobile-panel-code" : "panel-code"}
            role="tabpanel"
            aria-labelledby={isMobile ? "mobile-tab-code" : "tab-code"}
            className={cn(
              isMobile ? "overflow-hidden transition-all duration-200" : "h-full w-full",
              isRightTabActive("code") ? "block" : "hidden pointer-events-none invisible"
            )}
            style={isMobile && !isRightTabActive("code") ? { display: "none" } : undefined}
          >
            <CodePanel
              examples={codeExamples}
              codeLineMapping={codeLineMapping}
              onLanguageChange={setActiveLanguage}
              isVisible={isRightTabActive("code")}
            />
          </div>
        </div>
      </div>

      {/* Lower Inspector Panel - Accordion on Mobile, Tabs on Desktop */}
      <div className={cn("flex flex-col overflow-hidden mt-2", isMobile ? "h-auto" : "h-1/2")}>
        {/* Desktop: Tabs | Mobile: Accordion Headers */}
        {!isMobile ? (
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
              aria-controls="panel-explanation-or-log"
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
              aria-controls="panel-explanation-or-log"
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
        ) : (
          // Mobile accordion headers
          <div className="flex flex-col gap-1" role="tablist" aria-label="Step details">
            <button
              type="button"
              id="mobile-tab-explanation"
              role="tab"
              aria-selected={isLowerTabActive("explanation")}
              aria-controls="mobile-panel-explanation"
              onClick={() => handleLowerTabClick("explanation")}
              className={cn(
                "min-h-9 rounded-lg px-3 py-2 text-[11px] font-bold transition-all cursor-pointer select-none w-full text-left",
                isLowerTabActive("explanation")
                  ? "bg-primary-muted text-primary border border-primary/30 shadow-[var(--shadow-inset)]"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border"
              )}
            >
              Step Explanation
            </button>
            <button
              type="button"
              id="mobile-tab-log"
              role="tab"
              aria-selected={isLowerTabActive("log")}
              aria-controls="mobile-panel-log"
              onClick={() => handleLowerTabClick("log")}
              className={cn(
                "min-h-9 rounded-lg px-3 py-2 text-[11px] font-bold transition-all cursor-pointer select-none w-full text-left",
                isLowerTabActive("log")
                  ? "bg-primary-muted text-primary border border-primary/30 shadow-[var(--shadow-inset)]"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border"
              )}
            >
              Step Log
            </button>
          </div>
        )}

        {/* Panel Content */}
        <div
          id={isMobile ? "mobile-panel-explanation-or-log" : "panel-explanation-or-log"}
          role="tabpanel"
          aria-labelledby={
            isMobile
              ? isLowerTabActive("explanation")
                ? "mobile-tab-explanation"
                : "mobile-tab-log"
              : activeLowerTab === "explanation"
                ? "tab-explanation"
                : "tab-log"
          }
          className={cn(
            isMobile
              ? "overflow-hidden transition-all duration-200"
              : "flex-1 overflow-hidden min-h-0"
          )}
        >
          {isLowerTabActive("explanation") ? <StepExplanation /> : <StepLog />}
        </div>
      </div>
    </>
  );
}
