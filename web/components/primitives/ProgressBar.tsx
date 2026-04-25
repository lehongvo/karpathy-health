import { cn } from "@/lib/utils";

interface Props {
  value: number;
  max?: number;
  className?: string;
  tone?: "default" | "good" | "alert";
}

export function ProgressBar({ value, max = 100, className, tone = "default" }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fill =
    tone === "good"
      ? "bg-good"
      : tone === "alert"
        ? "bg-alert"
        : "bg-text";
  return (
    <div className={cn("h-1 w-full bg-border rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full transition-[width] duration-500", fill)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
