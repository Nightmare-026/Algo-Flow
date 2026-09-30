"use client";

import { ReactNode, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Algorithm, CodeExample } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { InspectorPanel } from "./InspectorPanel";
import { type StepLegendItem } from "./StepLegend";
import { usePlaybackStore } from "@/stores/playback-store";
import {
  useStatusToast,
  useVisualizerBookmark,
  useVisualizerCompletion,
  useVisualizerSaveSession,
} from "./useVisualizerActions";
import type { CodeLineMapping } from "@/visualizers/registry/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePracticeMode } from "./hooks/usePracticeMode";
import { useVisualizerKeyboard } from "./hooks/useVisualizerKeyboard";
import { useVisualizerTour } from "./hooks/useVisualizerTour";
import { useVisualizerUrlSync } from "./hooks/useVisualizerUrlSync";
import { VisualizerHeader } from "./layout/VisualizerHeader";
import { VisualizerCanvasShell } from "./layout/VisualizerCanvasShell";
import { VisualizerControlDock } from "./layout/VisualizerControlDock";
import { VisualizerMobileDrawer } from "./layout/VisualizerMobileDrawer";
import { KeyboardShortcutsModal } from "./layout/KeyboardShortcutsModal";
import { VisualizerTourModal } from "./layout/VisualizerTourModal";

interface VisualizerLayoutProps {
  algorithm: Algorithm;
  codeExamples: CodeExample[];
  codeLineMapping?: ReadonlyArray<CodeLineMapping>;
  legend?: ReadonlyArray<StepLegendItem>;
  children: ReactNode;
  controls?: ReactNode;
}

export function VisualizerLayout({
  algorithm,
  codeExamples,
  codeLineMapping,
  legend,
  children,
  controls,
}: VisualizerLayoutProps) {
  const pathname = usePathname();
  const { currentStepIndex, totalSteps, reducedMotion, steps } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  const [activeRightTab, setActiveRightTab] = useState<"pseudocode" | "code">("pseudocode");
  const [activeLowerTab, setActiveLowerTab] = useState<"explanation" | "log">("explanation");
  const [activeLanguage, setActiveLanguage] = useState<string>("python");
  const [showInspector, setShowInspector] = useState(false);
  const canvasRegionRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Extracted hooks
  const {
    isPracticeMode,
    setIsPracticeMode,
    togglePracticeMode,
    showPracticePrompt,
    practiceOptions,
    practiceAnswer,
    practiceSelected,
    setPracticeSelected,
    practiceFeedback,
    handlePracticeSubmit,
    handlePracticeSkip,
  } = usePracticeMode();

  const { statusMessage, showStatus } = useStatusToast();
  const { isBookmarked, handleToggleBookmark } = useVisualizerBookmark(algorithm.id, showStatus);
  useVisualizerCompletion(algorithm.id, showStatus);
  useVisualizerUrlSync();
  const { isSaving, handleSaveSession } = useVisualizerSaveSession(
    algorithm.id,
    algorithm.name,
    activeLanguage,
    showStatus
  );

  const handleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        showStatus("Fullscreen closed");
      } else {
        await canvasRegionRef.current?.requestFullscreen();
        showStatus("Canvas opened fullscreen");
      }
    } catch {
      showStatus("Fullscreen is not available");
    }
  }, [showStatus]);

  const {
    showTour,
    closeTour,
    tourStep,
    nextTourStep,
    prevTourStep,
    goToTourStep,
    tourModalRef,
    tourSteps,
  } = useVisualizerTour({
    algorithmSlug: algorithm.slug,
    algorithmName: algorithm.name,
  });

  const { showShortcuts, closeShortcuts } = useVisualizerKeyboard({
    togglePracticeMode,
    handleFullscreen,
    handleToggleBookmark,
    handleSaveSession,
    setActiveRightTab,
    setActiveLowerTab,
  });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showStatus("Visualizer link copied");
    } catch {
      showStatus("Could not copy link");
    }
  };

  return (
    <main
      id="main-content"
      data-reduced-motion={reducedMotion}
      className="flex h-dvh min-h-dvh flex-col overflow-hidden bg-background text-text-primary"
    >
      <div aria-hidden={showTour} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Top Workstation Header */}
        <VisualizerHeader
          algorithm={algorithm}
          showInspector={showInspector}
          setShowInspector={setShowInspector}
          isPracticeMode={isPracticeMode}
          setIsPracticeMode={setIsPracticeMode}
          isBookmarked={isBookmarked}
          handleToggleBookmark={handleToggleBookmark}
          isSaving={isSaving}
          handleSaveSession={handleSaveSession}
          handleShare={handleShare}
        />

        {/* Toast Notification */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              aria-live="polite"
              className="fixed right-4 top-16 z-70 flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-xs font-bold text-text-primary shadow-elevated backdrop-blur-md"
            >
              <span>{statusMessage}</span>
              {statusMessage.toLowerCase().includes("log in") && (
                <Link
                  href={`/login?next=${encodeURIComponent(pathname)}`}
                  className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
                >
                  Log in
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Workspace Split */}
        <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-hidden">
          {/* Left Column: Canvas, Legend, Input Controls, and Playback Footer */}
          <div className="flex min-w-0 w-full flex-1 flex-col h-full min-h-0 lg:w-0 lg:flex-1">
            <VisualizerCanvasShell
              canvasRegionRef={canvasRegionRef}
              controls={controls}
              legend={legend}
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              handleFullscreen={handleFullscreen}
              showPracticePrompt={showPracticePrompt}
              practiceOptions={practiceOptions}
              practiceAnswer={practiceAnswer}
              practiceSelected={practiceSelected}
              setPracticeSelected={setPracticeSelected}
              practiceFeedback={practiceFeedback}
              handlePracticeSubmit={handlePracticeSubmit}
              handlePracticeSkip={handlePracticeSkip}
            >
              {children}
            </VisualizerCanvasShell>

            <VisualizerControlDock
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              currentStepTitle={currentStep?.title}
              onOpenInspector={() => setShowInspector(true)}
            />
          </div>

          {/* Right Column: Dual-Split Inspector Panels (Pseudocode/Code & Explanation/Log) */}
          <VisualizerMobileDrawer
            showInspector={showInspector}
            setShowInspector={setShowInspector}
            algorithm={algorithm}
            codeExamples={codeExamples}
            codeLineMapping={codeLineMapping}
            activeRightTab={activeRightTab}
            setActiveRightTab={setActiveRightTab}
            activeLowerTab={activeLowerTab}
            setActiveLowerTab={setActiveLowerTab}
            setActiveLanguage={setActiveLanguage}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
          />

          {!isMobile && (
            <aside className="lg:flex h-full flex-col border-l border-border bg-surface-hover/40 lg:w-104 shrink-0">
              <InspectorPanel
                activeRightTab={activeRightTab}
                setActiveRightTab={setActiveRightTab}
                activeLowerTab={activeLowerTab}
                setActiveLowerTab={setActiveLowerTab}
                setActiveLanguage={setActiveLanguage}
                algorithm={algorithm}
                codeExamples={codeExamples}
                codeLineMapping={codeLineMapping}
              />
            </aside>
          )}
        </div>
      </div>

      {/* Onboarding Tour Modal */}
      <VisualizerTourModal
        showTour={showTour}
        closeTour={closeTour}
        tourModalRef={tourModalRef}
        algorithmName={algorithm.name}
        tourSteps={tourSteps}
        tourStep={tourStep}
        prevTourStep={prevTourStep}
        nextTourStep={nextTourStep}
        goToTourStep={goToTourStep}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal showShortcuts={showShortcuts} closeShortcuts={closeShortcuts} />
    </main>
  );
}
