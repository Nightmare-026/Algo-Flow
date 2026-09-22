import React from "react";
import Link from "next/link";
import { BrainCircuit, ListChecks, Bookmark, Save, Trophy, ChevronRight, Zap } from "lucide-react";
import type { Activity } from "@/lib/api/activity";
import type { Algorithm } from "@/types";

export interface ActivityItemProps {
  activity: Activity;
  algorithms: Algorithm[];
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "Just now";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Recent";
  }
}

export function ActivityItem({ activity: act, algorithms }: ActivityItemProps) {
  const isMentalMath = act.domain === "mental_math" || act.algorithm_id?.startsWith("mental_math");
  const alg = !isMentalMath ? algorithms.find((a) => a.id === act.algorithm_id) : null;

  if (!alg && !isMentalMath) return null;

  const mmMetadata = act.metadata as
    | {
        score?: number;
        accuracy?: number;
        mode?: string;
        operation?: string;
        solve_time_ms?: number;
      }
    | undefined;

  let title = "";
  let linkHref = "";

  if (isMentalMath) {
    if (act.action_type === "daily_completed") {
      title = `Daily Sprint: ${mmMetadata?.score ?? 0} pts`;
      linkHref = "/mental-math/daily";
    } else {
      const op = mmMetadata?.operation
        ? mmMetadata.operation.charAt(0).toUpperCase() + mmMetadata.operation.slice(1)
        : "Calculation";
      title = `Mental Math (${op}): ${mmMetadata?.score ?? 0} pts`;
      linkHref = "/mental-math/practice";
    }
  } else {
    linkHref = `/visualizer/${alg?.slug}`;
    switch (act.action_type) {
      case "completed":
        title = `Completed: ${alg?.name}`;
        break;
      case "bookmarked":
        title = `Bookmarked: ${alg?.name}`;
        break;
      case "saved_session":
        title = `Saved trace: ${alg?.name}`;
        break;
      case "daily_completed":
        title = `Daily Challenge: ${alg?.name}`;
        break;
      case "quiz_completed":
      default:
        title = `Passed quiz: ${alg?.name}`;
        break;
    }
  }

  const timeLabel = formatRelativeTime(act.created_at);

  const subtext = isMentalMath
    ? `${mmMetadata?.accuracy ?? 100}% accuracy â€¢ ${timeLabel}`
    : `${alg?.difficulty ? alg.difficulty.charAt(0).toUpperCase() + alg.difficulty.slice(1) : "Algorithm"} â€¢ ${timeLabel}`;

  return (
    <div className="flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl border border-transparent hover:border-border hover:bg-surface-hover/80 transition-all group">
      <div className="flex h-10 w-10 rounded-xl bg-bg-surface-inset border border-border shadow-(--shadow-inset) items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
        {isMentalMath ? (
          act.action_type === "daily_completed" ? (
            <Zap className="w-4 h-4 text-warning fill-current" />
          ) : (
            <BrainCircuit className="w-4 h-4 text-secondary" />
          )
        ) : act.action_type === "completed" ? (
          <ListChecks className="w-4 h-4 text-primary" />
        ) : act.action_type === "bookmarked" ? (
          <Bookmark className="w-4 h-4 text-primary fill-current" />
        ) : act.action_type === "saved_session" ? (
          <Save className="w-4 h-4 text-text-secondary" />
        ) : (
          <Trophy className="w-4 h-4 text-warning" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-text-primary truncate">{title}</h3>
          {isMentalMath && (
            <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-secondary-muted text-secondary border border-secondary/20">
              MATH
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono text-text-muted mt-0.5">{subtext}</p>
      </div>
      <Link
        href={linkHref}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted group-hover:text-primary group-hover:border-primary/40 transition-colors shrink-0"
        aria-label={isMentalMath ? "Open Mental Math Studio" : `Open ${alg?.name}`}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
