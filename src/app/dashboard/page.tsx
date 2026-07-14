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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Flame, Play, Bookmark, Clock, Activity, ArrowRight, Save, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Update streak whenever they visit dashboard
  await updateStreakOnActivity();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch stats
  const streak = await getStreak();
  const completedIds = await getCompletedAlgorithms();
  const bookmarkIds = await getBookmarks();
  const sessions = await getSavedSessions();
  const activities = await getActivityTimeline(5);
  
  // Daily challenge
  const dailyChallenge = await getDailyChallenge();
  let challengeCompleted = false;
  let challengeAlgorithm = null;
  if (dailyChallenge) {
    challengeCompleted = await isChallengeCompleted(dailyChallenge.algorithm_id);
    challengeAlgorithm = algorithms.find(a => a.id === dailyChallenge.algorithm_id);
  }

  // Derive Progress
  const totalAlgorithms = algorithms.filter(a => a.isPublished).length;
  const progressPercent = totalAlgorithms > 0 ? Math.round((completedIds.length / totalAlgorithms) * 100) : 0;

  // Next up logic
  const completedSet = new Set(completedIds);
  const nextAlgorithm = algorithms.find(a => a.isPublished && !completedSet.has(a.id));

  return (
    <div className="flex w-full flex-col p-4 md:p-8 space-y-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back, {profile?.full_name || "Learner"}
            </h1>
            <p className="mt-2 text-text-secondary">Here&apos;s your DSA progress summary.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2 border border-orange-500/20">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Day Streak</div>
                <div className="text-lg font-bold text-orange-700">{streak?.current_streak || 0}</div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-text-muted">Max Streak</span>
              <span className="font-semibold text-text-primary">{streak?.longest_streak || 0} days</span>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          {/* Main Content Column */}
          <div className="flex flex-col gap-6">
            
            {/* Daily Challenge */}
            {challengeAlgorithm && (
              <Card className={cn("border shadow-sm", challengeCompleted ? "bg-success/5 border-success/20" : "bg-gradient-to-r from-primary/10 to-bg-surface border-primary/20")}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className={cn("h-5 w-5", challengeCompleted ? "text-success" : "text-primary")} /> 
                    Daily Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary mb-1">
                      {challengeCompleted ? "Challenge Completed!" : "Complete the quiz to earn your streak."}
                    </p>
                    <p className="text-sm text-text-secondary">{challengeAlgorithm.name}</p>
                  </div>
                  {!challengeCompleted ? (
                    <Link href={`/quizzes/${challengeAlgorithm.id}`} className={buttonVariants({ size: "sm" })}>
                      Take Quiz
                    </Link>
                  ) : (
                    <Link href={`/quizzes/${challengeAlgorithm.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      Review Quiz
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Progress & Next Up */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="bg-bg-surface border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-text-primary">Course Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-bold text-primary">{progressPercent}%</span>
                    <span className="text-sm text-text-secondary">{completedIds.length} / {totalAlgorithms} completed</span>
                  </div>
                  <div className="h-3 w-full bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary-muted to-bg-surface border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-text-primary">Continue Learning</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full justify-between pb-2">
                  {nextAlgorithm ? (
                    <>
                      <p className="text-sm font-medium text-text-secondary line-clamp-2">
                        {nextAlgorithm.name}
                      </p>
                      <Link href={`/visualizer/${nextAlgorithm.slug}`} className={buttonVariants({ className: "mt-4 w-full sm:w-auto shadow-sm" })}>
                        <Play className="mr-2 h-4 w-4" /> Start Visualizer
                      </Link>
                    </>
                  ) : (
                    <div className="text-sm text-success">You&apos;ve completed all available algorithms!</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Bookmarks & Saved Sessions */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Bookmarks */}
              <Card className="bg-bg-surface border-border shadow-sm">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2 text-text-primary">
                    <Bookmark className="h-4 w-4 text-text-muted" /> Bookmarks
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 p-0">
                  {bookmarkIds.length > 0 ? (
                    <ul className="divide-y divide-border">
                      {bookmarkIds.map((id) => {
                        const alg = algorithms.find(a => a.id === id);
                        if (!alg) return null;
                        return (
                          <li key={id}>
                            <Link href={`/visualizer/${alg.slug}`} className="flex items-center justify-between p-4 hover:bg-bg-surface-hover transition-colors group">
                              <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{alg.name}</span>
                              <ArrowRight className="h-4 w-4 text-text-muted opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-lg bg-bg-surface-light/50 px-4 py-8 m-4 text-center text-sm text-text-muted border border-dashed border-border/50">
                      No bookmarks yet. Save algorithms to quickly access them later.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Saved Sessions */}
              <Card className="bg-bg-surface border-border shadow-sm">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2 text-text-primary">
                    <Save className="h-4 w-4 text-text-muted" /> Saved Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 p-0">
                  {sessions.length > 0 ? (
                    <ul className="divide-y divide-border">
                      {sessions.map((session) => {
                        const alg = algorithms.find(a => a.id === session.algorithm_id);
                        if (!alg) return null;
                        return (
                          <li key={session.id}>
                            <Link href={`/visualizer/${alg.slug}?session=${session.id}`} className="flex flex-col p-4 hover:bg-bg-surface-hover transition-colors group">
                              <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{session.title || "Untitled Session"}</span>
                              <span className="text-xs text-text-muted">{alg.name} • {new Date(session.updated_at).toLocaleDateString()}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-lg bg-bg-surface-light/50 px-4 py-8 m-4 text-center text-sm text-text-muted border border-dashed border-border/50">
                      No saved sessions. Save your progress while visualizing to resume later.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Right Column: Activity Timeline */}
          <div>
            <Card className="bg-bg-surface border-border shadow-sm h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-text-primary">
                  <Activity className="h-4 w-4 text-text-muted" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <div className="relative pl-4 border-l border-border space-y-6 mt-2">
                    {activities.map((act) => {
                      const alg = algorithms.find(a => a.id === act.algorithm_id);
                      if (!alg) return null;
                      
                      let icon = <Clock className="h-3 w-3" />;
                      let color = "bg-primary text-white";
                      if (act.action_type === "completed") {
                        icon = <Play className="h-3 w-3" />;
                        color = "bg-success text-white";
                      } else if (act.action_type === "bookmarked") {
                        icon = <Bookmark className="h-3 w-3" />;
                        color = "bg-orange-500 text-white";
                      } else if (act.action_type === "saved_session") {
                        icon = <Save className="h-3 w-3" />;
                        color = "bg-blue-500 text-white";
                      } else if (act.action_type === "quiz_completed") {
                        icon = <Target className="h-3 w-3" />;
                        color = "bg-purple-500 text-white";
                      }

                      return (
                        <div key={act.id} className="relative">
                          <div className={`absolute -left-[25px] top-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-bg-surface shadow-sm ${color}`}>
                            {icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {act.action_type === "completed" && "Completed visualizer"}
                              {act.action_type === "bookmarked" && "Bookmarked"}
                              {act.action_type === "saved_session" && "Saved session for"}
                              {act.action_type === "quiz_completed" && "Completed quiz for"}
                            </p>
                            <p className="text-xs text-text-secondary mt-0.5">{alg.name}</p>
                            <p className="text-xs text-text-muted mt-1">
                              {new Date(act.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg bg-bg-surface-light/50 px-4 py-8 mt-4 text-center text-sm text-text-muted border border-dashed border-border/50">
                    No recent activity. Start learning!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
