"use client";

import { useTranslations } from "next-intl";
import { LogIn, Lightbulb, Sparkles, Download } from "lucide-react";
import styles from "./HowItWorks.module.scss";

export default function HowItWorks() {
  const t = useTranslations("HOME.HOW_IT_WORKS");

  const steps = [
    {
      title: t("STEP_1_TITLE"),
      description: t("STEP_1_DESC"),
      icon: LogIn,
      number: "01"
    },
    {
      title: t("STEP_2_TITLE"),
      description: t("STEP_2_DESC"),
      icon: Lightbulb,
      number: "02"
    },
    {
      title: t("STEP_3_TITLE"),
      description: t("STEP_3_DESC"),
      icon: Sparkles,
      number: "03"
    },
    {
      title: t("STEP_4_TITLE"),
      description: t("STEP_4_DESC"),
      icon: Download,
      number: "04"
    }
  ];

  return (
    <section className={styles.howItWorks}>
      <div className={styles.howItWorks__container}>
        <h2 className={styles.howItWorks__heading}>{t("HEADING")}</h2>
        <p className={styles.howItWorks__subheading}>{t("SUBHEADING")}</p>
        
        <div className={styles.howItWorks__steps}>
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.title} className={styles.step}>
                <div className={styles.step__number}>{step.number}</div>
                <div className={styles.step__icon}>
                  <IconComponent />
                </div>
                <h3 className={styles.step__title}>{step.title}</h3>
                <p className={styles.step__description}>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}