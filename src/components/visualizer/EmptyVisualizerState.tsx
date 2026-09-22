"use client";

export function EmptyVisualizerState({
  message = "No visualization data yet.",
  hint = "Configure the inputs below and press Generate to run the visualizer.",
}: {
  message?: string;
  hint?: string;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 text-center" role="status">
      <div className="max-w-sm rounded-2xl border border-dashed border-border bg-surface p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-muted text-xl font-bold text-primary">
          AF
        </div>
        <h3 className="mb-1 text-lg font-bold text-text-primary">{message}</h3>
        <p className="text-sm leading-6 text-text-secondary">{hint}</p>
      </div>
    </div>
  );
}
