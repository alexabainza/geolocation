import { useState } from "react";

interface NotificationState {
  visible: boolean;
  message: string;
  type: "error" | "success" | "warning" | "info";
}

interface UseNotificationReturn {
  notification: NotificationState;
  showNotification: (
    message: string,
    type?: "error" | "success" | "warning" | "info"
  ) => void;
  hideNotification: () => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    message: "",
    type: "error",
  });

  const showNotification = (
    message: string,
    type: "error" | "success" | "warning" | "info" = "error"
  ) => {
    setNotification({
      visible: true,
      message,
      type,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const showError = (message: string) => showNotification(message, "error");
  const showSuccess = (message: string) => showNotification(message, "success");
  const showWarning = (message: string) => showNotification(message, "warning");
  const showInfo = (message: string) => showNotification(message, "info");

  return {
    notification,
    showNotification,
    hideNotification,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
};