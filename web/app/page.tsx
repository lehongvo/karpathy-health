import { Suspense } from "react";
import { DailyCard } from "@/components/DailyCard";
import { TodayStats } from "@/components/TodayStats";
import { BurnoutAlert } from "@/components/BurnoutAlert";
import { FocusScore } from "@/components/FocusScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CORE_HABITS } from "@/lib/protocols";
import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Daily dashboard</h1>
        <p className="text-sm text-muted-foreground">
          The 5-minute screen. Set MIT, log energy, see the burnout signal early.
        </p>
      </header>

      <Suspense fallback={null}>
        <BurnoutAlert />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <DailyCard />
        <div className="space-y-6">
          <TodayStats />
          <FocusScore />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core 5 (Pareto)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 md:grid-cols-2">
            {CORE_HABITS.map((h) => (
              <li
                key={h.id}
                className="flex items-center gap-3 rounded-md border bg-card/50 px-3 py-2 text-sm"
              >
                <span className="text-lg">{h.emoji}</span>
                <span className="flex-1">{h.text}</span>
                <Link
                  href={`/protocols/${h.doc.replace(/\.md$/, "")}`}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  doc
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
