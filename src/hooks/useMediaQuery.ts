import { useCallback, useSyncExternalStore } from "react";

function subscribe(query: string, callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getSnapshot(query: string) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query: string): boolean {
  const subscribeToQuery = useCallback(
    (onStoreChange: () => void) => subscribe(query, onStoreChange),
    [query]
  );
  return useSyncExternalStore(
    subscribeToQuery,
    () => getSnapshot(query),
    getServerSnapshot
  );
}
