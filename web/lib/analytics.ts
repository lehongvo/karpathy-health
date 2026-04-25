import type { SleepLog, DeepWorkBlock, ExerciseLog, Insight } from "./types";
import { format, subDays } from "date-fns";

export function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return 0;
  let sx = 0,
    sy = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i];
    sy += ys[i];
  }
  const mx = sx / n,
    my = sy / n;
  let num = 0,
    dx = 0,
    dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx,
      b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}

export interface DailyAggregate {
  date: string;
  sleepHours: number;
  deepWorkHours: number;
  exerciseMinutes: number;
}

export function buildDaily(
  sleep: SleepLog[],
  dw: DeepWorkBlock[],
  ex: ExerciseLog[],
  windowDays: number,
): DailyAggregate[] {
  const out: DailyAggregate[] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    const s = sleep.find((r) => r.date === date);
    const dws = dw.filter((r) => r.date === date);
    const exs = ex.filter((r) => r.date === date);
    out.push({
      date,
      sleepHours: s?.hours ?? 0,
      deepWorkHours: dws.reduce((a, r) => a + r.durationMin, 0) / 60,
      exerciseMinutes: exs.reduce((a, r) => a + r.durationMin, 0),
    });
  }
  return out;
}

const MIN_N = 7;
const SIG = 0.3;

export function computeInsights(
  sleep: SleepLog[],
  dw: DeepWorkBlock[],
  ex: ExerciseLog[],
  windowDays = 30,
): Insight[] {
  const days = buildDaily(sleep, dw, ex, windowDays);
  const valid = days.filter((d) => d.sleepHours > 0);
  if (valid.length < MIN_N) return [];

  const out: Insight[] = [];

  const sxs: number[] = [],
    dys: number[] = [];
  for (let i = 0; i < days.length - 1; i++) {
    if (days[i].sleepHours > 0) {
      sxs.push(days[i].sleepHours);
      dys.push(days[i + 1].deepWorkHours);
    }
  }
  const r1 = pearson(sxs, dys);
  if (Math.abs(r1) >= SIG && sxs.length >= MIN_N) {
    out.push({
      id: "sleep-vs-dw-next",
      title: r1 > 0 ? "More sleep tonight → more deep work tomorrow" : "Inverse sleep ↔ deep-work next-day (unusual — likely noise)",
      description: `r = ${r1.toFixed(2)} across ${sxs.length} day-pairs.`,
      effectSize: Math.abs(r1),
      sampleSize: sxs.length,
      direction: r1 > 0 ? "positive" : "negative",
    });
  }

  const exs: number[] = [],
    dys2: number[] = [];
  for (let i = 0; i < days.length - 1; i++) {
    exs.push(days[i].exerciseMinutes);
    dys2.push(days[i + 1].deepWorkHours);
  }
  const r2 = pearson(exs, dys2);
  if (Math.abs(r2) >= SIG && exs.length >= MIN_N) {
    out.push({
      id: "ex-vs-dw-next",
      title: r2 > 0 ? "Exercise today → more deep work tomorrow" : "Exercise today → less deep work tomorrow (overtraining?)",
      description: `r = ${r2.toFixed(2)} across ${exs.length} day-pairs.`,
      effectSize: Math.abs(r2),
      sampleSize: exs.length,
      direction: r2 > 0 ? "positive" : "negative",
    });
  }

  return out.sort((a, b) => b.effectSize - a.effectSize);
}

export interface RollingMetrics {
  sleepAvg: number;
  exerciseSessions: number;
  deepWorkHours: number;
  nightsBelow6: number;
  daysWithDeepWork: number;
}

export function rollingMetrics(
  sleep: SleepLog[],
  dw: DeepWorkBlock[],
  ex: ExerciseLog[],
  windowDays: number,
): RollingMetrics {
  const days = buildDaily(sleep, dw, ex, windowDays);
  const valid = days.filter((d) => d.sleepHours > 0);
  return {
    sleepAvg:
      valid.length > 0
        ? Math.round((valid.reduce((s, d) => s + d.sleepHours, 0) / valid.length) * 10) / 10
        : 0,
    exerciseSessions: days.filter((d) => d.exerciseMinutes > 0).length,
    deepWorkHours: Math.round(days.reduce((s, d) => s + d.deepWorkHours, 0) * 10) / 10,
    nightsBelow6: valid.filter((d) => d.sleepHours < 6).length,
    daysWithDeepWork: days.filter((d) => d.deepWorkHours > 0).length,
  };
}
