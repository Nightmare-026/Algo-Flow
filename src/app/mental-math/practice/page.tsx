"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMentalMathStore } from "@/features/mental-math/engine/session-store";
import { CalculationDisplay } from "@/features/mental-math/components/CalculationDisplay";
import { AnswerPad } from "@/features/mental-math/components/AnswerPad";
import { SessionHUD } from "@/features/mental-math/components/SessionHUD";
import { CountdownOverlay } from "@/features/mental-math/components/CountdownOverlay";
import { SessionResults } from "@/features/mental-math/components/SessionResults";
import { ConfigModal } from "@/features/mental-math/components/ConfigModal";
import { saveLocalSessionSummary } from "@/features/mental-math/storage/local-store";
import { recordMentalMathSession } from "@/features/mental-math/api/actions";
import { MathOperation, SessionConfig } from "@/features/mental-math/core/types";

export default function PracticeGamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const targetOp = (searchParams.get("operation") as MathOperation) || "addition";
  const isWeakness = searchParams.get("mode") === "weakness";
  const shouldAutoStart = searchParams.get("autostart") === "true";

  const {
    status,
    config,
    questions,
    currentIndex,
    currentInput,
    selectedOptionIndex,
    score,
    combo,
    lastAnswerFeedback,
    summary,
    startSession,
    setInput,
    selectOption,
    submitCurrentAnswer,
    pauseSession,
    resumeSession,
    abortSession,
    completeCountdown,
    toggleHintsMode,
  } = useMentalMathStore();

  const [showConfig, setShowConfig] = useState(false);

  // Auto-start or mode reset on mount / param change
  useEffect(() => {
    if (shouldAutoStart) {
      const initialConfig: SessionConfig = {
        mode: isWeakness ? "weakness" : "practice",
        operation: targetOp,
        difficulty: isWeakness ? "medium" : "easy",
        digitCountLeft: targetOp === "squares" || targetOp === "roots" ? 2 : 2,
        digitCountRight: targetOp === "multiplication" ? 1 : 2,
        questionCount: 10,
        hintsEnabled: false,
        soundEnabled: true,
      };
      startSession(initialConfig);
    } else if (status === "completed" && config.mode !== "practice" && config.mode !== "weakness") {
      abortSession();
    }
  }, [targetOp, isWeakness, shouldAutoStart, startSession, abortSession, config.mode, status]);

  // Persist session results on completion
  useEffect(() => {
    if (
      status === "completed" &&
      summary &&
      (summary.mode === "practice" || summary.mode === "weakness")
    ) {
      saveLocalSessionSummary(summary);
      startTransition(async () => {
        await recordMentalMathSession(summary);
      });
    }
  }, [status, summary]);

  const currentQ = questions[currentIndex];

  if (
    status === "completed" &&
    summary &&
    (summary.mode === "practice" || summary.mode === "weakness")
  ) {
    return (
      <div className="flex w-full flex-col px-4 max-w-4xl mx-auto">
        <SessionResults
          summary={summary}
          onRestart={() => startSession(config)}
          onDrillWeakness={() => {
            startSession({
              ...config,
              mode: "weakness",
              difficulty: "medium",
            });
          }}
        />
      </div>
    );
  }

  // Show Drill Setup Studio if status is idle or user explicitly opened config
  if (status === "idle" || showConfig) {
    return (
      <div className="flex w-full flex-col px-4 max-w-3xl mx-auto pb-12">
        <ConfigModal
          initialConfig={{
            ...config,
            operation: targetOp || config.operation,
          }}
          onStart={(newConfig) => {
            setShowConfig(false);
            startSession(newConfig);
          }}
          onCancel={
            status !== "idle"
              ? () => {
                  setShowConfig(false);
                }
              : undefined
          }
          title={status === "idle" ? "Customize Your Practice Drill" : "Adjust Drill Settings"}
          subtitle="Choose your target operation, digit complexity, and session pacing."
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col px-4 max-w-3xl mx-auto gap-4">
      {status === "countdown" && <CountdownOverlay onComplete={completeCountdown} />}

      <SessionHUD
        mode={config.mode}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        score={score}
        combo={combo}
        timeRemainingSeconds={config.timeLimitSeconds ? undefined : null}
        isPaused={status === "paused"}
        onPauseToggle={() => (status === "paused" ? resumeSession() : pauseSession())}
        onOpenConfig={() => {
          pauseSession();
          setShowConfig(true);
        }}
        onAbort={() => {
          abortSession();
          router.push("/mental-math");
        }}
      />

      {status === "paused" ? (
        <div className="neu-float flex flex-col items-center justify-center p-10 sm:p-12 rounded-3xl border border-border text-center my-6 shadow-xl">
          <h2 className="text-2xl font-bold font-display text-text-primary">Session Paused</h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 mb-6">
            Take a breath. Your score and progress are saved.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfig(true)}
              className="py-3 px-6 rounded-2xl border border-border bg-surface text-text-primary text-xs font-bold font-display shadow-[var(--shadow-raised-sm)] hover:bg-surface-hover active:scale-95 transition-all cursor-pointer"
            >
              Change Drill
            </button>
            <button
              onClick={resumeSession}
              className="py-3 px-8 rounded-2xl bg-primary text-white text-xs font-bold font-display shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
            >
              Resume Practice
            </button>
          </div>
        </div>
      ) : currentQ ? (
        <div className="flex flex-col items-center w-full">
          <CalculationDisplay
            question={currentQ}
            userAnswer={
              config.hintsEnabled
                ? selectedOptionIndex !== null
                  ? String(currentQ.options[selectedOptionIndex])
                  : undefined
                : currentInput
            }
            isAnswered={status === "feedback"}
            isCorrect={lastAnswerFeedback?.isCorrect}
          />

          <AnswerPad
            hintsEnabled={config.hintsEnabled}
            options={currentQ.options}
            selectedOptionIndex={selectedOptionIndex}
            currentInput={currentInput}
            isAnswered={status === "feedback"}
            correctAnswer={lastAnswerFeedback?.correctAnswer}
            onInputChange={setInput}
            onOptionSelect={selectOption}
            onSubmit={submitCurrentAnswer}
            onToggleHints={toggleHintsMode}
          />
        </div>
      ) : null}
    </div>
  );
}
