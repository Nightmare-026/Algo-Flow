"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { deleteUserAccountAction } from "@/features/account/api";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function DeleteAccountModal({ isOpen, onClose, userEmail }: DeleteAccountModalProps) {
  const router = useRouter();
  const [confirmationInput, setConfirmationInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const isConfirmed = confirmationInput.trim().toLowerCase() === "delete my account";

  const handleDelete = () => {
    if (!isConfirmed) return;
    setError(null);

    startTransition(async () => {
      const res = await deleteUserAccountAction();
      if (res.ok) {
        onClose();
        router.push("/login?message=account_deleted");
        router.refresh();
      } else {
        setError(res.error || "Failed to delete account. Please try again.");
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md rounded-lg border border-error/30 bg-surface p-6 shadow-elevated animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-1 rounded-sm hover:bg-surface-secondary transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-error-muted/40 border border-error/20 text-error">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3
              id="delete-account-title"
              className="text-base font-bold font-display text-text-primary"
            >
              Delete Account Permanently
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">GDPR Article 17 Right to Erasure</p>
          </div>
        </div>

        {/* Warning Body */}
        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          This action is <strong className="text-error font-semibold">irreversible</strong>.
          Deleting your account for{" "}
          <strong className="text-text-primary">{userEmail || "your profile"}</strong> will
          permanently purge:
        </p>

        <ul className="text-xs text-text-secondary list-disc list-inside space-y-1 mb-4 pl-1">
          <li>All visualizer progress &amp; study tracks</li>
          <li>Calculation solve history &amp; study streaks</li>
          <li>Saved bookmarks &amp; interactive sessions</li>
          <li>Quiz attempt records &amp; XP leaderboard stats</li>
        </ul>

        {error && (
          <div className="p-3 mb-4 rounded-sm bg-error-muted/40 border border-error/30 text-error text-xs">
            {error}
          </div>
        )}

        {/* Confirmation Input */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label
            htmlFor="delete-confirm-input"
            className="text-xs font-mono font-bold text-text-secondary"
          >
            Type <span className="text-error select-all">delete my account</span> to confirm:
          </label>
          <input
            id="delete-confirm-input"
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            disabled={isPending}
            placeholder="delete my account"
            className="h-9 rounded-sm border border-border bg-surface-secondary px-3 text-xs text-text-primary placeholder:text-text-muted focus:border-error focus:outline-none focus:ring-1 focus:ring-error"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="inline-flex min-h-9 items-center justify-center rounded-sm border border-border px-4 text-xs font-bold text-text-secondary hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmed || isPending}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-sm bg-error px-4 text-xs font-bold text-white shadow-card hover:bg-error-hover disabled:opacity-50 transition-all cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting Data...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanently Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
