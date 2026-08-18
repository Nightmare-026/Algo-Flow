export function LoadingState() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-background px-4 py-24 text-foreground"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading page</span>
      <div className="mx-auto max-w-6xl animate-pulse space-y-8" aria-hidden="true">
        <div className="h-10 w-2/3 max-w-xl rounded-lg bg-muted" />
        <div className="h-5 w-full max-w-2xl rounded bg-muted" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-44 rounded-2xl border border-border bg-surface" />
          ))}
        </div>
      </div>
    </main>
  );
}
