"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationPicker, PickedLocation } from "@/components/LocationPicker";
import { SprayTypePicker } from "@/components/SprayTypePicker";

export default function Home() {
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
      <header className="mb-8">
        <div className="text-emerald-700 font-semibold text-sm uppercase tracking-wide">
          Spray Window Predictor
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
          When can I spray?
        </h1>
        <p className="text-slate-600 mt-2">
          See the next 5 days of hourly spray windows for your field. Free,
          no signup, powered by Open-Meteo weather data.
        </p>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-6">
        <div>
          <h2 className="text-sm font-medium text-slate-700 mb-2">
            1. Location
          </h2>
          <LocationPicker value={location} onChange={setLocation} />
        </div>

        <div>
          <h2 className="text-sm font-medium text-slate-700 mb-2">
            2. What are you spraying?
          </h2>
          <SprayTypePicker value={sprayType} onChange={setSprayType} />
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!location || submitting}
          className="w-full rounded-lg bg-emerald-600 text-white px-4 py-3 font-semibold text-lg hover:bg-emerald-700 active:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Loading…" : "See 5-day forecast"}
        </button>
      </section>

      <footer className="mt-8 text-center text-xs text-slate-500 space-y-1">
        <p>
          Always follow product label instructions. This tool is a guide, not a
          substitute for professional agronomic advice.
        </p>
      </footer>
    </main>
  );
}
