"use client";

import { useEffect, useState } from "react";
import { format, parseISO, subDays } from "date-fns";
import { Button } from "@/components/primitives/Button";
import { TextInput, FieldLabel, FormBlock } from "@/components/primitives/Field";
import { Slider } from "@/components/primitives/Slider";
import { ProgressBar } from "@/components/primitives/ProgressBar";
import { Sparkline } from "@/components/charts/Sparkline";
import { sleepRepo, exerciseRepo, nutritionRepo } from "@/lib/db/repos";
import type { ExerciseType, NutritionLog, SleepLog } from "@/lib/types";
import {
  EXERCISE_SESSIONS_PER_WEEK,
  EXERCISE_MIN_MINUTES,
  CAFFEINE_CUTOFF_HOURS_BEFORE_BED,
  HYDRATION_TARGET_GLASSES,
  SLEEP_MIN_HOURS,
} from "@/lib/protocols";
import { todayISO } from "@/lib/utils";
import { useApp } from "@/lib/store";

const EX_TYPES: ExerciseType[] = ["cardio", "strength", "walk", "yoga", "other"];

function hoursBetween(bed: string, wake: string): number {
  const [bh, bm] = bed.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

export function EnergyTab() {
  // Sleep
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepQuality, setSleepQuality] = useState(3);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);

  // Exercise
  const [exType, setExType] = useState<ExerciseType>("cardio");
  const [exDuration, setExDuration] = useState(40);
  const [exIntensity, setExIntensity] = useState(3);
  const [weekSessions, setWeekSessions] = useState(0);

  // Nutrition
  const [lastCaffeine, setLastCaffeine] = useState<number | null>(null);
  const [glasses, setGlasses] = useState(0);
  const [lateMeal, setLateMeal] = useState(false);
  const settings = useApp((s) => s.settings);

  const refresh = async () => {
    const from30 = format(subDays(new Date(), 29), "yyyy-MM-dd");
    const today = todayISO();
    const sleep = await sleepRepo.byRange(from30, today);
    setSleepLogs(sleep);

    const from7 = format(subDays(new Date(), 6), "yyyy-MM-dd");
    const ex = await exerciseRepo.byRange(from7, today);
    setWeekSessions(ex.length);

    const nut = (await nutritionRepo.byRange(today, today)) as NutritionLog[];
    const last = nut[nut.length - 1];
    if (last) {
      setLastCaffeine(last.lastCaffeineHour);
      setGlasses(last.hydrationGlasses);
      setLateMeal(last.lateNightMeal);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const submitSleep = async () => {
    const today = todayISO();
    const hours = hoursBetween(bedtime, wakeTime);
    await sleepRepo.put({
      date: today,
      bedtime,
      wakeTime,
      hours,
      quality: Math.min(5, Math.max(1, sleepQuality)) as 1 | 2 | 3 | 4 | 5,
    });
    await refresh();
  };

  const submitExercise = async () => {
    await exerciseRepo.put({
      date: todayISO(),
      type: exType,
      durationMin: exDuration,
      intensity: Math.min(5, Math.max(1, exIntensity)) as 1 | 2 | 3 | 4 | 5,
    });
    await refresh();
  };

  const persistNutrition = async (
    next: Partial<{ lastCaffeineHour: number | null; hydrationGlasses: number; lateNightMeal: boolean }>,
  ) => {
    await nutritionRepo.put({
      date: todayISO(),
      lastCaffeineHour: next.lastCaffeineHour ?? lastCaffeine,
      hydrationGlasses: next.hydrationGlasses ?? glasses,
      lateNightMeal: next.lateNightMeal ?? lateMeal,
    });
  };

  const sleepSeries = sleepLogs.map((l) => ({ date: format(parseISO(l.date), "MMM d"), value: l.hours }));
  const sleepAvg =
    sleepLogs.length > 0
      ? Math.round((sleepLogs.reduce((s, l) => s + l.hours, 0) / sleepLogs.length) * 10) / 10
      : 0;
  const nightsLow = sleepLogs.filter((l) => l.hours < 6).length;

  const cutoffViolation =
    lastCaffeine !== null && settings.bedtimeHour - lastCaffeine < CAFFEINE_CUTOFF_HOURS_BEFORE_BED;

  return (
    <div className="space-y-12">
      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl">Sleep</h2>
          <div className="text-xs text-muted">
            avg <span className="font-mono text-text">{sleepAvg}h</span> · below 6h <span className="font-mono text-text">{nightsLow}</span> · target {SLEEP_MIN_HOURS}h
          </div>
        </div>
        <Sparkline data={sleepSeries} color="var(--color-accent)" domain={[3, 10]} height={50} />
        <FormBlock>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <FieldLabel>Bedtime</FieldLabel>
              <TextInput type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Wake</FieldLabel>
              <TextInput type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <FieldLabel>Quality</FieldLabel>
            <span className="font-mono text-sm">{sleepQuality}/5</span>
          </div>
          <Slider min={1} max={5} step={1} value={[sleepQuality]} onValueChange={([v]) => setSleepQuality(v)} />
          <Button onClick={submitSleep} size="sm">Log {hoursBetween(bedtime, wakeTime)}h</Button>
        </FormBlock>
      </section>

      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl">Exercise</h2>
          <div className="text-xs text-muted">
            this week <span className="font-mono text-text">{weekSessions}/{EXERCISE_SESSIONS_PER_WEEK}</span>
          </div>
        </div>
        <ProgressBar
          value={Math.min(100, (weekSessions / EXERCISE_SESSIONS_PER_WEEK) * 100)}
          tone={weekSessions >= EXERCISE_SESSIONS_PER_WEEK ? "good" : "default"}
        />
        <FormBlock>
          <FieldLabel>Type</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {EX_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setExType(t)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  exType === t ? "bg-text text-bg border-text" : "border-border hover:bg-accent-soft"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <FieldLabel>Duration (min)</FieldLabel>
              <TextInput
                type="number"
                value={exDuration}
                min={5}
                max={240}
                onChange={(e) => setExDuration(Number(e.target.value))}
              />
            </div>
            <div>
              <FieldLabel>Intensity {exIntensity}/5</FieldLabel>
              <Slider min={1} max={5} step={1} value={[exIntensity]} onValueChange={([v]) => setExIntensity(v)} />
            </div>
          </div>
          <Button onClick={submitExercise} size="sm">Log session</Button>
          <p className="text-xs text-muted">
            Target: {EXERCISE_SESSIONS_PER_WEEK} sessions × {EXERCISE_MIN_MINUTES} min Zone-2 (Erickson 2011 PNAS).
          </p>
        </FormBlock>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Nutrition</h2>
        <FormBlock>
          <FieldLabel>Last caffeine (hour 0–23)</FieldLabel>
          <TextInput
            type="number"
            min={0}
            max={23}
            value={lastCaffeine ?? ""}
            placeholder="14"
            onChange={(e) => {
              const v = e.target.value === "" ? null : Number(e.target.value);
              setLastCaffeine(v);
              void persistNutrition({ lastCaffeineHour: v });
            }}
          />
          <p className="text-xs text-muted">
            Bedtime {settings.bedtimeHour}:00 → cutoff {settings.bedtimeHour - CAFFEINE_CUTOFF_HOURS_BEFORE_BED}:00.{" "}
            {cutoffViolation ? (
              <span className="text-alert">Within {CAFFEINE_CUTOFF_HOURS_BEFORE_BED}h of bed — sleep cost likely (Drake 2013).</span>
            ) : (
              <span className="text-good">Within safe window.</span>
            )}
          </p>
        </FormBlock>
        <FormBlock>
          <FieldLabel>Hydration</FieldLabel>
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl">{glasses}/{HYDRATION_TARGET_GLASSES}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const v = Math.max(0, glasses - 1);
                  setGlasses(v);
                  void persistNutrition({ hydrationGlasses: v });
                }}
              >
                −
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const v = glasses + 1;
                  setGlasses(v);
                  void persistNutrition({ hydrationGlasses: v });
                }}
              >
                + glass
              </Button>
            </div>
          </div>
        </FormBlock>
        <FormBlock>
          <FieldLabel>Late-night meal</FieldLabel>
          <Button
            variant={lateMeal ? "destructive" : "outline"}
            size="sm"
            onClick={() => {
              const v = !lateMeal;
              setLateMeal(v);
              void persistNutrition({ lateNightMeal: v });
            }}
          >
            {lateMeal ? "Flagged ✓" : "Flag late meal"}
          </Button>
        </FormBlock>
      </section>
    </div>
  );
}
