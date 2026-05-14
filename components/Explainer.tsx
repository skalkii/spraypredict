"use client";

import { useState } from "react";

const ITEMS: { title: string; body: string }[] = [
  {
    title: "Delta-T (droplet drying)",
    body:
      "Delta-T is the gap between air temperature and wet-bulb temperature. Below 2°C the air is too saturated and droplets pool on the leaf without drying — poor adhesion, runoff into soil. Above 10°C droplets evaporate before they reach the target. The sweet spot is 2–8°C.",
  },
  {
    title: "Wind and drift",
    body:
      "Under 3 km/h is dead-calm: a temperature inversion can trap vapor near the ground and drift it laterally into a neighbour's field hours later. Over 15 km/h sustained, or gusts over 20 km/h, sends droplets off-target. The ideal window is a steady 3–10 km/h breeze.",
  },
  {
    title: "Rain windows",
    body:
      "Contact products need a long dry window after application (6–8h) so the chemical can bind to the leaf cuticle before rain washes it off. Systemic products only need a short uptake window (2–4h) because the plant absorbs them. Avoiding rain in the past 2h matters too — wet leaves dilute the spray.",
  },
  {
    title: "Time of day",
    body:
      "Hot midday hours (10 AM – 4 PM, >28°C) combine high evaporation, strong UV breakdown, and unstable air. Early morning and late afternoon usually offer cooler, more stable conditions — especially for herbicides and contact insecticides.",
  },
];

export function Explainer() {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold text-slate-900">Why this matters</span>
        <span className="text-slate-400 text-sm" aria-hidden>
          {open ? "Hide ▴" : "Show ▾"}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
          {ITEMS.map((it) => (
            <div key={it.title}>
              <h3 className="font-medium text-slate-900">{it.title}</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {it.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
