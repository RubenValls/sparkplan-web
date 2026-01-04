"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { SupportedLang, languages, i18nConfig } from "@/config/i18n";
import { getBrowserLanguage, getStorageItem, setStorageItem } from "@/utils";

interface LanguageContextValue {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): SupportedLang {
  const savedLang = getStorageItem<SupportedLang>("lang");
  if (savedLang === "en" || savedLang === "es") {
    return savedLang;
  }
  
  const browserLang = getBrowserLanguage();
  if (browserLang === "es") return "es";
  
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
    setStorageItem("lang", newLang);
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