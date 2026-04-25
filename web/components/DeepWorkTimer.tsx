"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Square, Pause } from "lucide-react";
import { getAll, getDB } from "@/lib/db";
import type { DeepWorkBlock, Project } from "@/lib/types";
import { DEEP_WORK_BLOCK_MINUTES } from "@/lib/protocols";

type State = "idle" | "running" | "paused";

function formatClock(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function DeepWorkTimer() {
  const [state, setState] = useState<State>("idle");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [distractions, setDistractions] = useState(0);
  const [quality, setQuality] = useState(4);
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void getAll("projects").then((rows) => {
      const list = rows as Project[];
      setProjects(list);
      const active = list.find((p) => p.status === "active");
      if (active) setProjectId(active.id);
    });
  }, []);

  useEffect(() => {
    if (state === "running") {
      tickRef.current = setInterval(() => {
        if (startedAtRef.current !== null) {
          setElapsed(Date.now() - startedAtRef.current);
        }
      }, 1000);
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [state]);

  const start = () => {
    startedAtRef.current = Date.now() - elapsed;
    setState("running");
  };
  const pause = () => setState("paused");
  const stop = async () => {
    if (!startedAtRef.current || elapsed < 60_000) {
      setState("idle");
      setElapsed(0);
      return;
    }
    const db = await getDB();
    const block: DeepWorkBlock = {
      date: format(new Date(), "yyyy-MM-dd"),
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      durationMin: Math.round(elapsed / 60_000),
      projectId: projectId || "untagged",
      distractionCount: distractions,
      focusQuality: Math.min(5, Math.max(1, quality)) as 1 | 2 | 3 | 4 | 5,
    };
    await db.put("deepWork", block);
    setState("idle");
    setElapsed(0);
    setDistractions(0);
    startedAtRef.current = null;
  };

  const targetMs = DEEP_WORK_BLOCK_MINUTES * 60_000;
  const progress = Math.min(100, (elapsed / targetMs) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Deep Work Timer</CardTitle>
          <Badge variant={state === "running" ? "success" : "outline"}>
            {state === "running" ? "Running" : state === "paused" ? "Paused" : "Idle"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-center">
          <div className="font-mono text-6xl tabular-nums tracking-tight">{formatClock(elapsed)}</div>
          <div className="mt-2 h-1 w-full rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-[var(--color-rust)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Target: {DEEP_WORK_BLOCK_MINUTES} min — BRAC-aligned ultradian cycle.
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {state !== "running" ? (
            <Button onClick={start} disabled={!projectId}>
              <Play className="mr-1 h-4 w-4" /> Start
            </Button>
          ) : (
            <Button variant="secondary" onClick={pause}>
              <Pause className="mr-1 h-4 w-4" /> Pause
            </Button>
          )}
          <Button variant="outline" onClick={stop} disabled={state === "idle"}>
            <Square className="mr-1 h-4 w-4" /> Stop & Log
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="project">Project</Label>
            <select
              id="project"
              className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.length === 0 ? (
                <option value="">no projects yet</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.status})
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <Label>Distractions</Label>
            <div className="mt-1 flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setDistractions((d) => Math.max(0, d - 1))}>
                −
              </Button>
              <span className="font-mono text-lg">{distractions}</span>
              <Button size="sm" variant="outline" onClick={() => setDistractions((d) => d + 1)}>
                +
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <Label>Focus quality (logged on stop)</Label>
            <span className="font-mono text-sm">{quality}/5</span>
          </div>
          <Slider min={1} max={5} step={1} value={[quality]} onValueChange={([v]) => setQuality(v)} />
        </div>
      </CardContent>
    </Card>
  );
}
