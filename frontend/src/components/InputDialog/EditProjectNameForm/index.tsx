import { Fragment, useRef } from "react";
import { Stack, TextField } from "@mui/material";
import { FormValues } from "..";
import { useSelector } from "react-redux";
import { RootState } from "@/types";

interface EditProjectNameFormProps {
  values: FormValues;
  setValues: (formValues: FormValues) => void;
}

const EditProjectNameForm = ({ values, setValues }: EditProjectNameFormProps) => {
  const projectNameRef = useRef<HTMLInputElement>(null);

  const projectName = useSelector((state: RootState) => state.project.projectName);

  return (
    <Fragment>
      <Stack direction="column">
        <TextField
          id="projectName"
          ref={projectNameRef}
          label="Project Name"
          placeholder={projectName.toString()}
          variant="standard"
          onChange={(e) =>
            setValues({ ...values, projectName: e.target.value })
          }
        />
      </Stack>
    </Fragment>
  );
};

export default EditProjectNameForm;
