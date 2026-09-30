"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface KeyboardShortcutsModalProps {
  showShortcuts: boolean;
  closeShortcuts: () => void;
}

export function KeyboardShortcutsModal({
  showShortcuts,
  closeShortcuts,
}: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {showShortcuts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-elevated max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="shortcuts-title" className="text-xl font-bold font-display text-text-primary">
                Keyboard Shortcuts
              </h2>
              <button
                onClick={closeShortcuts}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                aria-label="Close shortcuts"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                Playback
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-2">
                <dt className="font-mono font-bold text-text-secondary kbd-style">Space</dt>
                <dd className="text-text-secondary">Play / Pause</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">← / J</dt>
                <dd className="text-text-secondary">Previous Step</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">→ / L</dt>
                <dd className="text-text-secondary">Next Step</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">R</dt>
                <dd className="text-text-secondary">Restart</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">Shift + →</dt>
                <dd className="text-text-secondary">Jump to End</dd>
              </dl>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary mt-4">
                Navigation
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-2">
                <dt className="font-mono font-bold text-text-secondary kbd-style">?</dt>
                <dd className="text-text-secondary">Show this help</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">P</dt>
                <dd className="text-text-secondary">Toggle Practice Mode</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">F</dt>
                <dd className="text-text-secondary">Fullscreen Canvas</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">B</dt>
                <dd className="text-text-secondary">Toggle Bookmark</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">S</dt>
                <dd className="text-text-secondary">Save Session</dd>
              </dl>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary mt-4">
                Panels
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-2">
                <dt className="font-mono font-bold text-text-secondary kbd-style">1</dt>
                <dd className="text-text-secondary">Pseudocode Tab</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">2</dt>
                <dd className="text-text-secondary">Code Tab</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">E</dt>
                <dd className="text-text-secondary">Explanation Tab</dd>
                <dt className="font-mono font-bold text-text-secondary kbd-style">L</dt>
                <dd className="text-text-secondary">Step Log Tab</dd>
              </dl>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
