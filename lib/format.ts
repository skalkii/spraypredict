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

export function hourOfDay(iso: string): number {
  const m = iso.match(/T(\d{2}):/);
  return m ? parseInt(m[1], 10) : 0;
}

export function formatHourRange(start: string, end: string): string {
  // Inclusive-hour range, e.g. 06:00 start + 08:00 end → "6 AM–9 AM".
  const s = hourOfDay(start);
  const e = hourOfDay(end) + 1;
  const fmt = (h: number) => {
    if (h === 0 || h === 24) return "12 AM";
    if (h === 12) return "12 PM";
    if (h < 12) return `${h} AM`;
    return `${h - 12} PM`;
  };
  return `${fmt(s)}–${fmt(e)}`;
}

export function groupByDay(hours: HourScored[]): Record<string, HourScored[]> {
  const out: Record<string, HourScored[]> = {};
  for (const h of hours) {
    const k = h.time.slice(0, 10);
    (out[k] ??= []).push(h);
  }
  return out;
}
