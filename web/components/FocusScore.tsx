"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRangeByDate } from "@/lib/db";
import type { DeepWorkBlock } from "@/lib/types";
import { focusScore } from "@/lib/analytics";

export function FocusScore() {
  const [data, setData] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    (async () => {
      const from = format(subDays(new Date(), 14), "yyyy-MM-dd");
      const to = format(new Date(), "yyyy-MM-dd");
      const blocks = await getRangeByDate("deepWork", from, to);
      const grouped = new Map<string, DeepWorkBlock[]>();
      for (const b of blocks) {
        const list = grouped.get(b.date) ?? [];
        list.push(b);
        grouped.set(b.date, list);
      }
      const series: { date: string; score: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        const list = grouped.get(date) ?? [];
        const dwHours = list.reduce((s, b) => s + b.durationMin, 0) / 60;
        const avgQ = list.length > 0 ? list.reduce((s, b) => s + b.focusQuality, 0) / list.length : 0;
        const totalWork = Math.max(dwHours, 4);
        series.push({ date: format(new Date(date), "MMM d"), score: focusScore(dwHours, totalWork, avgQ) });
      }
      setData(series);
    })();
  }, []);

  const today = data[data.length - 1]?.score ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-baseline gap-3">
          <span className="font-mono text-4xl">{today}</span>
          <span className="text-xs text-muted-foreground">today (0-100)</span>
        </div>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="score" stroke="var(--color-rust)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Score = (deep_work_hours ÷ total_work_hours) × focus_quality. 14-day trend.
        </p>
      </CardContent>
    </Card>
  );
}
