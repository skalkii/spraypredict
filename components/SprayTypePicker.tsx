"use client";

import { SPRAY_PROFILES } from "@/lib/spray-rules";
import type { Strings } from "@/lib/i18n";

interface Props {
  t: Strings;
  value: string;
  onChange: (id: string) => void;
}

export function SprayTypePicker({ t, value, onChange }: Props) {
  const profiles = Object.values(SPRAY_PROFILES);
  return (
    <fieldset className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {profiles.map((p) => {
          const selected = value === p.id;
          const labelKey = `profile_${p.id}` as keyof Strings;
          const descKey = `profile_${p.id}_desc` as keyof Strings;
          const label = (t[labelKey] as string) ?? p.label;
          const desc = (t[descKey] as string) ?? p.description;
          return (
            <label
              key={p.id}
              className={[
                "rounded-xl border px-4 py-3 cursor-pointer transition",
                selected
                  ? "border-clay-400 bg-clay-50 dark:bg-clay-700/20 dark:border-clay-500 ring-2 ring-clay-100 dark:ring-clay-700/30"
                  : "border-cream-200 bg-cream-50 dark:border-ink-600 dark:bg-ink-900 hover:border-cream-300 dark:hover:border-ink-500",
              ].join(" ")}
            >
              <input
                type="radio"
                name="sprayType"
                value={p.id}
                checked={selected}
                onChange={() => onChange(p.id)}
                className="sr-only"
              />
              <div className="font-medium text-ink-900 dark:text-cream-50">{label}</div>
              <div className="text-xs text-ink-700 dark:text-ink-200 mt-0.5 leading-relaxed">{desc}</div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
