import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStreak, updateStreakOnActivity } from "@/features/streak/api";
import { getCompletedAlgorithms } from "@/features/progress/api";
import { getBookmarks } from "@/features/bookmarks/api";
import { getSavedSessions } from "@/features/sessions/api";
import { getActivityTimeline } from "@/lib/api/activity";
import { getDailyChallenge, isChallengeCompleted } from "@/lib/api/challenges";
import { algorithms } from "@/data/seed/algorithms";
import { 
  Flame, 
  Play, 
  Bookmark, 
  Clock, 
  Activity, 
  ArrowRight, 
  Save, 
  Target, 
  Star,
  ListChecks,
  Award,
  ChevronRight,
  BrainCircuit,
  Code2,
  Workflow
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

  // Update streak whenever they visit dashboard (best-effort)
  let streak: Awaited<ReturnType<typeof getStreak>> = null;
  try {
    await updateStreakOnActivity();
    streak = await getStreak();
  } catch {
    // streak table may not exist yet — continue with defaults
  }

  // Fetch profile (best-effort)
  let profile: Record<string, unknown> | null = null;
  try {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  } catch {
    // profiles table may not exist yet
  }

  // Fetch stats (all best-effort)
  let completedIds: string[] = [];
  try {
    completedIds = await getCompletedAlgorithms();
  } catch {
    // user_progress table may not exist yet
  }

  let bookmarkIds: string[] = [];
  try {
    bookmarkIds = await getBookmarks();
  } catch {
    // bookmarks table may not exist yet
  }

  let sessions: Awaited<ReturnType<typeof getSavedSessions>> = [];
  try {
    sessions = await getSavedSessions();
  } catch {
    // saved_visualizer_sessions table may not exist yet
  }

  let activities: Awaited<ReturnType<typeof getActivityTimeline>> = [];
  try {
    activities = await getActivityTimeline(10); // Fetch a few more for activity list
  } catch {
    // activity_timeline table may not exist yet
  }

  // Daily challenge
  const dailyChallenge = await getDailyChallenge();
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
  const progressPercent = totalAlgorithms > 0 ? Math.round((completedCount / totalAlgorithms) * 100) : 0;
  
  // Calculate mock XP based on completed algorithms
  const totalXP = completedCount * 150; 
  
  // Fake category breakdowns for progress bars (if not explicitly tracked in DB)
  const linearCount = algorithms.filter(a => a.dataStructureId.includes("list") || a.dataStructureId.includes("stack") || a.dataStructureId.includes("queue") || a.dataStructureId.includes("array")).length;
  const linearCompleted = completedIds.filter(id => {
    const a = algorithms.find(alg => alg.id === id);
    return a && (a.dataStructureId.includes("list") || a.dataStructureId.includes("stack") || a.dataStructureId.includes("queue") || a.dataStructureId.includes("array"));
  }).length;
  const linearProgress = linearCount > 0 ? Math.round((linearCompleted / linearCount) * 100) : 0;

  const nonLinearCount = algorithms.filter(a => a.dataStructureId.includes("tree") || a.dataStructureId.includes("graph")).length;
  const nonLinearCompleted = completedIds.filter(id => {
    const a = algorithms.find(alg => alg.id === id);
    return a && (a.dataStructureId.includes("tree") || a.dataStructureId.includes("graph"));
  }).length;
  const nonLinearProgress = nonLinearCount > 0 ? Math.round((nonLinearCompleted / nonLinearCount) * 100) : 0;

  // Next up logic
  const completedSet = new Set(completedIds);
  const nextAlgorithm = algorithms.find((a) => a.isPublished && !completedSet.has(a.id));

  return (
    <div className="flex w-full flex-col p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 md:gap-8">
        
        {/* Welcome Bar */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-xl neu-raised">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-text-primary">
              Welcome back, {(profile?.username as string) || "Learner"}
            </h2>
            <p className="text-base text-text-secondary mt-1">Ready to conquer some algorithms today?</p>
          </div>
          <div className="flex items-center gap-4 bg-surface-hover px-6 py-2 rounded-full neu-inset">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Current Streak</p>
              <p className="text-xl font-bold text-primary">{streak?.current_streak || 0} Days</p>
            </div>
          </div>
        </section>

        {/* Stat Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* XP Card */}
          <div className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-2">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-sm font-semibold">Total XP</span>
              <Star className="w-5 h-5 text-primary fill-primary" />
            </div>
            <div className="text-3xl font-bold font-display text-text-primary">{totalXP.toLocaleString()}</div>
            <div className="text-xs font-medium text-primary flex items-center gap-1">
              Keep learning to earn more
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-2">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-sm font-semibold">Max Streak</span>
              <Flame className="w-5 h-5 text-warning fill-warning" />
            </div>
            <div className="text-3xl font-bold font-display text-text-primary">{streak?.max_streak || 0}</div>
            <div className="text-xs font-medium text-text-muted">Best streak so far</div>
          </div>

          {/* Topics Card */}
          <div className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-2">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-sm font-semibold">Topics</span>
              <ListChecks className="w-5 h-5 text-primary-active" />
            </div>
            <div className="text-3xl font-bold font-display text-text-primary">
              {completedCount}<span className="text-xl text-text-muted">/{totalAlgorithms}</span>
            </div>
            <div className="w-full bg-surface-hover h-2 rounded-full neu-inset mt-1">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* Bookmarks Card */}
          <div className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-2">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-sm font-semibold">Saved</span>
              <Bookmark className="w-5 h-5 text-primary fill-primary" />
            </div>
            <div className="text-3xl font-bold font-display text-text-primary">{bookmarkIds.length}</div>
            <div className="text-xs font-medium text-text-muted">Bookmarked algorithms</div>
          </div>
        </section>

        {/* Bento Grid Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
            
            {/* Daily Challenge */}
            {challengeAlgorithm ? (
              <section className={cn(
                "p-8 rounded-2xl neu-raised relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-[12px_12px_28px_rgba(48,72,57,0.15),-12px_-12px_28px_rgba(255,255,255,0.95)]",
                challengeCompleted ? "bg-primary-muted border-primary/20" : "bg-surface"
              )}>
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110 duration-500">
                  <Target className="w-48 h-48" />
                </div>
                <div className="relative z-10 flex flex-col items-start gap-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold neu-raised inline-block",
                    challengeCompleted ? "bg-success text-white" : "bg-primary-muted text-primary-active"
                  )}>
                    {challengeCompleted ? "Challenge Completed!" : "Daily Challenge"}
                  </span>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-2">
                      {challengeAlgorithm.name}
                    </h3>
                    <p className="text-base text-text-secondary max-w-lg">
                      {challengeCompleted 
                        ? "You've successfully completed today's challenge. Come back tomorrow for a new one!" 
                        : "Test your knowledge and earn your streak. Mastering this is crucial for problem-solving."}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Link
                      href={challengeCompleted ? `/quizzes/${challengeAlgorithm.id}` : `/visualizer/${challengeAlgorithm.slug}`}
                      className={cn(
                        "px-6 py-2.5 rounded-lg text-sm font-semibold shadow-[var(--shadow-raised-sm)] transition-all duration-200 flex items-center gap-2",
                        challengeCompleted 
                          ? "bg-surface text-primary border border-primary/20 hover:bg-surface-hover" 
                          : "bg-primary text-white hover:bg-primary-hover active:scale-95"
                      )}
                    >
                      {challengeCompleted ? "Review Quiz" : "Start Challenge"} 
                      <Play className="w-4 h-4 fill-current" />
                    </Link>
                    {!challengeCompleted && (
                      <span className="text-sm font-bold text-primary-active flex items-center gap-1">
                        <Star className="w-4 h-4" /> +30 XP
                      </span>
                    )}
                  </div>
                </div>
              </section>
            ) : (
               <section className="bg-surface p-8 rounded-2xl neu-raised relative overflow-hidden">
                 <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2 h-40">
                   <Target className="w-10 h-10 text-text-muted mb-2" />
                   <h3 className="text-xl font-bold font-display text-text-primary">No Challenge Active</h3>
                   <p className="text-text-secondary">Check back later for a new daily challenge.</p>
                 </div>
               </section>
            )}

            {/* Recent Activity List (Alternative to Heatmap) */}
            <section className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-4">
              <h3 className="text-xl font-bold font-display text-text-primary">Recent Activity</h3>
              {activities.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {activities.slice(0, 5).map((act) => {
                    const alg = algorithms.find((a) => a.id === act.algorithm_id);
                    if (!alg) return null;
                    return (
                      <div key={act.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-surface neu-inset flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                          {act.action_type === "completed" && <ListChecks className="w-5 h-5" />}
                          {act.action_type === "bookmarked" && <Bookmark className="w-5 h-5" />}
                          {act.action_type === "saved_session" && <Save className="w-5 h-5" />}
                          {act.action_type === "quiz_completed" && <Target className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-text-primary truncate">
                            {act.action_type === "completed" && `Completed ${alg.name}`}
                            {act.action_type === "bookmarked" && `Saved ${alg.name}`}
                            {act.action_type === "saved_session" && `Saved session for ${alg.name}`}
                            {act.action_type === "quiz_completed" && `Finished quiz for ${alg.name}`}
                          </h4>
                          <p className="text-xs text-text-muted">
                            {act.created_at ? new Date(act.created_at).toLocaleDateString() : "Recently"}
                          </p>
                        </div>
                        <Link href={`/visualizer/${alg.slug}`} className="text-text-muted group-hover:text-primary transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-sm text-text-muted border border-dashed border-border/50 rounded-lg">
                  No recent activity. Start visualizing to see your progress here!
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 lg:gap-8">
            
            {/* Progress Bars */}
            <section className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-4">
              <h3 className="text-xl font-bold font-display text-text-primary mb-2">Category Progress</h3>
              
              {/* Linear */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-text-secondary">Linear DS</span>
                  <span className="text-text-primary">{linearProgress}%</span>
                </div>
                <div className="w-full bg-surface-hover h-3 rounded-full neu-inset">
                  <div className="bg-primary h-3 rounded-full relative overflow-hidden" style={{ width: `${linearProgress}%` }}>
                    <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
              
              {/* Non-Linear */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-text-secondary">Trees & Graphs</span>
                  <span className="text-text-primary">{nonLinearProgress}%</span>
                </div>
                <div className="w-full bg-surface-hover h-3 rounded-full neu-inset">
                  <div className="bg-primary-hover h-3 rounded-full" style={{ width: `${nonLinearProgress}%` }}></div>
                </div>
              </div>

              {/* Overall */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-text-secondary">Overall Progress</span>
                  <span className="text-text-primary">{progressPercent}%</span>
                </div>
                <div className="w-full bg-surface-hover h-3 rounded-full neu-inset">
                  <div className="bg-primary-active h-3 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </section>

            {/* Continue / Next Algorithm */}
            <section className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-4 flex-1">
              <h3 className="text-xl font-bold font-display text-text-primary">Continue Learning</h3>
              <div className="flex flex-col h-full justify-between">
                {nextAlgorithm ? (
                  <>
                    <p className="text-sm font-medium text-text-secondary mb-6">
                      Jump into your next recommended algorithm to keep the streak going.
                    </p>
                    <div className="bg-surface-hover p-4 rounded-lg neu-inset border border-transparent hover:border-primary/20 transition-colors">
                      <h4 className="text-base font-bold text-text-primary mb-1">{nextAlgorithm.name}</h4>
                      <p className="text-xs text-text-muted mb-4 line-clamp-2">{nextAlgorithm.shortDescription || "Learn how this algorithm works visually."}</p>
                      <Link
                        href={`/visualizer/${nextAlgorithm.slug}`}
                        className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" /> Resume
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-success text-center py-8">
                    You've completed all available algorithms! 🥳
                  </div>
                )}
              </div>
            </section>
            
          </div>
        </div>

        {/* Recommended Topics (Bottom Row) */}
        <section className="flex flex-col gap-4 mt-4">
          <h3 className="text-xl font-bold font-display text-text-primary px-2">Recommended For You</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link href="/visualizers/tree" className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer border border-transparent hover:border-primary/30">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-surface neu-inset flex items-center justify-center text-primary">
                  <Workflow className="w-6 h-6" />
                </div>
                <span className="bg-primary-muted text-primary-active px-2 py-1 rounded text-xs font-bold">Trees</span>
              </div>
              <div>
                <h4 className="text-lg font-bold font-display text-text-primary">Tree Traversals</h4>
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">Learn DFS and BFS traversal techniques for hierarchical data structures.</p>
              </div>
            </Link>

            <Link href="/visualizers/array" className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer border border-transparent hover:border-primary/30">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-surface neu-inset flex items-center justify-center text-primary">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="bg-primary-muted text-primary-active px-2 py-1 rounded text-xs font-bold">Sorting</span>
              </div>
              <div>
                <h4 className="text-lg font-bold font-display text-text-primary">Advanced Sorting</h4>
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">Master Merge Sort and Quick Sort to understand divide-and-conquer algorithms.</p>
              </div>
            </Link>

            <Link href="/visualizers/graph" className="bg-surface p-6 rounded-xl neu-raised flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer border border-transparent hover:border-primary/30">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-surface neu-inset flex items-center justify-center text-primary">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="bg-primary-muted text-primary-active px-2 py-1 rounded text-xs font-bold">Graphs</span>
              </div>
              <div>
                <h4 className="text-lg font-bold font-display text-text-primary">Dijkstra's Algorithm</h4>
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">Find the shortest path between nodes in a graph. Crucial for network routing.</p>
              </div>
            </Link>

          </div>
        </section>

      </div>
    </div>
  );
}

