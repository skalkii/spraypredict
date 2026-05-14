"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationPicker, PickedLocation } from "@/components/LocationPicker";
import { SprayTypePicker } from "@/components/SprayTypePicker";
import { LanguagePicker } from "@/components/LanguagePicker";
import type { Lang, Strings } from "@/lib/i18n";

interface Props {
  lang: Lang;
  t: Strings;
}

export function LandingClient({ lang, t }: Props) {
  const router = useRouter();
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [sprayType, setSprayType] = useState<string>("fungicide_contact");
  const [submitting, setSubmitting] = useState(false);

  function submit() {
    if (!location) return;
    setSubmitting(true);
    const params = new URLSearchParams({
      lat: location.latitude.toString(),
      lng: location.longitude.toString(),
      sprayType,
      label: location.label,
    });
    router.push(`/forecast?${params.toString()}`);
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex items-start justify-between gap-3">
        <div>
          <div className="text-emerald-700 font-semibold text-sm uppercase tracking-wide">
            {t.appTitle}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            {t.tagline}
          </h1>
          <p className="text-slate-600 mt-2">{t.description}</p>
        </div>
        <LanguagePicker current={lang} label={t.language} />
      </header>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-6">
        <div>
          <h2 className="text-sm font-medium text-slate-700 mb-2">{t.step1Location}</h2>
          <LocationPicker t={t} value={location} onChange={setLocation} />
        </div>

        <div>
          <h2 className="text-sm font-medium text-slate-700 mb-2">{t.step2Spray}</h2>
          <SprayTypePicker t={t} value={sprayType} onChange={setSprayType} />
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!location || submitting}
          className="w-full rounded-lg bg-emerald-600 text-white px-4 py-3 font-semibold text-lg hover:bg-emerald-700 active:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? t.loading : t.seeForecast}
        </button>
      </section>

      <footer className="mt-8 text-center text-xs text-slate-500 space-y-1">
        <p>{t.disclaimer}</p>
      </footer>
    </main>
  );
}
