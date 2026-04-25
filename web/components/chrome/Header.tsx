"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Sunrise, Sunset, CircleDot } from "lucide-react";
import { Container } from "./Container";
import { useApp, activeMode } from "@/lib/store";
import type { RitualMode } from "@/lib/protocols";
import { cn } from "@/lib/utils";

const MODE_ICON: Record<RitualMode, React.ReactNode> = {
  morning: <Sunrise className="h-3.5 w-3.5" />,
  day: <CircleDot className="h-3.5 w-3.5" />,
  evening: <Sunset className="h-3.5 w-3.5" />,
};

export function Header() {
  const { modeOverride, setMode } = useApp();
  const mode = activeMode(modeOverride);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-20">
      <Container className="flex items-center justify-between py-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted">
            {format(new Date(), "EEEE")}
          </div>
          <div className="font-serif text-lg leading-tight">{format(new Date(), "MMMM d, yyyy")}</div>
        </div>
        <div className="flex items-center gap-1">
          {(["morning", "day", "evening"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(modeOverride === m ? null : m)}
              title={m}
              className={cn(
                "h-8 w-8 rounded-md flex items-center justify-center transition-colors",
                mode === m
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:bg-accent-soft/50",
              )}
            >
              {MODE_ICON[m]}
            </button>
          ))}
          <div className="ml-2 h-5 w-px bg-border" />
          {mounted ? (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-md flex items-center justify-center text-muted hover:bg-accent-soft/50 ml-1"
              title="toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          ) : (
            <div className="h-8 w-8" />
          )}
        </div>
      </Container>
    </header>
  );
}
