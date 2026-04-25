"use client";

import { useState } from "react";
import { DeepWorkTimer } from "@/components/DeepWorkTimer";
import { EnergyHeatmap } from "@/components/EnergyHeatmap";
import { FocusScore } from "@/components/FocusScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NOTIFICATION_AUDIT } from "@/lib/protocols";

export default function AttentionPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allChecked = NOTIFICATION_AUDIT.every((i) => checked[i.id]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Attention</h1>
        <p className="text-sm text-muted-foreground">
          Deep work blocks + notification hygiene. Per Mark 2008 — every interruption costs ~23 min.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <DeepWorkTimer />
        <FocusScore />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notification audit (one-time setup)</CardTitle>
            <Button
              size="sm"
              variant={allChecked ? "secondary" : "default"}
              onClick={() => {
                if (allChecked) {
                  setChecked({});
                } else {
                  const all: Record<string, boolean> = {};
                  for (const i of NOTIFICATION_AUDIT) all[i.id] = true;
                  setChecked(all);
                }
              }}
            >
              {allChecked ? "Reset" : "Mark all"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {NOTIFICATION_AUDIT.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={!!checked[i.id]}
                  onChange={(e) => setChecked((c) => ({ ...c, [i.id]: e.target.checked }))}
                  className="h-4 w-4"
                />
                <span className={checked[i.id] ? "text-muted-foreground line-through" : ""}>{i.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <EnergyHeatmap />
    </div>
  );
}
