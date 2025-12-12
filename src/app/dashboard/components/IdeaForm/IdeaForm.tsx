"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, Sparkles } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import Loading from "@/components/ui/Loading/Loading";
import styles from "./IdeaForm.module.scss";
import PlanResult from "../PlanResult/PlanResult";

export default function IdeaForm() {
  const t = useTranslations("DASHBOARD.IDEA_FORM");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    plan?: string;
    rateLimit?: {
      remaining: number;
      limit: number;
    };
  } | null>(null);

  const MIN_LENGTH = 50;
  const isValid = idea.trim().length >= MIN_LENGTH;

  const loadingSteps = [
    t("LOADING_STEP_1"),
    t("LOADING_STEP_2"),
    t("LOADING_STEP_3"),
    t("LOADING_STEP_4"),
    t("LOADING_STEP_5"),
    t("LOADING_STEP_6"),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      alert(t("MIN_LENGTH_ERROR"));
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(ROUTES.API.GENERATE_PLAN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to generate plan");
      }

      setResult({
        success: true,
        message: t("SUCCESS_MESSAGE"),
        plan: data.plan,
        rateLimit: data.rateLimit,
      });
      setIdea("");
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : t("ERROR_MESSAGE"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF");
  };

  const handleSaveToDrive = () => {
    console.log("Save to Drive");
  };

  return (
    <div className={styles.ideaForm}>
      <div className={styles.ideaForm__header}>
        <div className={styles.ideaForm__titleWrapper}>
          <Lightbulb className={styles.ideaForm__icon} />
          <h2 className={styles.ideaForm__title}>{t("TITLE")}</h2>
        </div>

        {result?.rateLimit && (
          <div className={styles.ideaForm__rateLimit}>
            <span className={styles.ideaForm__rateLimitText}>
              {result.rateLimit.remaining} of {result.rateLimit.limit} plans remaining this hour
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <Loading steps={loadingSteps} duration={20000} size="large" />
      ) : (
        <>
          <form onSubmit={handleSubmit} className={styles.ideaForm__form}>
            <div className={styles.ideaForm__field}>
              <label htmlFor="idea" className={styles.ideaForm__label}>
                {t("LABEL")}
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={t("PLACEHOLDER")}
                className={styles.ideaForm__textarea}
                rows={8}
                disabled={loading}
                required
                minLength={MIN_LENGTH}
              />
              <div className={styles.ideaForm__counter}>
                <span
                  className={
                    idea.length >= MIN_LENGTH
                      ? styles["ideaForm__counter--valid"]
                      : ""
                  }
                >
                  {idea.length} / {MIN_LENGTH}
                </span>
              </div>
            </div>

            <div className={styles.ideaForm__tips}>
              <p className={styles.ideaForm__tipsTitle}>
                <Sparkles className={styles.ideaForm__tipsIcon} />
                {t("TIPS_TITLE")}
              </p>
              <ul className={styles.ideaForm__tipsList}>
                <li>{t("TIP_1")}</li>
                <li>{t("TIP_2")}</li>
                <li>{t("TIP_3")}</li>
                <li>{t("TIP_4")}</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !isValid}
              className={styles.ideaForm__submit}
            >
              {t("SUBMIT")}
            </button>
          </form>

          {result && (
            <PlanResult
              success={result.success}
              message={result.message}
              plan={result.plan}
              onDownloadPDF={handleDownloadPDF}
              onSaveToDrive={handleSaveToDrive}
            />
          )}
        </>
      )}
    </div>
  );
}