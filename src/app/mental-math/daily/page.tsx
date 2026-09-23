"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight } from "lucide-react";
import { useMentalMathStore } from "@/features/mental-math/engine/session-store";
import { CalculationDisplay } from "@/features/mental-math/components/CalculationDisplay";
import { AnswerPad } from "@/features/mental-math/components/AnswerPad";
import { SessionHUD } from "@/features/mental-math/components/SessionHUD";
import { CountdownOverlay } from "@/features/mental-math/components/CountdownOverlay";
import { SessionResults } from "@/features/mental-math/components/SessionResults";
import { saveLocalSessionSummary } from "@/features/mental-math/storage/local-store";
import { submitDailyChallenge, getMentalMathLeaderboard } from "@/features/mental-math/api/actions";
import { LeaderboardEntry, MathOperation, SessionConfig } from "@/features/mental-math/core/types";

export default function DailyChallengePage() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const submittedRef = useRef(false);

  const [{ todayStr, formattedDate, todayOperation }] = useState(() => {
    const now = new Date();
    const str = now.toISOString().split("T")[0];
    const formatted = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const dailyOperations: MathOperation[] = [
      "multiplication",
      "addition",
      "division",
      "subtraction",
    ];
    const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) % 4;
    return {
      todayStr: str,
      formattedDate: formatted,
      todayOperation: dailyOperations[dayIndex],
    };
  });

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

  // Load leaderboard on mount
  useEffect(() => {
    let isMounted = true;
    getMentalMathLeaderboard("daily", todayStr).then((data) => {
      if (isMounted) setLeaderboard(data);
    });
    return () => {
      isMounted = false;
    };
  }, [todayStr]);

  const handleStartDaily = () => {
    submittedRef.current = false;
    const dailyConfig: SessionConfig = {
      mode: "daily",
      operation: todayOperation,
      difficulty: "medium",
      digitCountLeft: 2,
      digitCountRight: todayOperation === "multiplication" ? 1 : 2,
      questionCount: 10,
      hintsEnabled: false,
      soundEnabled: true,
      seed: `algo-flow-daily-${todayStr}`,
    };
    startSession(dailyConfig);
  };

  // Reset store if left in completed state from another mode
  useEffect(() => {
    if (status === "completed" && config.mode !== "daily") {
      abortSession();
    }
  }, [status, config.mode, abortSession]);

  // Persist session on completion
  useEffect(() => {
    if (status === "completed" && summary && summary.mode === "daily" && !submittedRef.current) {
      submittedRef.current = true;
      saveLocalSessionSummary(summary);
      startTransition(async () => {
        await submitDailyChallenge(summary);
        const updated = await getMentalMathLeaderboard("daily", todayStr);
        setLeaderboard(updated);
      });
    }
  }, [status, summary, todayStr]);

  const currentQ = questions[currentIndex];

  if (status === "completed" && summary && summary.mode === "daily") {
    return (
      <div className="flex w-full flex-col px-4 max-w-4xl mx-auto gap-8">
        <SessionResults summary={summary} onRestart={handleStartDaily} />

        {/* Daily Leaderboard Snapshot */}
        <section className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold font-display text-text-primary">
              Today&apos;s Global Leaderboard
            </h2>
            <Link
              href="/mental-math/leaderboard"
              className="text-xs font-bold text-primary hover:underline"
            >
              View Full Standings →
            </Link>
          </div>

          {leaderboard.length > 0 ? (
            <div className="divide-y divide-border/60">
              {leaderboard.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-inset border border-border font-mono font-bold text-primary">
                      #{entry.rank}
                    </span>
                    <span className="font-bold text-text-primary">{entry.displayName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-right font-mono">
                    <span className="font-extrabold text-primary">{entry.score} PTS</span>
                    <span className="text-text-muted">{entry.accuracy}% acc</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neu-inset p-6 rounded-2xl border border-border text-center text-xs text-text-muted shadow-inner">
              No daily challenge runs recorded yet today. Complete the challenge to claim rank #1!
            </div>
          )}
        </section>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="flex w-full flex-col px-4 max-w-3xl mx-auto gap-6">
        <div className="neu-float rounded-3xl p-6 sm:p-10 border border-border text-center flex flex-col items-center shadow-(--shadow-raised)">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-inset text-primary border border-border shadow-inner mb-3">
            <Trophy className="w-8 h-8" />
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary mt-1 tracking-tight">
            Daily Mental Math Challenge
          </h1>

          <p className="text-xs font-mono font-bold text-text-muted mt-1">{formattedDate}</p>

          <p className="text-xs sm:text-sm text-text-secondary max-w-lg mt-3 leading-relaxed">
            10 deterministic calculation problems. Same seed for everyone worldwide. Accuracy and
            speed determine your global rank.
          </p>

          <button
            onClick={handleStartDaily}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-xs font-bold font-display text-white shadow-(--shadow-raised-sm) hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Today&apos;s Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Standings */}
        <div className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-4 shadow-(--shadow-raised-sm)">
          <h2 className="text-lg font-bold font-display text-text-primary tracking-tight">
            Today&apos;s Top Solvers
          </h2>
          {leaderboard.length > 0 ? (
            <div className="divide-y divide-border/60">
              {leaderboard.map((entry) => (
                <div
                  key={entry.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-inset border border-border font-mono font-bold text-primary">
                      #{entry.rank}
                    </span>
                    <span className="font-bold text-text-primary">{entry.displayName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-right font-mono">
                    <span className="font-extrabold text-primary">{entry.score} PTS</span>
                    <span className="text-text-muted">{entry.accuracy}% acc</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neu-inset p-8 rounded-2xl border border-border text-center flex flex-col items-center justify-center gap-2 shadow-inner">
              <Trophy className="w-8 h-8 text-primary/60 mb-1" />
              <p className="text-sm font-bold font-display text-text-primary">
                No global runs recorded yet today
              </p>
              <p className="text-xs text-text-secondary max-w-sm">
                Be the first learner worldwide to complete today&apos;s seeded arithmetic challenge
                and claim rank #1!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:gap-4">
      {status === "countdown" && <CountdownOverlay onComplete={completeCountdown} />}

      <SessionHUD
        mode="daily"
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        score={score}
        combo={combo}
        isPaused={status === "paused"}
        onPauseToggle={() => (status === "paused" ? resumeSession() : pauseSession())}
        onAbort={() => {
          abortSession();
          router.push("/mental-math");
        }}
      />

      {currentQ ? (
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
