"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Download } from "lucide-react";
import { Container } from "@/components/chrome/Container";
import { Button } from "@/components/primitives/Button";
import { sleepRepo, deepWorkRepo, exerciseRepo } from "@/lib/db/repos";
import { exportAll } from "@/lib/db";
import { computeInsights, rollingMetrics, type RollingMetrics } from "@/lib/analytics";
import type { Insight } from "@/lib/types";

const WINDOWS = [
  { label: "30d", days: 30 },
  { label: "60d", days: 60 },
  { label: "90d", days: 90 },
];

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [byWindow, setByWindow] = useState<Record<number, RollingMetrics>>({});

  useEffect(() => {
    (async () => {
      const widest = Math.max(...WINDOWS.map((w) => w.days));
      const from = format(subDays(new Date(), widest - 1), "yyyy-MM-dd");
      const to = format(new Date(), "yyyy-MM-dd");
      const sleep = await sleepRepo.byRange(from, to);
      const dw = await deepWorkRepo.byRange(from, to);
      const ex = await exerciseRepo.byRange(from, to);
      setInsights(computeInsights(sleep, dw, ex, 30));
      const next: Record<number, RollingMetrics> = {};
      for (const w of WINDOWS) next[w.days] = rollingMetrics(sleep, dw, ex, w.days);
      setByWindow(next);
    })();
  }, []);

  const downloadJSON = async () => {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personal-os-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-8 md:py-12 space-y-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-1">Insights</h1>
          <p className="text-sm text-muted">
            Auto-detected correlations. Threshold: |r| ≥ 0.3, n ≥ 7. Use as hypotheses, not laws.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={downloadJSON}>
          <Download className="h-3.5 w-3.5" /> Export JSON
        </Button>
      </header>

      <section>
        <h2 className="font-serif text-xl mb-4">Rolling metrics</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {WINDOWS.map((w) => {
            const m = byWindow[w.days];
            return (
              <div key={w.days} className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-muted mb-2">{w.label}</div>
                <Row label="Sleep avg" value={m ? `${m.sleepAvg}h` : "—"} />
                <Row label="Nights <6h" value={m ? String(m.nightsBelow6) : "—"} />
                <Row label="Exercise sessions" value={m ? String(m.exerciseSessions) : "—"} />
                <Row label="Deep work hours" value={m ? `${m.deepWorkHours}h` : "—"} />
                <Row label="Days w/ deep work" value={m ? `${m.daysWithDeepWork}/${w.days}` : "—"} />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl mb-4">Correlations</h2>
        {insights.length === 0 ? (
          <p className="text-sm text-muted">
            Not enough data yet — need ≥7 days. Or no correlation passed the |r| ≥ 0.3 threshold.
          </p>
        ) : (
          <ul className="space-y-3">
            {insights.map((i) => (
              <li key={i.id} className="border-l-2 border-accent pl-4 py-2">
                <div className="font-medium">{i.title}</div>
                <div className="mt-1 text-xs text-muted flex items-center gap-3">
                  <span>{i.description}</span>
                  <span className={`font-mono ${i.direction === "positive" ? "text-good" : "text-alert"}`}>
                    r = {i.effectSize.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted">Correlation is not causation. These are starting points for experiments.</p>
      </section>
    </Container>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="font-mono text-sm">{value}</span>
    </div>
  );
}
