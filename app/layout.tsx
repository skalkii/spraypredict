import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getLang, getTheme } from "@/lib/i18n-server";
import { getT } from "@/lib/i18n";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

export function generateMetadata(): Metadata {
  const t = getT(getLang());
  return {
    title: t.appTitle,
    description: t.description,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1F1E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = getLang();
  const theme = getTheme();
  // Server-render the explicit class for light/dark. For 'system', the inline
  // script applies the class before paint to avoid hydration mismatch flicker.
  const className = theme === "dark" ? "dark" : "";
  return (
    <html lang={lang} className={className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-cream-50 dark:bg-ink-900 text-ink-900 dark:text-cream-50 antialiased transition-colors">
        {children}
      </body>
    </html>
  );
}
