"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRangeByDate } from "@/lib/db";

interface DayCell {
  date: string;
  hit: boolean;
}

export function HabitChain({ title, source }: { title: string; source: "sleep" | "exercise" }) {
  const [cells, setCells] = useState<DayCell[]>([]);

  useEffect(() => {
    (async () => {
      const from = format(subDays(new Date(), 90), "yyyy-MM-dd");
      const to = format(new Date(), "yyyy-MM-dd");
      const data =
        source === "sleep"
          ? await getRangeByDate("sleep", from, to)
          : await getRangeByDate("exercise", from, to);
      const set = new Set(data.map((r) => r.date));
      const next: DayCell[] = [];
      for (let i = 89; i >= 0; i--) {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        next.push({
          date,
          hit:
            source === "sleep"
              ? data.some((r) => r.date === date && (r as { hours: number }).hours >= 7)
              : set.has(date),
        });
      }
      setCells(next);
    })();
  }, [source]);

  let streak = 0;
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].hit) streak += 1;
    else break;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <span className="font-mono text-sm">streak: {streak}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-1">
          {cells.slice(-90).map((c) => (
            <div
              key={c.date}
              title={`${c.date} — ${c.hit ? "hit" : "miss"}`}
              className={`aspect-square rounded-sm ${c.hit ? "bg-[var(--color-health)]" : "bg-muted"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Last 90 days. Green = met target.</p>
      </CardContent>
    </Card>
  );
}
