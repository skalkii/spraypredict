import type { SprayWindow } from "@/lib/types";
import type { Strings, Lang } from "@/lib/i18n";
import { intlLocale } from "@/lib/i18n";
import { formatHourRange } from "@/lib/format";
import { CheckCircle, AlertTriangle, Clock } from "./Icons";

function formatPlural(template: string, n: number): string {
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
      <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-rose-900 dark:text-rose-200 text-lg">
              {t.noSuitableWindows}
            </div>
            <p className="text-sm text-rose-800 dark:text-rose-300 mt-1.5 leading-relaxed">
              {t.noSuitableBody}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isGreen = best.rating === "green";
  const Icon = isGreen ? CheckCircle : AlertTriangle;
  const color = isGreen
    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
    : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200";
  const ratingLabel = isGreen ? t.ratingGreen : t.ratingYellow;

  return (
    <div className={`rounded-2xl border p-6 ${color}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-[0.16em] opacity-70">
            {t.bestWindow}
          </div>
          <div className="font-serif text-2xl mt-0.5 leading-tight tracking-tight">
            {dayLabel(best.startTime, t, lang)}, {formatHourRange(best.startTime, best.endTime)}
          </div>
          <div className="text-sm mt-2 flex items-center gap-3 flex-wrap opacity-80">
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
