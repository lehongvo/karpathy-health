"use client";

import { useEffect } from "react";
import { Container } from "@/components/chrome/Container";
import { Button } from "@/components/primitives/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Container className="py-12">
      <h1 className="font-serif text-2xl mb-2">Something failed</h1>
      <p className="text-sm text-muted mb-6">{error.message}</p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </Container>
  );
}
