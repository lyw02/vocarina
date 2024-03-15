import {
  createNewTrack,
  setCurrentTrack,
  setSheet,
} from "@/store/modules/tracks";
import { RootState } from "@/types";
import { AddCircleOutline } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";

const TrackBar = () => {
  const dispatch = useDispatch();

  const currentTrack = useSelector(
    (state: RootState) => state.tracks.currentTrack
  );
  const tracks = useSelector((state: RootState) => state.tracks.tracks);
  // const notes = useSelector((state: RootState) => state.notes.notes);

  const handleTrackChange = (event: SelectChangeEvent) => {
    // dispatch(setSheet({ trackId: currentTrack, notes: notes }));
    dispatch(setCurrentTrack(event.target.value));
    dispatch(
      setSheet({ trackId: currentTrack, sheet: tracks[currentTrack - 1].sheet })
    );
  };

  const handleCreateTrack = () => {
    dispatch(createNewTrack({ trackName: "" }));
  };

  // Toggle button (muted / solo)
  const [toggle, setToggle] = useState("");

  const handleToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    newToggle: string
  ) => {
    setToggle(newToggle);
  };
  return (
    <div className="trackbar-wrapper">
      <Stack direction="row" spacing={2}>
        <Select value={currentTrack.toString()} onChange={handleTrackChange}>
          {tracks.map((track) => (
            <MenuItem key={track.trackId} value={track.trackId}>
              {track.trackName}
            </MenuItem>
          ))}
        </Select>
        <ToggleButtonGroup
          color="primary"
          value={toggle}
          exclusive
          size="small"
          onChange={handleToggleChange}
          aria-label="Muted or solo"
        >
          <ToggleButton value="muted">M</ToggleButton>
          <ToggleButton value="solo">S</ToggleButton>
        </ToggleButtonGroup>
        <Button size="small" onClick={handleCreateTrack}>
          <AddCircleOutline />
        </Button>
      </Stack>
    </div>
  );
};

export default TrackBar;