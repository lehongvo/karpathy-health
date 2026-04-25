"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ProjectStatusBoard } from "@/components/ProjectStatusBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDB, getRangeByDate } from "@/lib/db";
import type { Task, SayingNoLog } from "@/lib/types";

export default function TasksPage() {
  const [inbox, setInbox] = useState<Task[]>([]);
  const [draft, setDraft] = useState("");
  const [noLog, setNoLog] = useState<SayingNoLog[]>([]);
  const [noWhat, setNoWhat] = useState("");
  const [noWhy, setNoWhy] = useState("");

  const refresh = async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const tasks = await getRangeByDate("tasks", today, today);
    setInbox(tasks);
    const allNo = await getRangeByDate(
      "sayingNo",
      format(new Date(2020, 0, 1), "yyyy-MM-dd"),
      today,
    );
    setNoLog(allNo);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const addTask = async () => {
    if (!draft.trim()) return;
    const db = await getDB();
    await db.add("tasks", {
      date: format(new Date(), "yyyy-MM-dd"),
      text: draft.trim(),
      priority: "p3",
      done: false,
      createdAt: Date.now(),
    });
    setDraft("");
    await refresh();
  };

  const logNo = async () => {
    if (!noWhat.trim()) return;
    const db = await getDB();
    await db.add("sayingNo", {
      date: format(new Date(), "yyyy-MM-dd"),
      what: noWhat.trim(),
      why: noWhy.trim(),
    });
    setNoWhat("");
    setNoWhy("");
    await refresh();
  };

  const toggleDone = async (t: Task) => {
    const db = await getDB();
    await db.put("tasks", { ...t, done: !t.done });
    await refresh();
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Tasks &amp; projects</h1>
        <p className="text-sm text-muted-foreground">
          Multi-project orchestration — Active capped at 2 (Mark 2008 context-switch tax).
        </p>
      </header>

      <ProjectStatusBoard />

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Capture quick…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <Button onClick={addTask}>Add</Button>
          </div>
          <ul className="space-y-1">
            {inbox.length === 0 ? (
              <li className="text-sm text-muted-foreground">Empty inbox.</li>
            ) : (
              inbox.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 rounded-md border bg-card/50 px-2 py-1.5 text-sm"
                >
                  <input type="checkbox" checked={t.done} onChange={() => toggleDone(t)} />
                  <span className={t.done ? "text-muted-foreground line-through" : ""}>{t.text}</span>
                  <Badge
                    variant={t.priority === "mit" ? "default" : "outline"}
                    className="ml-auto text-[10px]"
                  >
                    {t.priority}
                  </Badge>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Saying-no log <span className="ml-2 text-xs text-muted-foreground">({noLog.length} total)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-[2fr_2fr_auto]">
            <Input placeholder="What you declined…" value={noWhat} onChange={(e) => setNoWhat(e.target.value)} />
            <Input placeholder="Why" value={noWhy} onChange={(e) => setNoWhy(e.target.value)} />
            <Button onClick={logNo}>Log</Button>
          </div>
          <ul className="space-y-1">
            {noLog.slice(-5).reverse().map((n) => (
              <li key={n.id} className="text-sm">
                <span className="font-mono text-xs text-muted-foreground">{n.date}</span> · {n.what}
                {n.why ? <span className="text-muted-foreground"> — {n.why}</span> : null}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
