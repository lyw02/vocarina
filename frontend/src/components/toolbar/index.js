import React from "react";
import { useNotes } from "../../contexts/notesContext";
import { generateVoice } from "../../utils/generateVoice";
import "./index.css";

function Toolbar() {
  const { notes } = useNotes();

  const handleAddLyrics = () => {};
  const handleGenerate = () => {
    console.log(`notes in toolbar: ${notes}`);
    generateVoice(notes);
  };
  return (
    <div className="toolbar-wrapper">
      <span className="button add-lyrics-button" onClick={handleAddLyrics}>
        Add lyrics
      </span>
      <span className="button generate-button" onClick={handleGenerate}>
        Generate
      </span>
    </div>
  );
}

export default Toolbar;
