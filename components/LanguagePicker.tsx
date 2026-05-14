"use client";

import { LANGS, type Lang } from "@/lib/i18n";

interface Props {
  current: Lang;
  label: string;
}

export function LanguagePicker({ current, label }: Props) {
  function pick(code: Lang) {
    document.cookie = `lang=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.location.reload();
  }
  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-300 shrink-0">
      <span className="sr-only">{label}</span>
      <span aria-hidden>🌐</span>
      <select
        value={current}
        onChange={(e) => pick(e.target.value as Lang)}
        className="bg-cream-50 dark:bg-ink-700 border border-cream-200 dark:border-ink-600 rounded-lg px-2 py-1 text-sm text-ink-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-clay-400"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
