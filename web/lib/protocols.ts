/**
 * Protocol rules — typed constants pulled from the citation-backed framework
 * documented in /docs. Edit in one place to change everywhere.
 */

/** Minimum nightly sleep target. Source: Van Dongen 2003 (PubMed 12683469) */
export const SLEEP_MIN_HOURS = 7;

/** Per-week minimum nights at SLEEP_MIN_HOURS. */
export const SLEEP_MIN_NIGHTS_PER_WEEK = 5;

/**
 * Hard caffeine cutoff before intended bedtime. Source: Drake 2013 (PMC3805807) —
 * 400mg taken 6h pre-bed reduced total sleep by >1h. We use 8h to be safe for
 * normal metabolizers and acknowledge slow metabolizers may need 12h.
 */
export const CAFFEINE_CUTOFF_HOURS_BEFORE_BED = 8;

/**
 * Average caffeine half-life in healthy adults. Source: NCBI Bookshelf NBK223808.
 * Population mean ~5h, individual range 1.5-9.5h.
 */
export const CAFFEINE_HALF_LIFE_HOURS = 5;

/** Aerobic Zone-2 sessions per week. Source: Erickson 2011 PNAS. */
export const EXERCISE_SESSIONS_PER_WEEK = 3;

/** Per-session minutes for Zone-2 cardio. */
export const EXERCISE_MIN_MINUTES = 40;

/** Daily floor on steps even on rest days. */
export const STEP_FLOOR = 7000;

/** Hydration target. */
export const HYDRATION_TARGET_GLASSES = 8;

/** Maximum simultaneously-active projects. Anything beyond breaks deep work. */
export const MAX_ACTIVE_PROJECTS = 2;

/** Target deep work blocks per day. */
export const DEEP_WORK_BLOCKS_PER_DAY = 1;

/** Length of a single deep work block. Source: BRAC ~90min cycle. */
export const DEEP_WORK_BLOCK_MINUTES = 90;

/** Slack/email batched windows per day. */
export const COMMUNICATION_BATCHES_PER_DAY = 2;

/**
 * Burnout detection rules. Triggered by BurnoutAlert against last N days.
 */
export interface BurnoutRule {
  id: string;
  label: string;
  description: string;
  windowDays: number;
}

export const BURNOUT_RULES: readonly BurnoutRule[] = [
  {
    id: "sleep-debt-3d",
    label: "Sleep debt accumulating",
    description:
      "Slept <6h on 3 of the last 3 nights. Per Van Dongen, you're now performing like a sleep-deprived person without noticing. Cancel optional commits tonight.",
    windowDays: 3,
  },
  {
    id: "no-exercise-5d",
    label: "Movement lapse",
    description:
      "0 exercise sessions in the last 5 days. BDNF expression drops; mood + sleep follow. Walk 20 min today — that's enough to restart.",
    windowDays: 5,
  },
  {
    id: "deep-work-collapse",
    label: "Deep work collapse",
    description:
      "Last 7-day deep work hours <50% of the prior 28-day baseline. Audit where the hours went; schedule one 90-min block tomorrow morning.",
    windowDays: 7,
  },
  {
    id: "active-overload",
    label: "Active project overload",
    description:
      "More than 2 projects in the Active column. Force one to Maintenance or Paused — context switching tax compounds against you.",
    windowDays: 1,
  },
] as const;

/** Notification hygiene checklist (one-time setup). */
export interface AuditItem {
  id: string;
  text: string;
}

export const NOTIFICATION_AUDIT: readonly AuditItem[] = [
  { id: "phone-focus", text: "Phone Focus mode 06:00-12:00 daily" },
  { id: "slack-mute", text: "Slack: notifications off except DMs + @mentions" },
  { id: "email-quiet", text: "Email badge count off, no notification sound" },
  { id: "browser-clean", text: "No Twitter/X/LinkedIn tabs open during deep work" },
  { id: "calendar-quiet", text: "Calendar notifications only at T-15 min" },
  { id: "ide-quiet", text: "IDE extensions with live notifications muted" },
  { id: "macos-dnd", text: "macOS Do Not Disturb scheduled 06:00-12:00" },
] as const;

/** The core 5 habits from /docs/06-tldr.md */
export interface CoreHabit {
  id: string;
  emoji: string;
  text: string;
  doc: string;
}

export const CORE_HABITS: readonly CoreHabit[] = [
  { id: "sleep", emoji: "💤", text: "Sleep ≥7h, ≥5 nights/week", doc: "02-energy-protocol.md" },
  {
    id: "deep-work",
    emoji: "🧠",
    text: "1× 90-min deep work block before noon",
    doc: "03-attention-protocol.md",
  },
  { id: "cardio", emoji: "🏃", text: "3×/week × 40-min Zone-2 cardio", doc: "02-energy-protocol.md" },
  { id: "mit", emoji: "🎯", text: "MIT before email/Slack", doc: "06-tldr.md" },
  { id: "weekly", emoji: "📓", text: "Sunday 30-min weekly review", doc: "cadence.md" },
] as const;
