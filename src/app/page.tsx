"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";

export default function Home() {
  const translations = useTranslations("HOME");

  return (
    <section className={styles.home}>
      <div className={styles.home__content}>
        <h1 className={styles.home__title}>{translations("TITLE")}</h1>
        <p className={styles.home__subtitle}>
          {translations("SUBTITLE")}
        </p>
      </div>
    </section>
  );
}
