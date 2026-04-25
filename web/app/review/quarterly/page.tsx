import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function QuarterlyReviewPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Quarterly decision gate (3h)</h1>
        <p className="text-sm text-muted-foreground">
          The strategic checkpoint. Maps to Section 8.5 of the karpathy-rust strategic plan.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Step 1 — Stats over the quarter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Open <Link className="underline" href="/insights">Insights</Link> and copy the 90-day numbers:
          </p>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>Sleep avg + consistency</li>
            <li>Total deep work hours</li>
            <li>Exercise consistency</li>
            <li>Burnout incidents (count of times BurnoutAlert fired)</li>
            <li>Projects shipped vs paused vs failed</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 2 — Energy audit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>List 3 of each:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>Drainers</strong>: activities/people/projects that drained you most.</li>
            <li><strong>Energizers</strong>: activities/people/projects that energized you most.</li>
          </ul>
          <p className="text-muted-foreground">
            Concrete action: cancel one drainer this quarter. Add nothing else — the goal is subtraction.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 3 — Goal check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Goal of record: <strong>land remote Solana/Rust job by 2027</strong> (per memory).
          </p>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>Are you on track? Where&apos;s the bottleneck — skill, applications, network, sleep, family load?</li>
            <li>What single change next quarter moves the needle most?</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 4 — System adjustment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Add ≤1 habit. Drop ≤1 habit.</p>
          <p>
            Update <code>docs/decision-log.md</code> with the rationale.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 5 — Re-read</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          Re-read{" "}
          <Link href="/protocols/00-philosophy" className="underline">
            00-philosophy
          </Link>{" "}
          and{" "}
          <Link href="/protocols/06-tldr" className="underline">
            06-tldr
          </Link>
          . Are you still aligned? If not, system change before next-quarter execution.
        </CardContent>
      </Card>
    </div>
  );
}
