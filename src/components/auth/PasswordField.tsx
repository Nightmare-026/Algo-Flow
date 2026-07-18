"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordFieldProps = Omit<InputProps, "type" | "placeholder"> & {
  label: string;
  hint?: string;
};

export function PasswordField({ label, hint, id, className, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? String(props.name);
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="auth-field">
      <div className="relative">
        <Input
          {...props}
          id={inputId}
          type={visible ? "text" : "password"}
          placeholder=" "
          aria-describedby={props["aria-describedby"] ?? hintId}
          className={cn("peer h-14 pb-1 pl-4 pr-12 pt-5 placeholder:text-transparent", className)}
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-2.5 origin-left text-[11px] font-semibold text-text-muted transition-[color,transform,top,font-size] duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus-visible:top-2.5 peer-focus-visible:translate-y-0 peer-focus-visible:text-[11px] peer-focus-visible:font-semibold peer-focus-visible:text-primary-active"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>
      {hint ? (
        <p id={hintId} className="mt-2 text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
