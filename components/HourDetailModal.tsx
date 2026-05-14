"use client";

import { useEffect, useRef } from "react";
import type { HourScored } from "@/lib/types";
import { RATING_BG_SOFT, RATING_LABEL, hourOfDay } from "@/lib/format";
import {
  X,
  Wind,
  Droplet,
  Thermometer,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "./Icons";

interface Props {
  hour: HourScored;
  onClose: () => void;
}

function fmtHour(iso: string): string {
  const h = hourOfDay(iso);
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
}

export function HourDetailModal({ hour, onClose }: Props) {
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

  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(hour.time.slice(0, 10) + "T12:00:00Z"));

  return (
    <dialog
      ref={ref}
      onClick={backdropClick}
      className="rounded-2xl p-0 max-w-md w-[92vw] backdrop:bg-slate-900/60 m-auto"
    >
      <div className={`px-5 py-4 border-b ${RATING_BG_SOFT[hour.rating]}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-70">
              {dateLabel}
            </div>
            <div className="text-xl font-bold">{fmtHour(hour.time)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide opacity-70">
              Rating
            </div>
            <div className="font-bold flex items-center gap-1.5">
              {hour.rating === "red" ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {RATING_LABEL[hour.rating]}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-black/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat
            icon={<Thermometer className="w-4 h-4" />}
            label="Temperature"
            value={`${hour.temp.toFixed(1)}°C`}
          />
          <Stat
            icon={<Droplet className="w-4 h-4" />}
            label="Humidity"
            value={`${hour.humidity}%`}
          />
          <Stat
            icon={<Wind className="w-4 h-4" />}
            label="Wind"
            value={`${hour.windSpeed.toFixed(1)} km/h`}
            sub={`Gusts ${hour.windGusts.toFixed(0)} km/h`}
          />
          <Stat
            icon={<Droplet className="w-4 h-4" />}
            label="Rain risk"
            value={`${hour.precipitationProb}%`}
            sub={`${hour.precipitationMm.toFixed(1)}mm this hr`}
          />
          <Stat
            icon={<Clock className="w-4 h-4" />}
            label="Delta-T"
            value={`${hour.deltaT.toFixed(1)}°C`}
            sub="Droplet drying index"
          />
          <Stat
            icon={<Droplet className="w-4 h-4" />}
            label="Look-ahead rain"
            value={`${hour.rainNextWindowMm.toFixed(1)}mm`}
            sub={`${hour.rainNextWindowProb}% peak`}
          />
        </div>

        {hour.positives.length > 0 && (
          <div>
            <div className="text-sm font-medium text-emerald-700 mb-1.5">
              What&apos;s good
            </div>
            <ul className="space-y-1">
              {hour.positives.map((p, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
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
              What&apos;s not
            </div>
            <ul className="space-y-1">
              {hour.flags.map((f, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
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
          className="w-full rounded-lg bg-slate-900 text-white px-4 py-2.5 font-medium hover:bg-slate-800"
        >
          Close
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
    <div className="rounded-lg border border-slate-200 px-3 py-2.5 bg-slate-50">
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className="text-base font-semibold text-slate-900 mt-0.5">
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}
