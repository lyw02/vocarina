import { useState } from "react";
import { Button, Stack } from "@mui/material";
import "./index.css";
import LyricsDialog from "../InputDialog/LyricsDialog";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const Toolbar = () => {
  const [isLyricsDialogVisible, setIsLyricsDialogVisible] =
    useState<boolean>(false);

  const handleEditLyrics = () => {
    setIsLyricsDialogVisible(true);
  };
  const handleGenerate = () => {};
  return (
    <div className="toolbar-wrapper">
      {/* <span
        className="button add-lyrics-button"
        onClick={() => handleEditLyrics(true)}
      >
        Edit lyrics
      </span>
      <span className="button generate-button" onClick={handleGenerate}>
        Generate
      </span> */}
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
          <Button variant="contained" size="small">
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
