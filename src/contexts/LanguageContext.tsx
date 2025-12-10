"use client";

import {createContext, useContext, useState} from "react";
import {i18nConfig, languages, SupportedLang} from "@/i18n";
import {NextIntlClientProvider} from "next-intl";

interface LanguageContextValue {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): SupportedLang {
  return "en";
}

export function LanguageProvider({children}: {children: React.ReactNode}) {
  const [lang, setLangState] = useState<SupportedLang>(getInitialLang);

  function setLang(newLang: SupportedLang) {
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
  }

  return (
    <LanguageContext.Provider value={{lang, setLang}}>
      <NextIntlClientProvider 
        locale={lang}
        messages={languages[lang]}
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