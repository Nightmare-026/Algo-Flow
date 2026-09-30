"use client";

import React, { useState } from "react";
import { signout } from "@/app/(auth)/login/actions";
import { LogOut, Trash2 } from "lucide-react";
import { DeleteAccountModal } from "./DeleteAccountModal";

interface AccountSessionCardProps {
  email?: string;
  providers?: string[];
}

export function AccountSessionCard({ email }: AccountSessionCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <section className="rounded-lg p-6 sm:p-8 border border-border bg-surface flex flex-col justify-between gap-6 shadow-card h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 rounded-sm bg-error-muted/40 border border-error/20 text-error items-center justify-center shadow-xs shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-text-primary">
              Session &amp; Account Controls
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Active browser session for{" "}
              <strong className="text-text-primary">{email || "Your Account"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <form action={signout}>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center gap-2 rounded-sm px-4 text-xs font-bold font-display bg-surface border border-border hover:bg-surface-secondary text-text-secondary hover:text-text-primary shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-sm px-3.5 text-xs font-bold font-display bg-error/10 hover:bg-error text-error hover:text-white border border-error/30 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      <div className="mt-auto pt-2 flex flex-col gap-1.5">
        <p className="text-xs text-text-muted leading-relaxed">
          Signing out invalidates your session on this browser. Under GDPR Article 17, you may also
          permanently delete your account and all associated telemetry.
        </p>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        userEmail={email}
      />
    </section>
  );
}
