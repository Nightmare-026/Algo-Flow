import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger";
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-primary/20 bg-primary-muted text-primary font-semibold",
  secondary: "border-border-subtle bg-surface-hover text-text-secondary font-medium",
  outline: "border-border-subtle bg-transparent text-text-secondary font-medium",
  success:
    "border-credential-emerald/25 bg-credential-emerald-subtle text-credential-emerald font-semibold",
  warning:
    "border-partner-gold/30 bg-partner-gold-subtle text-amber-800 dark:text-amber-300 font-semibold",
  danger: "border-error/25 bg-error-muted text-error font-semibold",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs tracking-tight",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
