import { useState, useCallback } from "react";

export type ToastVariant = "success" | "error" | "warning";

interface UseToastReturn {
  showToast: (message: string, variant?: ToastVariant) => void;
  toastMessage: string;
  toastVariant: ToastVariant;
  isToastVisible: boolean;
  hideToast: () => void;
}

export function useToast(): UseToastReturn {
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<ToastVariant>("success");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setIsToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setIsToastVisible(false);
  }, []);

  return { showToast, toastMessage, toastVariant, isToastVisible, hideToast };
}