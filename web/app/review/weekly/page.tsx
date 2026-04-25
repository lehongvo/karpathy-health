"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRangeByDate } from "@/lib/db";
import { rollingMetrics, type RollingMetrics } from "@/lib/analytics";
import { EXERCISE_SESSIONS_PER_WEEK, SLEEP_MIN_HOURS } from "@/lib/protocols";

export default function WeeklyReviewPage() {
  const [m, setM] = useState<RollingMetrics | null>(null);

  useEffect(() => {
    (async () => {
      const from = format(subDays(new Date(), 6), "yyyy-MM-dd");
      const to = format(new Date(), "yyyy-MM-dd");
      const sleep = await getRangeByDate("sleep", from, to);
      const dw = await getRangeByDate("deepWork", from, to);
      const ex = await getRangeByDate("exercise", from, to);
      setM(rollingMetrics(sleep, dw, ex, 7));
    })();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Weekly review (Sunday, 30 min)</h1>
        <p className="text-sm text-muted-foreground">
          Stats → project review → next-week top 3. The system rots without this.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Last 7 days</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <StatRow label="Sleep avg" value={m ? `${m.sleepAvg}h` : "—"} ok={!!m && m.sleepAvg >= SLEEP_MIN_HOURS} />
          <StatRow
            label="Nights <6h"
            value={m ? String(m.nightsBelow6) : "—"}
            ok={!!m && m.nightsBelow6 === 0}
            invert
          />
          <StatRow
            label="Exercise sessions"
            value={m ? `${m.exerciseSessions}/${EXERCISE_SESSIONS_PER_WEEK}` : "—"}
            ok={!!m && m.exerciseSessions >= EXERCISE_SESSIONS_PER_WEEK}
          />
          <StatRow label="Deep work hours" value={m ? `${m.deepWorkHours}h` : "—"} ok={!!m && m.deepWorkHours >= 6} />
          <StatRow
            label="Days w/ deep work"
            value={m ? `${m.daysWithDeepWork}/7` : "—"}
            ok={!!m && m.daysWithDeepWork >= 4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next week — top 3 outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>Pick the highest-leverage outcome for next week. Not a task — an outcome.</li>
            <li>Block the deep work hours for it on your calendar now.</li>
            <li>If priority shifted from last week, write the reason in <code>docs/decision-log.md</code>.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

function StatRow({
  label,
  value,
  ok,
  invert,
}: {
  label: string;
  value: string;
  ok: boolean;
  invert?: boolean;
}) {
  const isOk = invert ? !ok : ok;
  return (
    <div className="rounded-md border bg-card/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono text-2xl ${isOk ? "text-[var(--color-health)]" : ""}`}>{value}</div>
    </div>
  );
}
