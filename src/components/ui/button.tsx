import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "border border-primary/30 bg-primary text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover hover:border-primary active:scale-[0.98]",
  secondary:
    "border border-border bg-surface text-foreground shadow-[var(--shadow-raised-sm)] hover:bg-surface-hover hover:border-border-hover active:scale-[0.98]",
  ghost:
    "border border-transparent text-muted-foreground hover:bg-primary-muted hover:text-primary active:scale-[0.98]",
  outline:
    "border border-border bg-surface/50 text-foreground shadow-[var(--shadow-raised-sm)] hover:border-primary/50 hover:bg-surface-hover hover:text-primary active:scale-[0.98]",
  destructive:
    "border border-destructive/40 bg-destructive text-destructive-foreground hover:brightness-95 active:scale-[0.98]",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-[var(--btn-size-sm)] px-3 text-xs rounded-lg",
  md: "min-h-[var(--btn-size-md)] px-4 text-sm rounded-xl",
  lg: "min-h-[var(--btn-size-lg)] px-6 text-base rounded-xl font-bold",
  icon: "h-[var(--btn-size-icon)] w-[var(--btn-size-icon)] p-0 rounded-xl",
};

export const buttonVariants = ({
  variant = "default",
  size = "md",
  className,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}) =>
  cn(
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
    variants[variant],
    sizes[size],
    className
  );

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
);
Button.displayName = "Button";
