import type { Strings } from "@/lib/i18n";
import { Github } from "./Icons";

const REPO_URL = "https://github.com/skalkii/spraypredict";

export function Footer({ t }: { t: Strings }) {
  return (
    <footer className="w-full border-t border-cream-200 dark:border-ink-600 mt-10 py-6 text-xs text-ink-500 dark:text-ink-300">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="leading-relaxed flex-1">{t.disclaimer}</p>
        <div className="flex items-center gap-4 shrink-0">
          <span>{t.weatherCredit.replace(/^.*?:\s*/, "Open-Meteo")}</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-ink-900 dark:hover:text-cream-50 transition"
            aria-label={t.viewOnGithub}
            title={t.viewOnGithub}
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
