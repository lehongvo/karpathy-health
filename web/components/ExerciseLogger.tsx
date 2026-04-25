"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getDB, getRangeByDate } from "@/lib/db";
import type { ExerciseLog, ExerciseType } from "@/lib/types";
import { EXERCISE_SESSIONS_PER_WEEK, EXERCISE_MIN_MINUTES } from "@/lib/protocols";

const TYPES: ExerciseType[] = ["cardio", "strength", "walk", "yoga", "other"];

export function ExerciseLogger() {
  const [type, setType] = useState<ExerciseType>("cardio");
  const [duration, setDuration] = useState(40);
  const [intensity, setIntensity] = useState(3);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);

  const refresh = async () => {
    const from = format(subDays(new Date(), 7), "yyyy-MM-dd");
    const to = format(new Date(), "yyyy-MM-dd");
    setLogs(await getRangeByDate("exercise", from, to));
  };

  useEffect(() => {
    void refresh();
  }, []);

  const submit = async () => {
    const db = await getDB();
    const log: ExerciseLog = {
      date: format(new Date(), "yyyy-MM-dd"),
      type,
      durationMin: duration,
      intensity: Math.min(5, Math.max(1, intensity)) as 1 | 2 | 3 | 4 | 5,
    };
    await db.put("exercise", log);
    await refresh();
  };

  const sessionsThisWeek = logs.length;
  const pct = Math.round((sessionsThisWeek / EXERCISE_SESSIONS_PER_WEEK) * 100);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Log session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Type</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={type === t ? "default" : "outline"}
                  onClick={() => setType(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Duration (min)</Label>
            <Input
              type="number"
              value={duration}
              min={5}
              max={240}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div>
            <div className="mb-2 flex justify-between">
              <Label>Intensity</Label>
              <span className="font-mono text-sm">{intensity}/5</span>
            </div>
            <Slider min={1} max={5} step={1} value={[intensity]} onValueChange={([v]) => setIntensity(v)} />
          </div>
          <Button onClick={submit}>Log session</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>This week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-2xl">
              {sessionsThisWeek}/{EXERCISE_SESSIONS_PER_WEEK}
            </span>
            <Badge variant={sessionsThisWeek >= EXERCISE_SESSIONS_PER_WEEK ? "success" : "outline"}>
              {sessionsThisWeek >= EXERCISE_SESSIONS_PER_WEEK ? "Hit target" : "Below target"}
            </Badge>
          </div>
          <Progress value={Math.min(100, pct)} />
          <p className="mt-2 text-xs text-muted-foreground">
            Target: {EXERCISE_SESSIONS_PER_WEEK} sessions × {EXERCISE_MIN_MINUTES} min Zone-2 (Erickson 2011).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
