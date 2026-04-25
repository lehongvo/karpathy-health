"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { TextInput, TextAreaInput, FieldLabel, FormBlock } from "@/components/primitives/Field";
import { todayISO } from "@/lib/utils";
import { projectRepo, taskRepo, sayingNoRepo } from "@/lib/db/repos";
import type { Project, ProjectStatus, Task, SayingNoLog } from "@/lib/types";
import { MAX_ACTIVE_PROJECTS } from "@/lib/protocols";

const COLUMNS: { status: ProjectStatus; label: string }[] = [
  { status: "active", label: "Active" },
  { status: "maintenance", label: "Maintenance" },
  { status: "paused", label: "Paused" },
  { status: "done", label: "Done" },
];

const KARPATHY_RUST_REPO = "https://github.com/lehongvo/karpathy-rust";

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDraft, setTaskDraft] = useState("");

  const [noLog, setNoLog] = useState<SayingNoLog[]>([]);
  const [noWhat, setNoWhat] = useState("");
  const [noWhy, setNoWhy] = useState("");

  const refresh = async () => {
    setProjects(await projectRepo.all());
    const today = todayISO();
    setTasks(await taskRepo.byRange(today, today));
    const allNo = await sayingNoRepo.byRange("2020-01-01", today);
    setNoLog(allNo);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const moveTo = async (id: string, status: ProjectStatus) => {
    const p = projects.find((x) => x.id === id);
    if (!p || p.status === status) return;
    await projectRepo.put({ ...p, status, updatedAt: Date.now() });
    await refresh();
  };

  const createProject = async () => {
    if (!newName.trim()) return;
    const id = newName.trim().toLowerCase().replace(/\s+/g, "-");
    await projectRepo.put({
      id,
      name: newName.trim(),
      status: "paused",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setNewName("");
    await refresh();
  };

  const addTask = async () => {
    if (!taskDraft.trim()) return;
    await taskRepo.put({
      date: todayISO(),
      text: taskDraft.trim(),
      priority: "p3",
      done: false,
      createdAt: Date.now(),
    });
    setTaskDraft("");
    await refresh();
  };

  const toggleTask = async (t: Task) => {
    await taskRepo.put({ ...t, done: !t.done });
    await refresh();
  };

  const logNo = async () => {
    if (!noWhat.trim()) return;
    await sayingNoRepo.put({ date: todayISO(), what: noWhat.trim(), why: noWhy.trim() });
    setNoWhat("");
    setNoWhy("");
    await refresh();
  };

  const activeCount = projects.filter((p) => p.status === "active").length;
  const overloaded = activeCount > MAX_ACTIVE_PROJECTS;

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl">Projects</h2>
          <div className="text-xs">
            {overloaded ? (
              <span className="text-alert flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {activeCount} active &gt; max {MAX_ACTIVE_PROJECTS}
              </span>
            ) : (
              <span className="text-muted">
                {activeCount}/{MAX_ACTIVE_PROJECTS} active
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => {
            const items = projects.filter((p) => p.status === col.status);
            return (
              <div
                key={col.status}
                className="border border-dashed border-border rounded-md p-3 min-h-[140px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId) void moveTo(dragId, col.status);
                  setDragId(null);
                }}
              >
                <div className="text-[10px] uppercase tracking-widest text-muted mb-2 flex justify-between">
                  <span>{col.label}</span>
                  <span>{items.length}</span>
                </div>
                <div className="space-y-1.5">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={() => setDragId(p.id)}
                      className="cursor-move text-sm bg-surface border border-border rounded px-2 py-1.5"
                      style={p.color ? { borderLeft: `2px solid ${p.color}` } : undefined}
                    >
                      {p.name}
                    </div>
                  ))}
                  {items.length === 0 ? (
                    <p className="text-[11px] text-muted/60">drop here</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <TextInput
            placeholder="New project…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createProject()}
          />
          <Button size="sm" onClick={createProject}>Add</Button>
        </div>
        <p className="text-[11px] text-muted">
          Drag to change status. Max {MAX_ACTIVE_PROJECTS} active — every project past the second steals time from every other.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Today's inbox</h2>
        <div className="flex gap-2">
          <TextInput
            placeholder="Capture quick…"
            value={taskDraft}
            onChange={(e) => setTaskDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Button size="sm" onClick={addTask}>Add</Button>
        </div>
        <ul className="space-y-1.5">
          {tasks.length === 0 ? (
            <li className="text-sm text-muted">Empty inbox.</li>
          ) : (
            tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 text-sm py-1"
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t)}
                  className="h-4 w-4 accent-accent"
                />
                <span className={t.done ? "text-muted line-through" : ""}>{t.text}</span>
                <span className="ml-auto font-mono text-[10px] text-muted">{t.priority}</span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Saying-no log</h2>
        <p className="text-xs text-muted">{noLog.length} declined so far. Every yes is a no to deep work somewhere else.</p>
        <FormBlock>
          <div className="grid gap-2 md:grid-cols-[2fr_2fr_auto]">
            <TextInput placeholder="What you declined…" value={noWhat} onChange={(e) => setNoWhat(e.target.value)} />
            <TextInput placeholder="Why" value={noWhy} onChange={(e) => setNoWhy(e.target.value)} />
            <Button size="sm" onClick={logNo}>Log</Button>
          </div>
        </FormBlock>
        <ul className="space-y-1">
          {noLog.slice(-5).reverse().map((n) => (
            <li key={n.id} className="text-sm">
              <span className="font-mono text-xs text-muted">{n.date}</span> · {n.what}
              {n.why ? <span className="text-muted"> — {n.why}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Learning</h2>
        <p className="text-xs text-muted">
          Linked to{" "}
          <a href={KARPATHY_RUST_REPO} target="_blank" rel="noreferrer" className="underline text-accent">
            karpathy-rust
          </a>
          . Daily Rust hours go through deep-work blocks tagged <code>rust-solana</code>.
        </p>
        <Button asChild variant="outline" size="sm">
          <a href={KARPATHY_RUST_REPO} target="_blank" rel="noreferrer">
            Open repo <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </section>
    </div>
  );
}
