import type { Insight, SleepLog, DeepWorkBlock, ExerciseLog } from "./types";
import { format, subDays } from "date-fns";

/** Pearson correlation coefficient for two equal-length numeric series. */
export function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return 0;
  let sumX = 0,
    sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += xs[i];
    sumY += ys[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;
  let num = 0,
    denX = 0,
    denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}

interface DailyAggregate {
  date: string;
  sleepHours: number;
  deepWorkHours: number;
  exerciseMinutes: number;
}

function buildDailyAggregates(
  sleep: SleepLog[],
  deepWork: DeepWorkBlock[],
  exercise: ExerciseLog[],
  windowDays: number,
): DailyAggregate[] {
  const today = new Date();
  const days: DailyAggregate[] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    const sleepRow = sleep.find((s) => s.date === date);
    const dwRows = deepWork.filter((d) => d.date === date);
    const exRows = exercise.filter((e) => e.date === date);
    days.push({
      date,
      sleepHours: sleepRow?.hours ?? 0,
      deepWorkHours: dwRows.reduce((sum, d) => sum + d.durationMin, 0) / 60,
      exerciseMinutes: exRows.reduce((sum, e) => sum + e.durationMin, 0),
    });
  }
  return days;
}

const MIN_SAMPLE = 7;
const SIGNIFICANT_R = 0.3;

export function computeInsights(
  sleep: SleepLog[],
  deepWork: DeepWorkBlock[],
  exercise: ExerciseLog[],
  windowDays = 30,
): Insight[] {
  const days = buildDailyAggregates(sleep, deepWork, exercise, windowDays);
  const valid = days.filter((d) => d.sleepHours > 0);
  if (valid.length < MIN_SAMPLE) return [];

  const insights: Insight[] = [];

  // Sleep -> deep work (next-day deep work hours after a given sleep night)
  const sleepXs: number[] = [];
  const dwYs: number[] = [];
  for (let i = 0; i < days.length - 1; i++) {
    if (days[i].sleepHours > 0) {
      sleepXs.push(days[i].sleepHours);
      dwYs.push(days[i + 1].deepWorkHours);
    }
  }
  const rSleepDw = pearson(sleepXs, dwYs);
  if (Math.abs(rSleepDw) >= SIGNIFICANT_R && sleepXs.length >= MIN_SAMPLE) {
    insights.push({
      id: "sleep-vs-deepwork",
      title:
        rSleepDw > 0
          ? "More sleep → more deep work the next day"
          : "Less sleep → more deep work next day (counterintuitive — likely noise)",
      description: `Pearson r = ${rSleepDw.toFixed(2)} across ${sleepXs.length} day-pairs.`,
      effectSize: Math.abs(rSleepDw),
      sampleSize: sleepXs.length,
      direction: rSleepDw > 0 ? "positive" : "negative",
    });
  }

  // Exercise (today) -> deep work (next day)
  const exXs: number[] = [];
  const dwY2s: number[] = [];
  for (let i = 0; i < days.length - 1; i++) {
    exXs.push(days[i].exerciseMinutes);
    dwY2s.push(days[i + 1].deepWorkHours);
  }
  const rExDw = pearson(exXs, dwY2s);
  if (Math.abs(rExDw) >= SIGNIFICANT_R && exXs.length >= MIN_SAMPLE) {
    insights.push({
      id: "exercise-vs-deepwork-next",
      title:
        rExDw > 0
          ? "Exercise today → more deep work tomorrow"
          : "Exercise today → less deep work tomorrow (likely overtraining)",
      description: `Pearson r = ${rExDw.toFixed(2)} across ${exXs.length} day-pairs.`,
      effectSize: Math.abs(rExDw),
      sampleSize: exXs.length,
      direction: rExDw > 0 ? "positive" : "negative",
    });
  }

  // Sleep -> deep work (same day, weaker mechanism but useful)
  const same1: number[] = [];
  const same2: number[] = [];
  for (const d of days) {
    if (d.sleepHours > 0) {
      same1.push(d.sleepHours);
      same2.push(d.deepWorkHours);
    }
  }
  const rSame = pearson(same1, same2);
  if (Math.abs(rSame) >= SIGNIFICANT_R && same1.length >= MIN_SAMPLE) {
    insights.push({
      id: "sleep-vs-deepwork-same",
      title:
        rSame > 0
          ? "Nights you slept more, you also did more deep work that day"
          : "Inverse relationship between sleep and same-day deep work",
      description: `Pearson r = ${rSame.toFixed(2)} across ${same1.length} days. (Same-day correlation — does not imply causation.)`,
      effectSize: Math.abs(rSame),
      sampleSize: same1.length,
      direction: rSame > 0 ? "positive" : "negative",
    });
  }

  return insights.sort((a, b) => b.effectSize - a.effectSize);
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
  deepWork: DeepWorkBlock[],
  exercise: ExerciseLog[],
  windowDays: number,
): RollingMetrics {
  const days = buildDailyAggregates(sleep, deepWork, exercise, windowDays);
  const validSleep = days.filter((d) => d.sleepHours > 0);
  const sleepAvg =
    validSleep.length > 0
      ? validSleep.reduce((s, d) => s + d.sleepHours, 0) / validSleep.length
      : 0;
  return {
    sleepAvg: Math.round(sleepAvg * 10) / 10,
    exerciseSessions: days.filter((d) => d.exerciseMinutes > 0).length,
    deepWorkHours: Math.round(days.reduce((s, d) => s + d.deepWorkHours, 0) * 10) / 10,
    nightsBelow6: validSleep.filter((d) => d.sleepHours < 6).length,
    daysWithDeepWork: days.filter((d) => d.deepWorkHours > 0).length,
  };
}

export function focusScore(deepWorkHours: number, totalWorkHours: number, avgQuality: number): number {
  if (totalWorkHours === 0) return 0;
  const ratio = Math.min(1, deepWorkHours / totalWorkHours);
  const qualityFactor = Math.max(0, Math.min(1, (avgQuality - 1) / 4));
  return Math.round(ratio * qualityFactor * 100);
}
