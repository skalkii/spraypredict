"use client";

import { useState } from "react";
import type { HourScored } from "@/lib/types";
import {
  RATING_BG,
  formatDayLabel,
  groupByDay,
  hourOfDay,
} from "@/lib/format";
import { HourDetailModal } from "./HourDetailModal";

interface Props {
  hours: HourScored[];
}

export function ForecastCalendar({ hours }: Props) {
  const [selected, setSelected] = useState<HourScored | null>(null);
  const byDay = groupByDay(hours);
  const days = Object.keys(byDay).sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500" /> Good
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-400" /> Marginal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-500" /> Avoid
        </span>
        <span className="ml-auto text-slate-400 hidden sm:inline">
          Tap any hour for details
        </span>
      </div>

      <div className="space-y-3">
        {days.map((day) => (
          <DayRow
            key={day}
            label={formatDayLabel(day + "T12:00")}
            hours={byDay[day]}
            onPick={setSelected}
          />
        ))}
      </div>

      {selected && (
        <HourDetailModal hour={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function DayRow({
  label,
  hours,
  onPick,
}: {
  label: string;
  hours: HourScored[];
  onPick: (h: HourScored) => void;
}) {
  // Build a 24-cell row keyed by hour-of-day; fill missing hours with placeholder.
  const byHour = new Map<number, HourScored>();
  for (const h of hours) byHour.set(hourOfDay(h.time), h);
  const cells = Array.from({ length: 24 }, (_, i) => byHour.get(i) ?? null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
        <div className="font-semibold text-slate-800">{label}</div>
        <div className="text-xs text-slate-500">{hours.length}h forecast</div>
      </div>
      <div className="grid grid-cols-12 sm:grid-cols-24 gap-0.5 p-2">
        {cells.map((h, i) => {
          if (!h) {
            return (
              <div
                key={i}
                className="aspect-square bg-slate-100 rounded-[3px]"
                aria-hidden
              />
            );
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(h)}
              className={`aspect-square rounded-[3px] ${RATING_BG[h.rating]} hover:ring-2 hover:ring-offset-1 hover:ring-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-600 transition`}
              title={`${i}:00 — ${h.rating.toUpperCase()} · ${h.temp.toFixed(0)}°C · wind ${h.windSpeed.toFixed(0)} km/h`}
              aria-label={`${i}:00 ${h.rating}`}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-12 sm:grid-cols-24 gap-0.5 px-2 pb-2 text-[9px] sm:text-[10px] text-slate-400 text-center">
        {cells.map((_, i) => (
          <div key={i}>{i % 2 === 0 ? i : ""}</div>
        ))}
      </div>
    </div>
  );
}
