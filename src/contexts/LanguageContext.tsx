"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { i18nConfig, languages, SupportedLang } from "@/i18n";
import { NextIntlClientProvider } from "next-intl";

interface LanguageContextValue {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): SupportedLang {
  if (typeof window !== "undefined") {
    const savedLang = localStorage.getItem("lang") as SupportedLang | null;
    if (savedLang === "en" || savedLang === "es") {
      return savedLang;
    }
  }
  if (typeof window !== "undefined") {
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "es") return "es";
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>(getInitialLang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang;
    }
  }, [lang, mounted]);

  function setLang(newLang: SupportedLang) {
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
  }

  const currentLang = mounted ? lang : "en";

  return (
    <LanguageContext.Provider value={{ lang: currentLang, setLang }}>
      <NextIntlClientProvider
        locale={currentLang}
        messages={languages[currentLang]}
        timeZone={i18nConfig.timeZone}
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}