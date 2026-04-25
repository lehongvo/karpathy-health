"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RustProgressLink } from "@/components/RustProgressLink";
import { getRangeByDate } from "@/lib/db";

interface DayHours {
  date: string;
  hours: number;
}

export default function LearningPage() {
  const [series, setSeries] = useState<DayHours[]>([]);

  useEffect(() => {
    (async () => {
      const from = format(subDays(new Date(), 13), "yyyy-MM-dd");
      const to = format(new Date(), "yyyy-MM-dd");
      const blocks = await getRangeByDate("deepWork", from, to);
      const map = new Map<string, number>();
      for (const b of blocks) {
        if (b.projectId !== "rust-solana" && b.projectId !== "interview-prep") continue;
        map.set(b.date, (map.get(b.date) ?? 0) + b.durationMin / 60);
      }
      const out: DayHours[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = format(subDays(new Date(), i), "yyyy-MM-dd");
        out.push({ date: format(new Date(d), "MMM d"), hours: Math.round((map.get(d) ?? 0) * 10) / 10 });
      }
      setSeries(out);
    })();
  }, []);

  const total = series.reduce((s, d) => s + d.hours, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Learning</h1>
        <p className="text-sm text-muted-foreground">
          Linked to <a className="underline" href="https://github.com/lehongvo/karpathy-rust">karpathy-rust</a> — see daily compounding.
        </p>
      </header>

      <RustProgressLink />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Study deep-work hours (last 14 days)</CardTitle>
            <span className="font-mono text-sm">{total.toFixed(1)}h total</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="hours" fill="var(--color-rust)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Counted: deep work blocks tagged <code>rust-solana</code> or <code>interview-prep</code>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spaced repetition queue (placeholder)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Anki-lite for Rust concepts. Current build skips this — use{" "}
            <a className="underline" href="https://apps.ankiweb.net/">
              Anki proper
            </a>{" "}
            for now. See{" "}
            <a className="underline" href="https://notes.andymatuschak.org/Evergreen_notes">
              Matuschak on durable learning
            </a>{" "}
            for principles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
