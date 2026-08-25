import {
  MathOperation,
  OperationMastery,
  SessionSummary,
  UserMentalMathStats,
} from "../core/types";

const STORAGE_KEY = "algo_flow_mental_math_stats_v1";

const INITIAL_MASTERY: Record<MathOperation, OperationMastery> = {
  addition: {
    operation: "addition",
    level: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    accuracy: 0,
    averageSpeedMs: 0,
    byDigitComplexity: {
      "1-digit": { accuracy: 0, total: 0 },
      "2-digit": { accuracy: 0, total: 0 },
      "3-digit": { accuracy: 0, total: 0 },
      "4-digit": { accuracy: 0, total: 0 },
    },
  },
  subtraction: {
    operation: "subtraction",
    level: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    accuracy: 0,
    averageSpeedMs: 0,
    byDigitComplexity: {
      "1-digit": { accuracy: 0, total: 0 },
      "2-digit": { accuracy: 0, total: 0 },
      "3-digit": { accuracy: 0, total: 0 },
      "4-digit": { accuracy: 0, total: 0 },
    },
  },
  multiplication: {
    operation: "multiplication",
    level: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    accuracy: 0,
    averageSpeedMs: 0,
    byDigitComplexity: {
      "1-digit": { accuracy: 0, total: 0 },
      "2-digit": { accuracy: 0, total: 0 },
      "3-digit": { accuracy: 0, total: 0 },
      "4-digit": { accuracy: 0, total: 0 },
    },
  },
  division: {
    operation: "division",
    level: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    accuracy: 0,
    averageSpeedMs: 0,
    byDigitComplexity: {
      "1-digit": { accuracy: 0, total: 0 },
      "2-digit": { accuracy: 0, total: 0 },
      "3-digit": { accuracy: 0, total: 0 },
      "4-digit": { accuracy: 0, total: 0 },
    },
  },
  percentages: {
    operation: "percentages",
    level: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    accuracy: 0,
    averageSpeedMs: 0,
    byDigitComplexity: {
      "1-digit": { accuracy: 0, total: 0 },
      "2-digit": { accuracy: 0, total: 0 },
      "3-digit": { accuracy: 0, total: 0 },
      "4-digit": { accuracy: 0, total: 0 },
    },
  },
  squares: {
    operation: "squares",
    level: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    accuracy: 0,
    averageSpeedMs: 0,
    byDigitComplexity: {
      "1-digit": { accuracy: 0, total: 0 },
      "2-digit": { accuracy: 0, total: 0 },
      "3-digit": { accuracy: 0, total: 0 },
      "4-digit": { accuracy: 0, total: 0 },
    },
  },
  roots: {
    operation: "roots",
    level: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    accuracy: 0,
    averageSpeedMs: 0,
    byDigitComplexity: {
      "1-digit": { accuracy: 0, total: 0 },
      "2-digit": { accuracy: 0, total: 0 },
      "3-digit": { accuracy: 0, total: 0 },
      "4-digit": { accuracy: 0, total: 0 },
    },
  },
  mixed: {
    operation: "mixed",
    level: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    accuracy: 0,
    averageSpeedMs: 0,
    byDigitComplexity: {
      "1-digit": { accuracy: 0, total: 0 },
      "2-digit": { accuracy: 0, total: 0 },
      "3-digit": { accuracy: 0, total: 0 },
      "4-digit": { accuracy: 0, total: 0 },
    },
  },
};

const INITIAL_STATS: UserMentalMathStats = {
  totalSessionsCompleted: 0,
  totalQuestionsSolved: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  currentStreakDays: 0,
  maxStreakDays: 0,
  lastPlayedDate: null,
  personalBests: {
    highestScore: 0,
    highestCombo: 0,
    fastestSpeedQPM: 0,
    bestAccuracyPercentage: 0,
    bestDailyScore: 0,
  },
  operationMastery: INITIAL_MASTERY,
  identifiedWeaknesses: [],
  recentSessions: [],
};

export function getLocalMentalMathStats(): UserMentalMathStats {
  if (typeof window === "undefined") return INITIAL_STATS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATS,
      ...parsed,
      operationMastery: {
        ...INITIAL_MASTERY,
        ...(parsed.operationMastery ?? {}),
      },
    };
  } catch {
    return INITIAL_STATS;
  }
}

export function saveLocalSessionSummary(summary: SessionSummary): UserMentalMathStats {
  if (typeof window === "undefined") return INITIAL_STATS;

  const current = getLocalMentalMathStats();
  const today = new Date().toISOString().split("T")[0];

  // Update streak
  let currentStreak = current.currentStreakDays;
  if (current.lastPlayedDate !== today) {
    if (current.lastPlayedDate) {
      const lastDate = new Date(current.lastPlayedDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
  }

  const maxStreak = Math.max(current.maxStreakDays, currentStreak);

  // Update personal bests
  const pbs = { ...current.personalBests };
  pbs.highestScore = Math.max(pbs.highestScore, summary.finalScore);
  pbs.highestCombo = Math.max(pbs.highestCombo, summary.maxComboStreak);
  pbs.fastestSpeedQPM = Math.max(pbs.fastestSpeedQPM, summary.questionsPerMinute);
  pbs.bestAccuracyPercentage = Math.max(pbs.bestAccuracyPercentage, summary.accuracyPercentage);
  if (summary.isDailyChallenge) {
    pbs.bestDailyScore = Math.max(pbs.bestDailyScore, summary.finalScore);
  }

  // Update operation mastery
  const op = summary.operation;
  const existingOpMastery = current.operationMastery[op] ?? INITIAL_MASTERY[op];
  const newAttempts = existingOpMastery.totalAttempts + summary.totalQuestions;
  const newCorrect = existingOpMastery.totalCorrect + summary.correctCount;
  const newAccuracy = newAttempts > 0 ? Math.round((newCorrect / newAttempts) * 100) : 0;

  // Level increases based on successful solves and accuracy
  const levelDelta = Math.round(
    (summary.correctCount * (summary.accuracyPercentage / 100)) /
      (summary.difficulty === "hard" ? 2 : 4)
  );
  const newLevel = Math.min(
    100,
    Math.max(existingOpMastery.level, existingOpMastery.level + levelDelta)
  );

  const updatedOpMastery: OperationMastery = {
    ...existingOpMastery,
    level: newLevel,
    totalAttempts: newAttempts,
    totalCorrect: newCorrect,
    accuracy: newAccuracy,
  };

  const updatedMasteryMap = {
    ...current.operationMastery,
    [op]: updatedOpMastery,
  };

  // Weaknesses
  const recentSessions = [summary, ...current.recentSessions.slice(0, 19)];

  const updatedStats: UserMentalMathStats = {
    totalSessionsCompleted: current.totalSessionsCompleted + 1,
    totalQuestionsSolved: current.totalQuestionsSolved + summary.totalQuestions,
    totalCorrect: current.totalCorrect + summary.correctCount,
    overallAccuracy: Math.round(
      ((current.totalCorrect + summary.correctCount) /
        Math.max(1, current.totalQuestionsSolved + summary.totalQuestions)) *
        100
    ),
    currentStreakDays: currentStreak,
    maxStreakDays: maxStreak,
    lastPlayedDate: today,
    personalBests: pbs,
    operationMastery: updatedMasteryMap,
    identifiedWeaknesses:
      summary.incorrectCount > 0
        ? [
            {
              id: `weakness_${summary.operation}`,
              operation: summary.operation,
              digitComplexity: `${summary.difficulty} level`,
              errorRate: Math.round((summary.incorrectCount / summary.totalQuestions) * 100),
              sampleProblem: `${summary.operation} calculation`,
              suggestedAction: `Practice ${summary.operation} at ${summary.difficulty} difficulty.`,
              detectedAt: new Date().toISOString(),
            },
          ]
        : current.identifiedWeaknesses,
    recentSessions,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
  } catch {
    // ignore storage quota error
  }

  return updatedStats;
}
