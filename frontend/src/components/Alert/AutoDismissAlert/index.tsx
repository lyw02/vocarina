import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

type severity = "success" | "error" | "warning" | "info";

interface AutoDismissAlertProps {
  message: string;
  severity: severity;
  closeCallback?: () => void;
}

const AutoDismissAlert = ({
  message,
  severity,
  closeCallback,
}: AutoDismissAlertProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsAlertOpen(true);
  }, []);

  return (
    <Snackbar
      open={isAlertOpen}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={5000}
      onClose={() => {
        setIsAlertOpen(false);
        closeCallback && closeCallback();
      }}
      children={<Alert severity={severity}>{message}</Alert>}
    />
  );
};

/**
 * Imperative auto dismiss alert
 * @param severity "success" | "error" | "warning" | "info"
 * @param message
 */
const raiseAlert = (severity: severity, message: string) => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  root.render(
    <AutoDismissAlert
      severity={severity}
      message={message}
      closeCallback={() => {
        root.unmount();
        container.remove();
      }}
    />
  );
};

export default AutoDismissAlert;
export { raiseAlert };
