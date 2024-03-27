import { Alert, Snackbar } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface AlertComponentProps {
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

interface AutoDismissAlertProps {
  isAlertOpen: boolean;
  handleAlertClose: () => void;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

const AlertComponent = ({ message, severity }: AlertComponentProps) => {
  return (
    <Alert icon={<CheckIcon fontSize="inherit" />} severity={severity}>
      {message}
    </Alert>
  );
};

const AutoDismissAlert = ({
  isAlertOpen,
  handleAlertClose,
  message,
  severity,
}: AutoDismissAlertProps) => {
  return (
    <Snackbar
      open={isAlertOpen}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={5000}
      onClose={handleAlertClose}
      children={AlertComponent({ message, severity })}
    />
  );
};

export default AutoDismissAlert;
