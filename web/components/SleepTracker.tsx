"use client";

import { useEffect, useState } from "react";
import { format, parseISO, subDays } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { getDB, getRangeByDate } from "@/lib/db";
import type { SleepLog } from "@/lib/types";
import { SLEEP_MIN_HOURS } from "@/lib/protocols";

function hoursBetween(bedtime: string, wakeTime: string): number {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = wakeTime.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

export function SleepTracker() {
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState(3);
  const [logs, setLogs] = useState<SleepLog[]>([]);

  const refresh = async () => {
    const from = format(subDays(new Date(), 30), "yyyy-MM-dd");
    const to = format(new Date(), "yyyy-MM-dd");
    const data = await getRangeByDate("sleep", from, to);
    setLogs(data);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const submit = async () => {
    const date = format(new Date(), "yyyy-MM-dd");
    const db = await getDB();
    const hours = hoursBetween(bedtime, wakeTime);
    const log: SleepLog = {
      date,
      bedtime,
      wakeTime,
      hours,
      quality: Math.min(5, Math.max(1, Math.round(quality))) as 1 | 2 | 3 | 4 | 5,
    };
    await db.put("sleep", log);
    await refresh();
  };

  const chartData = logs.map((l) => ({
    date: format(parseISO(l.date), "MMM d"),
    hours: l.hours,
  }));
  const avg =
    logs.length > 0 ? Math.round((logs.reduce((s, l) => s + l.hours, 0) / logs.length) * 10) / 10 : 0;
  const nightsBelow6 = logs.filter((l) => l.hours < 6).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Log last night</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="bed">Bedtime</Label>
              <Input id="bed" type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="wake">Wake time</Label>
              <Input id="wake" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex justify-between">
              <Label>Quality</Label>
              <span className="font-mono text-sm">{quality}/5</span>
            </div>
            <Slider min={1} max={5} step={1} value={[quality]} onValueChange={([v]) => setQuality(v)} />
          </div>
          <Button onClick={submit}>Log {hoursBetween(bedtime, wakeTime)}h</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>30-day rolling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-muted-foreground">Avg</div>
              <div className="font-mono text-2xl">{avg}h</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Below 6h</div>
              <div className="font-mono text-2xl">{nightsBelow6}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Logged</div>
              <div className="font-mono text-2xl">{logs.length}</div>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis domain={[3, 10]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <ReferenceLine y={SLEEP_MIN_HOURS} stroke="var(--color-health)" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--color-rust)"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 0, fill: "var(--color-rust)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Reference line = {SLEEP_MIN_HOURS}h target. Per Van Dongen 2003, chronic &lt;6h = unrecognized cognitive deficit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
