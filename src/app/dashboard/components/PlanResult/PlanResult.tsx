"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CheckCircle, XCircle, Download, Sparkles, Save } from "lucide-react";
import styles from "./PlanResult.module.scss";

interface PlanResultProps {
  success: boolean;
  message: string;
  plan?: string;
  onDownloadPDF?: () => void;
  onSaveToDrive?: () => void;
}

export default function PlanResult({
  success,
  message,
  plan,
  onDownloadPDF,
  onSaveToDrive,
}: PlanResultProps) {
  const sectionEmojis: Record<number, string> = useMemo(() => {
    return {
      1: "📋", // Resumen Ejecutivo / Executive Summary
      2: "🎯", // Contexto Estratégico / Strategic Context
      3: "🔍", // Definición del Problema / Problem Definition
      4: "💎", // Propuesta de Valor / Value Proposition
      5: "📊", // Análisis de Mercado / Market Analysis
      6: "💼", // Modelo de Negocio / Business Model
      7: "🚀", // Hoja de Ruta / Implementation Roadmap
      8: "🛠️", // Desarrollo de Producto / Product Development
      9: "⚙️", // Plan Operacional / Operational Plan
      10: "💰", // Planificación Financiera / Financial Planning
      11: "⚠️", // Evaluación de Riesgos / Risk Assessment
      12: "📈", // KPIs y Monitoreo / KPIs and Monitoring
      13: "✅", // Plan de Acción / Action Plan
      14: "🎓", // Conclusión / Conclusion
    };
  }, []);

  if (!success) {
    return (
      <div className={`${styles.planResult} ${styles["planResult--error"]}`}>
        <div className={styles.planResult__header}>
          <XCircle className={styles.planResult__errorIcon} />
          <p className={styles.planResult__message}>{message}</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className={`${styles.planResult} ${styles["planResult--success"]}`}>
      <div className={styles.planResult__brand}>
        <div className={styles.planResult__brandContent}>
          <Sparkles className={styles.planResult__brandIcon} />
          <div>
            <h3 className={styles.planResult__brandTitle}>SparkPlan</h3>
            <p className={styles.planResult__brandSubtitle}>
              Professional Business Plan Generator
            </p>
          </div>
        </div>
        <div className={styles.planResult__actions}>
          {onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              className={styles.planResult__actionBtn}
              title="Download as PDF"
            >
              <Download size={20} />
              PDF
            </button>
          )}
          {onSaveToDrive && (
            <button
              onClick={onSaveToDrive}
              className={`${styles.planResult__actionBtn} ${styles["planResult__actionBtn--primary"]}`}
              title="Save to Google Drive"
            >
              <Save size={20} />
              Drive
            </button>
          )}
        </div>
      </div>

      <div className={styles.planResult__successHeader}>
        <CheckCircle className={styles.planResult__successIcon} />
        <p className={styles.planResult__message}>{message}</p>
      </div>

      <div className={styles.planResult__content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => (
              <h1 className={styles.planResult__h1}>{children}</h1>
            ),
            h2: ({ children }) => {
              const text = String(children);
              const match = text.match(/^(\d+)\./);
              const sectionNumber = match ? parseInt(match[1]) : null;
              const emoji = sectionNumber ? sectionEmojis[sectionNumber] : null;

              return (
                <h2 className={styles.planResult__h2}>
                  {emoji && <span className={styles.planResult__emoji}>{emoji}</span>}
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => (
              <h3 className={styles.planResult__h3}>{children}</h3>
            ),
            h4: ({ children }) => (
              <h4 className={styles.planResult__h4}>{children}</h4>
            ),
            p: ({ children }) => (
              <p className={styles.planResult__p}>{children}</p>
            ),
            ul: ({ children }) => (
              <ul className={styles.planResult__ul}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className={styles.planResult__ol}>{children}</ol>
            ),
            li: ({ children }) => (
              <li className={styles.planResult__li}>{children}</li>
            ),
            table: ({ children }) => (
              <div className={styles.planResult__tableWrapper}>
                <table className={styles.planResult__table}>{children}</table>
              </div>
            ),
            blockquote: ({ children }) => (
              <blockquote className={styles.planResult__blockquote}>
                {children}
              </blockquote>
            ),
            code: ({ ...props }) => {
              const isInline = !props.className;
              
              if (isInline) {
                return (
                  <code className={styles.planResult__inlineCode} {...props} />
                );
              }
              
              return (
                <pre className={styles.planResult__codeBlock}>
                  <code {...props} />
                </pre>
              );
            },
            hr: () => <hr className={styles.planResult__hr} />,
          }}
        >
          {plan}
        </ReactMarkdown>
      </div>

      <div className={styles.planResult__footer}>
        <Sparkles size={16} />
        <p>Generated with SparkPlan • {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}