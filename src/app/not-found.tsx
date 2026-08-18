import Link from "next/link";
import { Compass, Home, SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground"
    >
      <section className="neu-float w-full max-w-lg rounded-3xl p-8 sm:p-10 text-center border border-border">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] text-primary">
          <SearchX aria-hidden="true" className="h-10 w-10" />
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          404 Error
        </p>
        <h1 className="mt-2 text-3xl font-extrabold font-display tracking-tight text-text-primary sm:text-4xl">
          Algorithm Not Found
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          The requested page or visualizer does not exist or may have been relocated in the catalog.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={cn(buttonVariants({ size: "lg" }), "no-underline")}>
            <Home className="h-4 w-4" />
            Return Home
          </Link>
          <Link
            href="/visualizers"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "no-underline")}
          >
            <Compass className="h-4 w-4" />
            Explore Library
          </Link>
        </div>
      </section>
    </main>
  );
}
