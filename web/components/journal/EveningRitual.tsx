"use client";

import { useEffect, useState } from "react";
import { Sunset } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { TextInput, TextAreaInput, FieldLabel } from "@/components/primitives/Field";
import { Slider } from "@/components/primitives/Slider";
import { todayISO } from "@/lib/utils";
import { reviewRepo, taskRepo } from "@/lib/db/repos";
import type { DailyReview } from "@/lib/types";
import { useApp } from "@/lib/store";

type Step = 0 | 1 | 2 | 3;

export function EveningRitual() {
  const [step, setStep] = useState<Step>(0);
  const [wins, setWins] = useState(["", "", ""]);
  const [lesson, setLesson] = useState("");
  const [tomorrowMIT, setTomorrowMIT] = useState("");
  const [energyRetro, setEnergyRetro] = useState(3);
  const [done, setDone] = useState(false);
  const settings = useApp((s) => s.settings);

  useEffect(() => {
    (async () => {
      const today = todayISO();
      const reviews = await reviewRepo.byRange(today, today);
      const r = reviews[reviews.length - 1];
      if (r) {
        setWins([...(r.wins ?? []), "", "", ""].slice(0, 3));
        setLesson(r.lesson ?? "");
        setTomorrowMIT(r.tomorrowMIT ?? "");
        setEnergyRetro(r.energyRetro);
      }
    })();
  }, []);

  const finish = async () => {
    const today = todayISO();
    const review: DailyReview = {
      date: today,
      wins: wins.filter(Boolean),
      lesson,
      tomorrowMIT,
      energyRetro: Math.min(5, Math.max(1, energyRetro)) as 1 | 2 | 3 | 4 | 5,
    };
    await reviewRepo.put(review);
    if (tomorrowMIT.trim()) {
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const y = tomorrowDate.getFullYear();
      const m = String(tomorrowDate.getMonth() + 1).padStart(2, "0");
      const d = String(tomorrowDate.getDate()).padStart(2, "0");
      const tomorrowISO = `${y}-${m}-${d}`;
      const existing = await taskRepo.byRange(tomorrowISO, tomorrowISO);
      const mit = existing.find((t) => t.priority === "mit");
      await taskRepo.put({
        ...(mit ?? {}),
        date: tomorrowISO,
        text: tomorrowMIT.trim(),
        priority: "mit",
        done: false,
        createdAt: mit?.createdAt ?? Date.now(),
      });
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="space-y-4">
        <p className="font-serif text-2xl leading-snug">Day closed.</p>
        <p className="text-sm text-muted">
          Bedtime alarm: aim for ~{settings.bedtimeHour}:30. No interactive screens 30 min before bed.
        </p>
        <p className="text-xs text-muted">
          (Static reading after dark = OK. Twitter/Slack = stops your sleep — Chang 2015.)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-muted text-xs uppercase tracking-widest">
        <Sunset className="h-3.5 w-3.5" />
        Evening review · step {step + 1} of 4
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Three wins today.</h2>
          <p className="text-sm text-muted">Small counts. Don't curate — write what actually happened.</p>
          <div className="space-y-3">
            {wins.map((w, i) => (
              <TextInput
                key={i}
                value={w}
                placeholder={`Win ${i + 1}`}
                onChange={(e) => {
                  const next = [...wins];
                  next[i] = e.target.value;
                  setWins(next);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">One lesson.</h2>
          <p className="text-sm text-muted">What would you do differently if you had today again?</p>
          <TextAreaInput
            rows={3}
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="One sentence. Be honest."
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Energy retro (1–5).</h2>
          <Slider min={1} max={5} step={1} value={[energyRetro]} onValueChange={([v]) => setEnergyRetro(v)} />
          <div className="text-center font-mono text-3xl">{energyRetro}</div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Tomorrow's MIT.</h2>
          <p className="text-sm text-muted">
            Decide tonight, do tomorrow morning. Whatever you do first, you do best.
          </p>
          <FieldLabel>Most Important Task</FieldLabel>
          <TextInput
            value={tomorrowMIT}
            onChange={(e) => setTomorrowMIT(e.target.value)}
            placeholder="The one thing tomorrow that makes it a win."
            autoFocus
            className="text-lg"
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => Math.min(3, s + 1) as Step)}>Next</Button>
        ) : (
          <Button onClick={finish}>Close the day →</Button>
        )}
      </div>
    </div>
  );
}
