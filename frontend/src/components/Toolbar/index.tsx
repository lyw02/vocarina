import { useRef, useState } from "react";
import { Button, CircularProgress, Stack } from "@mui/material";
import "./index.css";
import LyricsDialog from "../InputDialog/LyricsDialog";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { processAudio } from "@/api/projectApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setProjectAudio,
  setProjectAudioArr,
} from "@/store/modules/projectAudio";
import { RootState } from "@/types";
import {
  setGeneratedStatus,
  setGeneratingStatus,
  setPlayingStatus,
} from "@/store/modules/localStatus";
import AudioContainer from "../AudioContainer";

const sampleData = {
  tracks: [
    {
      lyrics: [
        "should",
        "auld",
        "aquain",
        "tance",
        "be",
        "for",
        "got",
        "and",
        "nev",
        "ver",
        "brought",
        "to",
        "mind",
      ],
      target_pitch_list: [
        261.6, 349.2, 349.2, 440, 392, 349.2, 392, 440, 349.2, 349.2, 440,
        523.3, 587.3,
      ],
      target_duration_list: [
        2, 2, 2, 1.3, 2, 1.3, 1.3, 1.3, 2, 0.65, 1.3, 1.3, 2.6,
      ],
    },
  ],
};

const Toolbar = () => {
  const dispatch = useDispatch();
  const tracks = useSelector((state: RootState) => state.tracks.tracks);

  const isGenerating = useSelector(
    (state: RootState) => state.localStatus.isGenerating
  );
  const isGenerated = useSelector(
    (state: RootState) => state.localStatus.isGenerated
  );
  const isPlaying = useSelector(
    (state: RootState) => state.localStatus.isPlaying
  );

  const [isLyricsDialogVisible, setIsLyricsDialogVisible] =
    useState<boolean>(false);

  const handleEditLyrics = () => {
    setIsLyricsDialogVisible(true);
  };

  const handleGenerate = async () => {
    dispatch(setGeneratingStatus(true));
    let responseData = await processAudio(sampleData);
    let resBase64DataArr = JSON.parse(responseData).data_arr;
    let resBase64Data = JSON.parse(responseData).final_data;
    dispatch(setProjectAudioArr(resBase64DataArr));
    dispatch(setProjectAudio(resBase64Data));
    dispatch(setGeneratingStatus(false));
    dispatch(setGeneratedStatus(true));
  };

  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const audioRef3 = useRef<HTMLAudioElement>(null);
  const audioRef4 = useRef<HTMLAudioElement>(null);
  const audioRef5 = useRef<HTMLAudioElement>(null);
  const audioRefs = [audioRef1, audioRef2, audioRef3, audioRef4, audioRef5];
  const instAudioRef = useRef<HTMLAudioElement>(null);

  let base64Data = useSelector((state: RootState) => state.projectAudio.base64);
  let instUrl = useSelector(
    (state: RootState) =>
      state.tracks.tracks.find((t) => t.trackType === "instrumental")?.instUrl
  );
  let cursorTime = useSelector(
    (state: RootState) => state.projectAudio.cursorTime
  );
  console.log("Get base64: ", base64Data);

  const refs = [...audioRefs, instAudioRef];

  const handlePlay = () => {
    dispatch(setPlayingStatus(!isPlaying));
    refs.forEach((ref) => {
      if (isPlaying && ref.current) {
        ref.current.pause();
      } else if (ref.current && cursorTime < ref.current.duration) {
        ref.current.currentTime = cursorTime;
        ref.current?.play();
      }
    });
  };

  const durations = refs.map((ref) => ref.current?.duration || 0);
  const maxDuration = Math.max(...durations);

  refs.forEach((ref) => {
    if (ref.current) {
      ref.current.onended = () => {
        ref.current!.pause();
        if (Math.abs(Math.floor(ref.current?.duration!) - maxDuration) < 1) {
          dispatch(setPlayingStatus(false));
        }
      };
    }
  });

  return (
    <div className="toolbar-wrapper">
      <Stack justifyContent="space-between" direction="row">
        <Stack spacing={2} direction="row">
          <Button variant="outlined" size="small">
            {"Save Project"}
          </Button>
          <Button variant="outlined" size="small">
            {"Import Project"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditLyrics()}
          >
            <EditOutlinedIcon />
            {"Edit Lyrics"}
          </Button>
          <Button variant="contained" size="small" onClick={handleGenerate}>
            {isGenerating ? (
              <CircularProgress
                size={20}
                sx={{ marginRight: "5px", color: "white" }}
              />
            ) : (
              <MusicNoteIcon sx={{ marginRight: "5px" }} />
            )}
            {"Generate"}
          </Button>
        </Stack>
        <Stack direction="row">
          <Button
            disabled={!isGenerated}
            onClick={handlePlay}
            variant="contained"
            size="small"
          >
            {isPlaying ? (
              <PauseCircleFilledIcon sx={{ marginRight: "5px" }} />
            ) : (
              <PlayCircleFilledIcon sx={{ marginRight: "5px" }} />
            )}
            {"Play"}
          </Button>
          <AudioContainer
            base64Data={base64Data}
            display="none"
            ref={audioRef1}
          />
          <AudioContainer
            base64Data={base64Data}
            display="none"
            ref={audioRef2}
          />
          <AudioContainer objUrl={instUrl} display="none" ref={instAudioRef} />
        </Stack>
      </Stack>
      <LyricsDialog
        isOpen={isLyricsDialogVisible}
        setIsOpen={setIsLyricsDialogVisible}
      />
    </div>
  );
};

export default Toolbar;
