"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";
import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <title>Something went wrong | Algo Flow</title>
        <ErrorState
          title="Algo Flow could not load"
          reference={error.digest}
          onRetry={unstable_retry}
        />
      </body>
    </html>
  );
}
