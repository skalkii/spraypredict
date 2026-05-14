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
    <main className="mx-auto max-w-xl px-4 py-8 sm:py-14">
      <header className="mb-10 flex items-start justify-between gap-3">
        <div>
          <div className="text-clay-600 font-medium text-xs uppercase tracking-[0.18em]">
            {t.appTitle}
          </div>
          <h1 className="text-4xl sm:text-5xl font-normal text-ink-900 mt-2 leading-tight tracking-tight">
            {t.tagline}
          </h1>
          <p className="text-ink-500 mt-3 leading-relaxed">{t.description}</p>
        </div>
        <LanguagePicker current={lang} label={t.language} />
      </header>

      <section className="bg-white rounded-2xl border border-cream-200 p-6 space-y-7">
        <div>
          <h2 className="text-sm font-medium text-ink-700 mb-3 uppercase tracking-wider">
            {t.step1Location}
          </h2>
          <LocationPicker t={t} value={location} onChange={setLocation} />
        </div>

        <div>
          <h2 className="text-sm font-medium text-ink-700 mb-3 uppercase tracking-wider">
            {t.step2Spray}
          </h2>
          <SprayTypePicker t={t} value={sprayType} onChange={setSprayType} />
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!location || submitting}
          className="w-full rounded-xl bg-ink-900 text-cream-50 px-4 py-3.5 font-medium text-base hover:bg-ink-700 active:bg-ink-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? t.loading : t.seeForecast}
        </button>
      </section>

      <footer className="mt-10 text-center text-xs text-ink-500 leading-relaxed">
        <p>{t.disclaimer}</p>
      </footer>
    </main>
  );
}
