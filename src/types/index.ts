/* ================================================================
   ALGO FLOW — Core Type Definitions
   ================================================================ */

// ----------------------------------------------------------------
// Visual Step — The fundamental unit of algorithm visualization
// ----------------------------------------------------------------
export type ActionType =
  | "initialize"
  | "read"
  | "success"
  | "compare"
  | "swap"
  | "visit"
  | "insert"
  | "delete"
  | "shift"
  | "move-pointer"
  | "highlight"
  | "found"
  | "not-found"
  | "error"
  | "complete"
  | "merge"
  | "split"
  | "rotate"
  | "enqueue"
  | "dequeue"
  | "push"
  | "pop"
  | "hash"
  | "collision"
  | "probe"
  | "link"
  | "unlink"
  | "set-pointer"
  | "overflow"
  | "underflow"
  | "build"
  | "update"
  | "access"
  | "recurse"
  | "return";

export type StepPhase = "idle" | "transitioning" | "committed" | "playing" | "paused";

export type ComparisonOperator = ">" | ">=" | "<" | "<=" | "===" | "!==";

export interface StepPredicate {
  operator: ComparisonOperator;
  left: number | string;
  right: number | string;
  result: boolean;
}

export interface VisualStepHighlights {
  current?: string[];
  compared?: string[];
  swapped?: string[];
  sorted?: string[];
  visited?: string[];
  target?: string[];
  error?: string[];
  found?: string[];
  inserted?: string[];
  deleted?: string[];
  pointer?: string[];
  path?: string[];
  active?: string[];
  success?: string[];
}

export interface VisualStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  operation: string;
  actionType: ActionType;
  dataState: unknown;
  beforeState?: unknown;
  afterState?: unknown;
  predicate?: StepPredicate;
  output?: unknown;
  highlights: VisualStepHighlights;
  variables?: Record<string, string | number | boolean | null>;
  pseudocodeLine?: number;
  codeLine?: number;
  pseudocodeLineIds?: string[];
  codeLineIds?: Partial<Record<CodeLanguage, string[]>>;
  complexityNote?: string;
}

// ----------------------------------------------------------------
// Data Structure & Algorithm Models
// ----------------------------------------------------------------
export type DifficultyLevel = "easy" | "medium" | "hard";
export type PriorityLevel = "P0" | "P1" | "P2" | "P3";
export type CodeLanguage = "cpp" | "java" | "python" | "javascript" | "typescript";

export type DSCategory = "linear" | "non-linear" | "hash-based";

export interface DataStructure {
  id: string;
  name: string;
  slug: string;
  category: DSCategory;
  description: string;
  difficulty: DifficultyLevel;
  displayOrder: number;
  isPublished: boolean;
  icon?: string;
}

export interface Operation {
  id: string;
  dataStructureId: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface Algorithm {
  id: string;
  operationId: string;
  dataStructureId: string;
  name: string;
  slug: string;
  difficulty: DifficultyLevel;
  timeComplexityBest: string;
  timeComplexityAverage: string;
  timeComplexityWorst: string;
  spaceComplexity: string;
  shortDescription: string;
  longDescription: string;
  prerequisites: string[];
  tags: string[];
  visualizerType: string;
  priority: PriorityLevel;
  isPublished: boolean;
  pseudocode?: string;
}

export interface CodeExample {
  id: string;
  algorithmId: string;
  language: CodeLanguage;
  code: string;
  explanation: string;
  isPrimary: boolean;
}

export interface AlgorithmStep {
  id: string;
  algorithmId: string;
  stepNumber: number;
  title: string;
  explanation: string;
  visualAction: Record<string, unknown>;
  pseudocodeLine?: number;
  codeLine?: number;
}

// ----------------------------------------------------------------
// Playback State
// ----------------------------------------------------------------
export type PlaybackSpeed =
  "0.25x" | "0.5x" | "0.75x" | "1x" | "2x" | "slow" | "normal" | "fast" | "custom";

export interface PlaybackState {
  steps: VisualStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  committedStepId: string | null;
  phase: StepPhase;
  speed: PlaybackSpeed;
  customSpeedMs: number;
  isComplete: boolean;
  totalSteps: number;
}

// ----------------------------------------------------------------
// User & Auth Types
// ----------------------------------------------------------------
export type UserRole = "student" | "admin";

export type ThemePreference = "light" | "dark" | "dark-neon" | "light-edu" | "system";

export interface UserProfile {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  userId: string;
  preferredLanguage: string;
  preferredCodeLanguage: CodeLanguage;
  theme: ThemePreference;
  animationSpeed: PlaybackSpeed;
  reducedMotion: boolean;
  difficultyLevel: DifficultyLevel;
  defaultVisualizerMode: string;
}

// ----------------------------------------------------------------
// Progress & Streak
// ----------------------------------------------------------------
export type ProgressStatus = "not_started" | "in_progress" | "completed" | "needs_revision";

export interface UserProgress {
  id: string;
  userId: string;
  algorithmId: string;
  status: ProgressStatus;
  completionPercentage: number;
  timeSpentSeconds: number;
  practiceAccuracy: number | null;
  lastPracticedAt: string | null;
  completedAt: string | null;
}

export interface UserStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  dailyGoalCompleted: boolean;
}

// ----------------------------------------------------------------
// Bookmarks & Sessions
// ----------------------------------------------------------------
export type BookmarkType = "algorithm" | "step" | "code" | "session";

export interface Bookmark {
  id: string;
  userId: string;
  bookmarkType: BookmarkType;
  dataStructureId: string | null;
  operationId: string | null;
  algorithmId: string;
  stepNumber: number | null;
  title: string;
  description: string | null;
  serializedState: Record<string, unknown> | null;
  createdAt: string;
}

export interface SavedVisualizerSession {
  id: string;
  userId: string;
  algorithmId: string;
  title: string | null;
  inputData: Record<string, unknown>;
  currentStep: number;
  visualState: Record<string, unknown> | null;
  speed: PlaybackSpeed;
  codeLanguage: CodeLanguage;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------
// Quiz Types
// ----------------------------------------------------------------
export interface Quiz {
  id: string;
  algorithmId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: DifficultyLevel;
  isPublished: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  algorithmId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  score: number;
  timeTakenSeconds: number;
  attemptedAt: string;
}

// ----------------------------------------------------------------
// Navigation & UI
// ----------------------------------------------------------------
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}
