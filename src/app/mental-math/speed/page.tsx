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

export default function SpeedSprintPage() {
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

  // Initialize 60s speed sprint on mount or when coming from another mode
  useEffect(() => {
    if (status === "idle" || config.mode !== "speed") {
      const speedConfig: SessionConfig = {
        mode: "speed",
        operation: "addition",
        difficulty: "easy",
        digitCountLeft: 2,
        digitCountRight: 1,
        questionCount: 40,
        timeLimitSeconds: 60, // 60-second limit
        hintsEnabled: true, // 4 choices for ultra fast clicking or direct typing
        soundEnabled: true,
      };
      startSession(speedConfig);
    }
  }, [status, config.mode, startSession]);

  // Interval for 60s countdown timer
  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => {
      tickTimer(200);
    }, 200);
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  // Persist session on completion
  useEffect(() => {
    if (status === "completed" && summary && summary.mode === "speed") {
      saveLocalSessionSummary(summary);
      startTransition(async () => {
        await recordMentalMathSession(summary);
      });
    }
  }, [status, summary]);

  const currentQ = questions[currentIndex];

  if (status === "completed" && summary && summary.mode === "speed") {
    return (
      <div className="flex w-full flex-col px-4 max-w-4xl mx-auto">
        <SessionResults summary={summary} onRestart={() => startSession(config)} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col px-4 max-w-3xl mx-auto gap-4">
      {status === "countdown" && <CountdownOverlay onComplete={completeCountdown} />}

      <SessionHUD
        mode="speed"
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

      {currentQ ? (
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
            isAnswered={false}
          />

          <AnswerPad
            hintsEnabled={config.hintsEnabled}
            options={currentQ.options}
            selectedOptionIndex={selectedOptionIndex}
            currentInput={currentInput}
            isAnswered={status === "feedback"}
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
