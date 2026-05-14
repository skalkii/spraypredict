import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LANG, isValidLang, type Lang } from "./i18n";

export const LANG_COOKIE = "lang";

export function getLang(): Lang {
  const c = cookies().get(LANG_COOKIE)?.value;
  return isValidLang(c) ? c : DEFAULT_LANG;
}
