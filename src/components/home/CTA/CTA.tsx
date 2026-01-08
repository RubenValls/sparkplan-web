"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/config";
import styles from "./CTA.module.scss";

export default function CTA() {
  const t = useTranslations("HOME.CTA");

  const handleAction = () => {
    signIn("google", { callbackUrl: ROUTES.DASHBOARD });
  };

  return (
    <section className={styles.cta}>
      <div className={styles.cta__container}>
        <h2 className={styles.cta__heading}>{t("HEADING")}</h2>
        <p className={styles.cta__text}>{t("TEXT")}</p>
        <button className={styles.cta__button} onClick={handleAction}>
          {t("START_NOW")}
        </button>
      </div>
    </section>
  );
}