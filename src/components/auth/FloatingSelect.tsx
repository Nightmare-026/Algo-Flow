"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface FloatingSelectProps {
  id?: string;
  name: string;
  label: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}

export function FloatingSelect({
  id = "select-gender",
  name,
  label,
  options,
  defaultValue = "",
  placeholder = "Select gender",
  required = false,
}: FloatingSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const hiddenInputId = `${id}-hidden`;

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setOpen(false);
  };

  return (
    <div className="auth-field">
      {/* Hidden input for standard form submission */}
      <input
        type="hidden"
        id={hiddenInputId}
        name={name}
        value={selectedValue}
        required={required}
      />

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            id={id}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={label}
            className="group relative flex h-14 w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-bg-surface-inset px-4 pb-1 pt-5 text-left text-sm text-text-primary shadow-(--shadow-inset) transition-all duration-200 hover:border-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            {/* Floating Label */}
            <span
              className={cn(
                "pointer-events-none absolute left-4 origin-left font-semibold transition-all duration-200",
                selectedValue || open
                  ? "top-2.5 text-[11px] text-text-muted group-focus-visible:text-primary-active"
                  : "top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted"
              )}
            >
              {label}
            </span>

            {/* Display Text */}
            <span
              className={cn(
                "truncate text-sm font-medium",
                selectedOption
                  ? "text-text-primary font-semibold"
                  : open
                    ? "text-text-muted"
                    : "text-transparent"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>

            {/* Indicator Icon */}
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-text-muted transition-transform duration-200",
                open && "rotate-180 text-primary"
              )}
              aria-hidden="true"
            />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            className="z-50 w-(--radix-popover-trigger-width) max-h-60 overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 text-text-primary shadow-(--shadow-float) backdrop-blur-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            role="listbox"
            aria-labelledby={id}
          >
            <div className="space-y-1">
              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex min-h-10 w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-150 select-none",
                      isSelected
                        ? "bg-primary-muted text-primary font-bold shadow-(--shadow-inset)"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary hover:shadow-(--shadow-raised-sm)"
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}
