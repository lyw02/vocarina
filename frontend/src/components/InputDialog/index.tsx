import { Fragment, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  PaperProps,
} from "@mui/material";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import { setBpm, setDenominator, setNumerator } from "@/store/modules/params";
import { setTrackName } from "@/store/modules/tracks";
import EditTimeSignatureForm from "./EditTimeSignatureForm";
import EditBpmForm from "./EditBpmForm";
import EditTrackNameForm from "./EditTrackNameForm";
import { RootState } from "@/types";

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
  formType: "EditTimeSignatureForm" | "EditBpmForm" | "EditTrackNameForm";
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  trackId?: number;
}

export interface FormValues {
  numerator?: number;
  denominator?: number;
  bpm?: number;
  trackName?: string;
}

const InputDialog = ({
  title,
  formType,
  isOpen,
  setIsOpen,
  trackId = 1,
}: InputDialogProps) => {
  const [values, setValues] = useState<FormValues>({});

  const dispatch = useDispatch();

  const oldName = useSelector(
    (state: RootState) =>
      state.tracks.tracks[
        state.tracks.tracks.findIndex((t) => t.trackId === trackId)
      ].trackName
  );

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
    } else if (formType === "EditBpmForm") {
      return {
        dispatchFunctions: [() => dispatch(setBpm(values.bpm || 120))],
        formComponent: (
          <EditBpmForm values={values} setValues={handleSetValues} />
        ),
      };
    } else if (formType === "EditTrackNameForm") {
      return {
        dispatchFunctions: [
          () =>
            dispatch(
              setTrackName({
                trackId: trackId,
                trackName: values.trackName || oldName,
              })
            ),
        ],
        formComponent: (
          <EditTrackNameForm
            values={values}
            setValues={handleSetValues}
            trackId={trackId}
          />
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
        <DialogContent>{getForm()?.formComponent}</DialogContent>
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
