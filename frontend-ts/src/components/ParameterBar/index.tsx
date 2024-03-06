import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import InputDialog from "../InputDialog";
import { setCurrentTrack } from "@/store/modules/tracks";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import "./index.css";

const ParameterBar = () => {
  const [isTimeSigDialogVisible, setIsTimeSigDialogVisible] =
    useState<boolean>(false);
  const [isBpmDialogVisible, setIsBpmDialogVisible] = useState<boolean>(false);

  const dispatch = useDispatch();

  const currentTrack = useSelector(
    (state: RootState) => state.tracks.currentTrack
  );
  const tracks = useSelector((state: RootState) => state.tracks.tracks);

  const handleTrackChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentTrack(event.target.value));
  };

  const { numerator, denominator, bpm } = useSelector(
    (state: RootState) => state.params
  );

  const [value, setValue] = useState(30);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <div className="param-wrapper">
      <Stack justifyContent="space-between" direction="row" sx={{mb: 1}}>
        <Stack alignItems="center" spacing={2} direction="row">
          <span
            className="param-item"
            onClick={() => setIsTimeSigDialogVisible(true)}
          >
            {numerator}/{denominator}
          </span>
          <span
            className="param-item"
            onClick={() => setIsBpmDialogVisible(true)}
          >
            BPM: {bpm}
          </span>
          <span>
            <select value={currentTrack} onChange={handleTrackChange}>
              {tracks.map((track) => (
                <option key={track.trackId} value={track.trackId}>
                  {track.trackName}
                </option>
              ))}
            </select>
          </span>
          <span>
            <select>
              <option>Select Voice</option>
            </select>
          </span>
        </Stack>
        <Stack spacing={2} direction="row" sx={{ width: "15%" }} alignItems="center">
          <VolumeDown fontSize="small" />
          <Slider aria-label="Volume" size="small" value={value} onChange={handleChange} />
          <VolumeUp fontSize="small" />
        </Stack>
      </Stack>
      <InputDialog
        title="Edit Time Signature"
        formType="EditTimeSignatureForm"
        isOpen={isTimeSigDialogVisible}
        setIsOpen={setIsTimeSigDialogVisible}
      />
      <InputDialog
        title="Edit BPM"
        formType="EditBpmForm"
        isOpen={isBpmDialogVisible}
        setIsOpen={setIsBpmDialogVisible}
      />
    </div>
  );
};

export default ParameterBar;
