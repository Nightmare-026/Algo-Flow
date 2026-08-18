import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStreak, updateStreakOnActivity } from "@/features/streak/api";
import { getCompletedAlgorithms } from "@/features/progress/api";
import { getBookmarks } from "@/features/bookmarks/api";
import { getActivityTimeline } from "@/lib/api/activity";
import { getDailyChallenge, isChallengeCompleted } from "@/lib/api/challenges";
import { algorithms } from "@/data/seed/algorithms";
import {
  Flame,
  Play,
  Bookmark,
  Save,
  Star,
  ListChecks,
  ChevronRight,
  BrainCircuit,
  Code2,
  Workflow,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  ] = await Promise.allSettled([
    updateStreakOnActivity().then(() => getStreak()),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    getCompletedAlgorithms(),
    getBookmarks(),
    getActivityTimeline(10),
    getDailyChallenge(),
  ]);

  const streak = streakResult.status === "fulfilled" ? streakResult.value : null;
  const profile = profileResult.status === "fulfilled" ? profileResult.value.data : null;
  const completedIds = completedResult.status === "fulfilled" ? completedResult.value : [];
  const bookmarkIds = bookmarksResult.status === "fulfilled" ? bookmarksResult.value : [];
  const activities = activitiesResult.status === "fulfilled" ? activitiesResult.value : [];
  const dailyChallenge =
    dailyChallengeResult.status === "fulfilled" ? dailyChallengeResult.value : null;

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
  const totalAlgorithms = algorithms.filter((a) => a.isPublished).length;
  const completedCount = completedIds.length;
  const progressPercent =
    totalAlgorithms > 0 ? Math.round((completedCount / totalAlgorithms) * 100) : 0;

  // Calculate XP based on completed algorithms
  const totalXP = completedCount * 150;

  // Category breakdowns
  const linearCount = algorithms.filter(
    (a) =>
      a.dataStructureId.includes("list") ||
      a.dataStructureId.includes("stack") ||
      a.dataStructureId.includes("queue") ||
      a.dataStructureId.includes("array")
  ).length;
  const linearCompleted = completedIds.filter((id) => {
    const a = algorithms.find((alg) => alg.id === id);
    return (
      a &&
      (a.dataStructureId.includes("list") ||
        a.dataStructureId.includes("stack") ||
        a.dataStructureId.includes("queue") ||
        a.dataStructureId.includes("array"))
    );
  }).length;
  const linearProgress = linearCount > 0 ? Math.round((linearCompleted / linearCount) * 100) : 0;

  const nonLinearCount = algorithms.filter(
    (a) => a.dataStructureId.includes("tree") || a.dataStructureId.includes("graph")
  ).length;
  const nonLinearCompleted = completedIds.filter((id) => {
    const a = algorithms.find((alg) => alg.id === id);
    return a && (a.dataStructureId.includes("tree") || a.dataStructureId.includes("graph"));
  }).length;
  const nonLinearProgress =
    nonLinearCount > 0 ? Math.round((nonLinearCompleted / nonLinearCount) * 100) : 0;

  // Next up logic
  const completedSet = new Set(completedIds);
  const nextAlgorithm = algorithms.find((a) => a.isPublished && !completedSet.has(a.id));

  return (
    <div className="flex w-full flex-col px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-8">
        {/* Welcome Header Bar */}
        <section className="neu-float flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 sm:p-8 rounded-3xl border border-border">
          <div>
            <div className="inline-flex min-h-7 items-center gap-2 rounded-full border border-border bg-surface px-3 text-[11px] font-bold uppercase tracking-wider text-primary shadow-[var(--shadow-raised-sm)] mb-2">
              <Sparkles className="h-3 w-3 text-primary" />
              Student Command Center
            </div>
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
                {streak?.current_streak || 0} <span className="text-xs font-normal text-text-secondary">Days</span>
              </p>
            </div>
          </div>
        </section>

        {/* 4 Quick Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* XP Card */}
          <div className="neu-raised p-6 rounded-2xl border border-border flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Experience</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted text-primary border border-primary/20">
                <Star className="w-4 h-4 fill-current" />
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-text-primary">
                {totalXP.toLocaleString()}
              </div>
              <p className="text-xs font-semibold text-primary mt-1">+150 XP per completed algorithm</p>
            </div>
          </div>

          {/* Max Streak Card */}
          <div className="neu-raised p-6 rounded-2xl border border-border flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Max Streak</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-muted text-warning border border-warning/20">
                <Flame className="w-4 h-4 fill-current" />
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-text-primary">
                {streak?.max_streak || 0}
              </div>
              <p className="text-xs font-medium text-text-muted mt-1">Best consistent study streak</p>
            </div>
          </div>

          {/* Topics Completed Card */}
          <div className="neu-raised p-6 rounded-2xl border border-border flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Mastered</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted text-primary border border-primary/20">
                <ListChecks className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-text-primary">
                {completedCount}
                <span className="text-lg font-normal text-text-muted">/{totalAlgorithms}</span>
              </div>
              <div className="w-full bg-bg-surface-inset h-2 rounded-full overflow-hidden border border-border shadow-[var(--shadow-inset)] mt-2">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Saved Visualizers Card */}
          <div className="neu-raised p-6 rounded-2xl border border-border flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Bookmarks</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-muted text-secondary border border-secondary/20">
                <Bookmark className="w-4 h-4 fill-current" />
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-text-primary">
                {bookmarkIds.length}
              </div>
              <p className="text-xs font-medium text-text-muted mt-1">Saved algorithms for quick study</p>
            </div>
          </div>
        </section>

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
                        : challengeAlgorithm.shortDescription || "Trace this algorithm and complete the interactive simulation to build your streak."}
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
              <h2 className="text-lg font-bold font-display text-text-primary">Recent Learning Activity</h2>
              {activities.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {activities.slice(0, 5).map((act) => {
                    const alg = algorithms.find((a) => a.id === act.algorithm_id);
                    if (!alg) return null;
                    return (
                      <div
                        key={act.id}
                        className="flex items-center gap-3.5 p-3 rounded-xl border border-transparent hover:border-border hover:bg-surface-hover transition-all group"
                      >
                        <div className="flex h-10 w-10 rounded-xl bg-bg-surface-inset border border-border shadow-[var(--shadow-inset)] items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                          {act.action_type === "completed" && <ListChecks className="w-4 h-4" />}
                          {act.action_type === "bookmarked" && <Bookmark className="w-4 h-4 fill-current" />}
                          {act.action_type === "saved_session" && <Save className="w-4 h-4" />}
                          {act.action_type === "quiz_completed" && <Trophy className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-bold text-text-primary truncate">
                            {act.action_type === "completed" && `Completed: ${alg.name}`}
                            {act.action_type === "bookmarked" && `Bookmarked: ${alg.name}`}
                            {act.action_type === "saved_session" && `Saved session: ${alg.name}`}
                            {act.action_type === "quiz_completed" && `Passed quiz: ${alg.name}`}
                          </h3>
                          <p className="text-[11px] font-mono text-text-muted mt-0.5">
                            {act.created_at
                              ? new Date(act.created_at).toLocaleDateString()
                              : "Recent"}
                          </p>
                        </div>
                        <Link
                          href={`/visualizer/${alg.slug}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted group-hover:text-primary group-hover:border-primary/40 transition-colors"
                          aria-label={`Open ${alg.name}`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    );
                  })}
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

        {/* Curated Study Tracks */}
        <section className="flex flex-col gap-4 mt-2">
          <h2 className="text-lg font-bold font-display text-text-primary">
            Curated Study Tracks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              href="/visualizers/tree"
              className="neu-raised p-6 rounded-2xl border border-border flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex h-11 w-11 rounded-xl bg-surface-inset border border-border shadow-[var(--shadow-inset)] items-center justify-center text-primary">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <span className="bg-primary-muted text-primary border border-primary/20 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase">
                    Trees
                  </span>
                </div>
                <h3 className="text-base font-bold font-display text-text-primary">
                  Tree Traversals &amp; Heaps
                </h3>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Understand DFS, BFS, pre-order, and min/max heap invariant mutations step by step.
                </p>
              </div>
            </Link>

            <Link
              href="/visualizers/array"
              className="neu-raised p-6 rounded-2xl border border-border flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex h-11 w-11 rounded-xl bg-surface-inset border border-border shadow-[var(--shadow-inset)] items-center justify-center text-primary">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="bg-primary-muted text-primary border border-primary/20 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase">
                    Sorting
                  </span>
                </div>
                <h3 className="text-base font-bold font-display text-text-primary">
                  Sorting Algorithms
                </h3>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Compare in-place Quick Sort, Divide-and-Conquer Merge Sort, and O(n²) Bubble/Insertion.
                </p>
              </div>
            </Link>

            <Link
              href="/visualizers/graph"
              className="neu-raised p-6 rounded-2xl border border-border flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex h-11 w-11 rounded-xl bg-surface-inset border border-border shadow-[var(--shadow-inset)] items-center justify-center text-primary">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <span className="bg-primary-muted text-primary border border-primary/20 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase">
                    Graphs
                  </span>
                </div>
                <h3 className="text-base font-bold font-display text-text-primary">
                  Shortest Path &amp; MST
                </h3>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Trace Dijkstra, Bellman-Ford, Kruskal, and Prim algorithms across weighted graphs.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
