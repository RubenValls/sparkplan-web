"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import styles from "./ConfirmDialog.module.scss";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        <button
          className={styles.dialog__close}
          onClick={onCancel}
          aria-label="Cerrar"
        >
          <X className={styles.dialog__closeIcon} />
        </button>

        <div className={styles.dialog__content}>
          <h2 id="dialog-title" className={styles.dialog__title}>
            {title}
          </h2>
          <p id="dialog-message" className={styles.dialog__message}>
            {message}
          </p>
        </div>

        <div className={styles.dialog__actions}>
          <Button variant="ghost" size="md" onClick={onCancel} type="button">
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="md"
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}