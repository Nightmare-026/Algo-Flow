import React from "react";
import Link from "next/link";
import { BrainCircuit, ListChecks, Bookmark, Save, Trophy, ChevronRight } from "lucide-react";
import type { Activity } from "@/lib/api/activity";
import type { Algorithm } from "@/types";

export interface ActivityItemProps {
  activity: Activity;
  algorithms: Algorithm[];
}

export function ActivityItem({ activity: act, algorithms }: ActivityItemProps) {
  const isMentalMath = act.algorithm_id?.startsWith("mental_math");
  const alg = !isMentalMath ? algorithms.find((a) => a.id === act.algorithm_id) : null;

  if (!alg && !isMentalMath) return null;

  const mmMetadata = act.metadata as
    | {
        score?: number;
        accuracy?: number;
        mode?: string;
        operation?: string;
      }
    | undefined;

  const title = isMentalMath
    ? `Mental Math (${mmMetadata?.operation || "Mixed"}): ${mmMetadata?.score || 0} pts`
    : act.action_type === "completed"
      ? `Completed: ${alg?.name}`
      : act.action_type === "bookmarked"
        ? `Bookmarked: ${alg?.name}`
        : act.action_type === "saved_session"
          ? `Saved session: ${alg?.name}`
          : `Passed quiz: ${alg?.name}`;

  const linkHref = isMentalMath ? "/mental-math/leaderboard" : `/visualizer/${alg?.slug}`;

  const subtext = isMentalMath
    ? `${mmMetadata?.accuracy || 100}% accuracy • ${mmMetadata?.mode || "daily"} mode • ${
        act.created_at ? new Date(act.created_at).toLocaleDateString() : "Recent"
      }`
    : act.created_at
      ? new Date(act.created_at).toLocaleDateString()
      : "Recent";

  return (
    <div className="flex items-center gap-3.5 p-3 rounded-xl border border-transparent hover:border-border hover:bg-surface-hover transition-all group">
      <div className="flex h-10 w-10 rounded-xl bg-bg-surface-inset border border-border shadow-[var(--shadow-inset)] items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
        {isMentalMath ? (
          <BrainCircuit className="w-4 h-4" />
        ) : act.action_type === "completed" ? (
          <ListChecks className="w-4 h-4" />
        ) : act.action_type === "bookmarked" ? (
          <Bookmark className="w-4 h-4 fill-current" />
        ) : act.action_type === "saved_session" ? (
          <Save className="w-4 h-4" />
        ) : (
          <Trophy className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-bold text-text-primary truncate">{title}</h3>
        <p className="text-[11px] font-mono text-text-muted mt-0.5">{subtext}</p>
      </div>
      <Link
        href={linkHref}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted group-hover:text-primary group-hover:border-primary/40 transition-colors"
        aria-label={isMentalMath ? "View leaderboard" : `Open ${alg?.name}`}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
