export function LoadingState() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-background px-4 py-24 text-foreground"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading page content</span>
      <div className="mx-auto max-w-6xl space-y-8" aria-hidden="true">
        <div className="space-y-3">
          <div className="h-9 w-2/3 max-w-md rounded-2xl border border-border bg-surface shadow-[var(--shadow-raised-sm)] animate-pulse" />
          <div className="h-5 w-full max-w-xl rounded-xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] animate-pulse" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="neu-raised flex h-48 flex-col justify-between rounded-2xl border border-border p-6 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-surface-inset" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-3/4 rounded bg-surface-inset" />
                  <div className="h-3 w-1/2 rounded bg-surface-inset" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-surface-inset" />
                <div className="h-3 w-4/5 rounded bg-surface-inset" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
