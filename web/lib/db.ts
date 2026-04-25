import { openDB, type DBSchema, type IDBPDatabase } from "idb";
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
} from "./types";

interface PersonalOSDB extends DBSchema {
  sleep: {
    key: number;
    value: SleepLog;
    indexes: { "by-date": string };
  };
  exercise: {
    key: number;
    value: ExerciseLog;
    indexes: { "by-date": string };
  };
  nutrition: {
    key: number;
    value: NutritionLog;
    indexes: { "by-date": string };
  };
  deepWork: {
    key: number;
    value: DeepWorkBlock;
    indexes: { "by-date": string; "by-project": string };
  };
  projects: {
    key: string;
    value: Project;
  };
  tasks: {
    key: number;
    value: Task;
    indexes: { "by-date": string };
  };
  habits: {
    key: string;
    value: Habit;
  };
  habitLogs: {
    key: number;
    value: HabitLog;
    indexes: { "by-date": string; "by-habit": string };
  };
  energy: {
    key: number;
    value: EnergyLog;
    indexes: { "by-date": string };
  };
  reviews: {
    key: number;
    value: DailyReview;
    indexes: { "by-date": string };
  };
  sayingNo: {
    key: number;
    value: SayingNoLog;
    indexes: { "by-date": string };
  };
  meta: {
    key: string;
    value: { key: string; value: string | number | boolean };
  };
}

const DB_NAME = "personal-os";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PersonalOSDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<PersonalOSDB>> {
  if (typeof window === "undefined") {
    throw new Error("getDB() must be called from the client.");
  }
  if (!dbPromise) {
    dbPromise = openDB<PersonalOSDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const sleep = db.createObjectStore("sleep", { keyPath: "id", autoIncrement: true });
        sleep.createIndex("by-date", "date");

        const exercise = db.createObjectStore("exercise", {
          keyPath: "id",
          autoIncrement: true,
        });
        exercise.createIndex("by-date", "date");

        const nutrition = db.createObjectStore("nutrition", {
          keyPath: "id",
          autoIncrement: true,
        });
        nutrition.createIndex("by-date", "date");

        const deepWork = db.createObjectStore("deepWork", {
          keyPath: "id",
          autoIncrement: true,
        });
        deepWork.createIndex("by-date", "date");
        deepWork.createIndex("by-project", "projectId");

        db.createObjectStore("projects", { keyPath: "id" });

        const tasks = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
        tasks.createIndex("by-date", "date");

        db.createObjectStore("habits", { keyPath: "id" });

        const habitLogs = db.createObjectStore("habitLogs", {
          keyPath: "id",
          autoIncrement: true,
        });
        habitLogs.createIndex("by-date", "date");
        habitLogs.createIndex("by-habit", "habitId");

        const energy = db.createObjectStore("energy", { keyPath: "id", autoIncrement: true });
        energy.createIndex("by-date", "date");

        const reviews = db.createObjectStore("reviews", { keyPath: "id", autoIncrement: true });
        reviews.createIndex("by-date", "date");

        const sayingNo = db.createObjectStore("sayingNo", {
          keyPath: "id",
          autoIncrement: true,
        });
        sayingNo.createIndex("by-date", "date");

        db.createObjectStore("meta", { keyPath: "key" });
      },
    });
  }
  return dbPromise;
}

export type StoreName = keyof PersonalOSDB;

export async function getRangeByDate<S extends StoreName>(
  store: S,
  fromDate: string,
  toDate: string,
): Promise<PersonalOSDB[S]["value"][]> {
  const db = await getDB();
  const tx = (db as unknown as { transaction: (s: string, m: "readonly") => unknown }).transaction(
    store as string,
    "readonly",
  ) as { store: { index: (n: string) => { getAll: (r: IDBKeyRange) => Promise<unknown[]> } }; done: Promise<void> };
  const idx = tx.store.index("by-date");
  const range = IDBKeyRange.bound(fromDate, toDate);
  const results = (await idx.getAll(range)) as PersonalOSDB[S]["value"][];
  await tx.done;
  return results;
}

export async function getAll<S extends StoreName>(
  store: S,
): Promise<PersonalOSDB[S]["value"][]> {
  const db = await getDB();
  return (db as unknown as { getAll: (s: string) => Promise<PersonalOSDB[S]["value"][]> }).getAll(
    store as string,
  );
}

export async function clearAll(): Promise<void> {
  const db = await getDB();
  const stores: StoreName[] = [
    "sleep",
    "exercise",
    "nutrition",
    "deepWork",
    "projects",
    "tasks",
    "habits",
    "habitLogs",
    "energy",
    "reviews",
    "sayingNo",
    "meta",
  ];
  for (const s of stores) {
    await (db as unknown as { clear: (s: string) => Promise<void> }).clear(s as string);
  }
}

export async function exportAll(): Promise<Record<string, unknown[]>> {
  const stores: StoreName[] = [
    "sleep",
    "exercise",
    "nutrition",
    "deepWork",
    "projects",
    "tasks",
    "habits",
    "habitLogs",
    "energy",
    "reviews",
    "sayingNo",
  ];
  const out: Record<string, unknown[]> = {};
  for (const s of stores) {
    out[s] = await getAll(s);
  }
  return out;
}

export async function getMeta(key: string): Promise<string | number | boolean | undefined> {
  const db = await getDB();
  const row = await db.get("meta", key);
  return row?.value;
}

export async function setMeta(key: string, value: string | number | boolean): Promise<void> {
  const db = await getDB();
  await db.put("meta", { key, value });
}
