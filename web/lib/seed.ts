import { getDB, getMeta, setMeta } from "./db";
import type {
  SleepLog,
  ExerciseLog,
  DeepWorkBlock,
  Project,
  Task,
  EnergyLog,
  ExerciseType,
} from "./types";
import { format, subDays } from "date-fns";

const SEED_FLAG = "seeded-v1";

/**
 * Deterministic pseudo-random — so dummy data is stable across reloads
 * and reviews. Mulberry32.
 */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PROJECTS: Project[] = [
  {
    id: "rust-solana",
    name: "Rust / Solana",
    status: "active",
    color: "#ce422b",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "fulltime-job",
    name: "Full-time job",
    status: "active",
    color: "#10b981",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "interview-prep",
    name: "Interview prep",
    status: "maintenance",
    color: "#f59e0b",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "personal-site",
    name: "Personal site",
    status: "paused",
    color: "#8884d8",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export async function seedIfEmpty(): Promise<void> {
  const flag = await getMeta(SEED_FLAG);
  if (flag) return;

  const db = await getDB();
  const r = rng(20260425);

  for (const p of PROJECTS) {
    await db.put("projects", p);
  }

  const exerciseTypes: ExerciseType[] = ["cardio", "strength", "walk", "yoga"];
  for (let i = 30; i >= 0; i--) {
    const day = subDays(new Date(), i);
    const date = format(day, "yyyy-MM-dd");

    const sleepHours = 6.2 + r() * 2.1;
    const bedHour = 22 + r() * 1.5;
    const bedMin = Math.floor(r() * 60);
    const sleepLog: SleepLog = {
      date,
      bedtime: `${String(Math.floor(bedHour)).padStart(2, "0")}:${String(bedMin).padStart(2, "0")}`,
      wakeTime: `${String(Math.floor((bedHour + sleepHours) % 24)).padStart(2, "0")}:${String(
        Math.floor(r() * 60),
      ).padStart(2, "0")}`,
      hours: Math.round(sleepHours * 10) / 10,
      quality: (Math.min(5, Math.max(1, Math.round(sleepHours - 4))) as 1 | 2 | 3 | 4 | 5),
    };
    await db.put("sleep", sleepLog as SleepLog & { id?: number });

    if (r() > 0.35) {
      const type = exerciseTypes[Math.floor(r() * exerciseTypes.length)];
      const ex: ExerciseLog = {
        date,
        type,
        durationMin: type === "walk" ? 25 + Math.floor(r() * 25) : 30 + Math.floor(r() * 35),
        intensity: (Math.min(5, Math.max(1, Math.ceil(r() * 5))) as 1 | 2 | 3 | 4 | 5),
      };
      await db.put("exercise", ex as ExerciseLog & { id?: number });
    }

    const blocks = sleepHours > 7 ? 1 + Math.floor(r() * 2) : Math.floor(r() * 2);
    for (let b = 0; b < blocks; b++) {
      const startHour = 8 + b * 3 + Math.floor(r() * 2);
      const start = day.getTime() + startHour * 3600_000;
      const dur = 60 + Math.floor(r() * 60);
      const end = start + dur * 60_000;
      const dw: DeepWorkBlock = {
        date,
        startedAt: start,
        endedAt: end,
        durationMin: dur,
        projectId:
          r() > 0.5 ? "rust-solana" : r() > 0.25 ? "fulltime-job" : "interview-prep",
        distractionCount: Math.floor(r() * 4),
        focusQuality: (Math.min(5, Math.max(1, Math.ceil(sleepHours - 4))) as 1 | 2 | 3 | 4 | 5),
      };
      await db.put("deepWork", dw as DeepWorkBlock & { id?: number });
    }

    const energyLevel = Math.min(5, Math.max(1, Math.round(sleepHours - 3 + r()))) as 1 | 2 | 3 | 4 | 5;
    const energy: EnergyLog = { date, hour: 9, level: energyLevel };
    await db.put("energy", energy as EnergyLog & { id?: number });

    const mit: Task = {
      date,
      text:
        i === 0
          ? "Ship the PersonalOS dashboard"
          : i % 3 === 0
            ? "Read 1 chapter of the Rust book"
            : i % 3 === 1
              ? "Solve 2 LeetCode problems"
              : "Code review 3 PRs",
      priority: "mit",
      done: i > 0,
      projectId: "rust-solana",
      createdAt: day.getTime(),
    };
    await db.put("tasks", mit as Task & { id?: number });
  }

  await setMeta(SEED_FLAG, true);
}
