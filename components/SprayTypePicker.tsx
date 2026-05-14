"use client";

import { SPRAY_PROFILES } from "@/lib/spray-rules";

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function SprayTypePicker({ value, onChange }: Props) {
  const profiles = Object.values(SPRAY_PROFILES);
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-slate-700 mb-1">
        Spray type
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {profiles.map((p) => {
          const selected = value === p.id;
          return (
            <label
              key={p.id}
              className={[
                "rounded-lg border px-4 py-3 cursor-pointer transition",
                selected
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                  : "border-slate-300 bg-white hover:border-slate-400",
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
              <div className="font-medium text-slate-900">{p.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">{p.description}</div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
