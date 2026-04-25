"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Container } from "@/components/chrome/Container";
import { sleepRepo, exerciseRepo, deepWorkRepo, projectRepo } from "@/lib/db/repos";
import { BURNOUT_RULES, MAX_ACTIVE_PROJECTS } from "@/lib/protocols";

interface Fired {
  id: string;
  label: string;
  description: string;
}

export function BurnoutNotice() {
  const [fired, setFired] = useState<Fired[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const out: Fired[] = [];
      const today = format(new Date(), "yyyy-MM-dd");

      const sleep = await sleepRepo.byRange(format(subDays(new Date(), 2), "yyyy-MM-dd"), today);
      const last3 = sleep.slice(-3);
      if (last3.length === 3 && last3.every((s) => s.hours < 6)) {
        const r = BURNOUT_RULES.find((x) => x.id === "sleep-debt-3d");
        if (r) out.push(r);
      }

      const ex = await exerciseRepo.byRange(format(subDays(new Date(), 4), "yyyy-MM-dd"), today);
      if (ex.length === 0) {
        const r = BURNOUT_RULES.find((x) => x.id === "no-exercise-5d");
        if (r) out.push(r);
      }

      const dw = await deepWorkRepo.byRange(format(subDays(new Date(), 27), "yyyy-MM-dd"), today);
      const last7 = dw.filter((b) => b.date >= format(subDays(new Date(), 6), "yyyy-MM-dd"));
      const last7Hrs = last7.reduce((s, b) => s + b.durationMin, 0) / 60;
      const totalHrs = dw.reduce((s, b) => s + b.durationMin, 0) / 60;
      const baseline28 = totalHrs / 28;
      if (baseline28 > 0.5 && last7Hrs < baseline28 * 7 * 0.5) {
        const r = BURNOUT_RULES.find((x) => x.id === "deep-work-collapse");
        if (r) out.push(r);
      }

      const projects = await projectRepo.all();
      if (projects.filter((p) => p.status === "active").length > MAX_ACTIVE_PROJECTS) {
        const r = BURNOUT_RULES.find((x) => x.id === "active-overload");
        if (r) out.push(r);
      }

      setFired(out);
    })();
  }, []);

  const visible = fired.filter((f) => !dismissed.includes(f.id));
  if (visible.length === 0) return null;

  return (
    <Container className="pt-3">
      {visible.map((r) => (
        <div
          key={r.id}
          className="border-l-2 border-alert pl-4 py-3 mb-3 flex items-start gap-3 bg-alert-soft/30 rounded-r-md"
        >
          <div className="flex-1">
            <div className="font-medium text-sm">{r.label}</div>
            <div className="text-xs text-muted mt-1 leading-relaxed">{r.description}</div>
          </div>
          <button
            onClick={() => setDismissed((d) => [...d, r.id])}
            className="text-muted hover:text-text text-xs px-2 -mt-1"
          >
            dismiss
          </button>
        </div>
      ))}
    </Container>
  );
}
