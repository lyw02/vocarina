import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import InputDialog from "../InputDialog";
import { setCurrentTrack } from "@/store/modules/tracks";
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

  return (
    <div className="param-wrapper">
      <span
        className="param-item"
        onClick={() => setIsTimeSigDialogVisible(true)}
      >
        {numerator}/{denominator}
      </span>
      <span className="param-item" onClick={() => setIsBpmDialogVisible(true)}>
        BPM: {bpm}
      </span>
      <span>
        <select value={currentTrack} onChange={handleTrackChange}>
          {tracks.map((track) => (
            <option key={track.trackId} value={track.trackId}>{track.trackName}</option>
          ))}
        </select>
      </span>
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
