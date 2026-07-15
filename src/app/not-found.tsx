import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-lg">
        <SearchX aria-hidden="true" className="mx-auto h-14 w-14 text-primary" />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page or visualizer you requested does not exist, may have moved, or is not published.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={cn(buttonVariants(), "no-underline")}>
            Return home
          </Link>
          <Link
            href="/visualizers"
            className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          >
            Browse visualizers
          </Link>
        </div>
      </section>
    </main>
  );
}
