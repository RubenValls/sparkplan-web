"use client";

import { useTranslations } from "next-intl";
import styles from "./Hero.module.scss";

export default function Hero() {
  const translations = useTranslations("HOME.HERO");

  const handleGetStarted = () => {
    //@TODO(): Implement Get Started
  };

  return (
    <section className={styles.hero}>
      <div className={styles.hero__container}>
        <h1 className={styles.hero__title}>{translations("TITLE")}</h1>
        <p className={styles.hero__subtitle}>{translations("SUBTITLE")}</p>
        <button 
          className={styles.hero__cta}
          onClick={handleGetStarted}
        >
          {translations("GET_STARTED")}
        </button>
      </div>
    </section>
  );
}