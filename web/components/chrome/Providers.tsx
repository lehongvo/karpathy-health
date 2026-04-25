"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { useApp } from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";

export function Providers({ children }: { children: ReactNode }) {
  const hydrate = useApp((s) => s.hydrate);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await seedIfEmpty();
      } catch (err) {
        console.error("seed failed", err);
      }
      if (!cancelled) hydrate();
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrate]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
