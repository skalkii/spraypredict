"use client";

import { useEffect, useState } from "react";
import { type Theme } from "@/lib/theme";
import type { Strings } from "@/lib/i18n";
import { Sun, Moon, Monitor } from "./Icons";

interface Props {
  initial: Theme;
  t: Strings;
}

function apply(theme: Theme) {
  document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export function ThemePicker({ initial, t }: Props) {
  const [theme, setTheme] = useState<Theme>(initial);

  // Re-evaluate when system theme changes while user is in 'system' mode.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  function pick(next: Theme) {
    setTheme(next);
    apply(next);
  }

  const opts: { value: Theme; label: string; Icon: typeof Sun }[] = [
    { value: "light", label: t.themeLight, Icon: Sun },
    { value: "dark", label: t.themeDark, Icon: Moon },
    { value: "system", label: t.themeSystem, Icon: Monitor },
  ];

  return (
    <div
      role="group"
      aria-label={t.theme}
      className="inline-flex items-center rounded-lg border border-cream-200 dark:border-ink-600 bg-cream-50 dark:bg-ink-700 p-0.5 shrink-0"
    >
      {opts.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => pick(value)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={`p-1.5 rounded-md transition ${
              active
                ? "bg-white dark:bg-ink-900 text-ink-900 dark:text-cream-50 shadow-sm"
                : "text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-cream-50"
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
