import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger";
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-primary/25 bg-primary-muted text-primary font-bold",
  secondary: "border-border bg-surface-hover text-text-secondary font-medium",
  outline: "border-border bg-transparent text-text-secondary font-medium",
  success: "border-success/30 bg-success-muted text-success font-bold",
  warning: "border-warning/30 bg-warning-muted text-warning font-bold",
  danger: "border-error/30 bg-error-muted text-error font-bold",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs tracking-tight shadow-(--shadow-raised-sm)",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
