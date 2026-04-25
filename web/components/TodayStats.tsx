"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { getRangeByDate } from "@/lib/db";
import { Moon, Brain, Activity } from "lucide-react";

interface Stats {
  sleepLast: number;
  deepWorkToday: number;
  exerciseToday: boolean;
}

export function TodayStats() {
  const [stats, setStats] = useState<Stats>({ sleepLast: 0, deepWorkToday: 0, exerciseToday: false });

  useEffect(() => {
    (async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
      const sleep = await getRangeByDate("sleep", yesterday, today);
      const dw = await getRangeByDate("deepWork", today, today);
      const ex = await getRangeByDate("exercise", today, today);
      const last = sleep[sleep.length - 1];
      setStats({
        sleepLast: last?.hours ?? 0,
        deepWorkToday: dw.reduce((s, b) => s + b.durationMin, 0) / 60,
        exerciseToday: ex.length > 0,
      });
    })();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      <Stat
        icon={<Moon className="h-4 w-4" />}
        label="Sleep"
        value={`${stats.sleepLast.toFixed(1)}h`}
        ok={stats.sleepLast >= 7}
      />
      <Stat
        icon={<Brain className="h-4 w-4" />}
        label="Deep work"
        value={`${stats.deepWorkToday.toFixed(1)}h`}
        ok={stats.deepWorkToday >= 1.5}
      />
      <Stat
        icon={<Activity className="h-4 w-4" />}
        label="Exercise"
        value={stats.exerciseToday ? "✓" : "—"}
        ok={stats.exerciseToday}
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  ok,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <div className={`mt-2 font-mono text-2xl ${ok ? "text-[var(--color-health)]" : ""}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
