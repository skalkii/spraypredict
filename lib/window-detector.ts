import type { HourScored, SprayWindow, RuleResult } from "./types";

const MIN_HOURS = 2;

function diffHours(start: string, end: string): number {
  return (new Date(end).getTime() - new Date(start).getTime()) / 3_600_000 + 1;
}

function collectRuns(hours: HourScored[], target: RuleResult): SprayWindow[] {
  const runs: SprayWindow[] = [];
  let start = -1;
  for (let i = 0; i <= hours.length; i++) {
    const matches = i < hours.length && hours[i].rating === target;
    if (matches && start === -1) start = i;
    if (!matches && start !== -1) {
      const slice = hours.slice(start, i);
      const duration = diffHours(slice[0].time, slice[slice.length - 1].time);
      if (duration >= MIN_HOURS) {
        const avg = slice.reduce((s, h) => s + h.score, 0) / slice.length;
        runs.push({
          startTime: slice[0].time,
          endTime: slice[slice.length - 1].time,
          durationHours: duration,
          rating: target,
          avgScore: Math.round(avg * 10) / 10,
        });
      }
      start = -1;
    }
  }
  return runs;
}

export function detectWindows(hours: HourScored[]): SprayWindow[] {
  const green = collectRuns(hours, "green");
  if (green.length > 0) return green;
  return collectRuns(hours, "yellow");
}

export function pickBest(windows: SprayWindow[]): SprayWindow | null {
  if (windows.length === 0) return null;
  return [...windows].sort((a, b) => {
    if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
    return b.durationHours - a.durationHours;
  })[0];
}
