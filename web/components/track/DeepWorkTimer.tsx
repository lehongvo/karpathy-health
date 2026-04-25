"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, Pause } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { FieldLabel } from "@/components/primitives/Field";
import { Slider } from "@/components/primitives/Slider";
import { ProgressBar } from "@/components/primitives/ProgressBar";
import { todayISO } from "@/lib/utils";
import { projectRepo, deepWorkRepo } from "@/lib/db/repos";
import type { Project } from "@/lib/types";
import { DEEP_WORK_BLOCK_MINUTES } from "@/lib/protocols";

type State = "idle" | "running" | "paused";

function clock(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function DeepWorkTimer() {
  const [state, setState] = useState<State>("idle");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [distractions, setDistractions] = useState(0);
  const [quality, setQuality] = useState(4);
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void projectRepo.all().then((list) => {
      setProjects(list);
      const active = list.find((p) => p.status === "active");
      if (active) setProjectId(active.id);
    });
  }, []);

  useEffect(() => {
    if (state === "running") {
      tickRef.current = setInterval(() => {
        if (startedAtRef.current !== null) setElapsed(Date.now() - startedAtRef.current);
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

  const stop = async () => {
    if (!startedAtRef.current || elapsed < 60_000) {
      setState("idle");
      setElapsed(0);
      startedAtRef.current = null;
      return;
    }
    await deepWorkRepo.put({
      date: todayISO(),
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      durationMin: Math.round(elapsed / 60_000),
      projectId: projectId || "untagged",
      distractionCount: distractions,
      focusQuality: Math.min(5, Math.max(1, quality)) as 1 | 2 | 3 | 4 | 5,
    });
    setState("idle");
    setElapsed(0);
    setDistractions(0);
    startedAtRef.current = null;
  };

  const targetMs = DEEP_WORK_BLOCK_MINUTES * 60_000;
  const progress = Math.min(100, (elapsed / targetMs) * 100);

  return (
    <section className="space-y-6">
      <div className="text-center py-6">
        <div className="font-mono text-6xl md:text-7xl tabular-nums tracking-tight">{clock(elapsed)}</div>
        <div className="mt-3 text-[10px] uppercase tracking-widest text-muted">
          Target {DEEP_WORK_BLOCK_MINUTES} min · BRAC ultradian cycle
        </div>
        <div className="mt-4">
          <ProgressBar value={progress} tone="default" />
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {state !== "running" ? (
          <Button onClick={start} disabled={!projectId}>
            <Play className="h-4 w-4" /> Start
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setState("paused")}>
            <Pause className="h-4 w-4" /> Pause
          </Button>
        )}
        <Button variant="outline" onClick={stop} disabled={state === "idle"}>
          <Square className="h-4 w-4" /> Stop &amp; log
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <FieldLabel>Project</FieldLabel>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="mt-2 block w-full bg-transparent border-0 border-b border-border py-2 text-sm focus:outline-none focus:border-text"
          >
            {projects.length === 0 ? (
              <option value="">no projects</option>
            ) : (
              projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.status}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <FieldLabel>Distractions</FieldLabel>
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => setDistractions((d) => Math.max(0, d - 1))}
              className="w-8 h-8 rounded-md border border-border hover:bg-accent-soft text-text"
            >
              −
            </button>
            <span className="font-mono text-xl w-6 text-center">{distractions}</span>
            <button
              onClick={() => setDistractions((d) => d + 1)}
              className="w-8 h-8 rounded-md border border-border hover:bg-accent-soft text-text"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <FieldLabel>Focus quality (logged on stop)</FieldLabel>
          <span className="font-mono text-sm">{quality}/5</span>
        </div>
        <Slider min={1} max={5} step={1} value={[quality]} onValueChange={([v]) => setQuality(v)} />
      </div>
    </section>
  );
}
