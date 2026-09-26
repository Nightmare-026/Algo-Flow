"use client";

import React from "react";
import { signout } from "@/app/(auth)/login/actions";
import { LogOut } from "lucide-react";

interface AccountSessionCardProps {
  email?: string;
  providers?: string[];
}

export function AccountSessionCard({ email }: AccountSessionCardProps) {
  return (
    <section className="rounded-[8px] p-6 sm:p-8 border border-border bg-surface flex flex-col justify-between gap-6 shadow-card h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 rounded-[4px] bg-error-muted/40 border border-error/20 text-error items-center justify-center shadow-xs shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-text-primary">
              Session &amp; Sign Out
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Active browser session for{" "}
              <strong className="text-text-primary">{email || "Your Account"}</strong>
            </p>
          </div>
        </div>

        <form action={signout} className="shrink-0 self-start sm:self-auto">
          <button
            type="submit"
            className="inline-flex min-h-10 items-center gap-2 rounded-[4px] px-4 text-xs font-bold font-display bg-error/10 hover:bg-error text-error hover:text-white border border-error/30 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>

      <div className="mt-auto pt-2">
        <p className="text-xs text-text-muted leading-relaxed">
          Signing out will invalidate your session on this browser. Your learning streaks, code
          submissions, bookmarks, and XP remain safely preserved in the cloud.
        </p>
      </div>
    </section>
  );
}
