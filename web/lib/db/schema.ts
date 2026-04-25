import type { DBSchema } from "idb";
import type {
  SleepLog,
  ExerciseLog,
  NutritionLog,
  DeepWorkBlock,
  Project,
  Task,
  Habit,
  HabitLog,
  EnergyLog,
  DailyReview,
  SayingNoLog,
} from "../types";

export interface PersonalOSDB extends DBSchema {
  sleep: { key: number; value: SleepLog; indexes: { "by-date": string } };
  exercise: { key: number; value: ExerciseLog; indexes: { "by-date": string } };
  nutrition: { key: number; value: NutritionLog; indexes: { "by-date": string } };
  deepWork: {
    key: number;
    value: DeepWorkBlock;
    indexes: { "by-date": string; "by-project": string };
  };
  projects: { key: string; value: Project };
  tasks: { key: number; value: Task; indexes: { "by-date": string } };
  habits: { key: string; value: Habit };
  habitLogs: {
    key: number;
    value: HabitLog;
    indexes: { "by-date": string; "by-habit": string };
  };
  energy: { key: number; value: EnergyLog; indexes: { "by-date": string } };
  reviews: { key: number; value: DailyReview; indexes: { "by-date": string } };
  sayingNo: { key: number; value: SayingNoLog; indexes: { "by-date": string } };
  meta: { key: string; value: { key: string; value: string | number | boolean } };
}

export const DB_NAME = "personal-os";
export const DB_VERSION = 1;
export type StoreName = keyof PersonalOSDB;
