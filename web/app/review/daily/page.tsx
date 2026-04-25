"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getDB, getRangeByDate } from "@/lib/db";
import type { DailyReview } from "@/lib/types";
import { rollingMetrics } from "@/lib/analytics";

export default function DailyReviewPage() {
  const [wins, setWins] = useState(["", "", ""]);
  const [lesson, setLesson] = useState("");
  const [tomorrowMIT, setTomorrowMIT] = useState("");
  const [energyRetro, setEnergyRetro] = useState(3);
  const [stats, setStats] = useState({ deepWorkHours: 0, exerciseSessions: 0, sleepAvg: 0 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const sleep = await getRangeByDate("sleep", today, today);
      const dw = await getRangeByDate("deepWork", today, today);
      const ex = await getRangeByDate("exercise", today, today);
      const m = rollingMetrics(sleep, dw, ex, 1);
      setStats({
        deepWorkHours: m.deepWorkHours,
        exerciseSessions: m.exerciseSessions,
        sleepAvg: m.sleepAvg,
      });
    })();
  }, []);

  const save = async () => {
    const db = await getDB();
    const review: DailyReview = {
      date: format(new Date(), "yyyy-MM-dd"),
      wins: wins.filter(Boolean),
      lesson,
      tomorrowMIT,
      energyRetro: Math.min(5, Math.max(1, energyRetro)) as 1 | 2 | 3 | 4 | 5,
    };
    await db.put("reviews", review);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Daily review (5 min)</h1>
        <p className="text-sm text-muted-foreground">Evening retrospective. The cheap insurance against drift.</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatChip label="Sleep" value={`${stats.sleepAvg}h`} />
        <StatChip label="Deep work" value={`${stats.deepWorkHours}h`} />
        <StatChip label="Exercise" value={stats.exerciseSessions > 0 ? "✓" : "—"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>3 wins</Label>
            <div className="mt-2 space-y-2">
              {wins.map((w, i) => (
                <Input
                  key={i}
                  placeholder={`Win ${i + 1}`}
                  value={w}
                  onChange={(e) => {
                    const next = [...wins];
                    next[i] = e.target.value;
                    setWins(next);
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="lesson">1 lesson</Label>
            <Textarea
              id="lesson"
              rows={2}
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              placeholder="One thing you learned or would do differently."
            />
          </div>
          <div>
            <div className="mb-2 flex justify-between">
              <Label>Energy retro (1-5)</Label>
              <span className="font-mono text-sm">{energyRetro}/5</span>
            </div>
            <Slider min={1} max={5} step={1} value={[energyRetro]} onValueChange={([v]) => setEnergyRetro(v)} />
          </div>
          <div>
            <Label htmlFor="mit">Tomorrow&apos;s MIT</Label>
            <Input
              id="mit"
              value={tomorrowMIT}
              onChange={(e) => setTomorrowMIT(e.target.value)}
              placeholder="The one thing tomorrow that makes it a win"
            />
          </div>
          <Button onClick={save}>{saved ? "Saved ✓ — save again" : "Save review"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 font-mono text-2xl">{value}</div>
      </CardContent>
    </Card>
  );
}
