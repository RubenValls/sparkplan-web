"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config";
import styles from "./UsageLimitError.module.scss";

interface UsageLimitErrorProps {
  subscription: string;
  currentUsage: number;
  limit: number;
  periodType: "daily" | "weekly";
  periodEnd: string;
}

export default function UsageLimitError({
  subscription,
  currentUsage,
  limit,
  periodType,
  periodEnd,
}: UsageLimitErrorProps) {
  const t = useTranslations("ERRORS.USAGE_LIMIT_REACHED");
  const router = useRouter();

  const messageKey = periodType === "daily" ? "MESSAGE_DAILY" : "MESSAGE_WEEKLY";
  
  const resetDate = new Date(periodEnd).toLocaleDateString(undefined, {
    weekday: periodType === "weekly" ? "long" : undefined,
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleUpgrade = () => {
    router.push(ROUTES.PLANS);
  };

  return (
    <div className={styles.error}>
      <h3 className={styles.error__title}>{t("TITLE")}</h3>
      <p className={styles.error__message}>
        {t(messageKey, { limit, currentUsage })}
      </p>
      <p className={styles.error__reset}>
        {t("RESET_INFO", { date: resetDate })}
      </p>
      {subscription === "FREE" && (
        <button onClick={handleUpgrade} className={styles.error__button}>
          {t("UPGRADE_CTA")}
        </button>
      )}
    </div>
  );
}