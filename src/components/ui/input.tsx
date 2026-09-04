import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    const hasCustomHeight = Boolean(className && /\bh-(?:6|7|8|9|10)\b/.test(className));
    const defaultClasses = hasCustomHeight
      ? "rounded-md border border-border bg-bg-surface-inset text-text-primary shadow-[var(--shadow-inset)] transition-all duration-200 placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 aria-[invalid=true]:border-error aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-error/20 disabled:cursor-not-allowed disabled:opacity-50"
      : "h-11 w-full rounded-xl border border-border bg-bg-surface-inset px-3.5 text-sm text-text-primary shadow-[var(--shadow-inset)] transition-all duration-200 placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 aria-[invalid=true]:border-error aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error/20 disabled:cursor-not-allowed disabled:opacity-50";

    return (
      <input
        ref={ref}
        type={type}
        className={cn(defaultClasses, className)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
