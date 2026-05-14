"use client";

import { LANGS, type Lang } from "@/lib/i18n";

interface Props {
  current: Lang;
  label: string;
}

export function LanguagePicker({ current, label }: Props) {
  function pick(code: Lang) {
    // 1 year, sameSite=Lax, path=/
    document.cookie = `lang=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.location.reload();
  }
  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-slate-600">
      <span className="sr-only">{label}</span>
      <span aria-hidden>🌐</span>
      <select
        value={current}
        onChange={(e) => pick(e.target.value as Lang)}
        className="bg-transparent border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
