"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, History, Plus } from "lucide-react";

import styles from "./IdeaForm.module.scss";

import Loading from "@/components/ui/Loading/Loading";
import DonationCard from "@/components/ui/DonationCard/DonationCard";
import Accordion from "@/components/ui/Accordion/Accordion";
import PlanResult from "../PlanResult/PlanResult";
import PlanHistoryList from "../PlanHistoryList/PlanHistoryList";
import Toast from "@/components/ui/Toast/Toast";

import { usePDFPrint } from "@/hooks/usePdfPrint";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { useIdeaPlan } from "@/hooks/useIdeaPlan";
import { usePlanHistory } from "@/hooks/usePlanHistory";
import { useToast } from "@/hooks/useToast";

import { deleteBusinessPlan } from "@/lib/supabase";
import { formatDateISO } from "@/utils";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";

import type { UsageLimitErrorResponse } from "@/types/usage-limits";
import UsageLimitError from "../UsageLimitError/UsageLimitError";
import { useUserSubscription } from "@/hooks/useUserSubscription";

type AccordionSection = "create" | "history" | null;

export default function IdeaForm() {
  const t = useTranslations("DASHBOARD.IDEA_FORM");
  const tHistory = useTranslations("DASHBOARD.PLAN_HISTORY");
  const tUsage = useTranslations("DASHBOARD.USAGE_INFO");

  const planResultRef = useRef<HTMLDivElement>(null);

  const { result, loading, generatePlan, setResult } = useIdeaPlan();
  const { printToPDF, generatePDFBlob, isPrinting, isGenerating } = usePDFPrint();
  const { uploadToDrive, isUploading } = useGoogleDrive();
  const { plans, loading: plansLoading, error: plansError, refetch } = usePlanHistory();
  const { showToast, toastMessage, isToastVisible, hideToast } = useToast();
  const { subscription } = useUserSubscription();

  const [idea, setIdea] = useState("");
  const [savingToDrive, setSavingToDrive] = useState(false);
  const [expandedSection, setExpandedSection] = useState<AccordionSection>("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [usageLimitError, setUsageLimitError] = useState<UsageLimitErrorResponse | null>(null);

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

    setUsageLimitError(null);

    const response = await generatePlan(idea.trim());

    if (!response.success && response.errorData) {
      setUsageLimitError(response.errorData);
      setExpandedSection("create");
      return;
    }

    if (response.success) {
      setIdea("");
      setExpandedSection(null);
      refetch();

      if (response.errorData) {
        const { currentUsage, limit, periodType } = response.errorData;
        
        if (limit === null) {
          showToast(tUsage("UNLIMITED"));
        } else {
          const messageKey = periodType === "daily" ? "DAILY" : "WEEKLY";
          showToast(tUsage(messageKey, { current: currentUsage, limit }));
        }
      }
    }
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

  const toggleSection = (section: AccordionSection) => {
    setExpandedSection(expandedSection === section ? null : section);
    
    if (section !== "create") {
      setUsageLimitError(null);
    }
  };

  const handleViewPlan = (id: string) => {
    const plan = plans.find((p) => p.id === id);

    if (!plan) {
      console.error("Plan not found:", id);
      return;
    }

    setResult({
      success: true,
      message: "SUCCESS_MESSAGE",
      plan: plan.plan,
    });

    setExpandedSection(null);

    setTimeout(() => {
      planResultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const handleDownloadPlan = (id: string) => {
    const plan = plans.find((p) => p.id === id);

    if (!plan) {
      console.error("Plan not found:", id);
      return;
    }

    setResult({
      success: true,
      message: "SUCCESS_MESSAGE",
      plan: plan.plan,
    });

    setTimeout(() => {
      handleDownloadPDF();
    }, 0);
  };

  const handleDeletePlan = (id: string) => {
    setPlanToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;

    setDeleting(true);

    try {
      await deleteBusinessPlan(planToDelete);
      
      if (result && plans.find(p => p.id === planToDelete)?.plan === result.plan) {
        setResult(null);
      }

      await refetch();
    } catch (error) {
      console.error("Error deleting plan:", error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const isBusy =
    loading || 
    savingToDrive || 
    isPrinting || 
    isGenerating || 
    isUploading ||
    deleting;

  return (
    <div className={styles.ideaForm}>
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={hideToast}
      />

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
              {usageLimitError && (
                <UsageLimitError
                  subscription={usageLimitError.subscription}
                  currentUsage={usageLimitError.currentUsage}
                  limit={usageLimitError.limit}
                  periodType={usageLimitError.periodType}
                  periodEnd={usageLimitError.periodEnd}
                />
              )}

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
              <PlanHistoryList
                plans={plans}
                loading={plansLoading}
                error={plansError}
                currentPlan={subscription}
                onView={handleViewPlan}
                onDownload={handleDownloadPlan}
                onDelete={handleDeletePlan}
              />
            </Accordion>
          </div>

          {result?.success && subscription === "FREE" && <DonationCard />}

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

          <ConfirmDialog
            isOpen={deleteDialogOpen}
            title={tHistory("DELETE_CONFIRM_TITLE")}
            message={tHistory("DELETE_CONFIRM_MESSAGE")}
            confirmText={tHistory("DELETE_CONFIRM_BUTTON")}
            cancelText={tHistory("DELETE_CANCEL_BUTTON")}
            variant="danger"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </>
      )}
    </div>
  );
}