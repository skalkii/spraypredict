"use client";

import { useState } from "react";
import type { Strings } from "@/lib/i18n";

export function Explainer({ t }: { t: Strings }) {
  const [open, setOpen] = useState(false);
  const items: { title: string; body: string }[] = [
    { title: t.expDeltaTTitle, body: t.expDeltaTBody },
    { title: t.expWindTitle, body: t.expWindBody },
    { title: t.expRainTitle, body: t.expRainBody },
    { title: t.expTimeTitle, body: t.expTimeBody },
  ];
  return (
    <section className="rounded-2xl border border-cream-200 dark:border-ink-700 bg-white dark:bg-ink-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-ink-900 dark:text-cream-50">{t.whyMatters}</span>
        <span className="text-ink-500 dark:text-ink-300 text-sm" aria-hidden>
          {open ? `${t.hide} ▴` : `${t.show} ▾`}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-cream-100 dark:border-ink-700 pt-5">
          {items.map((it) => (
            <div key={it.title}>
              <h3 className="font-medium text-ink-900 dark:text-cream-50">{it.title}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-300 mt-1.5 leading-relaxed">{it.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
