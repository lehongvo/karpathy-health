"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Container } from "@/components/chrome/Container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/primitives/Tabs";
import { sleepRepo, deepWorkRepo, exerciseRepo, reviewRepo } from "@/lib/db/repos";
import { rollingMetrics, type RollingMetrics } from "@/lib/analytics";
import { EXERCISE_SESSIONS_PER_WEEK, SLEEP_MIN_HOURS } from "@/lib/protocols";

function StatRow({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={`font-mono text-lg ${ok ? "text-good" : ""}`}>{value}</span>
    </div>
  );
}

function WeeklyView() {
  const [m, setM] = useState<RollingMetrics | null>(null);
  useEffect(() => {
    (async () => {
      const from = format(subDays(new Date(), 6), "yyyy-MM-dd");
      const to = format(new Date(), "yyyy-MM-dd");
      const sleep = await sleepRepo.byRange(from, to);
      const dw = await deepWorkRepo.byRange(from, to);
      const ex = await exerciseRepo.byRange(from, to);
      setM(rollingMetrics(sleep, dw, ex, 7));
    })();
  }, []);
  return (
    <div className="space-y-8">
      <section>
        <h3 className="font-serif text-xl mb-3">Last 7 days</h3>
        <div className="space-y-1">
          <StatRow label="Sleep avg" value={m ? `${m.sleepAvg}h` : "—"} ok={!!m && m.sleepAvg >= SLEEP_MIN_HOURS} />
          <StatRow label="Nights below 6h" value={m ? String(m.nightsBelow6) : "—"} ok={!!m && m.nightsBelow6 === 0} />
          <StatRow
            label="Exercise sessions"
            value={m ? `${m.exerciseSessions}/${EXERCISE_SESSIONS_PER_WEEK}` : "—"}
            ok={!!m && m.exerciseSessions >= EXERCISE_SESSIONS_PER_WEEK}
          />
          <StatRow label="Deep work hours" value={m ? `${m.deepWorkHours}h` : "—"} ok={!!m && m.deepWorkHours >= 6} />
          <StatRow label="Days w/ deep work" value={m ? `${m.daysWithDeepWork}/7` : "—"} ok={!!m && m.daysWithDeepWork >= 4} />
        </div>
      </section>
      <section>
        <h3 className="font-serif text-xl mb-3">Next week — top 3 outcomes</h3>
        <ol className="list-decimal pl-5 text-sm space-y-2 text-text">
          <li>Pick the highest-leverage outcome — not a task, an outcome.</li>
          <li>Block its deep-work hours on the calendar now.</li>
          <li>If priority shifted from last week, write the reason in <code>docs/decision-log.md</code>.</li>
        </ol>
      </section>
    </div>
  );
}

function MonthlyView() {
  const [m, setM] = useState<RollingMetrics | null>(null);
  const [prev, setPrev] = useState<RollingMetrics | null>(null);
  useEffect(() => {
    (async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const from30 = format(subDays(new Date(), 29), "yyyy-MM-dd");
      const from60 = format(subDays(new Date(), 59), "yyyy-MM-dd");
      const sleep30 = await sleepRepo.byRange(from30, today);
      const dw30 = await deepWorkRepo.byRange(from30, today);
      const ex30 = await exerciseRepo.byRange(from30, today);
      setM(rollingMetrics(sleep30, dw30, ex30, 30));
      const sleep60 = await sleepRepo.byRange(from60, format(subDays(new Date(), 30), "yyyy-MM-dd"));
      const dw60 = await deepWorkRepo.byRange(from60, format(subDays(new Date(), 30), "yyyy-MM-dd"));
      const ex60 = await exerciseRepo.byRange(from60, format(subDays(new Date(), 30), "yyyy-MM-dd"));
      setPrev(rollingMetrics(sleep60, dw60, ex60, 30));
    })();
  }, []);
  return (
    <div className="space-y-6">
      <h3 className="font-serif text-xl">30-day vs prior 30</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-muted">Last 30</div>
          <StatRow label="Sleep avg" value={m ? `${m.sleepAvg}h` : "—"} ok={!!m && m.sleepAvg >= SLEEP_MIN_HOURS} />
          <StatRow label="Deep work hrs" value={m ? `${m.deepWorkHours}h` : "—"} ok={!!m && m.deepWorkHours >= 24} />
          <StatRow label="Exercise" value={m ? `${m.exerciseSessions}` : "—"} ok={!!m && m.exerciseSessions >= 12} />
        </div>
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-muted">Prior 30</div>
          <StatRow label="Sleep avg" value={prev ? `${prev.sleepAvg}h` : "—"} ok={!!prev && prev.sleepAvg >= SLEEP_MIN_HOURS} />
          <StatRow label="Deep work hrs" value={prev ? `${prev.deepWorkHours}h` : "—"} ok={!!prev && prev.deepWorkHours >= 24} />
          <StatRow label="Exercise" value={prev ? `${prev.exerciseSessions}` : "—"} ok={!!prev && prev.exerciseSessions >= 12} />
        </div>
      </div>
      <p className="text-xs text-muted">
        Trend up = system working. Trend down = pick ONE habit from <code>06-tldr</code> to fix this month, not three.
      </p>
    </div>
  );
}

function QuarterlyView() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="font-serif text-xl mb-2">Step 1 — Stats over the quarter</h3>
        <p className="text-muted">
          Open <a href="/insights" className="underline text-accent">Insights</a>, copy 90-day numbers: sleep avg, deep work hours total, exercise consistency, burnout incidents, projects shipped/paused/failed.
        </p>
      </section>
      <section>
        <h3 className="font-serif text-xl mb-2">Step 2 — Energy audit</h3>
        <p>List 3 each:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Drainers</strong>: activities that drained you most. Cancel one this quarter.</li>
          <li><strong>Energizers</strong>: activities that energized you. Add nothing — the goal is subtraction.</li>
        </ul>
      </section>
      <section>
        <h3 className="font-serif text-xl mb-2">Step 3 — Goal check</h3>
        <p className="text-muted">
          Goal of record: land remote Solana/Rust job by 2027. On track? Where's the bottleneck — skill, applications, network, sleep, family load?
        </p>
      </section>
      <section>
        <h3 className="font-serif text-xl mb-2">Step 4 — System adjustment</h3>
        <p>Add ≤1 habit. Drop ≤1 habit. Update <code>docs/decision-log.md</code>.</p>
      </section>
      <section>
        <h3 className="font-serif text-xl mb-2">Step 5 — Re-read</h3>
        <p>
          Re-read <a href="/protocols/00-philosophy" className="underline text-accent">00-philosophy</a> + <a href="/protocols/06-tldr" className="underline text-accent">06-tldr</a>. Are you still aligned?
        </p>
      </section>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Container className="py-8 md:py-12">
      <h1 className="font-serif text-3xl mb-1">Review</h1>
      <p className="text-sm text-muted mb-8">
        Three nested loops. Don't skip Sunday — the system rots without it.
      </p>
      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly"><WeeklyView /></TabsContent>
        <TabsContent value="monthly"><MonthlyView /></TabsContent>
        <TabsContent value="quarterly"><QuarterlyView /></TabsContent>
      </Tabs>
    </Container>
  );
}
