"use client";

import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./Accordion.module.scss";

interface AccordionProps {
  id: string;
  icon?: ReactNode;
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function Accordion({
  id,
  icon,
  title,
  isExpanded,
  onToggle,
  children,
}: AccordionProps) {
  return (
    <div className={styles.accordion}>
      <button
        onClick={onToggle}
        className={styles.accordion__trigger}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${id}`}
      >
        <div className={styles.accordion__header}>
          {icon && <span className={styles.accordion__icon}>{icon}</span>}
          <span className={styles.accordion__title}>{title}</span>
        </div>
        <ChevronDown
          className={`${styles.accordion__chevron} ${
            isExpanded ? styles["accordion__chevron--expanded"] : ""
          }`}
        />
      </button>

      <div
        id={`accordion-content-${id}`}
        className={`${styles.accordion__content} ${
          !isExpanded ? styles["accordion__content--collapsed"] : ""
        }`}
        role="region"
        aria-labelledby={`accordion-trigger-${id}`}
      >
        {children}
      </div>
    </div>
  );
}