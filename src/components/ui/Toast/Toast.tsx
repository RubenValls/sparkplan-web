"use client";

import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import styles from "./Toast.module.scss";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.toast}>
      <CheckCircle className={styles.toast__icon} />
      <p className={styles.toast__message}>{message}</p>
      <button
        onClick={onClose}
        className={styles.toast__close}
        aria-label="Cerrar"
      >
        <X size={18} />
      </button>
    </div>
  );
}