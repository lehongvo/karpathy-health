/**
 * Protocol rules — typed constants pulled from the citation-backed framework
 * documented in /docs. Edit in one place, consumed everywhere.
 */

/** Min nightly sleep target. Source: Van Dongen 2003 (PubMed 12683469). */
export const SLEEP_MIN_HOURS = 7;
export const SLEEP_MIN_NIGHTS_PER_WEEK = 5;

/** Caffeine cutoff for normal metabolizers. Source: Drake 2013 (PMC3805807). */
export const CAFFEINE_CUTOFF_HOURS_BEFORE_BED = 8;

/** Aerobic Zone-2 cadence. Source: Erickson 2011 PNAS. */
export const EXERCISE_SESSIONS_PER_WEEK = 3;
export const EXERCISE_MIN_MINUTES = 40;

/** Hydration target glasses/day. */
export const HYDRATION_TARGET_GLASSES = 8;

/** Maximum simultaneously-active projects. */
export const MAX_ACTIVE_PROJECTS = 2;

/** Length of a single deep work block. BRAC ~90 min. */
export const DEEP_WORK_BLOCK_MINUTES = 90;

export interface BurnoutRule {
  id: string;
  label: string;
  description: string;
}

export const BURNOUT_RULES: readonly BurnoutRule[] = [
  {
    id: "sleep-debt-3d",
    label: "Sleep debt accumulating",
    description:
      "Slept under 6h on the last 3 nights. Per Van Dongen, you're degraded but won't notice. Cancel optional commits tonight; in bed by 21:30.",
  },
  {
    id: "no-exercise-5d",
    label: "Movement lapse",
    description:
      "Zero exercise sessions in the last 5 days. Walk 20 min today — that's enough to restart.",
  },
  {
    id: "deep-work-collapse",
    label: "Deep work collapse",
    description:
      "Last 7-day deep work hours <50% of the prior 28-day baseline. Schedule one 90-min block tomorrow morning.",
  },
  {
    id: "active-overload",
    label: "Active project overload",
    description:
      "More than 2 projects in Active. Force one to Maintenance or Paused — context-switch tax compounds.",
  },
] as const;

export interface AuditItem {
  id: string;
  text: string;
}

export const NOTIFICATION_AUDIT: readonly AuditItem[] = [
  { id: "phone-focus", text: "Phone Focus mode 06:00–12:00 daily" },
  { id: "slack-mute", text: "Slack: notifications off except DMs + @mentions" },
  { id: "email-quiet", text: "Email badge count off, no notification sound" },
  { id: "browser-clean", text: "No Twitter/X/LinkedIn tabs during deep work" },
  { id: "calendar-quiet", text: "Calendar notifications only at T-15 min" },
  { id: "ide-quiet", text: "IDE extensions with live notifications muted" },
  { id: "macos-dnd", text: "macOS Do Not Disturb scheduled 06:00–12:00" },
] as const;

export interface CoreHabit {
  id: string;
  text: string;
  doc: string;
}

export const CORE_HABITS: readonly CoreHabit[] = [
  { id: "sleep", text: "Sleep ≥7h, ≥5 nights/week", doc: "02-energy-protocol" },
  { id: "deep-work", text: "1× 90-min deep work block before noon", doc: "03-attention-protocol" },
  { id: "cardio", text: "3×/week × 40-min Zone-2 cardio", doc: "02-energy-protocol" },
  { id: "mit", text: "MIT before email/Slack", doc: "06-tldr" },
  { id: "weekly", text: "Sunday 30-min weekly review", doc: "cadence" },
] as const;

export type RitualMode = "morning" | "day" | "evening";

export function detectMode(date: Date = new Date()): RitualMode {
  const h = date.getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 18) return "day";
  return "evening";
}
