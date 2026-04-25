"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SleepTracker } from "@/components/SleepTracker";
import { ExerciseLogger } from "@/components/ExerciseLogger";
import { HabitChain } from "@/components/HabitChain";
import { getDB, getRangeByDate } from "@/lib/db";
import type { NutritionLog } from "@/lib/types";
import {
  CAFFEINE_CUTOFF_HOURS_BEFORE_BED,
  HYDRATION_TARGET_GLASSES,
} from "@/lib/protocols";

function NutritionLite() {
  const [lastCaffeineHour, setLastCaffeineHour] = useState<number | null>(null);
  const [glasses, setGlasses] = useState(0);
  const [lateMeal, setLateMeal] = useState(false);
  const [bedtimeHour, setBedtimeHour] = useState(23);

  useEffect(() => {
    (async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const rows = (await getRangeByDate("nutrition", today, today)) as NutritionLog[];
      const last = rows[rows.length - 1];
      if (last) {
        setLastCaffeineHour(last.lastCaffeineHour);
        setGlasses(last.hydrationGlasses);
        setLateMeal(last.lateNightMeal);
      }
    })();
  }, []);

  const persist = async (
    next: Partial<{ lastCaffeineHour: number | null; glasses: number; lateMeal: boolean }>,
  ) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const db = await getDB();
    const log: NutritionLog = {
      date: today,
      lastCaffeineHour: next.lastCaffeineHour ?? lastCaffeineHour,
      hydrationGlasses: next.glasses ?? glasses,
      lateNightMeal: next.lateMeal ?? lateMeal,
    };
    await db.put("nutrition", log);
  };

  const cutoffViolation =
    lastCaffeineHour !== null && bedtimeHour - lastCaffeineHour < CAFFEINE_CUTOFF_HOURS_BEFORE_BED;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Caffeine cutoff</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Last caffeine (hour 0-23)</Label>
              <Input
                type="number"
                min={0}
                max={23}
                value={lastCaffeineHour ?? ""}
                placeholder="14"
                onChange={(e) => {
                  const v = e.target.value === "" ? null : Number(e.target.value);
                  setLastCaffeineHour(v);
                  void persist({ lastCaffeineHour: v });
                }}
              />
            </div>
            <div>
              <Label>Intended bedtime hour</Label>
              <Input
                type="number"
                min={0}
                max={23}
                value={bedtimeHour}
                onChange={(e) => setBedtimeHour(Number(e.target.value))}
              />
            </div>
          </div>
          {cutoffViolation ? (
            <Badge variant="warning">
              Less than {CAFFEINE_CUTOFF_HOURS_BEFORE_BED}h before bed — likely sleep cost (Drake 2013).
            </Badge>
          ) : (
            <Badge variant="success">Within safe window</Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hydration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-2xl">
              {glasses}/{HYDRATION_TARGET_GLASSES}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const v = Math.max(0, glasses - 1);
                  setGlasses(v);
                  void persist({ glasses: v });
                }}
              >
                −
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const v = glasses + 1;
                  setGlasses(v);
                  void persist({ glasses: v });
                }}
              >
                + glass
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Late-night meal</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant={lateMeal ? "destructive" : "outline"}
            onClick={() => {
              const v = !lateMeal;
              setLateMeal(v);
              void persist({ lateMeal: v });
            }}
          >
            {lateMeal ? "Flagged ✓" : "Flag late meal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EnergyPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Energy</h1>
        <p className="text-sm text-muted-foreground">
          Sleep, exercise, nutrition. Hard rules in <a href="/protocols/02-energy-protocol" className="underline">/02-energy-protocol</a>.
        </p>
      </header>

      <Tabs defaultValue="sleep">
        <TabsList>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>
        <TabsContent value="sleep" className="space-y-4">
          <SleepTracker />
          <HabitChain title="Sleep ≥7h streak" source="sleep" />
        </TabsContent>
        <TabsContent value="exercise" className="space-y-4">
          <ExerciseLogger />
          <HabitChain title="Exercise streak" source="exercise" />
        </TabsContent>
        <TabsContent value="nutrition">
          <NutritionLite />
        </TabsContent>
      </Tabs>
    </div>
  );
}
