"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <title>Something went wrong | AlgoFlow</title>
        <ErrorState
          title="AlgoFlow could not load"
          reference={error.digest}
          onRetry={reset ?? unstable_retry}
        />
      </body>
    </html>
  );
}
