"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationPicker, PickedLocation } from "@/components/LocationPicker";
import { SprayTypePicker } from "@/components/SprayTypePicker";
import type { Strings } from "@/lib/i18n";

interface Props {
  t: Strings;
}

export function LandingClient({ t }: Props) {
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
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-normal text-ink-900 dark:text-cream-50 leading-tight tracking-tight">
          {t.tagline}
        </h1>
        <p className="text-ink-500 dark:text-ink-300 mt-3 leading-relaxed">
          {t.description}
        </p>
      </header>

      <section className="bg-white dark:bg-ink-800 rounded-2xl border border-cream-200 dark:border-ink-700 p-6 space-y-7">
        <div>
          <h2 className="text-xs font-medium text-ink-500 dark:text-ink-300 mb-3 uppercase tracking-[0.18em]">
            {t.step1Location}
          </h2>
          <LocationPicker t={t} value={location} onChange={setLocation} />
        </div>

        <div>
          <h2 className="text-xs font-medium text-ink-500 dark:text-ink-300 mb-3 uppercase tracking-[0.18em]">
            {t.step2Spray}
          </h2>
          <SprayTypePicker t={t} value={sprayType} onChange={setSprayType} />
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!location || submitting}
          className="w-full rounded-xl bg-ink-900 dark:bg-cream-50 text-cream-50 dark:text-ink-900 px-4 py-3.5 font-medium text-base hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? t.loading : t.seeForecast}
        </button>
      </section>
    </main>
  );
}
