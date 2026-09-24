import { useSyncExternalStore, useMemo, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

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

function parseLocalKeys(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalKeys(keys: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(keys));
    window.dispatchEvent(new Event(PROGRESS_UPDATE_EVENT));
  } catch {
    // Ignore storage quota or security errors
  }
}

/**
 * Hybrid progress tracking hook for AlgoFlow curriculum chapters.
 *
 * Provides:
 * - Instant zero-latency optimistic updates via localStorage
 * - Seamless guest & offline capability
 * - Background two-way synchronization with Supabase when authenticated
 */
export function useCompletedChapters(): {
  completedSet: Set<string>;
  isCompleted: (key: string) => boolean;
  toggleCompleted: (key: string) => void;
  markCompleted: (key: string) => void;
  markIncomplete: (key: string) => void;
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

  const hasSyncedRef = useRef(false);

  // Background two-way synchronization with Supabase for authenticated users
  useEffect(() => {
    if (typeof window === "undefined" || hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    // Check if Supabase URL and Key are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return;
    }

    let isMounted = true;

    async function syncCloudProgress() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user || !isMounted) return;

        const userId = session.user.id;

        // 1. Fetch existing cloud completions
        const { data: cloudRecords, error: fetchErr } = await supabase
          .from("chapter_progress")
          .select("module_slug, chapter_slug, completed")
          .eq("user_id", userId);

        if (fetchErr || !isMounted) return;

        const localKeys = new Set(parseLocalKeys());
        const cloudCompletedKeys = new Set(
          (cloudRecords || [])
            .filter((r) => r.completed)
            .map((r) => `${r.module_slug}/${r.chapter_slug}`)
        );

        // 2. Merge cloud records into local storage
        const mergedKeys = Array.from(new Set([...localKeys, ...cloudCompletedKeys]));
        if (mergedKeys.length !== localKeys.size) {
          saveLocalKeys(mergedKeys);
        }

        // 3. Push local completions that are missing from cloud
        const unmergedLocal = Array.from(localKeys).filter((k) => !cloudCompletedKeys.has(k));

        const toInsert: Array<{
          user_id: string;
          module_slug: string;
          chapter_slug: string;
          completed: boolean;
        }> = [];

        for (const key of unmergedLocal) {
          const parts = key.split("/");
          if (parts.length === 2) {
            toInsert.push({
              user_id: userId,
              module_slug: parts[0],
              chapter_slug: parts[1],
              completed: true,
            });
          }
        }

        if (toInsert.length > 0) {
          await supabase.from("chapter_progress").upsert(toInsert, {
            onConflict: "user_id,module_slug,chapter_slug",
          });
        }
      } catch {
        // Fall back cleanly without breaking reader experience
      }
    }

    syncCloudProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  const isCompleted = (key: string) => completedSet.has(key);

  const syncToggleToCloud = async (key: string, willBeCompleted: boolean) => {
    if (
      typeof window === "undefined" ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }

    try {
      const parts = key.split("/");
      if (parts.length !== 2) return;
      const [moduleSlug, chapterSlug] = parts;

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;
      const userId = session.user.id;

      if (willBeCompleted) {
        await supabase.from("chapter_progress").upsert(
          {
            user_id: userId,
            module_slug: moduleSlug,
            chapter_slug: chapterSlug,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,module_slug,chapter_slug" }
        );

        // Record activity timeline entry for learning milestone
        await supabase.from("activity_timeline").insert({
          user_id: userId,
          action_type: "complete_chapter",
          algorithm_id: `chapter:${key}`,
          domain: "dsa",
          metadata: { module_slug: moduleSlug, chapter_slug: chapterSlug },
        });
      } else {
        await supabase
          .from("chapter_progress")
          .delete()
          .match({ user_id: userId, module_slug: moduleSlug, chapter_slug: chapterSlug });
      }
    } catch {
      // Local state is preserved
    }
  };

  const markCompleted = (key: string) => {
    const current = parseLocalKeys();
    if (!current.includes(key)) {
      saveLocalKeys([...current, key]);
      syncToggleToCloud(key, true);
    }
  };

  const markIncomplete = (key: string) => {
    const current = parseLocalKeys();
    if (current.includes(key)) {
      saveLocalKeys(current.filter((k) => k !== key));
      syncToggleToCloud(key, false);
    }
  };

  const toggleCompleted = (key: string) => {
    if (completedSet.has(key)) {
      markIncomplete(key);
    } else {
      markCompleted(key);
    }
  };

  return { completedSet, isCompleted, toggleCompleted, markCompleted, markIncomplete };
}
