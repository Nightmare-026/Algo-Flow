export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8" data-theme="nature-cinematic">
      {/* Hero placeholder — will be replaced in Phase 1 */}
      <div className="flex flex-col items-center gap-6 max-w-3xl text-center">
        {/* Logo */}
        <div className="relative w-24 h-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Algo Flow Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm text-text-muted">
          🚀 Learn DSA Visually
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Master Data Structures Through{" "}
          <span className="text-gradient-primary">Beautiful Visual Journeys</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-text-muted max-w-2xl">
          Explore arrays, stacks, queues, trees, graphs, and algorithms with
          step-by-step animated explanations. 200+ interactive visualizers in
          4 programming languages.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <a
            href="/visualizers"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-text-inverse transition-all hover:bg-primary-hover hover:shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:scale-[0.96]"
          >
            Start Visualizing
          </a>
          <a
            href="/visualizers"
            className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 text-base font-semibold text-text-primary transition-all hover:border-border-active hover:bg-surface-hover hover:-translate-y-0.5"
          >
            Explore Algorithms
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">200+</span>
            <span>Visualizers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">4</span>
            <span>Code Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">10</span>
            <span>Data Structures</span>
          </div>
        </div>
      </div>

      {/* Phase 0 status indicator */}
      <div className="fixed bottom-4 right-4 glass-card-nature rounded-lg px-4 py-2 text-xs text-text-muted">
        Phase 0 — Setup Complete ✓
      </div>
    </main>
  );
}
