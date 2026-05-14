import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getLang } from "@/lib/i18n-server";
import { getT } from "@/lib/i18n";

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
  themeColor: "#10B981",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = getLang();
  return (
    <html lang={lang}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
