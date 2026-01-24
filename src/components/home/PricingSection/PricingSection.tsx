"use client";

import { useTranslations } from "next-intl";
import PricingPlans from "@/components/pricing/PricingPlans/PricingPlans";
import { ROUTES } from "@/config";
import styles from "./PricingSection.module.scss";
import { signIn } from "next-auth/react";

export default function PricingSection() {
  const t = useTranslations("HOME.PRICING");

  const handleFreePlan = () => {
    signIn("google", { callbackUrl: ROUTES.DASHBOARD });
  };

  return (
    <section className={styles.pricing}>
      <div className={styles.pricing__container}>
        <div className={styles.pricing__header}>
          <h2 className={styles.pricing__title}>{t("HEADING")}</h2>
          <p className={styles.pricing__subtitle}>{t("SUBHEADING")}</p>
        </div>

        <PricingPlans
          showButtons={{ free: true, plus: false, pro: false }}
          onFreePlanClick={handleFreePlan}
        />
      </div>
    </section>
  );
}