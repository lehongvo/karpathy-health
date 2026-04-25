import { openDB, type IDBPDatabase } from "idb";
import { DB_NAME, DB_VERSION, type PersonalOSDB } from "./schema";

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
        const exercise = db.createObjectStore("exercise", { keyPath: "id", autoIncrement: true });
        exercise.createIndex("by-date", "date");
        const nutrition = db.createObjectStore("nutrition", { keyPath: "id", autoIncrement: true });
        nutrition.createIndex("by-date", "date");
        const deepWork = db.createObjectStore("deepWork", { keyPath: "id", autoIncrement: true });
        deepWork.createIndex("by-date", "date");
        deepWork.createIndex("by-project", "projectId");
        db.createObjectStore("projects", { keyPath: "id" });
        const tasks = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
        tasks.createIndex("by-date", "date");
        db.createObjectStore("habits", { keyPath: "id" });
        const habitLogs = db.createObjectStore("habitLogs", { keyPath: "id", autoIncrement: true });
        habitLogs.createIndex("by-date", "date");
        habitLogs.createIndex("by-habit", "habitId");
        const energy = db.createObjectStore("energy", { keyPath: "id", autoIncrement: true });
        energy.createIndex("by-date", "date");
        const reviews = db.createObjectStore("reviews", { keyPath: "id", autoIncrement: true });
        reviews.createIndex("by-date", "date");
        const sayingNo = db.createObjectStore("sayingNo", { keyPath: "id", autoIncrement: true });
        sayingNo.createIndex("by-date", "date");
        db.createObjectStore("meta", { keyPath: "key" });
      },
    });
  }
  return dbPromise;
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

export async function clearAll(): Promise<void> {
  const db = await getDB();
  const stores = [
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
  ] as const;
  for (const s of stores) {
    await (db as unknown as { clear: (s: string) => Promise<void> }).clear(s);
  }
}

export async function exportAll(): Promise<Record<string, unknown[]>> {
  const db = await getDB();
  const stores = [
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
  ] as const;
  const out: Record<string, unknown[]> = {};
  for (const s of stores) {
    out[s] = await (db as unknown as { getAll: (s: string) => Promise<unknown[]> }).getAll(s);
  }
  return out;
}

async function getAllByDateGeneric(store: string, from: string, to: string): Promise<unknown[]> {
  const db = await getDB();
  const tx = (db as unknown as {
    transaction: (s: string, m: "readonly") => unknown;
  }).transaction(store, "readonly") as {
    store: { index: (n: string) => { getAll: (r: IDBKeyRange) => Promise<unknown[]> } };
    done: Promise<void>;
  };
  const idx = tx.store.index("by-date");
  const results = await idx.getAll(IDBKeyRange.bound(from, to));
  await tx.done;
  return results;
}

export { getAllByDateGeneric };
