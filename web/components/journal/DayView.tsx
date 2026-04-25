"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, subDays } from "date-fns";
import { Activity, Brain, Moon, Coffee, Play } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { TextAreaInput } from "@/components/primitives/Field";
import { todayISO } from "@/lib/utils";
import { sleepRepo, deepWorkRepo, exerciseRepo, taskRepo, reviewRepo } from "@/lib/db/repos";
import type { Task } from "@/lib/types";
import { SLEEP_MIN_HOURS } from "@/lib/protocols";

interface Stats {
  sleepLast: number;
  deepWorkToday: number;
  exerciseToday: boolean;
  mit: Task | null;
  topThree: Task[];
}

export function DayView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [scratch, setScratch] = useState("");
  const [scratchSaved, setScratchSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const today = todayISO();
      const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
      const sleep = await sleepRepo.byRange(yesterday, today);
      const dw = await deepWorkRepo.byRange(today, today);
      const ex = await exerciseRepo.byRange(today, today);
      const tasks = await taskRepo.byRange(today, today);
      const reviews = await reviewRepo.byRange(today, today);
      const mit = tasks.find((t) => t.priority === "mit") ?? null;
      const topThree = tasks.filter((t) => t.priority !== "mit").slice(0, 3);
      setStats({
        sleepLast: sleep[sleep.length - 1]?.hours ?? 0,
        deepWorkToday: dw.reduce((s, b) => s + b.durationMin, 0) / 60,
        exerciseToday: ex.length > 0,
        mit,
        topThree,
      });
      const r = reviews[reviews.length - 1];
      if (r?.lesson) setScratch(r.lesson);
    })();
  }, []);

  const toggleMIT = async () => {
    if (!stats?.mit) return;
    await taskRepo.put({ ...stats.mit, done: !stats.mit.done });
    setStats({ ...stats, mit: { ...stats.mit, done: !stats.mit.done } });
  };

  const saveScratch = async () => {
    const today = todayISO();
    const reviews = await reviewRepo.byRange(today, today);
    const existing = reviews[reviews.length - 1];
    await reviewRepo.put({
      ...(existing ?? {
        date: today,
        wins: [],
        tomorrowMIT: "",
        energyRetro: 3,
      }),
      date: today,
      lesson: scratch,
    });
    setScratchSaved(true);
    setTimeout(() => setScratchSaved(false), 1500);
  };

  if (!stats) {
    return <div className="space-y-2 animate-pulse"><div className="h-6 w-1/3 bg-border rounded" /><div className="h-4 w-2/3 bg-border rounded" /></div>;
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="text-[11px] uppercase tracking-widest text-muted mb-1">MIT</div>
        {stats.mit ? (
          <button
            onClick={toggleMIT}
            className="text-left w-full font-serif text-2xl md:text-3xl leading-snug hover:text-accent transition-colors"
          >
            <span className={stats.mit.done ? "line-through text-muted" : ""}>{stats.mit.text}</span>
            {stats.mit.done ? <span className="ml-2 text-accent text-base">✓</span> : null}
          </button>
        ) : (
          <p className="text-muted italic">No MIT set today. Set one in the morning ritual.</p>
        )}
      </section>

      {stats.topThree.length > 0 && (
        <section>
          <div className="text-[11px] uppercase tracking-widest text-muted mb-2">Top 3</div>
          <ul className="space-y-2">
            {stats.topThree.map((t, i) => (
              <li key={t.id ?? i} className="flex items-baseline gap-3 text-base">
                <span className="font-mono text-xs text-muted">{i + 1}</span>
                <span className={t.done ? "line-through text-muted" : ""}>{t.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-3 gap-3">
        <Stat
          icon={<Moon className="h-3.5 w-3.5" />}
          label="Sleep"
          value={`${stats.sleepLast.toFixed(1)}h`}
          ok={stats.sleepLast >= SLEEP_MIN_HOURS}
        />
        <Stat
          icon={<Brain className="h-3.5 w-3.5" />}
          label="Deep work"
          value={`${stats.deepWorkToday.toFixed(1)}h`}
          ok={stats.deepWorkToday >= 1.5}
        />
        <Stat
          icon={<Activity className="h-3.5 w-3.5" />}
          label="Exercise"
          value={stats.exerciseToday ? "✓" : "—"}
          ok={stats.exerciseToday}
        />
      </section>

      <section>
        <div className="text-[11px] uppercase tracking-widest text-muted mb-2">Notes</div>
        <TextAreaInput
          rows={4}
          value={scratch}
          onChange={(e) => setScratch(e.target.value)}
          onBlur={saveScratch}
          placeholder="Free-form. Goes into tonight's lesson field automatically."
          className="text-base"
        />
        {scratchSaved ? <div className="text-[10px] text-accent mt-1">saved</div> : null}
      </section>

      <section>
        <div className="text-[11px] uppercase tracking-widest text-muted mb-3">Quick</div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/track?tab=attention">
              <Play className="h-3.5 w-3.5" />
              Start deep work
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/track?tab=energy">
              <Activity className="h-3.5 w-3.5" />
              Log exercise
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/track?tab=energy">
              <Coffee className="h-3.5 w-3.5" />
              Caffeine cutoff
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  ok,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="border-l border-border pl-3 py-1">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted">
        {icon}
        {label}
      </div>
      <div className={`mt-1 font-mono text-xl ${ok ? "text-good" : ""}`}>{value}</div>
    </div>
  );
}
