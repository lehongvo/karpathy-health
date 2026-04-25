"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import {
  KARPATHY_RUST_REPO,
  readRustProgress,
  writeRustProgress,
  type RustProgress,
} from "@/lib/integrations";

export function RustProgressLink() {
  const [progress, setProgress] = useState<RustProgress | null>(null);
  const [pasting, setPasting] = useState(false);
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setProgress(readRustProgress());
  }, []);

  const submitPaste = () => {
    setErr(null);
    try {
      const parsed = JSON.parse(draft) as Partial<RustProgress>;
      const filled: RustProgress = {
        hoursThisWeek: Number(parsed.hoursThisWeek ?? 0),
        hoursThisMonth: Number(parsed.hoursThisMonth ?? 0),
        hoursTotal: Number(parsed.hoursTotal ?? 0),
        currentMonthFocus: String(parsed.currentMonthFocus ?? "M?"),
        lastUpdated: new Date().toISOString(),
        source: "manual-paste",
      };
      writeRustProgress(filled);
      setProgress(filled);
      setPasting(false);
      setDraft("");
    } catch {
      setErr("Invalid JSON. Expected { hoursThisWeek, hoursThisMonth, hoursTotal, currentMonthFocus }.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Rust progress (linked)</CardTitle>
          <a
            href={KARPATHY_RUST_REPO}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[var(--color-rust)] hover:underline"
          >
            karpathy-rust ↗
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {progress ? (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-muted-foreground">This week</div>
              <div className="font-mono text-2xl">{progress.hoursThisWeek}h</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">This month</div>
              <div className="font-mono text-2xl">{progress.hoursThisMonth}h</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Focus</div>
              <Badge variant="rust" className="mt-2">
                {progress.currentMonthFocus}
              </Badge>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No karpathy-rust progress linked yet. Paste the export JSON below.
          </p>
        )}

        {pasting ? (
          <div className="space-y-2">
            <Textarea
              rows={6}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder='{"hoursThisWeek":4.5,"hoursThisMonth":18,"hoursTotal":120,"currentMonthFocus":"M3 — Ownership"}'
              className="font-mono text-xs"
            />
            {err ? <p className="text-xs text-[hsl(var(--destructive))]">{err}</p> : null}
            <div className="flex gap-2">
              <Button size="sm" onClick={submitPaste}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setPasting(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setPasting(true)}>
            <ExternalLink className="mr-1 h-3 w-3" />
            {progress ? "Update from JSON" : "Paste progress JSON"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
