"use client";

import React, { useActionState, useState } from "react";
import { setAccountPassword } from "@/app/(auth)/login/actions";
import { ShieldCheck, KeyRound, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSecurityCardProps {
  email?: string;
  providers?: string[];
}

export function AccountSecurityCard({ email, providers = ["google"] }: AccountSecurityCardProps) {
  const isGoogleUser = providers.includes("google");
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(setAccountPassword, null);

  return (
    <section className="neu-raised rounded-3xl p-6 sm:p-8 border border-border bg-surface flex flex-col justify-between gap-6 shadow-[var(--shadow-raised-sm)] h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 rounded-2xl bg-primary-muted border border-primary/20 text-primary items-center justify-center shadow-inner shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-text-primary">
              Account Security &amp; Access
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Manage sign-in credentials for{" "}
              <strong className="text-text-primary">{email || "Your Account"}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold font-display shadow-[var(--shadow-raised-sm)] transition-all active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto",
            isOpen
              ? "border border-border bg-surface text-text-secondary hover:bg-surface-hover"
              : "bg-primary text-white hover:bg-primary-hover"
          )}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>
            {isOpen ? "Close Form" : isGoogleUser ? "Add / Change Password" : "Change Password"}
          </span>
        </button>
      </div>

      {!isOpen && (
        <div className="mt-auto pt-2">
          <p className="text-xs text-text-muted leading-relaxed">
            Manage your credentials and password security. You can add or update your account
            password at any time to sign in securely across devices.
          </p>
        </div>
      )}

      {/* Accordion Content */}
      {isOpen && (
        <div className="neu-inset p-5 sm:p-6 rounded-2xl border border-border bg-surface-inset shadow-inner flex flex-col gap-4 mt-1 transition-all">
          <div>
            <h3 className="text-sm font-bold font-display text-text-primary flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>
                {isGoogleUser ? "Set Password for Email Sign-in" : "Update Account Password"}
              </span>
            </h3>
            <p className="text-xs text-text-secondary mt-1 max-w-xl">
              Setting an account password allows you to sign in directly using your email (
              <strong>{email}</strong>) and password on any device, while keeping your Google
              1-click login active.
            </p>
          </div>

          {state?.error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-error-muted/30 border border-error/30 text-error text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {state?.ok && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-success-muted/30 border border-success/30 text-success text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.message}</span>
            </div>
          )}

          <form action={formAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sec-password"
                className="text-xs font-mono font-bold text-text-secondary"
              >
                New Password
              </label>
              <input
                id="sec-password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                required
                className="h-10 rounded-xl border border-border bg-surface px-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sec-password-confirm"
                className="text-xs font-mono font-bold text-text-secondary"
              >
                Confirm Password
              </label>
              <input
                id="sec-password-confirm"
                name="password_confirm"
                type="password"
                placeholder="Re-type new password"
                minLength={8}
                required
                className="h-10 rounded-xl border border-border bg-surface px-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="sm:col-span-2 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold font-display text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isPending ? "Setting Password..." : "Save Account Password"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
