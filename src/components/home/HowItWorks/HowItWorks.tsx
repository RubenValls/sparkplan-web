"use client";

import { useTranslations } from "next-intl";
import styles from "./HowItWorks.module.scss";

export default function HowItWorks() {
  const t = useTranslations("HOME.HOW_IT_WORKS");

  const steps = [
    {
      number: "1",
      title: t("STEP_1_TITLE"),
      description: t("STEP_1_DESC"),
      icon: "🔐"
    },
    {
      number: "2",
      title: t("STEP_2_TITLE"),
      description: t("STEP_2_DESC"),
      icon: "💡"
    },
    {
      number: "3",
      title: t("STEP_3_TITLE"),
      description: t("STEP_3_DESC"),
      icon: "🤖"
    },
    {
      number: "4",
      title: t("STEP_4_TITLE"),
      description: t("STEP_4_DESC"),
      icon: "📁"
    }
  ];

  return (
    <section className={styles.howItWorks}>
      <div className={styles.howItWorks__container}>
        <h2 className={styles.howItWorks__heading}>{t("HEADING")}</h2>
        <div className={styles.howItWorks__steps}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.step__icon}>{step.icon}</div>
              <div className={styles.step__number}>{step.number}</div>
              <h3 className={styles.step__title}>{step.title}</h3>
              <p className={styles.step__description}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}