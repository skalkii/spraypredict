export type Theme = "light" | "dark" | "system";

export const THEMES: Theme[] = ["light", "dark", "system"];

export const DEFAULT_THEME: Theme = "system";

export const THEME_COOKIE = "theme";

export function isValidTheme(s: string | undefined | null): s is Theme {
  return s === "light" || s === "dark" || s === "system";
}

// Renders to <head> as a blocking script so the html class is set BEFORE
// first paint — avoids the dark/light flash on initial load.
export const THEME_INIT_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]+)/);var t=m?m[1]:'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;if(d)e.classList.add('dark');else e.classList.remove('dark');e.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
