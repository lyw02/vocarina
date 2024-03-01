import { useState } from "react";
import { Button, Stack } from "@mui/material";
import "./index.css";
import LyricsDialog from "../InputDialog/LyricsDialog";

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
      <Stack spacing={2} direction="row">
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEditLyrics()}
        >
          Edit Lyrics
        </Button>
        <Button variant="contained" size="small">
          Generate
        </Button>
      </Stack>
      <LyricsDialog
        isOpen={isLyricsDialogVisible}
        setIsOpen={setIsLyricsDialogVisible}
      />
    </div>
  );
};

export default Toolbar;
