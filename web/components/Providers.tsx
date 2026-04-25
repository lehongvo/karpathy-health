"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import { seedIfEmpty } from "@/lib/seed";

export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty()
      .catch((err) => console.error("seed error", err))
      .finally(() => setReady(true));
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div data-seed={ready ? "ready" : "loading"}>{children}</div>
    </ThemeProvider>
  );
}
