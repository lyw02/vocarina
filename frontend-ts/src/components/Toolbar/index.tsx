import { useState } from "react";
import { Button, Stack } from "@mui/material";
import "./index.css";
import LyricsDialog from "../InputDialog/LyricsDialog";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { processAudio } from "@/api/projectApi";
import { useDispatch } from "react-redux";
import { setProjectAudio } from "@/store/modules/projectAudio";

const sampleData = {
  "tracks": 
  [
      {
          "lyrics": ["should", "auld", "aquain", "tance", "be", "for", "got", "and", "nev", "ver", "brought", "to", "mind"],
          "target_pitch_list": [261.6, 349.2, 349.2, 440, 392, 349.2, 392, 440, 349.2, 349.2, 440, 523.3, 587.3],
          "target_duration_list": [2, 2, 2, 1.3, 2, 1.3, 1.3, 1.3, 2, 0.65, 1.3, 1.3, 2.6]
      }
  ]
}

const Toolbar = () => {
  const dispatch = useDispatch();

  const [isLyricsDialogVisible, setIsLyricsDialogVisible] =
    useState<boolean>(false);

  const handleEditLyrics = () => {
    setIsLyricsDialogVisible(true);
  };

  const handleGenerate = async () => {
    console.log("Generate...");
    let responseData = await processAudio(sampleData)
    let base64Data = JSON.parse(responseData).data
    console.log(base64Data)
    dispatch(setProjectAudio(base64Data))
  };

  return (
    <div className="toolbar-wrapper">
      <Stack justifyContent="space-between" direction="row">
        <Stack spacing={2} direction="row">
          <Button variant="outlined" size="small">
            Save Project
          </Button>
          <Button variant="outlined" size="small">
            Import Project
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditLyrics()}
          >
            <EditOutlinedIcon />
            Edit Lyrics
          </Button>
          <Button variant="contained" size="small" onClick={handleGenerate}>
            Generate
          </Button>
        </Stack>
        <Stack direction="row">
          <Button variant="contained" size="small">
            <PlayCircleFilledIcon sx={{marginRight: "5px"}} />
            Play
          </Button>
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
