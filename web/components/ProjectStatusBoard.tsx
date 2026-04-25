"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAll, getDB } from "@/lib/db";
import type { Project, ProjectStatus } from "@/lib/types";
import { MAX_ACTIVE_PROJECTS } from "@/lib/protocols";
import { AlertTriangle } from "lucide-react";

const COLUMNS: { status: ProjectStatus; label: string; tone: string }[] = [
  { status: "active", label: "Active", tone: "border-[var(--color-rust)]/40" },
  { status: "maintenance", label: "Maintenance", tone: "border-[var(--color-warning)]/40" },
  { status: "paused", label: "Paused", tone: "border-muted-foreground/30" },
  { status: "done", label: "Done", tone: "border-[var(--color-health)]/40" },
];

export function ProjectStatusBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  const refresh = async () => {
    setProjects((await getAll("projects")) as Project[]);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const moveTo = async (id: string, status: ProjectStatus) => {
    const db = await getDB();
    const p = projects.find((x) => x.id === id);
    if (!p || p.status === status) return;
    await db.put("projects", { ...p, status, updatedAt: Date.now() });
    await refresh();
  };

  const create = async () => {
    if (!newName.trim()) return;
    const db = await getDB();
    const id = newName.trim().toLowerCase().replace(/\s+/g, "-");
    await db.put("projects", {
      id,
      name: newName.trim(),
      status: "paused",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setNewName("");
    await refresh();
  };

  const activeCount = projects.filter((p) => p.status === "active").length;
  const overloaded = activeCount > MAX_ACTIVE_PROJECTS;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Projects</CardTitle>
          {overloaded ? (
            <Badge variant="warning">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {activeCount} active &gt; max {MAX_ACTIVE_PROJECTS}
            </Badge>
          ) : (
            <Badge variant="outline">
              {activeCount}/{MAX_ACTIVE_PROJECTS} active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => {
            const items = projects.filter((p) => p.status === col.status);
            return (
              <div
                key={col.status}
                className={`rounded-lg border-2 border-dashed ${col.tone} bg-card/50 p-3`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId) void moveTo(dragId, col.status);
                  setDragId(null);
                }}
              >
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                  <span>{col.label}</span>
                  <span>{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground/60">drop here</p>
                  ) : (
                    items.map((p) => (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={() => setDragId(p.id)}
                        className="cursor-move rounded-md border bg-background px-2 py-1.5 text-sm"
                        style={p.color ? { borderLeft: `3px solid ${p.color}` } : undefined}
                      >
                        {p.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="New project…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void create();
            }}
          />
          <Button onClick={create}>Add</Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Drag to change status. Max {MAX_ACTIVE_PROJECTS} active — every project past that steals time from every other.
        </p>
      </CardContent>
    </Card>
  );
}
