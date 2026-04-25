"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { AlertTriangle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRangeByDate, getAll } from "@/lib/db";
import { BURNOUT_RULES, MAX_ACTIVE_PROJECTS } from "@/lib/protocols";
import type { Project } from "@/lib/types";

interface FiredRule {
  id: string;
  label: string;
  description: string;
}

export function BurnoutAlert() {
  const [fired, setFired] = useState<FiredRule[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const out: FiredRule[] = [];
      const today = format(new Date(), "yyyy-MM-dd");

      // sleep-debt-3d
      const sleepFrom = format(subDays(new Date(), 2), "yyyy-MM-dd");
      const sleep = await getRangeByDate("sleep", sleepFrom, today);
      const last3 = sleep.slice(-3);
      if (last3.length === 3 && last3.every((s) => s.hours < 6)) {
        const r = BURNOUT_RULES.find((x) => x.id === "sleep-debt-3d");
        if (r) out.push(r);
      }

      // no-exercise-5d
      const exFrom = format(subDays(new Date(), 4), "yyyy-MM-dd");
      const ex = await getRangeByDate("exercise", exFrom, today);
      if (ex.length === 0) {
        const r = BURNOUT_RULES.find((x) => x.id === "no-exercise-5d");
        if (r) out.push(r);
      }

      // deep-work-collapse: last 7d hours < 50% of last 28d avg
      const dwFrom28 = format(subDays(new Date(), 27), "yyyy-MM-dd");
      const dw = await getRangeByDate("deepWork", dwFrom28, today);
      const last7Sum =
        dw.filter((b) => b.date >= format(subDays(new Date(), 6), "yyyy-MM-dd")).reduce(
          (s, b) => s + b.durationMin,
          0,
        ) / 60;
      const totalSum = dw.reduce((s, b) => s + b.durationMin, 0) / 60;
      const baseline28 = totalSum / 28;
      const baseline7 = baseline28 * 7;
      if (baseline28 > 0.5 && last7Sum < baseline7 * 0.5) {
        const r = BURNOUT_RULES.find((x) => x.id === "deep-work-collapse");
        if (r) out.push(r);
      }

      // active-overload
      const projects = (await getAll("projects")) as Project[];
      const activeCount = projects.filter((p) => p.status === "active").length;
      if (activeCount > MAX_ACTIVE_PROJECTS) {
        const r = BURNOUT_RULES.find((x) => x.id === "active-overload");
        if (r) out.push(r);
      }

      setFired(out);
    })();
  }, []);

  const visible = fired.filter((f) => !dismissed.includes(f.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((r) => (
        <Card key={r.id} className="border-[var(--color-warning)]/60 bg-[var(--color-warning)]/10">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-warning)]" />
            <div className="flex-1">
              <div className="text-sm font-semibold">{r.label}</div>
              <div className="mt-1 text-xs text-foreground/80">{r.description}</div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDismissed((d) => [...d, r.id])}
              aria-label="dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
