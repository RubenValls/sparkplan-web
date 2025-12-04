"use client";

import { useTranslations } from "next-intl";
import { Lock, Lightbulb, Bot, FolderOpen } from "lucide-react";
import styles from "./HowItWorks.module.scss";

export default function HowItWorks() {
  const t = useTranslations("HOME.HOW_IT_WORKS");

  const steps = [
    {
      title: t("STEP_1_TITLE"),
      description: t("STEP_1_DESC"),
      icon: Lock
    },
    {
      title: t("STEP_2_TITLE"),
      description: t("STEP_2_DESC"),
      icon: Lightbulb
    },
    {
      title: t("STEP_3_TITLE"),
      description: t("STEP_3_DESC"),
      icon: Bot
    },
    {
      title: t("STEP_4_TITLE"),
      description: t("STEP_4_DESC"),
      icon: FolderOpen
    }
  ];

  return (
    <section className={styles.howItWorks}>
      <div className={styles.howItWorks__container}>
        <h2 className={styles.howItWorks__heading}>{t("HEADING")}</h2>
        <div className={styles.howItWorks__steps}>
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.title} className={styles.step}>
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