"use client";

import { useTranslations } from "next-intl";
import styles from "./Features.module.scss";

export default function Features() {
  const t = useTranslations("HOME.FEATURES");

  const features = [
    {
      title: t("FEATURE_1_TITLE"),
      description: t("FEATURE_1_DESC"),
      icon: "⚡"
    },
    {
      title: t("FEATURE_2_TITLE"),
      description: t("FEATURE_2_DESC"),
      icon: "🌍"
    },
    {
      title: t("FEATURE_3_TITLE"),
      description: t("FEATURE_3_DESC"),
      icon: "☁️"
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.features__container}>
        <h2 className={styles.features__heading}>{t("HEADING")}</h2>
        <div className={styles.features__grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <div className={styles.feature__icon}>{feature.icon}</div>
              <h3 className={styles.feature__title}>{feature.title}</h3>
              <p className={styles.feature__description}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}