import { Fragment, useRef } from "react";
import { Stack, TextField } from "@mui/material";
import { FormValues } from "..";
import { useSelector } from "react-redux";
import { RootState } from "@/types";

interface EditTrackNameFormProps {
  values: FormValues;
  setValues: (formValues: FormValues) => void;
  trackId: number;
}

const EditTrackNameForm = ({
  values,
  setValues,
  trackId,
}: EditTrackNameFormProps) => {
  const trackNameRef = useRef<HTMLInputElement>(null);

  const trackName = useSelector(
    (state: RootState) =>
      state.tracks.tracks.find((t) => t.trackId === trackId)!.trackName
  );

  return (
    <Fragment>
      <Stack direction="column">
        <TextField
          id="trackName"
          ref={trackNameRef}
          label="Track name"
          placeholder={trackName}
          variant="standard"
          onChange={(e) =>
            setValues({ ...values, trackName: e.target.value })
          }
        />
      </Stack>
    </Fragment>
  );
};

export default EditTrackNameForm;
