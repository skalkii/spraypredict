import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LANG, isValidLang, type Lang } from "./i18n";
import {
  DEFAULT_THEME,
  isValidTheme,
  THEME_COOKIE,
  type Theme,
} from "./theme";

export const LANG_COOKIE = "lang";

export function getLang(): Lang {
  const c = cookies().get(LANG_COOKIE)?.value;
  return isValidLang(c) ? c : DEFAULT_LANG;
}

export function getTheme(): Theme {
  const c = cookies().get(THEME_COOKIE)?.value;
  return isValidTheme(c) ? c : DEFAULT_THEME;
}
