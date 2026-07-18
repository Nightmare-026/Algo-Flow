import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-[var(--shadow-inset)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:shadow-[var(--shadow-inset),0_0_0_3px_rgba(34,197,94,0.14)] aria-[invalid=true]:border-error aria-[invalid=true]:shadow-[var(--shadow-inset),0_0_0_3px_rgba(220,38,38,0.10)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
