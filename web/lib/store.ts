"use client";

import { create } from "zustand";
import type { RitualMode } from "./protocols";
import { detectMode } from "./protocols";

export interface Settings {
  bedtimeHour: number;
  caffeineCutoffHour: number;
  weeklyExerciseTarget: number;
}

const DEFAULT_SETTINGS: Settings = {
  bedtimeHour: 23,
  caffeineCutoffHour: 14,
  weeklyExerciseTarget: 3,
};

interface AppState {
  hydrated: boolean;
  modeOverride: RitualMode | null;
  settings: Settings;
  hydrate: (settings?: Partial<Settings>) => void;
  setMode: (mode: RitualMode | null) => void;
  setSettings: (patch: Partial<Settings>) => void;
}

export const useApp = create<AppState>((set) => ({
  hydrated: false,
  modeOverride: null,
  settings: DEFAULT_SETTINGS,
  hydrate: (s) =>
    set((state) => ({
      hydrated: true,
      settings: { ...state.settings, ...(s ?? {}) },
    })),
  setMode: (mode) => set({ modeOverride: mode }),
  setSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
}));

export function activeMode(override: RitualMode | null): RitualMode {
  return override ?? detectMode();
}
