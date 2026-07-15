"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return <ErrorState reference={error.digest} onRetry={unstable_retry} />;
}
