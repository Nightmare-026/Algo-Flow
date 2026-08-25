export type MathOperation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "percentages"
  | "squares"
  | "roots"
  | "mixed";

export type DifficultyTier = "easy" | "medium" | "hard" | "expert" | "master";

export type GameMode = "practice" | "test" | "speed" | "daily" | "weakness";

export type DisplayLayout = "inline" | "vertical";

export interface ExpressionNode {
  operands: number[];
  operators: MathOperation[];
  targetAnswer: number;
  formattedInline: string;
  displayLayout: DisplayLayout;
  metadata: {
    carriesCount: number;
    borrowsCount: number;
    estimatedMentalEffort: number;
    complexityScore: number;
    calculatedTier: DifficultyTier;
  };
}

export interface QuestionSignature {
  canonicalId: string;
  operation: MathOperation;
  operandsNormalized: number[];
}

export interface MentalMathQuestion {
  id: string;
  signature: QuestionSignature;
  expression: ExpressionNode;
  correctAnswer: number;
  distractors: number[]; // exactly 3 plausible distractors when hints enabled
  options: number[]; // 4 randomized options (1 correct + 3 distractors)
  explanation?: string;
  targetSolveTimeMs: number;
  createdAt: number;
}

export interface DistractorErrorProfile {
  errorType:
    | "carry_error"
    | "borrow_error"
    | "digit_swap"
    | "neighbor_offset"
    | "operator_confusion"
    | "place_value_shift"
    | "quotient_mistake";
  value: number;
  reason: string;
}

export interface GeneratorConfig {
  operation: MathOperation;
  difficulty: DifficultyTier;
  digitCountLeft: number;
  digitCountRight: number;
  minRange?: number;
  maxRange?: number;
  allowNegativeResult?: boolean;
  questionCount: number;
  hintsEnabled: boolean;
  maxOperandReuse?: number; // default: 3
  seed?: string | number;
  deterministic?: boolean;
  generatorVersion?: string;
}

export interface AnswerEvent {
  questionId: string;
  questionSignature: string;
  formattedExpression?: string;
  userAnswer: number | null;
  correctAnswer?: number;
  explanation?: string;
  isCorrect: boolean;
  solveTimeMs: number;
  hintUsed: boolean;
  attemptsCount: number;
  timestamp: number;
}

export interface SessionConfig {
  mode: GameMode;
  operation: MathOperation;
  difficulty: DifficultyTier;
  digitCountLeft: number;
  digitCountRight: number;
  questionCount: number;
  timeLimitSeconds?: number;
  hintsEnabled: boolean;
  soundEnabled: boolean;
  seed?: string;
  isWeaknessDrill?: boolean;
  targetWeaknessId?: string;
}

export interface ScoreBreakdown {
  basePoints: number;
  difficultyMultiplier: number;
  speedBonus: number;
  comboBonus: number;
  accuracyBonus: number;
  hintPenalty: number;
  totalQuestionScore: number;
}

export interface SessionSummary {
  sessionId: string;
  userId?: string;
  mode: GameMode;
  operation: MathOperation;
  difficulty: DifficultyTier;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
  totalTimeMs: number;
  averageSolveTimeMs: number;
  fastestSolveTimeMs: number;
  slowestSolveTimeMs: number;
  questionsPerMinute: number;
  finalScore: number;
  maxComboStreak: number;
  hintsUsedCount: number;
  scoreVersion: string;
  generatorVersion: string;
  isDailyChallenge: boolean;
  dailyChallengeDate?: string;
  completedAt: string;
  answers: AnswerEvent[];
}

export interface OperationMastery {
  operation: MathOperation;
  level: number; // 1..100
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  averageSpeedMs: number;
  byDigitComplexity: {
    "1-digit": { accuracy: number; total: number };
    "2-digit": { accuracy: number; total: number };
    "3-digit": { accuracy: number; total: number };
    "4-digit": { accuracy: number; total: number };
  };
}

export interface UserMentalMathStats {
  totalSessionsCompleted: number;
  totalQuestionsSolved: number;
  totalCorrect: number;
  overallAccuracy: number;
  currentStreakDays: number;
  maxStreakDays: number;
  lastPlayedDate: string | null;
  personalBests: {
    highestScore: number;
    highestCombo: number;
    fastestSpeedQPM: number;
    bestAccuracyPercentage: number;
    bestDailyScore: number;
  };
  operationMastery: Record<MathOperation, OperationMastery>;
  identifiedWeaknesses: WeaknessPattern[];
  recentSessions: SessionSummary[];
}

export interface WeaknessPattern {
  id: string;
  operation: MathOperation;
  digitComplexity: string;
  errorRate: number;
  sampleProblem: string;
  suggestedAction: string;
  detectedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  score: number;
  accuracy: number;
  speedQPM: number;
  mode: GameMode;
  operation: MathOperation;
  difficulty: DifficultyTier;
  date: string;
  rank: number;
  isCurrentUser?: boolean;
}
