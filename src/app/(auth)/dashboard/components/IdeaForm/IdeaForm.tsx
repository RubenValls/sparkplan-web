"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, History, Plus } from "lucide-react";

import styles from "./IdeaForm.module.scss";

import Loading from "@/components/ui/Loading/Loading";
import DonationCard from "@/components/ui/DonationCard/DonationCard";
import PlanResult from "../PlanResult/PlanResult";

import { usePDFPrint } from "@/hooks/usePdfPrint";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { useIdeaPlan } from "@/hooks/useIdeaPlan";

import { formatDateISO } from "@/utils";
import Accordion from "@/components/ui/Accordion/Accordion";

type Accordion = "create" | "history" | null;

export default function IdeaForm() {
  const t = useTranslations("DASHBOARD.IDEA_FORM");

  const planResultRef = useRef<HTMLDivElement>(null);

  const { result, loading, generatePlan } = useIdeaPlan();
  const { printToPDF, generatePDFBlob, isPrinting, isGenerating } = usePDFPrint();
  const { uploadToDrive, isUploading } = useGoogleDrive();

  const [idea, setIdea] = useState("");
  const [savingToDrive, setSavingToDrive] = useState(false);
  const [expandedSection, setExpandedSection] = useState<Accordion>("create");

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

  const savingSteps = [t("SAVING_STEP_1"), t("SAVING_STEP_2")];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    await generatePlan(idea.trim());
    setIdea("");
    setExpandedSection(null);
  };

  const handleDownloadPDF = () => {
    if (!planResultRef.current) return;
    printToPDF(planResultRef.current);
  };

  const handleSaveToDrive = async () => {
    if (!planResultRef.current || !result?.plan) return;

    setSavingToDrive(true);

    try {
      const pdfBlob = await generatePDFBlob(planResultRef.current);
      const fileName = `SparkPlan-${formatDateISO()}.pdf`;

      const { fileUrl } = await uploadToDrive(pdfBlob, fileName);
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error saving to Google Drive:", error);
    } finally {
      setSavingToDrive(false);
    }
  };

  const toggleSection = (section: Accordion) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isBusy =
    loading || savingToDrive || isPrinting || isGenerating || isUploading;

  return (
    <div className={styles.ideaForm}>
      {loading ? (
        <Loading steps={loadingSteps} duration={30000} size="large" />
      ) : savingToDrive ? (
        <Loading steps={savingSteps} duration={5000} size="large" />
      ) : (
        <>
          <div className={styles.ideaForm__accordions}>
            <Accordion
              id="create"
              icon={<Plus className={styles.ideaForm__accordionIcon} />}
              title={t("TITLE")}
              isExpanded={expandedSection === "create"}
              onToggle={() => toggleSection("create")}
            >
              <form onSubmit={handleSubmit} className={styles.ideaForm__form}>
                <div className={styles.ideaForm__field}>
                  <textarea
                    id="idea"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder={t("PLACEHOLDER")}
                    className={styles.ideaForm__textarea}
                    rows={8}
                    disabled={isBusy}
                    required
                    minLength={MIN_LENGTH}
                    aria-describedby="idea-counter"
                  />

                  <div
                    id="idea-counter"
                    className={styles.ideaForm__counter}
                    aria-live="polite"
                  >
                    <span
                      className={
                        isValid ? styles["ideaForm__counter--valid"] : ""
                      }
                    >
                      {idea.length} / {MIN_LENGTH}
                    </span>
                  </div>
                </div>

                <div className={styles.ideaForm__tips}>
                  <p className={styles.ideaForm__tipsTitle}>
                    <Lightbulb className={styles.ideaForm__tipsIcon} />
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
                  disabled={!isValid || isBusy}
                  className={styles.ideaForm__submit}
                >
                  {t("SUBMIT")}
                </button>
              </form>
            </Accordion>

            <Accordion
              id="history"
              icon={<History className={styles.ideaForm__accordionIcon} />}
              title={t("HISTORY_TITLE")}
              isExpanded={expandedSection === "history"}
              onToggle={() => toggleSection("history")}
            >
              <div className={styles.ideaForm__comingSoon}>
                <p>{t("COMING_SOON")}</p>
              </div>
            </Accordion>
          </div>

          {result?.success && <DonationCard />}

          {result && (
            <PlanResult
              ref={planResultRef}
              success={result.success}
              message={t(result.message)}
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