import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface StudyTrackCardProps {
  href: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  completed?: number;
  total?: number;
  className?: string;
}

export function StudyTrackCard({
  href,
  icon,
  tag,
  title,
  description,
  completed,
  total,
  className,
}: StudyTrackCardProps) {
  const hasProgress = typeof completed === "number" && typeof total === "number" && total > 0;
  const percent = hasProgress ? Math.round((completed / total) * 100) : 0;

  return (
    <Link
      href={href}
      className={cn(
        "p-6 rounded-lg border border-border bg-surface flex flex-col justify-between shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all duration-200 group",
        className
      )}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex h-11 w-11 rounded-md bg-surface-secondary border border-border shadow-xs items-center justify-center text-primary group-hover:scale-105 transition-transform">
            {icon}
          </div>
          <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase">
            {tag}
          </span>
        </div>
        <h3 className="text-base font-bold font-display text-text-primary group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{description}</p>
      </div>

      {hasProgress && (
        <div className="mt-4 pt-3 border-t border-border/70 flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-mono font-bold">
            <span className="text-text-muted">
              {completed}/{total} Completed
            </span>
            <span className="text-primary">{percent}%</span>
          </div>
          <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden border border-border">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
