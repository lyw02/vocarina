import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  PaperProps,
} from "@mui/material";
import { Fragment, useState } from "react";
import Draggable from "react-draggable";
import EditTimeSignatureForm from "./EditTimeSignatureForm";
import { useDispatch } from "react-redux";
import { setDenominator, setNumerator } from "@/store/modules/params";

const PaperComponent = (props: PaperProps) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

interface InputDialogProps {
  title: string;
  formType: "EditTimeSignatureForm";
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FormValues {
  numerator?: number;
  denominator?: number;
}

const InputDialog = ({ title, formType, isOpen, setIsOpen }: InputDialogProps) => {
  const [values, setValues] = useState<FormValues>({});

  const dispatch = useDispatch();

  const getForm = () => {
    if (formType === "EditTimeSignatureForm") {
      return {
        dispatchFunctions: [
          () => dispatch(setNumerator(values.numerator || 4)),
          () => dispatch(setDenominator(values.denominator || 4)),
        ],
        formComponent: (
          <EditTimeSignatureForm values={values} setValues={handleSetValues} />
        ),
      };
    }
  };

  const handleSetValues = (formValues: FormValues): void => {
    setValues(formValues);
  };

  const handleFormSubmit = () => {
    console.log("Submit", values);
    getForm()?.dispatchFunctions.forEach((func) => func());
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          {getForm()?.formComponent}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleFormSubmit}>Apply</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default InputDialog;
