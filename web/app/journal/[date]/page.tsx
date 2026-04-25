"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/chrome/Container";
import { sleepRepo, deepWorkRepo, exerciseRepo, taskRepo, reviewRepo } from "@/lib/db/repos";
import type { SleepLog, DeepWorkBlock, ExerciseLog, Task, DailyReview } from "@/lib/types";

export default function PastJournalPage() {
  const params = useParams<{ date: string }>();
  const date = params.date;
  const [sleep, setSleep] = useState<SleepLog | null>(null);
  const [dw, setDw] = useState<DeepWorkBlock[]>([]);
  const [ex, setEx] = useState<ExerciseLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [review, setReview] = useState<DailyReview | null>(null);

  useEffect(() => {
    if (!date) return;
    (async () => {
      const s = await sleepRepo.byRange(date, date);
      setSleep(s[s.length - 1] ?? null);
      setDw(await deepWorkRepo.byRange(date, date));
      setEx(await exerciseRepo.byRange(date, date));
      setTasks(await taskRepo.byRange(date, date));
      const r = await reviewRepo.byRange(date, date);
      setReview(r[r.length - 1] ?? null);
    })();
  }, [date]);

  if (!date) return null;
  const mit = tasks.find((t) => t.priority === "mit");

  return (
    <Container className="py-10 md:py-16 space-y-8">
      <Link href="/" className="text-sm text-muted hover:text-text">← back to today</Link>
      <h1 className="font-serif text-3xl">{date}</h1>

      {mit ? (
        <section>
          <div className="text-[10px] uppercase tracking-widest text-muted mb-1">MIT</div>
          <p className="font-serif text-xl">
            <span className={mit.done ? "line-through text-muted" : ""}>{mit.text}</span>
            {mit.done ? <span className="text-accent ml-2 text-base">✓</span> : null}
          </p>
        </section>
      ) : null}

      <section className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted">Sleep</div>
          <div className="font-mono text-lg">{sleep ? `${sleep.hours}h` : "—"}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted">Deep work</div>
          <div className="font-mono text-lg">
            {dw.length > 0 ? `${(dw.reduce((s, b) => s + b.durationMin, 0) / 60).toFixed(1)}h` : "—"}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted">Exercise</div>
          <div className="font-mono text-lg">{ex.length > 0 ? `${ex.reduce((s, e) => s + e.durationMin, 0)} min` : "—"}</div>
        </div>
      </section>

      {review ? (
        <section className="space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-muted">Review</div>
          {review.wins.length > 0 ? (
            <div>
              <div className="text-xs text-muted mb-1">Wins</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {review.wins.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          ) : null}
          {review.lesson ? (
            <div>
              <div className="text-xs text-muted mb-1">Lesson</div>
              <p className="text-sm italic">{review.lesson}</p>
            </div>
          ) : null}
          {review.tomorrowMIT ? (
            <div>
              <div className="text-xs text-muted mb-1">Tomorrow's MIT (set this day)</div>
              <p className="text-sm">{review.tomorrowMIT}</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </Container>
  );
}
