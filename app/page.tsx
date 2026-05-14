import { LandingClient } from "@/components/LandingClient";
import { getLang } from "@/lib/i18n-server";
import { getT } from "@/lib/i18n";

export default function Home() {
  const lang = getLang();
  const t = getT(lang);
  return <LandingClient lang={lang} t={t} />;
}
