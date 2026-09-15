import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStreak, updateStreakOnActivity } from "@/features/streak/api";
import { getCompletedAlgorithms } from "@/features/progress/api";
import { getBookmarks } from "@/features/bookmarks/api";
import { getActivityTimeline } from "@/lib/api/activity";
import { getDailyChallenge, isChallengeCompleted } from "@/lib/api/challenges";
import { algorithms } from "@/data/seed/algorithms";
import { getMentalMathUserStats } from "@/features/mental-math/api/actions";
import {
  Flame,
  Play,
  Star,
  ListChecks,
  ChevronRight,
  BrainCircuit,
  Workflow,
  Code2,
  Trophy,
  Crown,
  Bookmark,
} from "lucide-react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import {
  DashboardHeaderAnimation,
  DashboardStatCardsAnimation,
} from "@/components/dashboard/DashboardAnimations";
import { AccountSecurityCard } from "@/components/dashboard/AccountSecurityCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { StudyTrackCard } from "@/components/dashboard/StudyTrackCard";
import { computeCategoryProgress } from "@/components/dashboard/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your learning progress, saved algorithm sessions, streaks, and bookmarks.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Parallelize dashboard queries
  const [
    streakResult,
    profileResult,
    completedResult,
    bookmarksResult,
    activitiesResult,
    dailyChallengeResult,
    mentalMathResult,
  ] = await Promise.allSettled([
    updateStreakOnActivity().then(() => getStreak()),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    getCompletedAlgorithms(),
    getBookmarks(),
    getActivityTimeline(10),
    getDailyChallenge(),
    getMentalMathUserStats(),
  ]);

  const streak = streakResult.status === "fulfilled" ? streakResult.value : null;
  const profile = profileResult.status === "fulfilled" ? profileResult.value.data : null;
  const completedIds = completedResult.status === "fulfilled" ? completedResult.value : [];
  const bookmarkIds = bookmarksResult.status === "fulfilled" ? bookmarksResult.value : [];
  const activities = activitiesResult.status === "fulfilled" ? activitiesResult.value : [];
  const dailyChallenge =
    dailyChallengeResult.status === "fulfilled" ? dailyChallengeResult.value : null;
  const mentalMathStats = mentalMathResult.status === "fulfilled" ? mentalMathResult.value : null;

  let challengeCompleted = false;
  let challengeAlgorithm = null;
  if (dailyChallenge) {
    try {
      challengeCompleted = await isChallengeCompleted(dailyChallenge.algorithm_id);
    } catch {
      // challenge check failed — treat as not completed
    }
    challengeAlgorithm = algorithms.find((a) => a.id === dailyChallenge.algorithm_id);
  }

  // Derive Progress
  const {
    totalAlgorithms,
    completedCount,
    progressPercent,
    totalXP,
    linearProgress,
    nonLinearProgress,
  } = computeCategoryProgress(algorithms, completedIds);

  // Next up logic
  const completedSet = new Set(completedIds);
  const nextAlgorithm = algorithms.find((a) => a.isPublished && !completedSet.has(a.id));

  return (
    <div className="flex w-full flex-col px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-8">
        {/* Welcome Header Bar */}
        <DashboardHeaderAnimation>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-text-primary tracking-tight">
              Welcome back, {(profile?.username as string) || "Learner"}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Track your computational mastery, study streaks, and bookmarked visualizers.
            </p>
          </div>

          <div className="flex items-center gap-3.5 bg-bg-surface-inset px-5 py-3 rounded-2xl border border-border shadow-[var(--shadow-inset)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-muted text-warning border border-warning/30">
              <Flame className="h-5 w-5 fill-current" />
            </span>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
                Active Streak
              </p>
              <p className="text-lg font-extrabold font-display text-text-primary">
                {streak?.current_streak || 0}{" "}
                <span className="text-xs font-normal text-text-secondary">Days</span>
              </p>
            </div>
          </div>
        </DashboardHeaderAnimation>

        {/* 4 Quick Stat Cards */}
        <DashboardStatCardsAnimation>
          <StatCard
            title="Experience"
            value={totalXP.toLocaleString()}
            subtitle="+150 XP per completed algorithm"
            icon={<Star className="w-4 h-4 fill-current" />}
            variant="primary"
          />
          <StatCard
            title="Max Streak"
            value={streak?.max_streak || 0}
            subtitle="Best consistent study streak"
            icon={<Flame className="w-4 h-4 fill-current" />}
            variant="warning"
          />
          <StatCard
            title="Mastered"
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
            title="Bookmarks"
            value={bookmarkIds.length}
            subtitle="Saved algorithms for quick study"
            icon={<Bookmark className="w-4 h-4 fill-current" />}
            variant="secondary"
          />
        </DashboardStatCardsAnimation>

        {/* Bento Grid: Daily Challenge, Activity Feed, and Category Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Daily Challenge Banner */}
            {challengeAlgorithm ? (
              <section
                className={cn(
                  "neu-float relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300",
                  challengeCompleted
                    ? "border-success/30 bg-success-muted/30"
                    : "border-border bg-surface"
                )}
              >
                <div className="relative z-10 flex flex-col items-start gap-4">
                  <span
                    className={cn(
                      "rounded-full px-3 py-0.5 text-xs font-bold font-mono uppercase tracking-wider shadow-[var(--shadow-raised-sm)]",
                      challengeCompleted
                        ? "bg-success text-white"
                        : "border border-primary/30 bg-primary-muted text-primary"
                    )}
                  >
                    {challengeCompleted ? "Challenge Completed" : "Daily Algorithm Challenge"}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold font-display text-text-primary mb-2">
                      {challengeAlgorithm.name}
                    </h2>
                    <p className="text-sm leading-relaxed text-text-secondary max-w-xl">
                      {challengeCompleted
                        ? "You have completed today's challenge. Re-test your knowledge anytime with the interactive quiz."
                        : challengeAlgorithm.shortDescription ||
                          "Trace this algorithm and complete the interactive simulation to build your streak."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Link
                      href={
                        challengeCompleted
                          ? `/quizzes/${challengeAlgorithm.id}`
                          : `/visualizer/${challengeAlgorithm.slug}`
                      }
                      className={cn(
                        "inline-flex min-h-10 items-center gap-2 rounded-xl px-5 text-xs font-bold shadow-[var(--shadow-raised-sm)] transition-all active:scale-95",
                        challengeCompleted
                          ? "border border-border bg-surface text-text-primary hover:bg-surface-hover"
                          : "bg-primary text-white hover:bg-primary-hover"
                      )}
                    >
                      {challengeCompleted ? "Review Quiz" : "Start Simulation"}
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </Link>
                    {!challengeCompleted && (
                      <span className="text-xs font-mono font-bold text-primary flex items-center gap-1 bg-primary-muted px-2.5 py-1 rounded-lg border border-primary/20">
                        <Star className="w-3.5 h-3.5 fill-current" /> +30 Bonus XP
                      </span>
                    )}
                  </div>
                </div>
              </section>
            ) : null}

            {/* Recent Activity Timeline */}
            <section className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-4">
              <h2 className="text-lg font-bold font-display text-text-primary">
                Recent Learning Activity
              </h2>
              {activities.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {activities.slice(0, 6).map((act) => (
                    <ActivityItem key={act.id} activity={act} algorithms={algorithms} />
                  ))}
                </div>
              ) : (
                <div className="neu-inset flex flex-col items-center justify-center p-8 rounded-2xl border border-border text-center">
                  <ListChecks className="w-8 h-8 text-text-muted mb-2" />
                  <p className="text-xs font-bold text-text-primary">No recorded sessions yet</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Open any visualizer and complete a simulation to build your learning trace.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Category Progress & Up Next */}
          <div className="flex flex-col gap-6">
            {/* Category Progress Bars */}
            <section className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-5">
              <h2 className="text-lg font-bold font-display text-text-primary">Category Mastery</h2>

              {/* Linear DS */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text-secondary">Linear (Arrays, Lists, Queues)</span>
                  <span className="font-mono text-text-primary">{linearProgress}%</span>
                </div>
                <div className="w-full bg-bg-surface-inset h-2.5 rounded-full overflow-hidden border border-border shadow-[var(--shadow-inset)]">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${linearProgress}%` }}
                  />
                </div>
              </div>

              {/* Non-Linear DS */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text-secondary">Non-Linear (Trees, Graphs)</span>
                  <span className="font-mono text-text-primary">{nonLinearProgress}%</span>
                </div>
                <div className="w-full bg-bg-surface-inset h-2.5 rounded-full overflow-hidden border border-border shadow-[var(--shadow-inset)]">
                  <div
                    className="bg-secondary h-full rounded-full transition-all duration-500"
                    style={{ width: `${nonLinearProgress}%` }}
                  />
                </div>
              </div>

              {/* Overall Mastery */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text-primary">Total Catalog Completion</span>
                  <span className="font-mono text-primary font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-bg-surface-inset h-3 rounded-full overflow-hidden border border-border shadow-[var(--shadow-inset)]">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Next Recommended Algorithm */}
            <section className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-lg font-bold font-display text-text-primary mb-1">
                  Continue Learning
                </h2>
                <p className="text-xs text-text-secondary mb-4">
                  Recommended algorithm based on your syllabus progress.
                </p>
                {nextAlgorithm ? (
                  <div className="neu-inset p-4 rounded-2xl border border-border">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                      Next in Queue
                    </span>
                    <h3 className="text-base font-bold font-display text-text-primary mt-1">
                      {nextAlgorithm.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {nextAlgorithm.shortDescription}
                    </p>
                    <Link
                      href={`/visualizer/${nextAlgorithm.slug}`}
                      className="mt-4 w-full min-h-10 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Launch Visualizer
                    </Link>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-success text-center py-6">
                    🎉 You have completed all visualizers!
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Mental Math Precision Training & Telemetry Card */}
        <section className="neu-float rounded-3xl p-6 sm:p-8 border border-primary/30 bg-primary-muted/15 flex flex-col gap-6 shadow-[var(--shadow-raised)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-sm">
                  <BrainCircuit className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                  Arithmetic Fluency & Mastery
                </span>
              </div>
              <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
                Mental Math Calculation Studio
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Train arithmetic calculation speed, eliminate scratchpad reliance, and track your
                carry/borrow precision alongside your algorithm visualizer milestones.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/mental-math/practice"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold font-display text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Practice Studio</span>
              </Link>
              <Link
                href="/mental-math/daily"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-xs font-bold font-display text-text-primary hover:text-primary hover:bg-surface-hover shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-warning" />
                <span>Daily Challenge</span>
              </Link>
              <Link
                href="/mental-math/leaderboard"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-bold font-display text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Leaderboard</span>
              </Link>
              <Link
                href="/mental-math/progress"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-bold font-display text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
              >
                <span>Diagnostics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Real Mental Math Telemetry KPI Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-primary/20">
            <div className="neu-inset p-3.5 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Calculations Solved
              </span>
              <div className="mt-2">
                <p className="text-xl font-extrabold font-display text-text-primary tabular-nums">
                  {mentalMathStats?.totalQuestionsSolved
                    ? mentalMathStats.totalQuestionsSolved.toLocaleString()
                    : 0}
                </p>
                <p className="text-[10px] font-mono text-text-muted mt-0.5">
                  {mentalMathStats?.totalSessionsCompleted
                    ? `${mentalMathStats.totalSessionsCompleted} sessions`
                    : "No sessions yet"}
                </p>
              </div>
            </div>

            <div className="neu-inset p-3.5 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Accuracy Precision
              </span>
              <div className="mt-2">
                <p className="text-xl font-extrabold font-display text-text-primary tabular-nums">
                  {mentalMathStats && mentalMathStats.totalQuestionsSolved > 0
                    ? `${mentalMathStats.overallAccuracy}%`
                    : "—"}
                </p>
                <p className="text-[10px] font-mono text-text-muted mt-0.5">Overall correctness</p>
              </div>
            </div>

            <div className="neu-inset p-3.5 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Fastest Cadence
              </span>
              <div className="mt-2">
                <p className="text-xl font-extrabold font-display text-text-primary tabular-nums">
                  {mentalMathStats?.personalBests?.fastestSpeedQPM
                    ? `${mentalMathStats.personalBests.fastestSpeedQPM} QPM`
                    : "—"}
                </p>
                <p className="text-[10px] font-mono text-text-muted mt-0.5">Questions / min</p>
              </div>
            </div>

            <div className="neu-inset p-3.5 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Calculation Streak
              </span>
              <div className="mt-2">
                <p className="text-xl font-extrabold font-display text-text-primary tabular-nums flex items-center gap-1">
                  <Flame className="w-4 h-4 text-warning fill-current" />
                  <span>{mentalMathStats?.currentStreakDays || 0}</span>
                  <span className="text-xs font-normal text-text-secondary">Days</span>
                </p>
                <p className="text-[10px] font-mono text-text-muted mt-0.5">Active habit streak</p>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Study Tracks */}
        <section className="flex flex-col gap-4 mt-2">
          <h2 className="text-lg font-bold font-display text-text-primary">Curated Study Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StudyTrackCard
              href="/visualizers/tree"
              icon={<Workflow className="w-5 h-5" />}
              tag="Trees"
              title="Tree Traversals & Heaps"
              description="Understand DFS, BFS, pre-order, and min/max heap invariant mutations step by step."
            />
            <StudyTrackCard
              href="/visualizers/array"
              icon={<Code2 className="w-5 h-5" />}
              tag="Sorting"
              title="Sorting Algorithms"
              description="Compare in-place Quick Sort, Divide-and-Conquer Merge Sort, and O(n²) Bubble/Insertion."
            />
            <StudyTrackCard
              href="/visualizers/graph"
              icon={<BrainCircuit className="w-5 h-5" />}
              tag="Graphs"
              title="Shortest Path & MST"
              description="Trace Dijkstra, Bellman-Ford, Kruskal, and Prim algorithms across weighted graphs."
            />
          </div>
        </section>

        {/* Account Security & Password Linking */}
        <AccountSecurityCard
          email={user.email}
          providers={(user.app_metadata?.providers as string[]) || ["google"]}
        />
      </div>
    </div>
  );
}
