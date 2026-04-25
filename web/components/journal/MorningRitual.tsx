"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Sun } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { TextInput, FieldLabel } from "@/components/primitives/Field";
import { Slider } from "@/components/primitives/Slider";
import { todayISO } from "@/lib/utils";
import { sleepRepo, taskRepo, energyRepo } from "@/lib/db/repos";

type Step = 0 | 1 | 2 | 3 | 4;

function timeDiffHours(bed: string, wake: string): number {
  const [bh, bm] = bed.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

export function MorningRitual() {
  const [step, setStep] = useState<Step>(0);
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [energy, setEnergy] = useState(3);
  const [mit, setMit] = useState("");
  const [topThree, setTopThree] = useState(["", "", ""]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
      const sleep = await sleepRepo.byRange(yesterday, yesterday);
      const last = sleep[sleep.length - 1];
      if (last) {
        setBedtime(last.bedtime);
        setWakeTime(last.wakeTime);
      }
      const tasks = await taskRepo.byRange(todayISO(), todayISO());
      const mitRow = tasks.find((t) => t.priority === "mit");
      if (mitRow) setMit(mitRow.text);
      const others = tasks.filter((t) => t.priority !== "mit").slice(0, 3);
      setTopThree([0, 1, 2].map((i) => others[i]?.text ?? ""));
    })();
  }, []);

  const finish = async () => {
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
    const hours = timeDiffHours(bedtime, wakeTime);
    await sleepRepo.put({
      date: yesterday,
      bedtime,
      wakeTime,
      hours,
      quality: Math.min(5, Math.max(1, Math.round(hours - 4))) as 1 | 2 | 3 | 4 | 5,
    });
    await energyRepo.put({
      date: todayISO(),
      hour: new Date().getHours(),
      level: Math.min(5, Math.max(1, energy)) as 1 | 2 | 3 | 4 | 5,
    });
    if (mit.trim()) {
      const tasks = await taskRepo.byRange(todayISO(), todayISO());
      const existing = tasks.find((t) => t.priority === "mit");
      await taskRepo.put({
        ...(existing ?? {}),
        date: todayISO(),
        text: mit.trim(),
        priority: "mit",
        done: false,
        createdAt: existing?.createdAt ?? Date.now(),
      });
    }
    for (let i = 0; i < 3; i++) {
      if (topThree[i].trim()) {
        await taskRepo.put({
          date: todayISO(),
          text: topThree[i].trim(),
          priority: i === 0 ? "p1" : i === 1 ? "p2" : "p3",
          done: false,
          createdAt: Date.now() + i,
        });
      }
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="space-y-6">
        <p className="font-serif text-2xl leading-snug">
          The day is set. Now do the work.
        </p>
        <p className="text-muted text-sm">
          MIT: <span className="text-text">{mit || "—"}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-muted text-xs uppercase tracking-widest">
        <Sun className="h-3.5 w-3.5" />
        Morning ritual · step {step + 1} of 4
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Last night.</h2>
          <p className="text-sm text-muted">When did you sleep, and when did you wake?</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Bedtime</FieldLabel>
              <TextInput type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Wake</FieldLabel>
              <TextInput type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-muted font-mono">
            {timeDiffHours(bedtime, wakeTime)}h
            {timeDiffHours(bedtime, wakeTime) < 7 ? " — below the 7h floor (Van Dongen 2003)" : " — at or above target"}
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Energy now.</h2>
          <p className="text-sm text-muted">1 = wrecked. 5 = sharp.</p>
          <div className="space-y-2">
            <Slider min={1} max={5} step={1} value={[energy]} onValueChange={([v]) => setEnergy(v)} />
            <div className="text-center font-mono text-3xl">{energy}</div>
          </div>
          {energy <= 2 ? (
            <p className="text-xs text-muted leading-relaxed">
              Energy ≤2 → de-scope today. One block, no extras.
            </p>
          ) : null}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Today's MIT.</h2>
          <p className="text-sm text-muted">The one thing that, if you ship it, makes today a win.</p>
          <TextInput
            autoFocus
            value={mit}
            onChange={(e) => setMit(e.target.value)}
            placeholder="One sentence. No lists."
            className="text-lg"
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Three priorities.</h2>
          <p className="text-sm text-muted">Below MIT. Optional — skip if you don't have them yet.</p>
          <div className="space-y-3">
            {topThree.map((t, i) => (
              <TextInput
                key={i}
                value={t}
                placeholder={`Priority ${i + 1}`}
                onChange={(e) => {
                  const next = [...topThree];
                  next[i] = e.target.value;
                  setTopThree(next);
                }}
              />
            ))}
          </div>
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
          <Button onClick={finish}>Start the day →</Button>
        )}
      </div>
    </div>
  );
}
