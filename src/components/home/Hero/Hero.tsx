"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/config";
import { Sparkles } from "lucide-react";
import styles from "./Hero.module.scss";

export default function Hero() {
  const t = useTranslations("HOME.HERO");

  const handleGetStarted = () => {
    signIn("google", { callbackUrl: ROUTES.DASHBOARD });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.hero__container}>
        <div className={styles.hero__badge}>
          <Sparkles size={16} />
          <span>{t("BADGE")}</span>
        </div>

        <h1 className={styles.hero__title}>{t("TITLE")}</h1>
        <p className={styles.hero__subtitle}>{t("SUBTITLE")}</p>

        <button 
          className={styles.hero__cta}
          onClick={handleGetStarted}
        >
          {t("GET_STARTED")}
        </button>

        <p className={styles.hero__note}>{t("NOTE")}</p>
      </div>
    </section>
  );
}