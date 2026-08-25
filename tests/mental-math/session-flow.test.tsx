import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CalculationDisplay } from "@/features/mental-math/components/CalculationDisplay";
import { AnswerPad } from "@/features/mental-math/components/AnswerPad";
import { SessionHUD } from "@/features/mental-math/components/SessionHUD";
import { FeedbackOverlay } from "@/features/mental-math/components/FeedbackOverlay";
import { MentalMathQuestion } from "@/features/mental-math/core/types";
import { useMentalMathStore } from "@/features/mental-math/engine/session-store";

describe("Mental Math Component Integration & Gameplay Flow", () => {
  const mockQuestion: MentalMathQuestion = {
    id: "q1",
    signature: {
      canonicalId: "addition:24:37",
      operation: "addition",
      operandsNormalized: [24, 37],
    },
    expression: {
      operands: [24, 37],
      operators: ["addition"],
      targetAnswer: 61,
      formattedInline: "24 + 37 = ?",
      displayLayout: "inline",
      metadata: {
        carriesCount: 1,
        borrowsCount: 0,
        estimatedMentalEffort: 3.5,
        complexityScore: 30,
        calculatedTier: "medium",
      },
    },
    correctAnswer: 61,
    distractors: [51, 71, 62],
    options: [61, 51, 71, 62],
    explanation: "24 + 37 = 61 (1 carry step)",
    targetSolveTimeMs: 4000,
    createdAt: 0,
  };

  it("should render CalculationDisplay inline arithmetic properly", () => {
    render(<CalculationDisplay question={mockQuestion} userAnswer="61" />);
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("37")).toBeInTheDocument();
    expect(screen.getByText("61")).toBeInTheDocument();
  });

  it("should render CalculationDisplay vertical layout properly", () => {
    const verticalQuestion: MentalMathQuestion = {
      ...mockQuestion,
      expression: {
        ...mockQuestion.expression,
        displayLayout: "vertical",
      },
    };
    render(<CalculationDisplay question={verticalQuestion} userAnswer="61" />);
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("37")).toBeInTheDocument();
    expect(screen.getByText("61")).toBeInTheDocument();
  });

  it("should render SessionHUD with active combo and progress", () => {
    const onPause = jest.fn();
    const onAbort = jest.fn();

    render(
      <SessionHUD
        mode="practice"
        currentIndex={3}
        totalQuestions={10}
        score={350}
        combo={4}
        isPaused={false}
        onPauseToggle={onPause}
        onAbort={onAbort}
      />
    );

    expect(screen.getByText("4x Combo")).toBeInTheDocument();
    expect(screen.getByText("350")).toBeInTheDocument();
    expect(screen.getByText("Practice Mode")).toBeInTheDocument();
  });

  it("should render AnswerPad with 4 choices when hints enabled", () => {
    const onSelect = jest.fn();
    render(
      <AnswerPad
        hintsEnabled={true}
        options={[61, 51, 71, 62]}
        selectedOptionIndex={null}
        currentInput=""
        isAnswered={false}
        onInputChange={jest.fn()}
        onOptionSelect={onSelect}
        onSubmit={jest.fn()}
      />
    );

    const optionBtn = screen.getByText("61");
    expect(optionBtn).toBeInTheDocument();
    fireEvent.click(optionBtn);
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("should render FeedbackOverlay and handle Next/Retry", () => {
    const onNext = jest.fn();
    const onRetry = jest.fn();

    render(
      <FeedbackOverlay
        isCorrect={false}
        correctAnswer={61}
        explanation="24 + 37 = 61 (1 carry step)"
        isPracticeMode={true}
        onNext={onNext}
        onRetry={onRetry}
      />
    );

    expect(screen.getByText("Not quite.")).toBeInTheDocument();
    expect(screen.getByText("61")).toBeInTheDocument();

    const retryBtn = screen.getByText("Retry Problem [R]");
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalled();

    const nextBtn = screen.getByText("Next Problem");
    fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalled();
  });

  it("should transition through complete session lifecycle in session-store", () => {
    const store = useMentalMathStore.getState();

    // 1. Start Session
    act(() => {
      store.startSession({
        mode: "practice",
        operation: "addition",
        difficulty: "easy",
        digitCountLeft: 2,
        digitCountRight: 2,
        questionCount: 2,
        hintsEnabled: false,
        soundEnabled: false,
      });
    });

    expect(useMentalMathStore.getState().status).toBe("countdown");
    expect(useMentalMathStore.getState().questions.length).toBe(2);

    // 2. Complete countdown
    act(() => {
      useMentalMathStore.getState().completeCountdown();
    });
    expect(useMentalMathStore.getState().status).toBe("active");

    // 3. Submit first answer
    const q1 = useMentalMathStore.getState().questions[0];
    act(() => {
      useMentalMathStore.getState().setInput(String(q1.correctAnswer));
      useMentalMathStore.getState().submitCurrentAnswer();
    });

    expect(useMentalMathStore.getState().status).toBe("feedback");
    expect(useMentalMathStore.getState().combo).toBe(1);
    expect(useMentalMathStore.getState().score).toBeGreaterThan(0);

    // 4. Next question
    act(() => {
      useMentalMathStore.getState().nextQuestion();
    });
    expect(useMentalMathStore.getState().status).toBe("active");
    expect(useMentalMathStore.getState().currentIndex).toBe(1);

    // 5. Submit second answer and finish
    const q2 = useMentalMathStore.getState().questions[1];
    act(() => {
      useMentalMathStore.getState().setInput(String(q2.correctAnswer));
      useMentalMathStore.getState().submitCurrentAnswer();
    });

    act(() => {
      useMentalMathStore.getState().nextQuestion();
    });

    // Final state: completed
    expect(useMentalMathStore.getState().status).toBe("completed");
    const summary = useMentalMathStore.getState().summary;
    expect(summary).not.toBeNull();
    expect(summary?.correctCount).toBe(2);
    expect(summary?.accuracyPercentage).toBe(100);
  });
});
