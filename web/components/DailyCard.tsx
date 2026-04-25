"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDB, getRangeByDate } from "@/lib/db";
import type { Task, EnergyLog } from "@/lib/types";

const TODAY = () => format(new Date(), "yyyy-MM-dd");

export function DailyCard() {
  const [mit, setMit] = useState("");
  const [mitDone, setMitDone] = useState(false);
  const [topThree, setTopThree] = useState<string[]>(["", "", ""]);
  const [energy, setEnergy] = useState<number>(3);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const date = TODAY();
      const tasks = await getRangeByDate("tasks", date, date);
      const mitRow = tasks.find((t) => t.priority === "mit");
      const others = tasks.filter((t) => t.priority !== "mit");
      const energyRows = await getRangeByDate("energy", date, date);
      if (cancelled) return;
      if (mitRow) {
        setMit(mitRow.text);
        setMitDone(mitRow.done);
      }
      const top: string[] = ["", "", ""];
      others.slice(0, 3).forEach((t, i) => (top[i] = t.text));
      setTopThree(top);
      if (energyRows.length > 0) {
        setEnergy(energyRows[energyRows.length - 1].level);
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveMit = async () => {
    const date = TODAY();
    const db = await getDB();
    const tasks = await getRangeByDate("tasks", date, date);
    const existing = tasks.find((t) => t.priority === "mit");
    const row: Task = {
      ...(existing ?? {}),
      date,
      text: mit,
      priority: "mit",
      done: mitDone,
      createdAt: existing?.createdAt ?? Date.now(),
    };
    await db.put("tasks", row);
  };

  const saveEnergy = async (level: number) => {
    const date = TODAY();
    const db = await getDB();
    const log: EnergyLog = {
      date,
      hour: new Date().getHours(),
      level: Math.min(5, Math.max(1, Math.round(level))) as 1 | 2 | 3 | 4 | 5,
    };
    await db.put("energy", log);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Today — {format(new Date(), "EEE, MMM d")}</CardTitle>
            <Badge variant={mitDone ? "success" : "outline"}>
              {mitDone ? "MIT done ✓" : "MIT pending"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="mit" className="text-xs uppercase tracking-wide text-muted-foreground">
              Most important task
            </Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="mit"
                placeholder="The one thing that makes today a win…"
                value={mit}
                onChange={(e) => setMit(e.target.value)}
                onBlur={saveMit}
              />
              <Button
                variant={mitDone ? "secondary" : "default"}
                onClick={() => {
                  setMitDone((v) => !v);
                  void saveMit();
                }}
                disabled={!mit}
              >
                {mitDone ? "Undo" : "Done"}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Top 3 priorities
            </Label>
            <div className="mt-2 space-y-2">
              {topThree.map((t, i) => (
                <Input
                  key={i}
                  placeholder={`Priority ${i + 1}`}
                  value={t}
                  onChange={(e) => {
                    const next = [...topThree];
                    next[i] = e.target.value;
                    setTopThree(next);
                  }}
                  onBlur={async () => {
                    const date = TODAY();
                    const db = await getDB();
                    if (!t) return;
                    const row: Task = {
                      date,
                      text: t,
                      priority: i === 0 ? "p1" : i === 1 ? "p2" : "p3",
                      done: false,
                      createdAt: Date.now(),
                    };
                    await db.add("tasks", row);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Energy now (1-5)
              </Label>
              <span className="font-mono text-sm">{energy}</span>
            </div>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[energy]}
              onValueChange={([v]) => setEnergy(v)}
              onValueCommit={([v]) => void saveEnergy(v)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              ≤2 → de-scope today. One block, no extras.
            </p>
          </div>

          {!loaded ? (
            <p className="text-xs text-muted-foreground">Loading dummy data…</p>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
