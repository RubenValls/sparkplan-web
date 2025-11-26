import en from "./en.json";
import es from "./es.json";

export const languages = {
  en,
  es
};

export type SupportedLang = keyof typeof languages;
