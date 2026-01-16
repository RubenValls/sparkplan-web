"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import styles from "./WelcomeCard.module.scss";

interface WelcomeCardProps {
  user: string | null | undefined;
}

export default function WelcomeCard({ user }: WelcomeCardProps) {
  const t = useTranslations("DASHBOARD.WELCOME");

  return (
    <div className={styles.welcomeCard}>
      <div className={styles.welcomeCard__header}>
        <div className={styles.welcomeCard__icon}>
          <Sparkles />
        </div>
        <div className={styles.welcomeCard__text}>
          <h1 className={styles.welcomeCard__greeting}>
            {t("GREETING")} {user?.split(" ")[0] || "User"}!
          </h1>
          <p className={styles.welcomeCard__subtitle}>{t("SUBTITLE")}</p>
        </div>
      </div>
    </div>
  );
}