import { Fragment, useRef } from "react";
import { Stack, TextField } from "@mui/material";
import { FormValues } from "..";
import { useSelector } from "react-redux";
import { RootState } from "@/types";

interface EditBpmFormProps {
  values: FormValues;
  setValues: (formValues: FormValues) => void;
}

const EditBpmForm = ({ values, setValues }: EditBpmFormProps) => {
  const bpmRef = useRef<HTMLInputElement>(null);

  const { bpm } = useSelector((state: RootState) => state.params);

  return (
    <Fragment>
      <Stack direction="column">
        <TextField
          id="bpm"
          ref={bpmRef}
          label="BPM"
          placeholder={bpm.toString()}
          variant="standard"
          onChange={(e) =>
            setValues({ ...values, bpm: Number(e.target.value) })
          }
        />
      </Stack>
    </Fragment>
  );
};

export default EditBpmForm;
