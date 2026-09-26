import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStreak } from "@/features/streak/api";
import { getCompletedAlgorithms } from "@/features/progress/api";
import { getBookmarks, getBookmarkedAlgorithmItems } from "@/features/bookmarks/api";
import { getActivityTimeline, type Activity as ActivityRecord } from "@/lib/api/activity";
import {
  getDailyChallenge,
  isChallengeCompleted,
  isMentalMathDailyCompleted,
} from "@/lib/api/challenges";
import { getUserUnifiedXP } from "@/lib/api/xp";
import { algorithms } from "@/data/seed/algorithms";
import { getMentalMathUserStats } from "@/features/mental-math/api/actions";
import { Flame, Play, Star, ListChecks, BrainCircuit, Workflow, Code2, Hash } from "lucide-react";
import type { Metadata } from "next";
import {
  DashboardHeaderAnimation,
  DashboardStatCardsAnimation,
} from "@/components/dashboard/DashboardAnimations";
import { AccountSecurityCard } from "@/components/dashboard/AccountSecurityCard";
import { AccountSessionCard } from "@/components/dashboard/AccountSessionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { StudyTrackCard } from "@/components/dashboard/StudyTrackCard";
import { DailyDualQuestCard } from "@/components/dashboard/DailyDualQuestCard";
import { MentalMathRadar } from "@/components/dashboard/MentalMathRadar";
import { BookmarksSection } from "@/components/dashboard/BookmarksSection";
import { computeCategoryProgress } from "@/components/dashboard/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your learning progress, saved algorithm sessions, streaks, and bookmarks.",
};

const MOCK_DATE_1 = "2026-09-15T21:00:00.000Z";
const MOCK_DATE_2 = "2026-09-15T19:30:00.000Z";
const MOCK_DATE_3 = "2026-09-14T14:00:00.000Z";
const MOCK_TODAY = "2026-09-16";
const MOCK_USER_CREATED = "2026-09-01T00:00:00.000Z";

export default async function DashboardPage() {
  const isDev = process.env.NODE_ENV === "development";
  const isDevMockAuth = isDev && process.env.DEV_MOCK_AUTH === "true";

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const mockUser = isDevMockAuth
    ? {
        id: "dev-mock-user-id",
        email: "developer@algoflow.local",
        app_metadata: { provider: "dev", providers: ["google", "dev"] },
        user_metadata: { full_name: "Local Developer" },
        aud: "authenticated",
        created_at: MOCK_USER_CREATED,
        role: "authenticated",
      }
    : null;

  const user = authUser || mockUser;

  if (!user) {
    redirect("/login");
  }

  const isMockSession = user.id === "dev-mock-user-id";

  // Single roundtrip dashboard summary via RPC (PERF-001) with graceful fallback
  let streak: {
    current_streak: number;
    max_streak: number;
    last_activity_date: string | null;
  } | null = null;
  let profile: {
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
  } | null = null;
  let completedIds: string[] = [];
  let bookmarkIds: string[] = [];
  let activities: ActivityRecord[] = [];
  let dailyChallenge: Awaited<ReturnType<typeof getDailyChallenge>> = null;
  let mentalMathStats: Awaited<ReturnType<typeof getMentalMathUserStats>> = null;
  let challengeCompleted = false;
  let mathChallengeCompleted = false;

  if (isMockSession) {
    streak = {
      current_streak: 5,
      max_streak: 12,
      last_activity_date: MOCK_DATE_1,
    };
    profile = { username: "Local Developer" };
    completedIds = [
      "alg_arr_access",
      "alg_stack_peek",
      "alg_stack_array_impl",
      "alg_stack_is_empty",
    ];
    bookmarkIds = ["alg_arr_access", "alg_stack_peek"];
    activities = [
      {
        id: "act-dev-1",
        domain: "dsa",
        algorithm_id: "alg_stack_peek",
        action_type: "completed",
        created_at: MOCK_DATE_1,
      },
      {
        id: "act-dev-2",
        domain: "mental_math",
        algorithm_id: "mental_math_multiplication",
        action_type: "math_session_completed",
        created_at: MOCK_DATE_2,
        metadata: { score: 1420, accuracy: 95, operation: "multiplication" },
      },
      {
        id: "act-dev-3",
        domain: "dsa",
        algorithm_id: "alg_arr_access",
        action_type: "quiz_completed",
        created_at: MOCK_DATE_3,
      },
    ];
    dailyChallenge = await getDailyChallenge();
    mentalMathStats = {
      totalQuestionsSolved: 184,
      totalSessionsCompleted: 22,
      totalCorrect: 175,
      overallAccuracy: 95,
      currentStreakDays: 5,
      maxStreakDays: 12,
      lastPlayedDate: MOCK_TODAY,
      personalBests: {
        highestScore: 1420,
        highestCombo: 12,
        fastestSpeedQPM: 42,
        bestAccuracyPercentage: 98,
        bestDailyScore: 1200,
      },
      operationMastery: {} as Record<
        import("@/features/mental-math/core/types").MathOperation,
        import("@/features/mental-math/core/types").OperationMastery
      >,
      identifiedWeaknesses: [],
      recentSessions: [],
    };
  } else {
    // Attempt single-roundtrip RPC for dashboard summary
    const [summaryRpc, dailyChallengeResult, mentalMathResult] = await Promise.allSettled([
      supabase.rpc("get_user_dashboard_summary", { p_user_id: user.id }),
      getDailyChallenge(),
      getMentalMathUserStats(),
    ]);

    dailyChallenge =
      dailyChallengeResult.status === "fulfilled" ? dailyChallengeResult.value : null;
    mentalMathStats = mentalMathResult.status === "fulfilled" ? mentalMathResult.value : null;

    type DashboardSummaryData = {
      profile?: {
        username?: string | null;
        full_name?: string | null;
        avatar_url?: string | null;
      } | null;
      streak?: {
        current_streak: number;
        max_streak: number;
        last_activity_date: string | null;
      } | null;
      completedAlgorithmIds?: string[];
      bookmarkAlgorithmIds?: string[];
      recentActivities?: ActivityRecord[];
      dailyChallengeCompleted?: boolean;
      mentalMathDailyCompleted?: boolean;
    };

    const summaryData: DashboardSummaryData | null =
      summaryRpc.status === "fulfilled" && !summaryRpc.value.error
        ? (summaryRpc.value.data as unknown as DashboardSummaryData)
        : null;

    if (summaryData) {
      streak = summaryData.streak ?? null;
      profile = summaryData.profile ?? null;
      completedIds = Array.isArray(summaryData.completedAlgorithmIds)
        ? summaryData.completedAlgorithmIds
        : [];
      bookmarkIds = Array.isArray(summaryData.bookmarkAlgorithmIds)
        ? summaryData.bookmarkAlgorithmIds
        : [];
      activities = Array.isArray(summaryData.recentActivities) ? summaryData.recentActivities : [];
      challengeCompleted = Boolean(summaryData.dailyChallengeCompleted);
      mathChallengeCompleted = Boolean(summaryData.mentalMathDailyCompleted);
    } else {
      // Graceful fallback to individual queries if RPC is not yet migrated
      const [streakResult, profileResult, completedResult, bookmarksResult, activitiesResult] =
        await Promise.allSettled([
          getStreak(),
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          getCompletedAlgorithms(),
          getBookmarks(),
          getActivityTimeline(10),
        ]);

      streak = streakResult.status === "fulfilled" ? streakResult.value : null;
      profile = profileResult.status === "fulfilled" ? profileResult.value.data : null;
      completedIds = completedResult.status === "fulfilled" ? completedResult.value : [];
      bookmarkIds = bookmarksResult.status === "fulfilled" ? bookmarksResult.value : [];
      activities = activitiesResult.status === "fulfilled" ? activitiesResult.value : [];

      if (dailyChallenge) {
        try {
          challengeCompleted = await isChallengeCompleted(dailyChallenge.algorithm_id);
        } catch {
          challengeCompleted = false;
        }
      }

      try {
        mathChallengeCompleted = await isMentalMathDailyCompleted();
      } catch {
        mathChallengeCompleted = false;
      }
    }
  }

  // Daily Quests Verification
  const challengeAlgorithm = dailyChallenge
    ? (algorithms.find((a) => a.id === dailyChallenge.algorithm_id) ?? null)
    : null;

  // Authentic Unified Experience (XP) & Level
  const unifiedXP = await getUserUnifiedXP(
    user.id,
    completedIds.length,
    0,
    mentalMathStats?.totalQuestionsSolved ?? 0
  );

  // Bookmarked Algorithm Details
  const bookmarkedItems = isMockSession
    ? [
        {
          id: "alg_arr_access",
          slug: "access",
          name: "Access Element",
          difficulty: "easy",
          shortDescription: "Directly access an element at a specific index.",
          dataStructureId: "ds_array",
        },
        {
          id: "alg_stack_peek",
          slug: "peek",
          name: "Peek / Top",
          difficulty: "easy",
          shortDescription: "Inspect the top element of the stack without removing it.",
          dataStructureId: "ds_stack",
        },
      ]
    : await getBookmarkedAlgorithmItems(bookmarkIds);

  // Category Progress
  const {
    totalAlgorithms,
    completedCount,
    progressPercent,
    linearProgress,
    nonLinearProgress,
    hashProgress,
  } = computeCategoryProgress(algorithms, completedIds, unifiedXP.totalXP);

  // Next recommended algorithm
  const completedSet = new Set(completedIds);
  const nextAlgorithm = algorithms.find((a) => a.isPublished && !completedSet.has(a.id));

  // Study tracks dynamic counts
  const treeAlgos = algorithms.filter((a) => a.dataStructureId === "ds_tree" && a.isPublished);
  const treeCompleted = completedIds.filter((id) => treeAlgos.some((a) => a.id === id)).length;

  const arrayAlgos = algorithms.filter((a) => a.dataStructureId === "ds_array" && a.isPublished);
  const arrayCompleted = completedIds.filter((id) => arrayAlgos.some((a) => a.id === id)).length;

  const graphAlgos = algorithms.filter((a) => a.dataStructureId === "ds_graph" && a.isPublished);
  const graphCompleted = completedIds.filter((id) => graphAlgos.some((a) => a.id === id)).length;

  const hashAlgos = algorithms.filter(
    (a) =>
      (a.dataStructureId === "ds_hash_table" || a.dataStructureId === "ds_hash_set") &&
      a.isPublished
  );
  const hashCompleted = completedIds.filter((id) => hashAlgos.some((a) => a.id === id)).length;

  return (
    <div className="flex w-full flex-col px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-8">
        {/* Local Dev Mode Isolation Notice */}
        {isMockSession && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary-muted/20 px-4 py-3 text-xs text-primary shadow-card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-white text-xs font-bold shrink-0">
                🛠️
              </span>
              <span>
                <strong>Local Dev Mode Active:</strong> Logged in with local mock profile (
                <code>developer@algoflow.local</code>). Zero risk to production.
              </span>
            </div>
            <span className="font-mono text-[11px] font-semibold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-sm w-fit">
              DEV_MOCK_AUTH=true
            </span>
          </div>
        )}

        {/* Welcome Header Bar */}
        <DashboardHeaderAnimation>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-text-primary tracking-tight">
              Welcome back, {(profile?.username as string) || "Learner"}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Your unified computational mastery command center. Track algorithm traces, habit
              streaks, and calculation fluency.
            </p>
          </div>

          {/* Unified Platform Streak Pill */}
          <div className="flex items-center gap-3.5 bg-surface-secondary px-5 py-3 rounded-lg border border-border shadow-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-warning-muted text-warning border border-warning/30">
              <Flame className="h-5 w-5 fill-current" />
            </span>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
                Platform Streak
              </p>
              <p className="text-lg font-extrabold font-display text-text-primary">
                {streak?.current_streak || 0}{" "}
                <span className="text-xs font-normal text-text-secondary">Days</span>
              </p>
            </div>
          </div>
        </DashboardHeaderAnimation>

        {/* 4 Harmonized Quick Stat Cards */}
        <DashboardStatCardsAnimation>
          <StatCard
            title="Experience"
            value={unifiedXP.totalXP.toLocaleString()}
            subtitle={`Level ${unifiedXP.level} • Authentic XP`}
            icon={<Star className="w-4 h-4 fill-current" />}
            variant="primary"
          />
          <StatCard
            title="Max Streak"
            value={streak?.max_streak || 0}
            subtitle="Best consistent learning habit"
            icon={<Flame className="w-4 h-4 fill-current" />}
            variant="warning"
          />
          <StatCard
            title="DSA Mastered"
            value={
              <>
                {completedCount}
                <span className="text-lg font-normal text-text-muted">/{totalAlgorithms}</span>
              </>
            }
            progress={progressPercent}
            icon={<ListChecks className="w-4 h-4" />}
            variant="primary"
          />
          <StatCard
            title="Calculation Cadence"
            value={
              mentalMathStats?.personalBests?.fastestSpeedQPM
                ? `${mentalMathStats.personalBests.fastestSpeedQPM} QPM`
                : "—"
            }
            subtitle={`${mentalMathStats?.totalQuestionsSolved || 0} solved (${mentalMathStats?.overallAccuracy || 0}% acc)`}
            icon={<BrainCircuit className="w-4 h-4" />}
            variant="secondary"
          />
        </DashboardStatCardsAnimation>

        {/* Bento Grid: 2/3 Left Column vs 1/3 Right Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* 1. Daily Dual-Quest Card */}
            <DailyDualQuestCard
              dsaAlgorithm={challengeAlgorithm}
              dsaCompleted={challengeCompleted}
              mathCompleted={mathChallengeCompleted}
            />

            {/* 2. Category Mastery Breakdown */}
            <section className="p-6 sm:p-8 rounded-lg border border-border bg-surface shadow-card flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-display text-text-primary">
                    Category Syllabus Mastery
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Structural curriculum progress across all data structure branches.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                  {progressPercent}% Catalog Complete
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Linear */}
                <div className="p-4 rounded-md border border-border bg-surface-secondary/70 shadow-xs flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-text-secondary">Linear Collections</span>
                    <span className="font-mono text-primary">{linearProgress}%</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded-full overflow-hidden border border-border/40">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${linearProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    Arrays, Lists, Stacks, Queues
                  </span>
                </div>

                {/* Non-Linear */}
                <div className="p-4 rounded-md border border-border bg-surface-secondary/70 shadow-xs flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-text-secondary">Hierarchical &amp; Graphs</span>
                    <span className="font-mono text-secondary">{nonLinearProgress}%</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded-full overflow-hidden border border-border/40">
                    <div
                      className="bg-secondary h-full rounded-full transition-all duration-500"
                      style={{ width: `${nonLinearProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    Trees, BST, Heaps, Graphs
                  </span>
                </div>

                {/* Hash-Based */}
                <div className="p-4 rounded-md border border-border bg-surface-secondary/70 shadow-xs flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-text-secondary">Hash Mappings</span>
                    <span className="font-mono text-accent">{hashProgress}%</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded-full overflow-hidden border border-border/40">
                    <div
                      className="bg-accent h-full rounded-full transition-all duration-500"
                      style={{ width: `${hashProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    Hash Tables, Sets, Lookups
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Recent Learning Activity Timeline */}
            <section className="p-6 sm:p-8 rounded-lg border border-border bg-surface shadow-card flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-display text-text-primary">
                    Unified Learning Activity
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Chronological audit ledger of your algorithm simulations, quizzes, and mental
                    math sprints.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-text-muted bg-surface-secondary px-2.5 py-1 rounded-full border border-border">
                  {activities.length} Recorded
                </span>
              </div>

              {activities.length > 0 ? (
                <div className="flex flex-col gap-1.5 pt-1">
                  {activities.slice(0, 7).map((act) => (
                    <ActivityItem key={act.id} activity={act} algorithms={algorithms} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-border bg-surface-secondary/50 text-center shadow-xs">
                  <ListChecks className="w-8 h-8 text-text-muted mb-2 stroke-[1.5]" />
                  <p className="text-xs font-bold text-text-primary">No recorded sessions yet</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Open any visualizer or launch a mental math practice sprint to begin your
                    learning trail.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right 1 Column */}
          <div className="flex flex-col gap-6">
            {/* 1. Arithmetic Fluency Radar Widget */}
            <MentalMathRadar stats={mentalMathStats} />

            {/* 2. Up Next in Syllabus */}
            <section className="p-6 rounded-lg border border-border bg-surface shadow-card flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                  Continue Learning
                </span>
                <h2 className="text-base font-bold font-display text-text-primary mt-0.5">
                  Next in Syllabus Queue
                </h2>
                <p className="text-xs text-text-secondary mt-1 mb-4">
                  Recommended next topic based on catalog sequence.
                </p>

                {nextAlgorithm ? (
                  <div className="p-4 rounded-md border border-border bg-surface-secondary/70 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs bg-primary/10 text-primary">
                        {nextAlgorithm.difficulty || "Recommended"}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">
                        {nextAlgorithm.timeComplexityAverage || "O(n)"}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold font-display text-text-primary mt-1">
                      {nextAlgorithm.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                      {nextAlgorithm.shortDescription}
                    </p>
                    <Link
                      href={`/visualizer/${nextAlgorithm.slug}`}
                      className="mt-4 w-full min-h-10 bg-primary text-white text-xs font-bold font-display rounded-sm flex items-center justify-center gap-2 shadow-card hover:bg-primary-hover active:scale-[0.99] transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Launch Visualizer
                    </Link>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-success text-center py-6">
                    🎉 You have completed all visualizers in the catalog!
                  </div>
                )}
              </div>
            </section>

            {/* 3. Bookmarked Visualizers Section */}
            <BookmarksSection bookmarks={bookmarkedItems} />
          </div>
        </div>

        {/* Curated Study Tracks Section */}
        <section className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-display text-text-primary">
                Curated Study Tracks
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Structured learning paths with live syllabus completion tracking.
              </p>
            </div>
            <Link href="/visualizers" className="text-xs font-bold text-primary hover:underline">
              Browse All Data Structures →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StudyTrackCard
              href="/visualizers/tree"
              icon={<Workflow className="w-5 h-5" />}
              tag="Trees"
              title="Tree Traversals &amp; Heaps"
              description="Understand DFS, BFS, pre-order, and min/max heap invariant mutations step by step."
              completed={treeCompleted}
              total={treeAlgos.length}
            />
            <StudyTrackCard
              href="/visualizers/array"
              icon={<Code2 className="w-5 h-5" />}
              tag="Arrays"
              title="Linear Arrays &amp; Sorting"
              description="Master contiguous memory indexing, two-pointer scanning, and search algorithms."
              completed={arrayCompleted}
              total={arrayAlgos.length}
            />
            <StudyTrackCard
              href="/visualizers/graph"
              icon={<BrainCircuit className="w-5 h-5" />}
              tag="Graphs"
              title="Shortest Path &amp; Networks"
              description="Trace Dijkstra, Bellman-Ford, Kruskal, and Prim algorithms across weighted graphs."
              completed={graphCompleted}
              total={graphAlgos.length}
            />
            <StudyTrackCard
              href="/visualizers/hash-table"
              icon={<Hash className="w-5 h-5" />}
              tag="Hashing"
              title="Hash Tables &amp; Sets"
              description="Explore collision resolution, open addressing, chaining, and O(1) amortized search."
              completed={hashCompleted}
              total={hashAlgos.length}
            />
          </div>
        </section>

        {/* Account Security & Session Controls (50/50 Equal Width Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <AccountSecurityCard
            email={user.email}
            providers={(user.app_metadata?.providers as string[]) || ["google"]}
          />
          <AccountSessionCard
            email={user.email}
            providers={(user.app_metadata?.providers as string[]) || ["google"]}
          />
        </div>
      </div>
    </div>
  );
}
