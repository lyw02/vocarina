import React from "react";
import { useNotes } from "../../contexts/notesContext";
import { useParameters } from "../../contexts/paramsContext";
import { parsePitch, parseDuration } from "../../utils/parseNote";
import "./index.css";

function Toolbar({ isDialogVisible }) {
  const { notes, updateNotes } = useNotes();
  const { numerator, denominator, bpm} = useParameters();

  const handleEditLyrics = (flag) => {
    isDialogVisible("isLyricsDialogVisible", flag)
  };

  const handleGenerate = () => {
    parsePitch(notes, updateNotes);
    parseDuration(notes, updateNotes, bpm);
    console.log(notes);
    // call api
  };

  return (
    <div className="toolbar-wrapper">
      <span className="button add-lyrics-button" onClick={() => handleEditLyrics(true)}>
        Edit lyrics
      </span>
      <span className="button generate-button" onClick={handleGenerate}>
        Generate
      </span>
    </div>
  );
}

export default Toolbar;
