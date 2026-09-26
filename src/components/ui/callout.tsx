"use client";

import { ReactNode, forwardRef, HTMLAttributes } from "react";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutVariant = "default" | "success" | "error" | "warning" | "info";

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
}

const variantStyles: Record<CalloutVariant, string> = {
  default: "border-border-subtle bg-surface text-text-primary",
  success: "border-credential-emerald/25 bg-credential-emerald-subtle text-credential-emerald",
  error: "border-error/25 bg-error-muted text-error",
  warning: "border-partner-gold/30 bg-partner-gold-subtle text-amber-800 dark:text-amber-300",
  info: "border-primary/25 bg-primary-muted text-primary",
};

const variantIcons: Record<CalloutVariant, ReactNode> = {
  default: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      variant = "default",
      title,
      children,
      dismissible = false,
      onDismiss,
      icon,
      className,
      role = "status",
      ...props
    },
    ref
  ) => {
    const Icon = icon ?? variantIcons[variant];

    return (
      <div
        ref={ref}
        role={role}
        className={cn(
          "flex items-start gap-3 rounded-[8px] border p-4 text-xs font-semibold leading-relaxed shadow-card",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="mt-0.5 shrink-0" aria-hidden="true">
          {Icon}
        </div>
        <div className="flex-1 min-w-0">
          {title && <p className="font-bold">{title}</p>}
          <div className={cn("mt-1", title ? "text-[11px]" : "")}>{children}</div>
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="mt-0.5 shrink-0 rounded-lg p-1 text-current/60 hover:text-current transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);
Callout.displayName = "Callout";
