import type { HourScored, RuleResult } from "./types";

export const RATING_BG: Record<RuleResult, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-400",
  red: "bg-rose-500",
};

export const RATING_BG_SOFT: Record<RuleResult, string> = {
  green: "bg-emerald-100 text-emerald-900 border-emerald-300",
  yellow: "bg-amber-100 text-amber-900 border-amber-300",
  red: "bg-rose-100 text-rose-900 border-rose-300",
};

export const RATING_LABEL: Record<RuleResult, string> = {
  green: "Good",
  yellow: "Marginal",
  red: "Avoid",
};

export function hourOfDay(iso: string): number {
  const m = iso.match(/T(\d{2}):/);
  return m ? parseInt(m[1], 10) : 0;
}

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function formatHourRange(start: string, end: string): string {
  const s = hourOfDay(start);
  const e = hourOfDay(end) + 1;
  const fmt = (h: number) => {
    if (h === 0) return "12 AM";
    if (h === 12) return "12 PM";
    if (h === 24) return "12 AM";
    if (h < 12) return `${h} AM`;
    return `${h - 12} PM`;
  };
  return `${fmt(s)}–${fmt(e)}`;
}

export function formatDayLabel(iso: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const date = iso.slice(0, 10);
  if (date === today) return "Today";
  if (date === tomorrow) return "Tomorrow";
  const d = new Date(date + "T12:00:00Z");
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function groupByDay(hours: HourScored[]): Record<string, HourScored[]> {
  const out: Record<string, HourScored[]> = {};
  for (const h of hours) {
    const k = dayKey(h.time);
    (out[k] ??= []).push(h);
  }
  return out;
}
