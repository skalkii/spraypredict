import Link from "next/link";
import { fetchForecast } from "@/lib/openmeteo";
import { SPRAY_PROFILES, scoreForecast } from "@/lib/spray-rules";
import { detectWindows, pickBest } from "@/lib/window-detector";
import { ForecastCalendar } from "@/components/ForecastCalendar";
import { WindowSummary } from "@/components/WindowSummary";
import { Explainer } from "@/components/Explainer";
import { ArrowLeft } from "@/components/Icons";

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
  const lat = parseFloat(searchParams.lat ?? "");
  const lng = parseFloat(searchParams.lng ?? "");
  const sprayId = searchParams.sprayType ?? "fungicide_contact";
  const label = searchParams.label ?? `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
  const profile = SPRAY_PROFILES[sprayId];

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !profile) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-5">
          <h1 className="text-lg font-semibold text-rose-900">Invalid request</h1>
          <p className="text-sm text-rose-800 mt-1">
            Missing or invalid location / spray type.
          </p>
          <Link
            href="/"
            className="inline-block mt-3 text-sm text-rose-900 underline"
          >
            ← Start over
          </Link>
        </div>
      </main>
    );
  }

  let body;
  try {
    const raw = await fetchForecast(lat, lng);
    const hours = scoreForecast(raw.hourly, profile, raw.daily);
    const windows = detectWindows(hours);
    const best = pickBest(windows);

    body = (
      <>
        <WindowSummary best={best} total={windows.length} sprayLabel={profile.label} />

        {windows.length > 0 && (
          <section className="rounded-2xl bg-white border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-3">
              All spray windows ({windows.length})
            </h2>
            <ul className="divide-y divide-slate-100">
              {windows.map((w, i) => (
                <li key={i} className="py-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        w.rating === "green" ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                    />
                    <span className="font-medium text-slate-800">
                      {new Date(w.startTime.slice(0, 10) + "T12:00:00Z")
                        .toLocaleDateString("en", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        })}
                    </span>
                    <span className="text-slate-600">
                      {w.startTime.slice(11, 16)}–{w.endTime.slice(11, 16)}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {Math.round(w.durationHours)}h · score {w.avgScore}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="font-semibold text-slate-900 mb-3">
            Hourly forecast (5 days)
          </h2>
          <ForecastCalendar hours={hours} />
        </section>

        <Explainer />
      </>
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    body = (
      <div className="rounded-2xl border border-rose-300 bg-rose-50 p-5">
        <h2 className="text-lg font-semibold text-rose-900">
          Couldn&apos;t fetch weather
        </h2>
        <p className="text-sm text-rose-800 mt-1">{msg}</p>
        <Link href="/" className="inline-block mt-3 text-sm text-rose-900 underline">
          ← Try again
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">
          {profile.label}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
          {label}
        </h1>
      </header>

      <div className="space-y-5">{body}</div>

      <footer className="mt-10 text-center text-xs text-slate-500">
        Weather: Open-Meteo. Always follow product label.
      </footer>
    </main>
  );
}
