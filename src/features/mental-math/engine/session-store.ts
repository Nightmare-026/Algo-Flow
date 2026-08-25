import { create } from "zustand";
import { AnswerEvent, MentalMathQuestion, SessionConfig, SessionSummary } from "../core/types";
import { GENERATOR_VERSION, generateSessionQuestions } from "../core/generator";
import { calculateQuestionScore, calculateFinalSessionScore, SCORE_VERSION } from "./scoring";
import { soundEngine } from "./sound";
import { normalizeUserAnswer } from "../core/normalizer";

export type SessionStatus = "idle" | "countdown" | "active" | "feedback" | "paused" | "completed";

export interface SessionState {
  status: SessionStatus;
  config: SessionConfig;
  questions: MentalMathQuestion[];
  currentIndex: number;
  currentInput: string;
  selectedOptionIndex: number | null;
  questionStartTime: number;
  sessionStartTime: number;
  timeRemainingSeconds: number | null;
  combo: number;
  maxCombo: number;
  score: number;
  questionScores: number[];
  answers: AnswerEvent[];
  lastAnswerFeedback: {
    isCorrect: boolean;
    correctAnswer: number;
    explanation?: string;
  } | null;
  summary: SessionSummary | null;

  // Actions
  toggleHintsMode: () => void;
  startSession: (config: SessionConfig) => void;
  setInput: (input: string) => void;
  selectOption: (index: number) => void;
  submitCurrentAnswer: (overrideValue?: number) => void;
  nextQuestion: () => void;
  retryQuestion: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  abortSession: () => void;
  tickTimer: (deltaMs: number) => void;
  completeCountdown: () => void;
}

const DEFAULT_CONFIG: SessionConfig = {
  mode: "practice",
  operation: "addition",
  difficulty: "easy",
  digitCountLeft: 2,
  digitCountRight: 2,
  questionCount: 10,
  hintsEnabled: false,
  soundEnabled: true,
};

export const useMentalMathStore = create<SessionState>((set, get) => ({
  status: "idle",
  config: DEFAULT_CONFIG,
  questions: [],
  currentIndex: 0,
  currentInput: "",
  selectedOptionIndex: null,
  questionStartTime: 0,
  sessionStartTime: 0,
  timeRemainingSeconds: null,
  combo: 0,
  maxCombo: 0,
  score: 0,
  questionScores: [],
  answers: [],
  lastAnswerFeedback: null,
  summary: null,

  toggleHintsMode: () => {
    const state = get();
    set({
      config: {
        ...state.config,
        hintsEnabled: !state.config.hintsEnabled,
      },
    });
  },

  startSession: (config: SessionConfig) => {
    // Generate questions according to configuration
    const isDeterministic = config.mode === "daily";
    const questions = generateSessionQuestions({
      operation: config.operation,
      difficulty: config.difficulty,
      digitCountLeft: config.digitCountLeft,
      digitCountRight: config.digitCountRight,
      questionCount: config.questionCount,
      hintsEnabled: config.hintsEnabled,
      deterministic: isDeterministic,
      seed: config.seed,
    });

    const initialTimer = config.timeLimitSeconds ?? (config.mode === "speed" ? 60 : null);

    set({
      status: "countdown",
      config,
      questions,
      currentIndex: 0,
      currentInput: "",
      selectedOptionIndex: null,
      questionStartTime: 0,
      sessionStartTime: Date.now(),
      timeRemainingSeconds: initialTimer,
      combo: 0,
      maxCombo: 0,
      score: 0,
      questionScores: [],
      answers: [],
      lastAnswerFeedback: null,
      summary: null,
    });
  },

  completeCountdown: () => {
    const now = Date.now();
    soundEngine.playCountdownTick(true);
    set({
      status: "active",
      questionStartTime: now,
      sessionStartTime: now,
    });
  },

  setInput: (input: string) => {
    set({ currentInput: input });
  },

  selectOption: (index: number) => {
    const state = get();
    if (state.status !== "active") return;
    const currentQ = state.questions[state.currentIndex];
    if (!currentQ) return;

    set({ selectedOptionIndex: index });
    const selectedAnswer = currentQ.options[index];
    get().submitCurrentAnswer(selectedAnswer);
  },

  submitCurrentAnswer: (overrideValue?: number) => {
    const state = get();
    if (state.status !== "active") return;

    const currentQ = state.questions[state.currentIndex];
    if (!currentQ) return;

    let userNum: number | null = null;
    if (overrideValue !== undefined) {
      userNum = overrideValue;
    } else {
      const parsed = normalizeUserAnswer(state.currentInput);
      if (!parsed.isValid) return; // ignore invalid enter
      userNum = parsed.value;
    }

    const now = Date.now();
    const solveTimeMs = Math.max(100, now - state.questionStartTime);
    const isCorrect = userNum === currentQ.correctAnswer;
    const hintUsed = state.config.hintsEnabled || state.selectedOptionIndex !== null;

    const newCombo = isCorrect ? state.combo + 1 : 0;
    const newMaxCombo = Math.max(state.maxCombo, newCombo);

    if (isCorrect) {
      if (newCombo >= 3) {
        soundEngine.playCombo(newCombo);
      } else {
        soundEngine.playCorrect();
      }
    } else {
      soundEngine.playIncorrect();
    }

    const scoreDetails = calculateQuestionScore({
      isCorrect,
      difficulty: state.config.difficulty,
      solveTimeMs,
      targetSolveTimeMs: currentQ.targetSolveTimeMs,
      currentCombo: state.combo,
      hintUsed,
    });

    const newQuestionScores = [...state.questionScores, scoreDetails.totalQuestionScore];
    const newScore = state.score + scoreDetails.totalQuestionScore;

    const answerEvent: AnswerEvent = {
      questionId: currentQ.id,
      questionSignature: currentQ.signature.canonicalId,
      formattedExpression: currentQ.expression.formattedInline.replace(" = ?", ""),
      userAnswer: userNum,
      correctAnswer: currentQ.correctAnswer,
      explanation: currentQ.explanation,
      isCorrect,
      solveTimeMs,
      hintUsed,
      attemptsCount: 1,
      timestamp: now,
    };

    const newAnswers = [...state.answers, answerEvent];

    // In Speed mode: immediate rapid advance
    if (state.config.mode === "speed") {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.questions.length && (state.timeRemainingSeconds ?? 1) > 0) {
        set({
          currentIndex: nextIndex,
          currentInput: "",
          selectedOptionIndex: null,
          questionStartTime: now,
          combo: newCombo,
          maxCombo: newMaxCombo,
          score: newScore,
          questionScores: newQuestionScores,
          answers: newAnswers,
        });
      } else {
        get().nextQuestion();
      }
      return;
    }

    // Set feedback state for visual cue
    set({
      status: "feedback",
      combo: newCombo,
      maxCombo: newMaxCombo,
      score: newScore,
      questionScores: newQuestionScores,
      answers: newAnswers,
      lastAnswerFeedback: {
        isCorrect,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
      },
    });

    // Automatically advance in all modes (200ms on correct, 400ms on error)
    const delay = isCorrect ? 200 : 400;
    setTimeout(() => {
      if (get().status === "feedback") {
        get().nextQuestion();
      }
    }, delay);
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentIndex + 1;

    if (nextIndex >= state.questions.length) {
      // Session Complete!
      soundEngine.playFinish();
      const totalTimeMs = Date.now() - state.sessionStartTime;
      const correctCount = state.answers.filter((a) => a.isCorrect).length;
      const incorrectCount = state.answers.length - correctCount;
      const accuracyPercentage =
        state.answers.length > 0 ? Math.round((correctCount / state.answers.length) * 100) : 0;

      const solveTimes = state.answers.map((a) => a.solveTimeMs);
      const avgTime =
        solveTimes.length > 0
          ? Math.round(solveTimes.reduce((a, b) => a + b, 0) / solveTimes.length)
          : 0;
      const fastest = solveTimes.length > 0 ? Math.min(...solveTimes) : 0;
      const slowest = solveTimes.length > 0 ? Math.max(...solveTimes) : 0;
      const totalMinutes = Math.max(0.1, totalTimeMs / 60000);
      const questionsPerMinute = Number((state.answers.length / totalMinutes).toFixed(1));

      const finalNormalizedScore = calculateFinalSessionScore(
        state.questionScores,
        accuracyPercentage
      );

      const summary: SessionSummary = {
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        mode: state.config.mode,
        operation: state.config.operation,
        difficulty: state.config.difficulty,
        totalQuestions: state.questions.length,
        correctCount,
        incorrectCount,
        accuracyPercentage,
        totalTimeMs,
        averageSolveTimeMs: avgTime,
        fastestSolveTimeMs: fastest,
        slowestSolveTimeMs: slowest,
        questionsPerMinute,
        finalScore: finalNormalizedScore,
        maxComboStreak: state.maxCombo,
        hintsUsedCount: state.answers.filter((a) => a.hintUsed).length,
        scoreVersion: SCORE_VERSION,
        generatorVersion: GENERATOR_VERSION,
        isDailyChallenge: state.config.mode === "daily",
        dailyChallengeDate:
          state.config.mode === "daily" ? new Date().toISOString().split("T")[0] : undefined,
        completedAt: new Date().toISOString(),
        answers: state.answers,
      };

      set({
        status: "completed",
        summary,
      });
      return;
    }

    const now = Date.now();
    set({
      status: "active",
      currentIndex: nextIndex,
      currentInput: "",
      selectedOptionIndex: null,
      questionStartTime: now,
      lastAnswerFeedback: null,
    });
  },

  retryQuestion: () => {
    const now = Date.now();
    set({
      status: "active",
      currentInput: "",
      selectedOptionIndex: null,
      questionStartTime: now,
      lastAnswerFeedback: null,
    });
  },

  pauseSession: () => {
    if (get().status === "active" || get().status === "feedback") {
      set({ status: "paused" });
    }
  },

  resumeSession: () => {
    if (get().status === "paused") {
      set({
        status: "active",
        questionStartTime: Date.now(),
      });
    }
  },

  abortSession: () => {
    set({
      status: "idle",
      questions: [],
      currentIndex: 0,
      currentInput: "",
      selectedOptionIndex: null,
      summary: null,
    });
  },

  tickTimer: (deltaMs: number) => {
    const state = get();
    if (state.status !== "active") return;
    if (state.timeRemainingSeconds === null) return;

    const newRemaining = Math.max(0, state.timeRemainingSeconds - deltaMs / 1000);
    if (newRemaining <= 0) {
      // Time is up!
      soundEngine.playCountdownTick(true);
      get().nextQuestion();
    } else {
      set({ timeRemainingSeconds: Number(newRemaining.toFixed(1)) });
    }
  },
}));
