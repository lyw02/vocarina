import theme from "@/theme";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog as MUIDialog,
  ThemeProvider,
} from "@mui/material";
import { useState } from "react";
import { createRoot } from "react-dom/client";

interface DialogProps {
  title: string;
  message?: string;
  content?: JSX.Element;
  cancelCallback?: () => void;
  confirmCallback?: () => void;
  closeCallback?: () => void;
}

const Dialog = ({
  title,
  message,
  content,
  cancelCallback,
  confirmCallback,
  closeCallback,
}: DialogProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    closeCallback && closeCallback();
  };

  const handleCancel = () => {
    handleClose();
    cancelCallback && cancelCallback();
  };

  const handleConfirm = () => {
    handleClose();
    confirmCallback && confirmCallback();
  };
  return (
    <ThemeProvider theme={theme}>
      <MUIDialog
        open={open}
        onClose={handleClose}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
          {content}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </MUIDialog>
    </ThemeProvider>
  );
};

/**
 * Show dialog with message or other contents
 */
const showDialog = ({
  title,
  message,
  content,
  cancelCallback,
  confirmCallback,
  closeCallback,
}: DialogProps) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    <Dialog
      title={title}
      message={message}
      content={content}
      cancelCallback={cancelCallback}
      confirmCallback={confirmCallback}
      closeCallback={() => {
        root.unmount();
        container.remove();
        closeCallback && closeCallback();
      }}
    />
  );
};

export { showDialog };
