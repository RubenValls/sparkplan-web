"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import styles from "./Loading.module.scss";
import { useTranslations } from "next-intl";

interface LoadingProps {
  steps?: string[];
  duration?: number;
  size?: "small" | "medium" | "large";
  message?: string;
}

export default function Loading({
  steps,
  duration = 15000,
  size = "medium",
  message,
}: LoadingProps) {
  const t = useTranslations("LOADING");
  const [currentStep, setCurrentStep] = useState(0);
  const hasSteps = steps && steps.length > 0;
  const stepDuration = hasSteps ? duration / steps.length : 0;

  useEffect(() => {
    if (!hasSteps) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [hasSteps, steps?.length, stepDuration]);

  const sizeClasses = {
    small: styles["loading--small"],
    medium: styles["loading--medium"],
    large: styles["loading--large"],
  };

  return (
    <div className={`${styles.loading} ${sizeClasses[size]}`}>
      <div className={styles.loading__spinner}>
        <Loader2 className={styles.loading__icon} />
      </div>

      {(hasSteps || message) && (
        <div className={styles.loading__content}>
          {hasSteps ? (
            <>
              <p className={styles.loading__text}>{steps[currentStep]}</p>

              <div className={styles.loading__progress}>
                <div
                  className={styles.loading__progressBar}
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>

              <p className={styles.loading__step}>
                {t("STEP_OF", {
                  current: currentStep + 1,
                  total: steps.length,
                })}
              </p>
            </>
          ) : (
            message && <p className={styles.loading__text}>{message}</p>
          )}
        </div>
      )}
    </div>
  );
}