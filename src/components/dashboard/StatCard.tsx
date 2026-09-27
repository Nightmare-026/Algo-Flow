import React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon: React.ReactNode;
  variant?: "primary" | "warning" | "secondary";
  progress?: number;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = "primary",
  progress,
  className,
}: StatCardProps) {
  const variantStyles = {
    primary: "hover:border-primary/30",
    warning: "hover:border-warning/30",
    secondary: "hover:border-secondary/30",
  }[variant];

  const iconStyles = {
    primary: "bg-primary-muted text-primary border-primary/20",
    warning: "bg-warning-muted text-warning border-warning/20",
    secondary: "bg-secondary-muted text-secondary border-secondary/20",
  }[variant];

  const progressBg = {
    primary: "bg-primary",
    warning: "bg-warning",
    secondary: "bg-secondary",
  }[variant];

  return (
    <div
      className={cn(
        "p-3.5 sm:p-6 rounded-lg border border-border bg-surface flex flex-col justify-between shadow-card hover:shadow-card-hover transition-colors",
        variantStyles,
        className
      )}
    >
      <div className="flex justify-between items-center gap-1.5">
        <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-text-muted truncate">
          {title}
        </span>
        <span
          className={cn(
            "flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm border shadow-xs",
            iconStyles
          )}
        >
          {icon}
        </span>
      </div>
      <div className="mt-2.5 sm:mt-4">
        <div className="text-xl sm:text-3xl font-extrabold font-display text-text-primary">
          {value}
        </div>
        {typeof progress === "number" && (
          <div className="w-full bg-surface-secondary h-1.5 sm:h-2 rounded-full overflow-hidden border border-border mt-1.5 sm:mt-2">
            <div
              className={cn("h-full rounded-full transition-all duration-500", progressBg)}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
        {subtitle && (
          <p className="text-[11px] sm:text-xs font-medium text-text-muted mt-1 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
