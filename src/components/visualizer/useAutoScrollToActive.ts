import { useEffect, type RefObject } from "react";
import { usePathname } from "next/navigation";

interface UseAutoScrollToActiveOptions {
  containerRef: RefObject<HTMLElement | null>;
  activeElementRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  trigger?: unknown;
}

function isElementVisible(element: HTMLElement): boolean {
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility();
  }
  return element.offsetWidth > 0 && element.offsetHeight > 0;
}

export function useAutoScrollToActive({
  containerRef,
  activeElementRef,
  reducedMotion,
  trigger,
}: UseAutoScrollToActiveOptions) {
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollActiveIntoView = () => {
      if (!isElementVisible(container)) return;
      const activeElement = activeElementRef.current;
      if (!activeElement || !activeElement.isConnected) return;

      const top =
        container.scrollTop +
        activeElement.getBoundingClientRect().top -
        container.getBoundingClientRect().top -
        container.clientHeight / 2 +
        activeElement.offsetHeight / 2;
      container.scrollTo({
        top: Math.max(0, top),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    };

    scrollActiveIntoView();

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scrollActiveIntoView);
      resizeObserver.observe(container);
    }

    return () => resizeObserver?.disconnect();
  }, [activeElementRef, containerRef, pathname, reducedMotion, trigger]);
}
