import { AlertStatus } from "@/types";
import { useState } from "react";

export const useAlert = () => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<AlertStatus>({
    severity: "error",
    message: "",
  });
  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  const raiseAlert = (severity: AlertStatus["severity"], message: string) => {
    setAlertStatus({
      severity: severity,
      message: message,
    });
    setIsAlertOpen(true);
  };

  return { isAlertOpen, alertStatus, handleAlertClose, raiseAlert };
};
