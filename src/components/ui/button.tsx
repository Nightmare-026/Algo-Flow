import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "border border-primary bg-primary text-white shadow-card hover:bg-primary-hover hover:border-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.99]",
  secondary:
    "border border-border-subtle bg-surface text-foreground shadow-card hover:bg-surface-hover hover:border-border-strong active:scale-[0.99]",
  ghost:
    "border border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary active:scale-[0.99]",
  outline:
    "border-[1.5px] border-primary bg-transparent text-primary hover:bg-primary-muted/60 active:scale-[0.99]",
  destructive: "border border-error bg-error text-white hover:bg-error/90 active:scale-[0.99]",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-9 px-3 text-xs rounded-[4px]",
  md: "min-h-11 px-4 text-sm rounded-[4px]",
  lg: "min-h-12 px-6 text-base rounded-[4px] font-bold",
  icon: "h-11 w-11 p-0 rounded-[4px]",
};

export const buttonVariants = ({
  variant = "default",
  size = "md",
  className,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}) => {
  const hasCustomHeight = Boolean(className && /\bh-\d+/.test(className));
  const hasCustomRadius = Boolean(
    className && /\brounded-(?:none|sm|md|lg|xl|2xl|3xl|full|\[[^\]]+\])\b/.test(className)
  );

  let sizeClass = sizes[size];
  if (hasCustomHeight) {
    sizeClass = sizeClass.replace(/min-h-\d+\s*/g, "");
  }
  if (hasCustomRadius) {
    sizeClass = sizeClass.replace(/rounded-\[[^\]]+\]\s*/g, "");
  }

  return cn(
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
    variants[variant],
    sizeClass,
    className
  );
};

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
