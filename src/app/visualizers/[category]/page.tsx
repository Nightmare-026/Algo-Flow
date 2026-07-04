export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Category Visualizers</h1>
        <p className="text-text-muted">Algorithms for this category — coming in Phase 2</p>
      </div>
    </main>
  );
}
