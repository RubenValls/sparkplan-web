import en from "./en.json";
import es from "./es.json";

export const languages = {
  en,
  es
};

export type SupportedLang = keyof typeof languages;

export const i18nConfig = {
  locales: ["en", "es"] as const,
  defaultLocale: "en" as const,
  timeZone: "UTC",
} as const;