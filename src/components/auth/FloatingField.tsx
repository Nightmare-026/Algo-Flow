import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FloatingFieldProps = Omit<InputProps, "placeholder"> & {
  label: string;
  hint?: string;
};

export function FloatingField({ label, hint, id, className, ...props }: FloatingFieldProps) {
  const inputId = id ?? String(props.name);
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="auth-field">
      <div className="relative">
        <Input
          {...props}
          id={inputId}
          placeholder=" "
          aria-describedby={props["aria-describedby"] ?? hintId}
          className={cn("peer h-14 px-4 pb-1 pt-5 placeholder:text-transparent", className)}
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-2.5 origin-left text-[11px] font-semibold text-text-muted transition-[color,transform,top,font-size] duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus-visible:top-2.5 peer-focus-visible:translate-y-0 peer-focus-visible:text-[11px] peer-focus-visible:font-semibold peer-focus-visible:text-primary-active"
        >
          {label}
        </label>
      </div>
      {hint ? (
        <p id={hintId} className="mt-2 text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
