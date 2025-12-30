"use client";

import { useLang } from "@/components/providers/LanguageProvider";
import { Globe } from "lucide-react";
import styles from "./LanguageSwitcher.module.scss";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "es" : "en";
    setLang(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={styles.languageSwitcher}
      aria-label={`Switch to ${lang === "en" ? "Spanish" : "English"}`}
      title={`Switch to ${lang === "en" ? "Spanish" : "English"}`}
    >
      <Globe className={styles.languageSwitcher__icon} />
      <span className={styles.languageSwitcher__text}>
        {lang === "en" ? "ES" : "EN"}
      </span>
    </button>
  );
}