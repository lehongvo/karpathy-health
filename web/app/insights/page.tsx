"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { computeInsights, rollingMetrics, type RollingMetrics } from "@/lib/analytics";
import { exportAll, getRangeByDate } from "@/lib/db";
import type { Insight } from "@/lib/types";

const WINDOWS: { label: string; days: number }[] = [
  { label: "30d", days: 30 },
  { label: "60d", days: 60 },
  { label: "90d", days: 90 },
];

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [metricsByWindow, setMetricsByWindow] = useState<Record<number, RollingMetrics>>({});

  useEffect(() => {
    (async () => {
      const widest = Math.max(...WINDOWS.map((w) => w.days));
      const from = format(subDays(new Date(), widest - 1), "yyyy-MM-dd");
      const to = format(new Date(), "yyyy-MM-dd");
      const sleep = await getRangeByDate("sleep", from, to);
      const dw = await getRangeByDate("deepWork", from, to);
      const ex = await getRangeByDate("exercise", from, to);
      setInsights(computeInsights(sleep, dw, ex, 30));
      const m: Record<number, RollingMetrics> = {};
      for (const w of WINDOWS) {
        m[w.days] = rollingMetrics(sleep, dw, ex, w.days);
      }
      setMetricsByWindow(m);
    })();
  }, []);

  const downloadJSON = async () => {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personal-os-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
          <p className="text-sm text-muted-foreground">
            Auto-detected correlations + rolling trends. Threshold: |r| ≥ 0.3, n ≥ 7.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadJSON}>
          Export JSON
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Rolling metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {WINDOWS.map((w) => {
              const m = metricsByWindow[w.days];
              return (
                <div key={w.days} className="rounded-md border bg-card/50 p-3">
                  <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">{w.label}</div>
                  <div className="space-y-1 text-sm">
                    <Row label="Sleep avg" value={m ? `${m.sleepAvg}h` : "—"} />
                    <Row label="Nights <6h" value={m ? String(m.nightsBelow6) : "—"} />
                    <Row label="Exercise sessions" value={m ? String(m.exerciseSessions) : "—"} />
                    <Row label="Deep work hours" value={m ? `${m.deepWorkHours}h` : "—"} />
                    <Row label="Days w/ deep work" value={m ? `${m.daysWithDeepWork}/${w.days}` : "—"} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Correlations</CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Not enough data yet — need ≥7 days. Or no correlation passed the |r| ≥ 0.3 threshold.
            </p>
          ) : (
            <ul className="space-y-3">
              {insights.map((i) => (
                <li key={i.id} className="rounded-md border bg-card/50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{i.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{i.description}</div>
                    </div>
                    <Badge variant={i.direction === "positive" ? "success" : "warning"}>
                      r = {i.effectSize.toFixed(2)}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Correlation is not causation. Use these as hypotheses to test, not laws.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm">{value}</span>
    </div>
  );
}
