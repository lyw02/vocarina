import { setCurrentTrack } from "@/store/modules/tracks";
import { RootState } from "@/types";
import { AddCircleOutline } from "@mui/icons-material";
import { Button, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";

const TrackBar = () => {
  const dispatch = useDispatch();

  const currentTrack = useSelector(
    (state: RootState) => state.tracks.currentTrack
  );
  const tracks = useSelector((state: RootState) => state.tracks.tracks);

  const handleTrackChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentTrack(event.target.value));
  };

  const handleCreateTrack = () => {
    //
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
        <select value={currentTrack} onChange={handleTrackChange}>
          {tracks.map((track) => (
            <option key={track.trackId} value={track.trackId}>
              {track.trackName}
            </option>
          ))}
        </select>
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
