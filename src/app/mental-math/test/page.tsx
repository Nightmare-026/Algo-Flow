"use client";

import React, { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMentalMathStore } from "@/features/mental-math/engine/session-store";
import { CalculationDisplay } from "@/features/mental-math/components/CalculationDisplay";
import { AnswerPad } from "@/features/mental-math/components/AnswerPad";
import { SessionHUD } from "@/features/mental-math/components/SessionHUD";
import { CountdownOverlay } from "@/features/mental-math/components/CountdownOverlay";
import { SessionResults } from "@/features/mental-math/components/SessionResults";
import { saveLocalSessionSummary } from "@/features/mental-math/storage/local-store";
import { recordMentalMathSession } from "@/features/mental-math/api/actions";
import { SessionConfig } from "@/features/mental-math/core/types";

export default function TimedTestPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const {
    status,
    config,
    questions,
    currentIndex,
    currentInput,
    selectedOptionIndex,
    score,
    combo,
    timeRemainingSeconds,
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
    tickTimer,
    toggleHintsMode,
  } = useMentalMathStore();

  // Initialize standardized 20-question test on mount or when coming from another mode
  useEffect(() => {
    if (status === "idle" || config.mode !== "test") {
      const testConfig: SessionConfig = {
        mode: "test",
        operation: "multiplication",
        difficulty: "medium",
        digitCountLeft: 2,
        digitCountRight: 1,
        questionCount: 20,
        timeLimitSeconds: 180, // 3 minutes for 20 questions
        hintsEnabled: false,
        soundEnabled: true,
      };
      startSession(testConfig);
    }
  }, [status, config.mode, startSession]);

  // Interval for countdown timer
  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => {
      tickTimer(200);
    }, 200);
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  // Persist session on completion
  useEffect(() => {
    if (status === "completed" && summary && summary.mode === "test") {
      saveLocalSessionSummary(summary);
      startTransition(async () => {
        await recordMentalMathSession(summary);
      });
    }
  }, [status, summary]);

  const currentQ = questions[currentIndex];

  if (status === "completed" && summary && summary.mode === "test") {
    return (
      <div className="flex w-full flex-col px-4 max-w-4xl mx-auto">
        <SessionResults summary={summary} onRestart={() => startSession(config)} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:gap-4">
      {status === "countdown" && <CountdownOverlay onComplete={completeCountdown} />}

      <SessionHUD
        mode={config.mode}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        score={score}
        combo={combo}
        timeRemainingSeconds={timeRemainingSeconds}
        isPaused={status === "paused"}
        onPauseToggle={() => (status === "paused" ? resumeSession() : pauseSession())}
        onAbort={() => {
          abortSession();
          router.push("/mental-math");
        }}
      />

      {status === "paused" ? (
        <div className="neu-float flex flex-col items-center justify-center p-10 sm:p-12 rounded-3xl border border-border text-center my-6 shadow-xl max-w-xl mx-auto w-full">
          <h2 className="text-2xl font-bold font-display text-text-primary">Assessment Paused</h2>
          <p className="text-xs text-text-secondary mt-1 mb-6">
            Timer is frozen. Resume whenever you are ready.
          </p>
          <button
            onClick={resumeSession}
            className="py-3 px-8 rounded-2xl bg-primary text-white text-xs font-bold font-display shadow-(--shadow-raised-sm) hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            Resume Assessment
          </button>
        </div>
      ) : currentQ ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-6 items-stretch w-full">
          <div className="lg:col-span-7 flex flex-col">
            <CalculationDisplay
              question={currentQ}
              userAnswer={currentInput}
              isAnswered={status === "feedback"}
              isCorrect={lastAnswerFeedback?.isCorrect}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col">
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
        </div>
      ) : null}
    </div>
  );
}
