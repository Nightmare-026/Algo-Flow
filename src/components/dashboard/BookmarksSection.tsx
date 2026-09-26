import React from "react";
import Link from "next/link";
import { Bookmark, Play, ArrowRight } from "lucide-react";
import type { BookmarkAlgorithm } from "@/features/bookmarks/api";
import { cn } from "@/lib/utils";

export interface BookmarksSectionProps {
  bookmarks: BookmarkAlgorithm[];
}

export function BookmarksSection({ bookmarks }: BookmarksSectionProps) {
  return (
    <section className="p-6 rounded-lg border border-border bg-surface shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-secondary-muted text-secondary border border-secondary/20">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </span>
            <h2 className="text-base font-bold font-display text-text-primary">
              Saved Visualizers
            </h2>
          </div>
          <span className="text-[11px] font-mono font-bold text-text-muted bg-surface-secondary px-2.5 py-0.5 rounded-full border border-border">
            {bookmarks.length} Saved
          </span>
        </div>

        {bookmarks.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {bookmarks.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-md border border-border bg-surface hover:bg-surface-secondary hover:border-primary/40 transition-all group shadow-xs"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-text-primary truncate">{item.name}</h3>
                    {item.difficulty && (
                      <span
                        className={cn(
                          "px-1.5 py-0.2 rounded-xs text-[9px] font-mono font-bold uppercase",
                          item.difficulty === "easy" && "bg-success-muted text-success",
                          item.difficulty === "medium" && "bg-warning-muted text-warning",
                          item.difficulty === "hard" && "bg-error-muted text-error"
                        )}
                      >
                        {item.difficulty}
                      </span>
                    )}
                  </div>
                  {item.shortDescription && (
                    <p className="text-[11px] text-text-muted truncate mt-0.5 max-w-55">
                      {item.shortDescription}
                    </p>
                  )}
                </div>

                <Link
                  href={`/visualizer/${item.slug}`}
                  className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-white hover:bg-primary-hover shadow-xs transition-transform active:scale-[0.99] shrink-0"
                  aria-label={`Launch ${item.name} visualizer`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-lg border border-border bg-surface-secondary/50 text-center flex flex-col items-center justify-center shadow-xs">
            <Bookmark className="w-6 h-6 text-text-muted mb-2 stroke-[1.5]" />
            <p className="text-xs font-bold text-text-primary">No bookmarks yet</p>
            <p className="text-[11px] text-text-secondary mt-1 max-w-55">
              Click the bookmark icon on any algorithm simulation to save it here for instant
              review.
            </p>
            <Link
              href="/visualizers"
              className="mt-3 text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Browse Catalog <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {bookmarks.length > 4 && (
        <div className="pt-3 mt-3 border-t border-border flex justify-end">
          <Link
            href="/visualizers"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View all ({bookmarks.length}) <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </section>
  );
}
