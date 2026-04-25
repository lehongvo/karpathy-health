import { getDB, getAllByDateGeneric } from "./index";
import type {
  SleepLog,
  ExerciseLog,
  NutritionLog,
  DeepWorkBlock,
  Project,
  Task,
  EnergyLog,
  DailyReview,
  SayingNoLog,
} from "../types";

// One typed repo per store. Keep API thin and obvious.

export const sleepRepo = {
  async byRange(from: string, to: string): Promise<SleepLog[]> {
    return (await getAllByDateGeneric("sleep", from, to)) as SleepLog[];
  },
  async put(row: SleepLog): Promise<void> {
    const db = await getDB();
    await db.put("sleep", row);
  },
};

export const exerciseRepo = {
  async byRange(from: string, to: string): Promise<ExerciseLog[]> {
    return (await getAllByDateGeneric("exercise", from, to)) as ExerciseLog[];
  },
  async put(row: ExerciseLog): Promise<void> {
    const db = await getDB();
    await db.put("exercise", row);
  },
};

export const nutritionRepo = {
  async byRange(from: string, to: string): Promise<NutritionLog[]> {
    return (await getAllByDateGeneric("nutrition", from, to)) as NutritionLog[];
  },
  async put(row: NutritionLog): Promise<void> {
    const db = await getDB();
    await db.put("nutrition", row);
  },
};

export const deepWorkRepo = {
  async byRange(from: string, to: string): Promise<DeepWorkBlock[]> {
    return (await getAllByDateGeneric("deepWork", from, to)) as DeepWorkBlock[];
  },
  async put(row: DeepWorkBlock): Promise<void> {
    const db = await getDB();
    await db.put("deepWork", row);
  },
};

export const projectRepo = {
  async all(): Promise<Project[]> {
    const db = await getDB();
    return (await db.getAll("projects")) as Project[];
  },
  async put(row: Project): Promise<void> {
    const db = await getDB();
    await db.put("projects", row);
  },
};

export const taskRepo = {
  async byRange(from: string, to: string): Promise<Task[]> {
    return (await getAllByDateGeneric("tasks", from, to)) as Task[];
  },
  async put(row: Task): Promise<Task> {
    const db = await getDB();
    const id = await db.put("tasks", row);
    return { ...row, id: typeof id === "number" ? id : row.id };
  },
};

export const energyRepo = {
  async byRange(from: string, to: string): Promise<EnergyLog[]> {
    return (await getAllByDateGeneric("energy", from, to)) as EnergyLog[];
  },
  async put(row: EnergyLog): Promise<void> {
    const db = await getDB();
    await db.put("energy", row);
  },
};

export const reviewRepo = {
  async byRange(from: string, to: string): Promise<DailyReview[]> {
    return (await getAllByDateGeneric("reviews", from, to)) as DailyReview[];
  },
  async put(row: DailyReview): Promise<void> {
    const db = await getDB();
    await db.put("reviews", row);
  },
};

export const sayingNoRepo = {
  async byRange(from: string, to: string): Promise<SayingNoLog[]> {
    return (await getAllByDateGeneric("sayingNo", from, to)) as SayingNoLog[];
  },
  async put(row: SayingNoLog): Promise<void> {
    const db = await getDB();
    await db.put("sayingNo", row);
  },
};
