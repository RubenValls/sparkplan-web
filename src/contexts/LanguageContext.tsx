"use client";

import {createContext, useContext, useState} from "react";
import {languages, SupportedLang} from "@/i18n";
import {NextIntlClientProvider} from "next-intl";

interface LanguageContextValue {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): SupportedLang {
  if (typeof window === "undefined") return "en";

  const saved = localStorage.getItem("lang") as SupportedLang | null;
  return saved ?? "en";
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