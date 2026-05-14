import { LandingClient } from "@/components/LandingClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getLang, getTheme } from "@/lib/i18n-server";
import { getT } from "@/lib/i18n";

export default function Home() {
  const lang = getLang();
  const theme = getTheme();
  const t = getT(lang);
  return (
    <>
      <Header lang={lang} theme={theme} t={t} />
      <LandingClient t={t} />
      <Footer t={t} />
    </>
  );
}
