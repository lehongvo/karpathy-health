"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { DeepWorkTimer } from "./DeepWorkTimer";
import { energyRepo } from "@/lib/db/repos";
import { NOTIFICATION_AUDIT } from "@/lib/protocols";
import type { EnergyLog } from "@/lib/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function colorFor(level: number): string {
  if (level === 0) return "var(--color-border)";
  if (level <= 1.5) return "var(--color-alert)";
  if (level <= 2.5) return "#d68a52";
  if (level <= 3.5) return "#cf9d49";
  if (level <= 4.5) return "#7aa468";
  return "var(--color-good)";
}

function EnergyHeatmap() {
  const [grid, setGrid] = useState<number[][]>([]);
  useEffect(() => {
    (async () => {
      const from = format(subDays(new Date(), 28), "yyyy-MM-dd");
      const to = format(new Date(), "yyyy-MM-dd");
      const logs = (await energyRepo.byRange(from, to)) as EnergyLog[];
      const sums: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
      const counts: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
      for (const l of logs) {
        const d = new Date(l.date);
        const dow = (d.getDay() + 6) % 7;
        sums[dow][l.hour] += l.level;
        counts[dow][l.hour] += 1;
      }
      setGrid(sums.map((row, i) => row.map((v, h) => (counts[i][h] === 0 ? 0 : v / counts[i][h]))));
    })();
  }, []);
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="inline-block">
        {grid.map((row, i) => (
          <div key={i} className="flex items-center gap-1 mb-px">
            <div className="w-9 text-right text-[9px] text-muted">{DAYS[i]}</div>
            <div className="flex gap-px">
              {row.map((v, h) => (
                <div
                  key={h}
                  title={`${DAYS[i]} ${h}:00 — ${v ? v.toFixed(1) : "-"}`}
                  className="h-3 w-3 rounded-sm"
                  style={{ background: colorFor(v) }}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="ml-10 mt-1 text-[9px] text-muted">0h ··· 23h</div>
      </div>
    </div>
  );
}

export function AttentionTab() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allChecked = NOTIFICATION_AUDIT.every((i) => checked[i.id]);

  return (
    <div className="space-y-12">
      <DeepWorkTimer />

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Notification audit</h2>
        <p className="text-xs text-muted leading-relaxed">
          One-time setup. Every notification you allow becomes the most likely thing to break your block. Mark 2008 → ~23 min average resumption.
        </p>
        <ul className="space-y-2">
          {NOTIFICATION_AUDIT.map((i) => (
            <li key={i.id} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!checked[i.id]}
                onChange={(e) => setChecked((c) => ({ ...c, [i.id]: e.target.checked }))}
                className="h-4 w-4 accent-accent"
              />
              <span className={checked[i.id] ? "text-muted line-through" : ""}>{i.text}</span>
            </li>
          ))}
        </ul>
        {allChecked ? (
          <p className="text-xs text-good">All set — keep it that way.</p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Energy heatmap</h2>
        <p className="text-xs text-muted">Avg energy 1–5 by day-of-week × hour, last 28 days.</p>
        <EnergyHeatmap />
      </section>
    </div>
  );
}
