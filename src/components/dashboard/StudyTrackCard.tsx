import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface StudyTrackCardProps {
  href: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  className?: string;
}

export function StudyTrackCard({
  href,
  icon,
  tag,
  title,
  description,
  className,
}: StudyTrackCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "neu-raised p-6 rounded-2xl border border-border flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all duration-200",
        className
      )}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex h-11 w-11 rounded-xl bg-surface-inset border border-border shadow-[var(--shadow-inset)] items-center justify-center text-primary">
            {icon}
          </div>
          <span className="bg-primary-muted text-primary border border-primary/20 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase">
            {tag}
          </span>
        </div>
        <h3 className="text-base font-bold font-display text-text-primary">{title}</h3>
        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
