"use client";

import { useTranslations } from "next-intl";
import { User } from "next-auth";
import { Sparkles } from "lucide-react";
import styles from "./WelcomeCard.module.scss";

interface WelcomeCardProps {
  user: User;
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
            {t("GREETING")} {user.name?.split(" ")[0] || "User"}!
          </h1>
          <p className={styles.welcomeCard__subtitle}>{t("SUBTITLE")}</p>
        </div>
      </div>
    </div>
  );
}