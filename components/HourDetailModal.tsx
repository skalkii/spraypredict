"use client";

import { useEffect, useRef } from "react";
import type { HourScored } from "@/lib/types";
import type { Strings, Lang } from "@/lib/i18n";
import { intlLocale } from "@/lib/i18n";
import { RATING_BG_SOFT, hourOfDay } from "@/lib/format";
import {
  X,
  Wind,
  Droplet,
  Thermometer,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
} from "./Icons";

const COMPASS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

function compass(deg: number): string {
  const idx = Math.round(deg / 22.5) % 16;
  return COMPASS[idx];
}

interface Props {
  hour: HourScored;
  onClose: () => void;
  t: Strings;
  lang: Lang;
}

function fmtHour(iso: string, lang: Lang): string {
  const h = hourOfDay(iso);
  return new Intl.DateTimeFormat(intlLocale(lang), {
    hour: "numeric",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(`2026-01-01T${String(h).padStart(2, "0")}:00:00Z`));
}

function ratingLabel(rating: HourScored["rating"], t: Strings): string {
  if (rating === "green") return t.ratingGreen;
  if (rating === "yellow") return t.ratingYellow;
  return t.ratingRed;
}

export function HourDetailModal({ hour, onClose, t, lang }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (!d.open) d.showModal();
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [onClose]);

  function backdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === ref.current) onClose();
  }

  const dateLabel = new Intl.DateTimeFormat(intlLocale(lang), {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(hour.time.slice(0, 10) + "T12:00:00Z"));

  return (
    <dialog
      ref={ref}
      onClick={backdropClick}
      className="rounded-2xl p-0 max-w-md w-[92vw] backdrop:bg-ink-900/55 m-auto bg-white dark:bg-ink-800 dark:text-cream-50"
    >
      <div className={`px-5 py-4 border-b ${RATING_BG_SOFT[hour.rating]}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-70">{dateLabel}</div>
            <div className="text-xl font-bold">{fmtHour(hour.time, lang)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide opacity-70">{t.rating}</div>
            <div className="font-bold flex items-center gap-1.5">
              {hour.rating === "red" ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {ratingLabel(hour.rating, t)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-black/10"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat
            icon={<Thermometer className="w-4 h-4" />}
            label={t.temperature}
            value={`${hour.temp.toFixed(1)}°C`}
          />
          <Stat
            icon={<Droplet className="w-4 h-4" />}
            label={t.humidity}
            value={`${hour.humidity}%`}
          />
          <div className="rounded-lg border border-cream-200 dark:border-ink-700 px-3 py-2.5 bg-cream-50 dark:bg-ink-900">
            <div className="text-xs text-ink-500 dark:text-ink-300 flex items-center gap-1.5">
              <Wind className="w-4 h-4" />
              {t.wind}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="text-base font-medium text-ink-900 dark:text-cream-50">
                {hour.windSpeed.toFixed(1)} km/h
              </div>
              <div
                title={`${compass(hour.windDirection)} (${Math.round(hour.windDirection)}°)`}
                className="flex items-center gap-0.5 text-ink-500 dark:text-ink-300"
              >
                <ArrowUp
                  className="w-4 h-4"
                  style={{ transform: `rotate(${hour.windDirection + 180}deg)` }}
                />
                <span className="text-xs">{compass(hour.windDirection)}</span>
              </div>
            </div>
            <div className="text-xs text-ink-500 dark:text-ink-300 mt-0.5">
              {t.gusts} {hour.windGusts.toFixed(0)} km/h
            </div>
          </div>
          <Stat
            icon={<Droplet className="w-4 h-4" />}
            label={t.rainRisk}
            value={`${hour.precipitationProb}%`}
            sub={`${hour.precipitationMm.toFixed(1)}mm ${t.thisHour}`}
          />
          <Stat
            icon={<Clock className="w-4 h-4" />}
            label={t.deltaT}
            value={`${hour.deltaT.toFixed(1)}°C`}
            sub={t.dropletDrying}
          />
          <Stat
            icon={<Droplet className="w-4 h-4" />}
            label={t.rainNext}
            value={`${hour.rainNextWindowMm.toFixed(1)}mm`}
            sub={`${hour.rainNextWindowProb}% ${t.peak}`}
          />
        </div>

        {hour.positives.length > 0 && (
          <div>
            <div className="text-sm font-medium text-emerald-700 mb-1.5">
              {t.whatsGood}
            </div>
            <ul className="space-y-1">
              {hour.positives.map((p, i) => (
                <li key={i} className="text-sm text-ink-700 dark:text-cream-50 flex gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hour.flags.length > 0 && (
          <div>
            <div className="text-sm font-medium text-rose-700 mb-1.5">
              {t.whatsNot}
            </div>
            <ul className="space-y-1">
              {hour.flags.map((f, i) => (
                <li key={i} className="text-sm text-ink-700 dark:text-cream-50 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-ink-900 dark:bg-cream-50 text-cream-50 dark:text-ink-900 px-4 py-2.5 font-medium hover:opacity-90"
        >
          {t.close}
        </button>
      </div>
    </dialog>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-cream-200 dark:border-ink-700 px-3 py-2.5 bg-cream-50 dark:bg-ink-900">
      <div className="text-xs text-ink-500 dark:text-ink-300 flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className="text-base font-medium text-ink-900 dark:text-cream-50 dark:text-cream-50 mt-0.5">{value}</div>
      {sub && <div className="text-xs text-ink-500 dark:text-ink-300 mt-0.5">{sub}</div>}
    </div>
  );
}
