"use client";

import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CheckCircle, Download, Sparkles, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import styles from "./PlanResult.module.scss";

interface PlanResultProps {
  success: boolean;
  message: string;
  plan?: string;
  onDownloadPDF?: () => void;
  onSaveToDrive?: () => void;
  isDownloading?: boolean;
  isSavingToDrive?: boolean;
}

const PlanResult = forwardRef<HTMLDivElement, PlanResultProps>(
  ({ success, message, plan, onDownloadPDF, onSaveToDrive, isDownloading, isSavingToDrive }, ref) => {

    if (!plan || !success) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={`${styles.planResult} ${styles["planResult--success"]}`}
      >
        <BrandHeader
          onDownloadPDF={onDownloadPDF}
          onSaveToDrive={onSaveToDrive}
          isDownloading={isDownloading}
          isSavingToDrive={isSavingToDrive}
        />

        <SuccessMessage message={message} />

        <MarkdownContent plan={plan} />

        <Footer />
      </div>
    );
  }
);

function BrandHeader({
  onDownloadPDF,
  onSaveToDrive,
  isDownloading,
  isSavingToDrive,
}: Pick<PlanResultProps, "onDownloadPDF" | "onSaveToDrive" | "isDownloading" | "isSavingToDrive">) {
  const t = useTranslations("DASHBOARD.PLAN_RESULT");

  return (
    <div className={styles.planResult__brand}>
      <div className={styles.planResult__brandContent}>
        <Sparkles className={styles.planResult__brandIcon} />
        <div>
          <h3 className={styles.planResult__brandTitle}>SparkPlan</h3>
          <p className={styles.planResult__brandSubtitle}>
            {t("SUBTITLE")}
          </p>
        </div>
      </div>
      <ActionButtons
        onDownloadPDF={onDownloadPDF}
        onSaveToDrive={onSaveToDrive}
        isDownloading={isDownloading}
        isSavingToDrive={isSavingToDrive}
      />
    </div>
  );
}

function ActionButtons({
  onDownloadPDF,
  onSaveToDrive,
  isDownloading,
  isSavingToDrive,
}: Pick<PlanResultProps, "onDownloadPDF" | "onSaveToDrive" | "isDownloading" | "isSavingToDrive">) {
  const t = useTranslations("DASHBOARD.PLAN_RESULT");

  return (
    <div className={styles.planResult__actions}>
      {onDownloadPDF && (
        <Button
          variant="ghost-inverse"
          size="sm"
          onClick={onDownloadPDF}
          isLoading={isDownloading}
          icon={<Download size={18} />}
          title={t("DOWNLOAD_PDF_TITLE")}
        >
          {t("PDF_BUTTON")}
        </Button>
      )}
      {onSaveToDrive && (
        <Button
          variant="ghost-inverse"
          size="sm"
          onClick={onSaveToDrive}
          isLoading={isSavingToDrive}
          icon={<Save size={18} />}
          title={t("SAVE_TO_DRIVE_TITLE")}
          className={styles["planResult__actionBtn--primary"]}
        >
          {t("DRIVE_BUTTON")}
        </Button>
      )}
    </div>
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <div className={styles.planResult__successHeader}>
      <CheckCircle className={styles.planResult__successIcon} />
      <p className={styles.planResult__message}>{message}</p>
    </div>
  );
}

function MarkdownContent({ plan }: { plan: string }) {
  return (
    <div className={styles.planResult__content}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={createMarkdownComponents()}
      >
        {plan}
      </ReactMarkdown>
    </div>
  );
}

function createMarkdownComponents(): Components {
  return {
    h1: ({ children, ...props }) => (
      <h1 className={styles.planResult__h1} {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className={styles.planResult__h2} {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className={styles.planResult__h3} {...props}>{children}</h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className={styles.planResult__h4} {...props}>{children}</h4>
    ),
    p: ({ children, ...props }) => (
      <p className={styles.planResult__p} {...props}>{children}</p>
    ),
    ul: ({ children, ...props }) => (
      <ul className={styles.planResult__ul} {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className={styles.planResult__ol} {...props}>{children}</ol>
    ),
    li: ({ children, ...props }) => (
      <li className={styles.planResult__li} {...props}>{children}</li>
    ),
    table: ({ children, ...props }) => (
      <div className={styles.planResult__tableWrapper}>
        <table className={styles.planResult__table} {...props}>{children}</table>
      </div>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className={styles.planResult__blockquote} {...props}>
        {children}
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const isInline = !className;

      if (isInline) {
        return (
          <code className={styles.planResult__inlineCode} {...props}>
            {children}
          </code>
        );
      }

      return (
        <pre className={styles.planResult__codeBlock}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    },
    hr: ({ ...props }) => <hr className={styles.planResult__hr} {...props} />,
  };
}

function Footer() {
  const t = useTranslations("DASHBOARD.PLAN_RESULT");
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className={styles.planResult__footer}>
      <Sparkles size={16} />
      <p>{t("GENERATED_WITH", { date: currentDate })}</p>
    </div>
  );
}

PlanResult.displayName = "PlanResult";

export default PlanResult;