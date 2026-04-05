"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/config";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
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
        <Button
          variant="hero"
          size="lg"
          onClick={handleAction}
          className={styles.cta__button}
          iconRight={<ArrowRight size={20} />}
        >
          {t("START_NOW")}
        </Button>
        <p className={styles.cta__note}>{t("NOTE")}</p>
      </div>
    </section>
  );
}