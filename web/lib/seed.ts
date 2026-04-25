import { getMeta, setMeta } from "./db";
import { sleepRepo, exerciseRepo, deepWorkRepo, projectRepo, energyRepo, taskRepo } from "./db/repos";
import { format, subDays } from "date-fns";
import type { ExerciseType } from "./types";

const SEED_FLAG = "seeded-v2";

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

const PROJECTS = [
  { id: "rust-solana", name: "Rust / Solana", status: "active" as const, color: "#ce422b" },
  { id: "fulltime-job", name: "Full-time job", status: "active" as const, color: "#2e7d5b" },
  { id: "interview-prep", name: "Interview prep", status: "maintenance" as const, color: "#a8513e" },
  { id: "personal-site", name: "Personal site", status: "paused" as const, color: "#8884d8" },
];

const EX_TYPES: ExerciseType[] = ["cardio", "strength", "walk", "yoga"];

export async function seedIfEmpty(): Promise<void> {
  const flag = await getMeta(SEED_FLAG);
  if (flag) return;

  const r = rng(20260425);
  const now = Date.now();
  for (const p of PROJECTS) {
    await projectRepo.put({ ...p, createdAt: now, updatedAt: now });
  }

  for (let i = 30; i >= 0; i--) {
    const day = subDays(new Date(), i);
    const date = format(day, "yyyy-MM-dd");
    const sleepHours = 6.2 + r() * 2.1;
    const bedHour = Math.floor(22 + r() * 1.5);
    const bedMin = Math.floor(r() * 60);
    await sleepRepo.put({
      date,
      bedtime: `${String(bedHour).padStart(2, "0")}:${String(bedMin).padStart(2, "0")}`,
      wakeTime: `${String(Math.floor((bedHour + sleepHours) % 24)).padStart(2, "0")}:${String(
        Math.floor(r() * 60),
      ).padStart(2, "0")}`,
      hours: Math.round(sleepHours * 10) / 10,
      quality: Math.min(5, Math.max(1, Math.round(sleepHours - 4))) as 1 | 2 | 3 | 4 | 5,
    });

    if (r() > 0.35) {
      const t = EX_TYPES[Math.floor(r() * EX_TYPES.length)];
      await exerciseRepo.put({
        date,
        type: t,
        durationMin: t === "walk" ? 25 + Math.floor(r() * 25) : 30 + Math.floor(r() * 35),
        intensity: Math.min(5, Math.max(1, Math.ceil(r() * 5))) as 1 | 2 | 3 | 4 | 5,
      });
    }

    const blocks = sleepHours > 7 ? 1 + Math.floor(r() * 2) : Math.floor(r() * 2);
    for (let b = 0; b < blocks; b++) {
      const startHour = 8 + b * 3 + Math.floor(r() * 2);
      const start = day.getTime() + startHour * 3600_000;
      const dur = 60 + Math.floor(r() * 60);
      await deepWorkRepo.put({
        date,
        startedAt: start,
        endedAt: start + dur * 60_000,
        durationMin: dur,
        projectId: r() > 0.5 ? "rust-solana" : r() > 0.25 ? "fulltime-job" : "interview-prep",
        distractionCount: Math.floor(r() * 4),
        focusQuality: Math.min(5, Math.max(1, Math.ceil(sleepHours - 4))) as 1 | 2 | 3 | 4 | 5,
      });
    }

    await energyRepo.put({
      date,
      hour: 9,
      level: Math.min(5, Math.max(1, Math.round(sleepHours - 3 + r()))) as 1 | 2 | 3 | 4 | 5,
    });

    await taskRepo.put({
      date,
      text:
        i === 0
          ? "Ship the PersonalOS redesign"
          : i % 3 === 0
            ? "Read 1 chapter of the Rust book"
            : i % 3 === 1
              ? "Solve 2 LeetCode problems"
              : "Code review 3 PRs",
      priority: "mit",
      done: i > 0,
      projectId: "rust-solana",
      createdAt: day.getTime(),
    });
  }

  await setMeta(SEED_FLAG, true);
}
