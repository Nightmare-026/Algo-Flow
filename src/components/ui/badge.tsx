import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger";
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-primary/25 bg-primary-muted text-primary",
  secondary: "border-border bg-secondary text-secondary-foreground",
  outline: "border-border bg-transparent text-secondary-foreground",
  success: "border-success/25 bg-success-muted text-success",
  warning: "border-warning/25 bg-warning-muted text-warning",
  danger: "border-error/25 bg-error-muted text-error",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
}
