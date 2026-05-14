import type { SprayWindow } from "@/lib/types";
import { formatDayLabel, formatHourRange, RATING_LABEL } from "@/lib/format";
import { CheckCircle, AlertTriangle, Clock } from "./Icons";

interface Props {
  best: SprayWindow | null;
  total: number;
  sprayLabel: string;
}

export function WindowSummary({ best, total, sprayLabel }: Props) {
  if (!best) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-900">
              No suitable windows in next 5 days
            </div>
            <p className="text-sm text-rose-800 mt-1">
              Weather conditions are unfavorable for {sprayLabel.toLowerCase()}.
              Check back tomorrow or pick a different product.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isGreen = best.rating === "green";
  const Icon = isGreen ? CheckCircle : AlertTriangle;
  const color = isGreen
    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
    : "border-amber-300 bg-amber-50 text-amber-900";

  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide opacity-70">
            Best window
          </div>
          <div className="font-semibold text-lg leading-tight">
            {formatDayLabel(best.startTime)}, {formatHourRange(best.startTime, best.endTime)}
          </div>
          <div className="text-sm mt-1 flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {Math.round(best.durationHours)}h
            </span>
            <span>·</span>
            <span>{RATING_LABEL[best.rating]}</span>
            <span>·</span>
            <span>{total} window{total === 1 ? "" : "s"} found</span>
          </div>
        </div>
      </div>
    </div>
  );
}
