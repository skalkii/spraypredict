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

const AXIS_MARKERS = [
  { h: 0, label: "12a" },
  { h: 6, label: "6a" },
  { h: 12, label: "12p" },
  { h: 18, label: "6p" },
];

export function ForecastCalendar({ hours }: Props) {
  const [selected, setSelected] = useState<HourScored | null>(null);
  const byDay = groupByDay(hours);
  const days = Object.keys(byDay).sort();

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-slate-50/85 backdrop-blur supports-[backdrop-filter]:bg-slate-50/75 border-b border-slate-200">
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
      </div>

      <div className="space-y-3">
        {days.map((day, i) => (
          <DayRow
            key={day}
            label={formatDayLabel(day + "T12:00")}
            sublabel={new Date(day + "T12:00:00Z").toLocaleDateString("en", {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })}
            hours={byDay[day]}
            onPick={setSelected}
            showAxis={i === 0}
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
  sublabel,
  hours,
  onPick,
  showAxis,
}: {
  label: string;
  sublabel: string;
  hours: HourScored[];
  onPick: (h: HourScored) => void;
  showAxis: boolean;
}) {
  // Build a 24-cell row keyed by hour-of-day; fill missing hours with placeholder.
  const byHour = new Map<number, HourScored>();
  for (const h of hours) byHour.set(hourOfDay(h.time), h);
  const cells = Array.from({ length: 24 }, (_, i) => byHour.get(i) ?? null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <div className="font-semibold text-slate-800">{label}</div>
          <div className="text-xs text-slate-500">{sublabel}</div>
        </div>
        <div className="text-xs text-slate-500">{hours.length}h</div>
      </div>
      <div className="grid grid-cols-24 gap-0.5 p-2">
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
      {showAxis && (
        <div className="relative px-2 pb-2 text-[10px] text-slate-400 select-none h-4">
          {AXIS_MARKERS.map(({ h, label }) => (
            <span
              key={h}
              className="absolute"
              style={{ left: `calc(${(h / 24) * 100}% + 0.5rem)` }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
