/**
 * Cross-repo integration with karpathy-rust.
 * Spec §10.6 Option A: JSON paste/import (no network coupling).
 */

export interface RustProgress {
  hoursThisWeek: number;
  hoursThisMonth: number;
  hoursTotal: number;
  currentMonthFocus: string;
  lastUpdated: string;
  source: "manual-paste" | "remote";
}

const STORAGE_KEY = "rust-progress-paste";

export function readRustProgress(): RustProgress | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as RustProgress;
    return parsed;
  } catch {
    return null;
  }
}

export function writeRustProgress(progress: RustProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function clearRustProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export const KARPATHY_RUST_REPO = "https://github.com/lehongvo/karpathy-rust";
