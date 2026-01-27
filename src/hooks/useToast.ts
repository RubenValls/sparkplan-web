import { useState, useCallback } from "react";

interface UseToastReturn {
  showToast: (message: string) => void;
  toastMessage: string;
  isToastVisible: boolean;
  hideToast: () => void;
}

export function useToast(): UseToastReturn {
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setIsToastVisible(false);
  }, []);

  return { showToast, toastMessage, isToastVisible, hideToast };
}