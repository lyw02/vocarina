import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import "./index.css";
import LyricsDialog from "../InputDialog/LyricsDialog";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PublishIcon from "@mui/icons-material/Publish";
import {
  listProject,
  loadProject,
  processAudio,
  saveProject,
  saveProjectSupabase,
} from "@/api/projectApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setParsedLyricsArr,
  setProjectAudio,
  setProjectAudioArr,
} from "@/store/modules/projectAudio";
import { AlertStatus, RootState } from "@/types";
import {
  setGeneratedStatus,
  setGeneratingStatus,
  setPlayingStatus,
} from "@/store/modules/localStatus";
import AudioContainer from "../AudioContainer";
import {
  parseDuration,
  parseLyrics,
  parsePitch,
  parseStartTime,
} from "@/utils/ParseData";
import { raiseAlert } from "../Alert/AutoDismissAlert";
import { noteStyle } from "@/utils/Note";
import { pitchFrequency } from "@/utils/PitchFrequency";
import { SimpleDialog } from "../SimpleDialog";
import { setProjectId } from "@/store/modules/project";
import { setTracks } from "@/store/modules/tracks";
import { publishProject } from "@/api/communityApi";
// import { Sentence } from "@/types/project";
import { useNavigate } from "react-router-dom";
import InputDialog from "../InputDialog";
import LyricsDialogNew from "../InputDialog/LyricsDialogNew";

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
  const navigate = useNavigate();
  const { bpm, numerator, denominator } = useSelector(
    (state: RootState) => state.params
  );
  const projectName = useSelector(
    (state: RootState) => state.project.projectName
  );
  const projectId = useSelector((state: RootState) => state.project.projectId);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUserId
  );

  const tracks = useSelector((state: RootState) => state.tracks.tracks);
  const vocalTracks = tracks.filter((t) => t.trackType === "vocal");
  const tracksDataOriginal = vocalTracks.map((t) => {
    // TODO
    return {
      trackId: t.trackId,
      // lyrics: t.trackLyrics
      //   .map((s) => s.content)
      //   .join(" ")
      //   .split(" "),
      sheet: t.sheet,
    };
  });

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

    let parsedLyricsArr: { id: number; data: string[] }[] = [];
    const tracksDataProcessed = tracksDataOriginal.map((t) => {
      // TODO
      // console.log("t.lyrics: ", t.lyrics);
      // let parsedLyrics;
      // if (t.lyrics.length === 1 && t.lyrics[0] === "") {
      //   parsedLyrics = t.sheet.map((n) => n.lyrics);
      // } else {
      //   parsedLyrics = parseLyrics(t.sheet, t.lyrics);
      // }
      // parsedLyricsArr.push({ id: t.trackId, data: parsedLyrics });
      // console.log("parsedLyrics: ", parsedLyrics);
      // return {
      //   trackId: t.trackId,
      //   lyrics: parsedLyrics,
      //   targetPitchList: parsePitch(t.sheet, parsedLyrics),
      //   startTime: parseStartTime(t.sheet, bpm, numerator, denominator),
      //   targetDurationList: parseDuration(
      //     t.sheet,
      //     bpm,
      //     numerator,
      //     parsedLyrics
      //   ),
      // };
    });

    let responseData = await processAudio({ tracksDataProcessed });
    let resBase64DataArr = JSON.parse(responseData).dataArr;
    let resBase64Data = JSON.parse(responseData).finalData;
    dispatch(setParsedLyricsArr(parsedLyricsArr));
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

  // Project options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const measureLength = 40 * numerator;
  const measureDuration = (60 * numerator * denominator) / bpm;

  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const handleSaveProject = async () => {
    if (!currentUser) {
      raiseAlert("error", "Please sign in first");
      return;
    }
    const tracksData = tracks.map((t) => ({
      trackId: t.trackId,
      trackName: t.trackName,
      status: t.trackState,
      trackType: t.trackType,
      sheet: t.sheet.map((n) => {
        let noteIndex = Math.floor((2700 - n.endY) / noteStyle.noteHeight);
        let octave = Math.floor(noteIndex / 12);
        let key = octave === 0 ? noteIndex : noteIndex % 12;
        return {
          note_id: n.id,
          start_time:
            (Math.min(n.startX, n.endX) * measureDuration) / measureLength,
          end_time:
            (Math.max(n.startX, n.endX) * measureDuration) / measureLength,
          pitch: pitchFrequency[octave][key],
          lyrics: n.lyrics,
          lyricsAliasMapper: n.lyricsAliasMapper,
        };
      }),
    }));
    const data = {
      id: projectId || undefined,
      name: projectName,
      user_id: currentUser.id,
      // status: 1,
      tracks: tracksData,
    };
    console.log("data in save: ", data);
    setIsSaveLoading(true);
    const res = await saveProjectSupabase(data);
    if (!res.error) {
      console.log("ok");
      console.log("---", res.data);
      dispatch(setProjectId(res.data[0].id));
      raiseAlert("success", "Saved");
      setIsSaveLoading(false);
    } else {
      console.log(res.error);
      raiseAlert("error", `Error: ${res.error.message}`);
    }
    handleClose();
  };

  // Import project dialog
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importDialogSelectedValue, setImportDialogSelectedValue] = useState<
    number | null
  >(null);
  const [importDialogItem, setImportDialogItem] = useState([]);

  const handleImportDialogClickOpen = () => {
    setIsImportDialogOpen(true);
  };

  const handleImportDialogClose = (value: number | null) => {
    setIsImportDialogOpen(false);
    setImportDialogSelectedValue(value);
    if (value) {
      handleLoadProject(value);
    }
    handleClose();
  };

  const handleLoadProject = async (value: number) => {
    dispatch(setProjectId(value));
    const res = await loadProject(value);
    const resJson = await res.json();
    if (res.status === 200) {
      console.log("resJson: ", resJson);
      const parsedTracksData = resJson.tracks.map((t: any) => {
        const findIndexIn2DArray = (arr: number[][], targetValue: number) => {
          for (let i = 0; i < arr.length; i++) {
            const innerArray = arr[i];
            for (let j = 0; j < innerArray.length; j++) {
              if (innerArray[j] === targetValue) {
                return [i, j];
              }
            }
          }
          return null;
        };
        const parsedSheetData = t.sheet.map((n: any) => {
          console.log(
            "findIndexIn2DArray(pitchFrequency, n.pitch): ",
            findIndexIn2DArray(pitchFrequency, n.pitch)
          );
          return {
            id: n.note_id,
            startX: (n.start_time * measureLength) / measureDuration,
            startY:
              2700 -
              (findIndexIn2DArray(pitchFrequency, n.pitch)![0] * 12 +
                findIndexIn2DArray(pitchFrequency, n.pitch)![1] +
                1) *
                noteStyle.noteHeight,
            endX: (n.end_time * measureLength) / measureDuration,
            endY:
              2700 -
              (findIndexIn2DArray(pitchFrequency, n.pitch)![0] * 12 +
                findIndexIn2DArray(pitchFrequency, n.pitch)![1] +
                1) *
                noteStyle.noteHeight +
              noteStyle.noteHeight,
            isOverlap: false,
            noteLength:
              ((n.end_time - n.start_time) * measureLength) / measureDuration,
            lyrics: n.lyrics,
          };
        });
        return {
          trackId: t.track_id,
          trackName: t.track_name,
          trackState:
            t.status === 1 ? "normal" : t.status === 2 ? "muted" : "solo",
          trackType: t.track_type,
          sheet: parsedSheetData,
          // trackLyrics: [],
        };
      });
      dispatch(setTracks(parsedTracksData));
    } else {
      console.log("error");
      raiseAlert("error", "Error");
    }
  };

  const handlePublish = async () => {
    // TODO
    // if (!currentUserId) {
    //   raiseAlert("error", "Please sign in first");
    //   return;
    // }
    // // const lyrics: { [id: number]: Sentence[] } = {};
    // // tracks.forEach((t) => {
    // //   lyrics[t.trackId] = t.trackLyrics;
    // // });
    // const res = await publishProject(
    //   currentUser,
    //   currentUserId,
    //   projectName,
    //   base64Data.map((item) => item.data),
    //   // lyrics
    // );
    // if (res.status === 200) {
    //   raiseAlert("success", "Success");
    // } else {
    //   raiseAlert("error", "Failed");
    // }
    // // navigate("/community");
  };

  const [isPrjNameDialogVisible, setIsPrjNameDialogVisible] =
    useState<boolean>(false);
  const handleEditProjectName = () => {
    setIsPrjNameDialogVisible(true);
    handleClose();
  };

  const [loaded, setLoaded] = useState(false); // First time rendered
  useEffect(() => {
    const fetchData = async () => {
      if (loaded) {
        if (currentUserId) {
          const projectList = await listProject(currentUserId);
          const projectListJson = await projectList.json();
          setImportDialogItem(projectListJson);
        } else {
          raiseAlert("error", "Please sign in first");
        }
      } else {
        setLoaded(true);
      }
    };
    fetchData();
    console.log("importDialogItem: ", importDialogItem);
  }, [isImportDialogOpen]);

  return (
    <div className="toolbar-wrapper">
      <SimpleDialog
        title="Import project"
        selectedValue={importDialogSelectedValue}
        open={isImportDialogOpen}
        onClose={handleImportDialogClose}
        items={importDialogItem.map((item) => (
          <ImportDialogItem item={item} />
        ))}
      />
      <InputDialog
        title="Edit Project Name"
        formType="EditProjectNameForm"
        isOpen={isPrjNameDialogVisible}
        setIsOpen={setIsPrjNameDialogVisible}
      />
      <Stack justifyContent="space-between" direction="row">
        <Stack spacing={2} direction="row">
          <Button onClick={handleClick} sx={{ textTransform: "none" }}>
            {projectName}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleEditProjectName}>
              {"Edit project name"}
            </MenuItem>
            <MenuItem onClick={handleSaveProject}>
              {isSaveLoading ? (
                <CircularProgress size="2rem" />
              ) : (
                "Save project"
              )}
            </MenuItem>
            <MenuItem onClick={handleImportDialogClickOpen}>
              {"Import project"}
            </MenuItem>
          </Menu>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditLyrics()}
          >
            <EditOutlinedIcon />
            {"Edit Lyrics"}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
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
        <Stack direction="row" spacing={2}>
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
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            disabled={!isGenerated}
            onClick={handlePublish}
            variant="contained"
            size="small"
          >
            <PublishIcon sx={{ marginRight: "5px" }} />
            {"Publish"}
          </Button>
          <AudioContainer
            base64Data={base64Data.find((b) => b.id === 0)?.data}
            display="none"
            ref={audioRef1}
          />
          <AudioContainer
            base64Data={base64Data.find((b) => b.id === 1)?.data}
            display="none"
            ref={audioRef2}
          />
          <AudioContainer
            base64Data={base64Data.find((b) => b.id === 2)?.data}
            display="none"
            ref={audioRef3}
          />
          <AudioContainer
            base64Data={base64Data.find((b) => b.id === 3)?.data}
            display="none"
            ref={audioRef4}
          />
          <AudioContainer
            base64Data={base64Data.find((b) => b.id === 4)?.data}
            display="none"
            ref={audioRef5}
          />
          <AudioContainer objUrl={instUrl} display="none" ref={instAudioRef} />
        </Stack>
      </Stack>
      {/* <LyricsDialog
        isOpen={isLyricsDialogVisible}
        setIsOpen={setIsLyricsDialogVisible}
      /> */}
      <LyricsDialogNew
        isOpen={isLyricsDialogVisible}
        setIsOpen={setIsLyricsDialogVisible}
      />
    </div>
  );
};

const ImportDialogItem = (item: any) => {
  return (
    <Stack
      direction="row"
      sx={{ width: "50vw", justifyContent: "space-between" }}
    >
      <Box component="div">
        <Typography variant="body1">{item.item.project_name}</Typography>
      </Box>
      <Box component="div">
        <Typography variant="body1">
          {"Created at "}
          {item.item.create_date.substring(0, 10)}
        </Typography>
      </Box>
      <Box component="div">
        <Typography variant="body1">
          {"Edited at "}
          {item.item.last_update.substring(0, 10)}
        </Typography>
      </Box>
    </Stack>
  );
};

export default Toolbar;
