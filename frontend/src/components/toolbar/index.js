import React from "react";
import { useNotes } from "../../contexts/notesContext";
import { generateVoice } from "../../utils/generateVoice";
import "./index.css";

function Toolbar({ isDialogVisible }) {
  const { notes } = useNotes();

  const handleEditLyrics = (flag) => {
    isDialogVisible("isLyricsDialogVisible", flag)
  };
  const handleGenerate = () => {
    console.log("notes in toolbar: ");
    console.log(JSON.stringify(notes, null, 2));
    // generateVoice(notes);
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
