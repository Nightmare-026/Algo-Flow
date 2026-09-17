"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";
import { logger } from "@/lib/observability/logger";
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
    logger.error(error, {
      digest: error.digest,
      source: "global-error-boundary",
    });
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Something went wrong | AlgoFlow</title>
      </head>
      <body>
        <ErrorState
          title="AlgoFlow could not load"
          reference={error.digest}
          onRetry={reset ?? unstable_retry}
        />
      </body>
    </html>
  );
}
