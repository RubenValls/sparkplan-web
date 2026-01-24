"use client";

import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./PricingCard.module.scss";
import type { PlanType } from "@/types/pricing";

interface PricingCardProps {
  plan: PlanType;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onButtonClick?: () => void;
  buttonText?: string;
  showButton?: boolean;
}

type FeatureKey = "FEATURE_1" | "FEATURE_2" | "FEATURE_3" | "FEATURE_4" | "FEATURE_5" | "FEATURE_6";

interface Feature {
  key: FeatureKey;
  included: boolean;
}

export default function PricingCard({
  plan,
  isCurrentPlan = false,
  isPopular = false,
  onButtonClick,
  buttonText,
  showButton = true,
}: PricingCardProps) {
  const t = useTranslations(`PRICING.${plan}`);
  const tCommon = useTranslations("PRICING");

  const features: Feature[] = [
    { key: "FEATURE_1", included: true },
    { key: "FEATURE_2", included: true },
    { key: "FEATURE_3", included: true },
    { key: "FEATURE_4", included: true },
    { key: "FEATURE_5", included: plan !== "FREE" },
    ...(plan === "PRO" ? [{ key: "FEATURE_6" as FeatureKey, included: true }] : []),
  ];

  return (
    <div
      className={`${styles.card} ${isPopular ? styles["card--popular"] : ""} ${
        isCurrentPlan ? styles["card--current"] : ""
      }`}
    >
      {isPopular && (
        <div className={styles.card__badge}>{tCommon("MOST_POPULAR")}</div>
      )}

      <div className={styles.card__header}>
        <h3 className={styles.card__title}>{t("TITLE")}</h3>
        <p className={styles.card__description}>{t("DESCRIPTION")}</p>
      </div>

      <div className={styles.card__pricing}>
        <div className={styles.card__price}>
          {t("PRICE")}
          {plan !== "FREE" && (
            <span className={styles.card__period}>{t("PERIOD")}</span>
          )}
        </div>
      </div>

      <ul className={styles.card__features}>
        {features.map((feature) => (
          <li
            key={feature.key}
            className={`${styles.card__feature} ${
              !feature.included ? styles["card__feature--disabled"] : ""
            }`}
          >
            {feature.included ? (
              <Check className={styles.card__featureIcon} />
            ) : (
              <X className={styles.card__featureIconDisabled} />
            )}
            <span>{t(feature.key)}</span>
          </li>
        ))}
      </ul>

      {showButton && (
        <button
          className={`${styles.card__button} ${
            isPopular ? styles["card__button--popular"] : ""
          }`}
          onClick={onButtonClick}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? tCommon("CURRENT_PLAN") : buttonText || t("BUTTON")}
        </button>
      )}
    </div>
  );
}