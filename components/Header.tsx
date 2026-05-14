import Link from "next/link";
import type { Lang, Strings } from "@/lib/i18n";
import type { Theme } from "@/lib/theme";
import { LanguagePicker } from "./LanguagePicker";
import { ThemePicker } from "./ThemePicker";

interface Props {
  lang: Lang;
  theme: Theme;
  t: Strings;
  /** Optional sticky behaviour on mobile-scroll pages. */
  sticky?: boolean;
}

export function Header({ lang, theme, t, sticky }: Props) {
  return (
    <header
      className={[
        "w-full border-b border-cream-200 dark:border-ink-600 bg-cream-50/90 dark:bg-ink-900/90 backdrop-blur",
        sticky ? "sticky top-0 z-20" : "",
      ].join(" ")}
    >
      <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 min-w-0 group">
          <Logo className="w-7 h-7 shrink-0" />
          <span className="font-serif text-base sm:text-lg text-ink-900 dark:text-cream-50 truncate">
            {t.appTitle}
          </span>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <LanguagePicker current={lang} label={t.language} />
          <ThemePicker initial={theme} t={t} />
        </div>
      </div>
    </header>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" className="fill-cream-100 dark:fill-ink-700" />
      <path
        d="M32 8 C 22 22, 16 32, 16 40 a16 16 0 0 0 32 0 c 0 -8 -6 -18 -16 -32 z"
        className="fill-clay-500"
      />
      <ellipse cx="26" cy="36" rx="4" ry="6" className="fill-clay-50" opacity="0.6" />
    </svg>
  );
}
