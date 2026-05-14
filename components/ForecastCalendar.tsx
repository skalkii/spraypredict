"use client";

import { useState } from "react";
import type { HourScored } from "@/lib/types";
import type { Strings, Lang } from "@/lib/i18n";
import { intlLocale } from "@/lib/i18n";
import { RATING_BG, groupByDay, hourOfDay } from "@/lib/format";
import { HourDetailModal } from "./HourDetailModal";

interface Props {
  hours: HourScored[];
  t: Strings;
  lang: Lang;
}

const AXIS_MARKERS = [
  { h: 0, label: "12a" },
  { h: 6, label: "6a" },
  { h: 12, label: "12p" },
  { h: 18, label: "6p" },
];

function dayLabel(date: string, t: Strings, lang: Lang): string {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  if (date === today) return t.today;
  if (date === tomorrow) return t.tomorrow;
  return new Intl.DateTimeFormat(intlLocale(lang), {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
}

function shortDate(date: string, lang: Lang): string {
  return new Intl.DateTimeFormat(intlLocale(lang), {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
}

export function ForecastCalendar({ hours, t, lang }: Props) {
  const [selected, setSelected] = useState<HourScored | null>(null);
  const byDay = groupByDay(hours);
  const days = Object.keys(byDay).sort();

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-cream-50/85 dark:bg-ink-900/85 backdrop-blur supports-[backdrop-filter]:bg-cream-50/75 dark:supports-[backdrop-filter]:bg-ink-900/75 border-b border-cream-200 dark:border-ink-700">
        <div className="flex items-center gap-3 text-xs text-ink-500 dark:text-ink-300 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" /> {t.legendGood}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400" /> {t.legendMarginal}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500" /> {t.legendAvoid}
          </span>
          <span className="inline-flex items-center gap-1.5 ml-2 opacity-60">
            <span className="w-3 h-3 rounded-sm bg-ink-300" /> {t.legendNight}
          </span>
          <span className="ml-auto text-ink-300 hidden sm:inline">
            {t.tapHourHint}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {days.map((day, i) => (
          <DayRow
            key={day}
            label={dayLabel(day, t, lang)}
            sublabel={shortDate(day, lang)}
            hours={byDay[day]}
            onPick={setSelected}
            showAxis={i === 0}
          />
        ))}
      </div>

      {selected && (
        <HourDetailModal hour={selected} onClose={() => setSelected(null)} t={t} lang={lang} />
      )}
    </div>
  );
}

function DaySummary({ hours }: { hours: HourScored[] }) {
  const day = hours.filter((h) => h.isDaylight);
  const g = day.filter((h) => h.rating === "green").length;
  const y = day.filter((h) => h.rating === "yellow").length;
  const r = day.filter((h) => h.rating === "red").length;
  return (
    <div className="flex items-center gap-1 text-[11px] font-medium shrink-0">
      <Chip count={g} color="bg-emerald-500" />
      <Chip count={y} color="bg-amber-400" />
      <Chip count={r} color="bg-rose-500" />
    </div>
  );
}

function Chip({ count, color }: { count: number; color: string }) {
  const muted = count === 0;
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${muted ? "text-ink-300 dark:text-ink-500" : "text-ink-700 dark:text-cream-50"}`}
    >
      <span className={`w-2 h-2 rounded-sm ${color} ${muted ? "opacity-40" : ""}`} />
      {count}
    </span>
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
  const byHour = new Map<number, HourScored>();
  for (const h of hours) byHour.set(hourOfDay(h.time), h);
  const cells = Array.from({ length: 24 }, (_, i) => byHour.get(i) ?? null);

  return (
    <div className="rounded-xl border border-cream-200 dark:border-ink-700 bg-white dark:bg-ink-800 overflow-hidden">
      <div className="px-3 py-2 border-b border-cream-100 dark:border-ink-700 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2 min-w-0">
          <div className="font-medium text-ink-900 dark:text-cream-50 truncate">{label}</div>
          <div className="text-xs text-ink-500 dark:text-ink-300 shrink-0">{sublabel}</div>
        </div>
        <DaySummary hours={hours} />
      </div>
      <div className="grid grid-cols-24 gap-0.5 p-2">
        {cells.map((h, i) => {
          if (!h) {
            return (
              <div
                key={i}
                className="aspect-square bg-cream-100 dark:bg-ink-700 rounded-[3px]"
                aria-hidden
              />
            );
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(h)}
              className={`aspect-square rounded-[3px] ${RATING_BG[h.rating]} ${h.isDaylight ? "" : "opacity-40"} hover:opacity-100 hover:ring-2 hover:ring-offset-1 hover:ring-ink-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ink-700 transition`}
              title={`${i}:00 — ${h.rating.toUpperCase()}${h.isDaylight ? "" : " (night)"} · ${h.temp.toFixed(0)}°C · wind ${h.windSpeed.toFixed(0)} km/h`}
              aria-label={`${i}:00 ${h.rating}${h.isDaylight ? "" : " night"}`}
            />
          );
        })}
      </div>
      {showAxis && (
        <div className="relative px-2 pb-2 text-[10px] text-ink-300 dark:text-ink-500 select-none h-4">
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
