export function prefersDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getBrowserLanguage(): string {
  if (typeof window === "undefined") return "en";
  
  const lang = navigator.language.split("-")[0];
  return lang;
}

export function isClient(): boolean {
  return typeof window !== "undefined";
}