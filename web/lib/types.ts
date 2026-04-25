export type ISODate = string;

export interface SleepLog {
  id?: number;
  date: ISODate;
  bedtime: string;
  wakeTime: string;
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export type ExerciseType = "strength" | "cardio" | "walk" | "yoga" | "other";

export interface ExerciseLog {
  id?: number;
  date: ISODate;
  type: ExerciseType;
  durationMin: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface NutritionLog {
  id?: number;
  date: ISODate;
  lastCaffeineHour: number | null;
  hydrationGlasses: number;
  lateNightMeal: boolean;
}

export interface DeepWorkBlock {
  id?: number;
  date: ISODate;
  startedAt: number;
  endedAt: number;
  durationMin: number;
  projectId: string;
  distractionCount: number;
  focusQuality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export type ProjectStatus = "active" | "maintenance" | "paused" | "done";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

export type TaskPriority = "mit" | "p1" | "p2" | "p3";

export interface Task {
  id?: number;
  date: ISODate;
  text: string;
  priority: TaskPriority;
  done: boolean;
  projectId?: string;
  createdAt: number;
}

export interface Habit {
  id: string;
  name: string;
  emoji?: string;
  target: number;
  unit: "times" | "min" | "hours";
  cadence: "daily" | "weekly";
  createdAt: number;
}

export interface HabitLog {
  id?: number;
  habitId: string;
  date: ISODate;
  value: number;
}

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface EnergyLog {
  id?: number;
  date: ISODate;
  hour: number;
  level: EnergyLevel;
}

export interface DailyReview {
  id?: number;
  date: ISODate;
  wins: string[];
  lesson: string;
  tomorrowMIT: string;
  energyRetro: EnergyLevel;
}

export interface SayingNoLog {
  id?: number;
  date: ISODate;
  what: string;
  why: string;
}

export interface BurnoutAlertEvent {
  date: ISODate;
  reason: string;
  ruleId: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  effectSize: number;
  sampleSize: number;
  direction: "positive" | "negative" | "neutral";
}

export interface FocusScoreSnapshot {
  date: ISODate;
  deepWorkHours: number;
  totalWorkHours: number;
  avgFocusQuality: number;
  score: number;
}
