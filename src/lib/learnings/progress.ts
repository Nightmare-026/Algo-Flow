import { useSyncExternalStore, useMemo } from "react";

const PROGRESS_STORAGE_KEY = "algoflow_completed_chapters";
const PROGRESS_UPDATE_EVENT = "algoflow_progress_updated";

function subscribeProgress(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(PROGRESS_UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PROGRESS_UPDATE_EVENT, callback);
  };
}

function getProgressSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return localStorage.getItem(PROGRESS_STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
}

function getServerProgressSnapshot(): string {
  return "[]";
}

export function useCompletedChapters(): {
  completedSet: Set<string>;
  isCompleted: (key: string) => boolean;
  toggleCompleted: (key: string) => void;
} {
  const raw = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot
  );

  const completedSet = useMemo(() => {
    try {
      const arr = JSON.parse(raw);
      return new Set<string>(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  const isCompleted = (key: string) => completedSet.has(key);

  const toggleCompleted = (key: string) => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      const list: string[] = stored ? JSON.parse(stored) : [];
      const updated = list.includes(key) ? list.filter((item) => item !== key) : [...list, key];
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(PROGRESS_UPDATE_EVENT));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  return { completedSet, isCompleted, toggleCompleted };
}
