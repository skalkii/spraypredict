import Link from "next/link";
import { fetchForecast } from "@/lib/openmeteo";
import { SPRAY_PROFILES, scoreForecast } from "@/lib/spray-rules";
import { detectWindows, pickBest } from "@/lib/window-detector";
import { ForecastCalendar } from "@/components/ForecastCalendar";
import { WindowSummary } from "@/components/WindowSummary";
import { Explainer } from "@/components/Explainer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "@/components/Icons";
import { getLang, getTheme } from "@/lib/i18n-server";
import { getT, intlLocale, type Strings } from "@/lib/i18n";

export const revalidate = 600;

interface SearchParams {
  lat?: string;
  lng?: string;
  sprayType?: string;
  label?: string;
}

export default async function ForecastPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const lang = getLang();
  const theme = getTheme();
  const t = getT(lang);
  const lat = parseFloat(searchParams.lat ?? "");
  const lng = parseFloat(searchParams.lng ?? "");
  const sprayId = searchParams.sprayType ?? "fungicide_contact";
  const label = searchParams.label ?? `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
  const profile = SPRAY_PROFILES[sprayId];

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !profile) {
    return (
      <>
        <Header lang={lang} theme={theme} t={t} />
        <main className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-5">
            <h1 className="text-lg font-medium text-rose-900 dark:text-rose-200">
              {t.invalidRequest}
            </h1>
            <p className="text-sm text-rose-800 dark:text-rose-300 mt-1">
              {t.invalidLocationSpray}
            </p>
            <Link href="/" className="inline-block mt-3 text-sm text-rose-900 dark:text-rose-200 underline">
              ← {t.startOver}
            </Link>
          </div>
        </main>
        <Footer t={t} />
      </>
    );
  }

  const profileLabel =
    (t[`profile_${profile.id}` as keyof Strings] as string) ?? profile.label;

  let body;
  try {
    const raw = await fetchForecast(lat, lng);
    const hours = scoreForecast(raw.hourly, profile, raw.daily);
    const windows = detectWindows(hours);
    const best = pickBest(windows);

    body = (
      <>
        <WindowSummary best={best} total={windows.length} t={t} lang={lang} />

        {windows.length > 0 && (
          <section className="rounded-2xl bg-white dark:bg-ink-800 border border-cream-200 dark:border-ink-700 p-5">
            <h2 className="font-medium text-ink-900 dark:text-cream-50 mb-3 text-lg">
              {t.allWindows} ({windows.length})
            </h2>
            <ul className="divide-y divide-cream-100 dark:divide-ink-700">
              {windows.map((w, i) => (
                <li key={i} className="py-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        w.rating === "green" ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                    />
                    <span className="font-medium text-ink-900 dark:text-cream-50 truncate">
                      {new Date(w.startTime.slice(0, 10) + "T12:00:00Z")
                        .toLocaleDateString(intlLocale(lang), {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        })}
                    </span>
                    <span className="text-ink-500 dark:text-ink-300 shrink-0">
                      {w.startTime.slice(11, 16)}–{w.endTime.slice(11, 16)}
                    </span>
                  </div>
                  <div className="text-sm text-ink-500 dark:text-ink-300 shrink-0">
                    {Math.round(w.durationHours)}h · {w.avgScore}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="font-medium text-ink-900 dark:text-cream-50 mb-3 text-lg">
            {t.hourlyForecast}
          </h2>
          <ForecastCalendar hours={hours} t={t} lang={lang} />
        </section>

        <Explainer t={t} />
      </>
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    body = (
      <div className="rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-5">
        <h2 className="text-lg font-medium text-rose-900 dark:text-rose-200">
          {t.cantFetchWeather}
        </h2>
        <p className="text-sm text-rose-800 dark:text-rose-300 mt-1">{msg}</p>
        <Link href="/" className="inline-block mt-3 text-sm text-rose-900 dark:text-rose-200 underline">
          ← {t.tryAgain}
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header lang={lang} theme={theme} t={t} />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-cream-50 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Link>
          <div className="text-xs uppercase tracking-[0.18em] text-clay-600 dark:text-clay-400 font-medium">
            {profileLabel}
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal text-ink-900 dark:text-cream-50 mt-1 leading-tight tracking-tight truncate">
            {label}
          </h1>
        </div>

        <div className="space-y-5">{body}</div>
      </main>
      <Footer t={t} />
    </>
  );
}
