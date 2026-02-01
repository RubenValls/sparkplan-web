"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config";
import styles from "./UsageLimitError.module.scss";

interface UsageLimitErrorProps {
  subscription: "FREE" | "PLUS" | "PRO";
  currentUsage: number;
  limit: number;
  periodType: "lifetime" | "monthly";
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

  const isFree = periodType === "lifetime";
  
  const resetDate = !isFree 
    ? new Date(periodEnd).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const handleUpgrade = () => {
    router.push(ROUTES.PLANS);
  };

  return (
    <div className={styles.error}>
      <h3 className={styles.error__title}>{t("TITLE")}</h3>
      
      <p className={styles.error__message}>
        {isFree 
          ? t("MESSAGE_FREE")
          : t("MESSAGE_MONTHLY", { limit, currentUsage })
        }
      </p>

      {!isFree && (
        <p className={styles.error__reset}>
          {t("RESET_INFO", { date: resetDate })}
        </p>
      )}

      {(subscription === "FREE" || subscription === "PLUS") && (
        <button onClick={handleUpgrade} className={styles.error__button}>
          {subscription === "FREE" 
            ? t("UPGRADE_CTA_FREE")
            : t("UPGRADE_CTA_PLUS")
          }
        </button>
      )}
    </div>
  );
}