import { Fragment, useRef } from "react";
import { Stack, TextField } from "@mui/material";
import { FormValues } from "..";
import { useSelector } from "react-redux";
import { RootState } from "@/types";

interface EditTimeSignatureFormProps {
  values: FormValues;
  setValues: (formValues: FormValues) => void;
}

const EditTimeSignatureForm = ({
  values,
  setValues,
}: EditTimeSignatureFormProps) => {
  const numeratorRef = useRef<HTMLInputElement>(null);
  const denominatorRef = useRef<HTMLInputElement>(null);

  const { numerator, denominator } = useSelector(
    (state: RootState) => state.params
  );

  return (
    <Fragment>
      <Stack direction="column">
        <TextField
          id="numerator"
          ref={numeratorRef}
          label="Numerator"
          placeholder={numerator.toString()}
          variant="standard"
          onChange={(e) =>
            setValues({ ...values, numerator: Number(e.target.value) })
          }
        />
        <TextField
          id="denominator"
          ref={denominatorRef}
          label="Denominator"
          placeholder={denominator.toString()}
          variant="standard"
          onChange={(e) =>
            setValues({ ...values, denominator: Number(e.target.value) })
          }
        />
      </Stack>
    </Fragment>
  );
};

export default EditTimeSignatureForm;
