"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRangeByDate } from "@/lib/db";
import type { EnergyLog } from "@/lib/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function colorFor(level: number): string {
  if (level === 0) return "hsl(var(--muted))";
  if (level <= 1.5) return "rgb(239 68 68 / 0.7)";
  if (level <= 2.5) return "rgb(245 158 11 / 0.7)";
  if (level <= 3.5) return "rgb(234 179 8 / 0.7)";
  if (level <= 4.5) return "rgb(132 204 22 / 0.7)";
  return "rgb(16 185 129 / 0.85)";
}

export function EnergyHeatmap() {
  const [grid, setGrid] = useState<number[][]>([]);

  useEffect(() => {
    (async () => {
      const from = format(subDays(new Date(), 28), "yyyy-MM-dd");
      const to = format(new Date(), "yyyy-MM-dd");
      const logs = await getRangeByDate("energy", from, to);
      const sums: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
      const counts: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
      for (const l of logs as EnergyLog[]) {
        const d = new Date(l.date);
        const dow = (d.getDay() + 6) % 7;
        sums[dow][l.hour] += l.level;
        counts[dow][l.hour] += 1;
      }
      const out = sums.map((row, i) => row.map((v, h) => (counts[i][h] === 0 ? 0 : v / counts[i][h])));
      setGrid(out);
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block">
            <div className="ml-10 mb-1 grid grid-cols-24 gap-px text-[9px] text-muted-foreground">
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="w-3 text-center">
                  {h % 6 === 0 ? h : ""}
                </div>
              ))}
            </div>
            {grid.map((row, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-9 text-right text-[10px] text-muted-foreground">{DAYS[i]}</div>
                <div className="flex gap-px">
                  {row.map((v, h) => (
                    <div
                      key={h}
                      title={`${DAYS[i]} ${h}:00 — ${v ? v.toFixed(1) : "-"}`}
                      className="h-3 w-3 rounded-sm"
                      style={{ background: colorFor(v) }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Avg energy 1-5 by day-of-week × hour, last 28 days.
        </p>
      </CardContent>
    </Card>
  );
}
