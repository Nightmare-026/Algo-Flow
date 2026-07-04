export default function VisualizerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Algorithm Visualizer</h1>
        <p className="text-text-muted">Interactive visualizer — coming in Phase 3-4</p>
      </div>
    </main>
  );
}
