"use client";

import { Eye, Download, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./PlanHistoryList.module.scss";
import type { BusinessPlan } from "@/lib/supabase/types";

interface PlanHistoryListProps {
  plans: BusinessPlan[];
  loading: boolean;
  error: string | null;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function PlanHistoryList({
  plans,
  loading,
  error,
  onView,
  onDownload,
  onDelete,
}: PlanHistoryListProps) {
  const t = useTranslations("DASHBOARD.PLAN_HISTORY");

  if (loading) {
    return (
      <div className={styles.planHistory__loading}>
        <p>{t("LOADING")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.planHistory__error}>
        <p>{t("ERROR", { error })}</p>
      </div>
    );
  }

  const plansWithContent = plans.filter((plan) => plan.plan && plan.plan.trim() !== "");

  if (plansWithContent.length === 0) {
    return (
      <div className={styles.planHistory__empty}>
        <p>{t("EMPTY")}</p>
      </div>
    );
  }

  return (
    <div className={styles.planHistory}>
      <div className={styles.planHistory__table}>
        {plansWithContent.map((plan) => (
          <div key={plan.id} className={styles.planHistory__row}>
            <div className={styles.planHistory__name}>
              <span className={styles.planHistory__nameText}>
                {plan.plan_name}
              </span>
              <span className={styles.planHistory__date}>
                {new Date(plan.creation_date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className={styles.planHistory__actions}>
              <button
                className={styles.planHistory__actionButton}
                onClick={() => onView?.(plan.id)}
                title={t("VIEW")}
                aria-label={t("VIEW")}
              >
                <Eye className={styles.planHistory__actionIcon} />
              </button>

              <button
                className={styles.planHistory__actionButton}
                onClick={() => onDownload?.(plan.id)}
                title={t("DOWNLOAD")}
                aria-label={t("DOWNLOAD")}
              >
                <Download className={styles.planHistory__actionIcon} />
              </button>

              <button
                className={`${styles.planHistory__actionButton} ${styles["planHistory__actionButton--delete"]}`}
                onClick={() => onDelete?.(plan.id)}
                title={t("DELETE")}
                aria-label={t("DELETE")}
              >
                <Trash2 className={styles.planHistory__actionIcon} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}