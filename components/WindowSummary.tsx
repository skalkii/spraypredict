import type { SprayWindow } from "@/lib/types";
import type { Strings, Lang } from "@/lib/i18n";
import { intlLocale } from "@/lib/i18n";
import { formatHourRange } from "@/lib/format";
import { CheckCircle, AlertTriangle, Clock } from "./Icons";

function formatPlural(template: string, n: number): string {
  // Template form: "singular form|plural form" with {n} placeholder. Falls back to
  // single form if no pipe (languages without an English-style singular/plural split).
  const parts = template.split("|");
  const pick = n === 1 ? parts[0] : parts[parts.length - 1];
  return pick.replace("{n}", String(n));
}

interface Props {
  best: SprayWindow | null;
  total: number;
  t: Strings;
  lang: Lang;
}

function dayLabel(iso: string, t: Strings, lang: Lang): string {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const date = iso.slice(0, 10);
  if (date === today) return t.today;
  if (date === tomorrow) return t.tomorrow;
  return new Intl.DateTimeFormat(intlLocale(lang), {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
}

export function WindowSummary({ best, total, t, lang }: Props) {
  if (!best) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-900">
              {t.noSuitableWindows}
            </div>
            <p className="text-sm text-rose-800 mt-1">{t.noSuitableBody}</p>
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
  const ratingLabel = isGreen ? t.ratingGreen : t.ratingYellow;

  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide opacity-70">
            {t.bestWindow}
          </div>
          <div className="font-semibold text-lg leading-tight">
            {dayLabel(best.startTime, t, lang)}, {formatHourRange(best.startTime, best.endTime)}
          </div>
          <div className="text-sm mt-1 flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {Math.round(best.durationHours)}h
            </span>
            <span>·</span>
            <span>{ratingLabel}</span>
            <span>·</span>
            <span>{formatPlural(t.windowsFound, total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
