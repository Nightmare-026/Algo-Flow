import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "border border-primary bg-primary text-primary-foreground shadow-[5px_5px_12px_rgba(34,197,94,0.18),-4px_-4px_10px_rgba(255,255,255,0.85)] hover:border-primary-hover hover:bg-primary-hover hover:-translate-y-0.5",
  secondary:
    "border border-white/80 bg-surface-light text-foreground shadow-[var(--shadow-raised-sm)] hover:bg-surface-hover hover:-translate-y-0.5",
  ghost:
    "border border-transparent text-muted-foreground hover:bg-primary-muted hover:text-primary-active",
  outline:
    "border border-border bg-surface/70 text-foreground shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:text-primary-active",
  destructive:
    "border border-destructive bg-destructive text-destructive-foreground hover:brightness-95",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-10 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-sm",
  icon: "h-11 w-11 p-0",
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
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[transform,box-shadow,background-color,border-color,color,filter,opacity] duration-200 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
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
